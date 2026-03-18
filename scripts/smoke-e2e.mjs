#!/usr/bin/env node
import dotenv from "dotenv";
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

dotenv.config({ path: ".env.local" });

const BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Missing E2E credentials. Set E2E_EMAIL and E2E_PASSWORD.");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const ARTIFACT_DIR = process.env.E2E_ARTIFACT_DIR || path.join(process.cwd(), "artifacts", "smoke-e2e");
const AUTOSTART_ENABLED = process.env.E2E_AUTOSTART_SERVER !== "0";
const BASE_HOST = new URL(BASE_URL).hostname;
const BASE_PORT = Number(new URL(BASE_URL).port || (new URL(BASE_URL).protocol === "https:" ? 443 : 80));

let serverProcess = null;

async function isBaseUrlReachable() {
  try {
    const response = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
    return response.status > 0;
  } catch {
    return false;
  }
}

async function waitForBaseUrl(timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isBaseUrlReachable()) return true;
    await delay(1000);
  }
  return false;
}

async function ensureServerReady() {
  if (await isBaseUrlReachable()) return;

  if (!AUTOSTART_ENABLED) {
    throw new Error(`Smoke target not reachable at ${BASE_URL}. Start the app server first or set E2E_AUTOSTART_SERVER=1.`);
  }

  console.log(`[smoke] target ${BASE_URL} is down; starting app server (next start) on ${BASE_HOST}:${BASE_PORT}...`);
  serverProcess = spawn("npm", ["run", "-s", "start", "--", "--hostname", BASE_HOST, "--port", String(BASE_PORT)], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  serverProcess.stdout?.on("data", (chunk) => {
    const line = String(chunk || "").trim();
    if (line) console.log(`[smoke][server] ${line}`);
  });

  serverProcess.stderr?.on("data", (chunk) => {
    const line = String(chunk || "").trim();
    if (line) console.error(`[smoke][server] ${line}`);
  });

  const ready = await waitForBaseUrl(90000);
  if (!ready) {
    throw new Error(`Smoke target not reachable at ${BASE_URL} after autostart attempt.`);
  }
}

async function cleanupServer() {
  if (!serverProcess) return;
  const proc = serverProcess;
  serverProcess = null;

  if (proc.exitCode == null && !proc.killed) {
    proc.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => proc.once("exit", resolve)),
      delay(3000),
    ]).catch(() => {});
    if (proc.exitCode == null && !proc.killed) {
      proc.kill("SIGKILL");
    }
  }
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function captureFailureArtifacts(stepName) {
  const safe = stepName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const base = `${stamp()}-${safe || "step"}`;
  await fs.mkdir(ARTIFACT_DIR, { recursive: true });
  const screenshotPath = path.join(ARTIFACT_DIR, `${base}.png`);
  const htmlPath = path.join(ARTIFACT_DIR, `${base}.html`);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
  const html = await page.content().catch(() => "");
  if (html) await fs.writeFile(htmlPath, html, "utf8").catch(() => {});
  console.error(`[smoke] artifacts: ${screenshotPath}${html ? ` | ${htmlPath}` : ""}`);
}

async function step(name, fn) {
  try {
    console.log(`\n[smoke] ${name}`);
    await fn();
    console.log(`[smoke] PASS: ${name}`);
  } catch (error) {
    console.error(`[smoke] FAIL: ${name}`);
    console.error(error);
    await captureFailureArtifacts(name);
    await browser.close();
    await cleanupServer();
    process.exit(1);
  }
}

await ensureServerReady();

await step("Login", async () => {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });

  const email = page.getByPlaceholder("you@example.com");
  const password = page.getByPlaceholder("••••••••");
  const submit = page.locator('button[type="submit"], button:has-text("Sign In")').first();

  let loginApiOutcome = null;
  let loginAuthRequestSeen = false;
  let loginAuthRequestFailed = null;
  const authEndpointRx = /(\/auth\/v1\/(token|authorize|verify|otp|magiclink)|\/api\/auth\/)/i;
  const authRequests = [];
  const pendingAuthRequests = new Map();

  const onRequest = (request) => {
    const url = request.url();
    if (!authEndpointRx.test(url)) return;
    loginAuthRequestSeen = true;
    const id = `${request.method()} ${url}`;
    pendingAuthRequests.set(id, Date.now());
    authRequests.push({
      kind: "request",
      url,
      method: request.method(),
      at: new Date().toISOString(),
    });
  };

  const onRequestFailed = (request) => {
    const url = request.url();
    if (!authEndpointRx.test(url)) return;
    loginAuthRequestSeen = true;
    const id = `${request.method()} ${url}`;
    pendingAuthRequests.delete(id);
    const failure = request.failure();
    loginAuthRequestFailed = {
      url,
      errorText: failure?.errorText || "unknown request failure",
      method: request.method(),
    };
    authRequests.push({
      kind: "requestfailed",
      url,
      method: request.method(),
      errorText: loginAuthRequestFailed.errorText,
      at: new Date().toISOString(),
    });
  };

  const onResponse = async (response) => {
    const url = response.url();
    if (!authEndpointRx.test(url)) return;

    loginAuthRequestSeen = true;
    const status = response.status();
    const method = response.request().method();
    const id = `${method} ${url}`;
    pendingAuthRequests.delete(id);
    let bodyText = "";
    try {
      bodyText = await response.text();
    } catch {
      bodyText = "";
    }

    authRequests.push({
      kind: "response",
      url,
      method,
      status,
      ok: response.ok(),
      at: new Date().toISOString(),
    });

    loginApiOutcome = {
      status,
      bodyText: bodyText.slice(0, 300),
      ok: response.ok(),
      url,
    };
  };

  page.on("request", onRequest);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);

  await email.waitFor({ state: "visible", timeout: 20000 });
  await page.waitForFunction(() => {
    const emailInput = document.querySelector('input[placeholder="you@example.com"]');
    const submitButton = document.querySelector('button[type="submit"]')
      || Array.from(document.querySelectorAll("button")).find((b) => /sign in/i.test((b.textContent || "").trim()));
    return !!emailInput && !emailInput.hasAttribute("disabled") && !!submitButton && !submitButton.hasAttribute("disabled");
  }, null, { timeout: 20000 });

  await email.fill(EMAIL);
  await password.fill(PASSWORD);
  await submit.click();

  let outcome = {
    ok: false,
    path: new URL(page.url()).pathname,
    errorText: "",
    state: "login timeout",
  };

  const loginDeadline = Date.now() + 90000;
  while (Date.now() < loginDeadline) {
    outcome = await page.evaluate(() => {
      const path = window.location.pathname;
      const isAuthenticatedPath = /\/(dashboard|onboarding|desk)$/.test(path);
      const errorNode = document.querySelector('[class*="text-red"], [class*="bg-red"], [role="alert"]');
      const errorText = (errorNode?.textContent || "").trim();
      const submitButton = document.querySelector('button[type="submit"]')
        || Array.from(document.querySelectorAll("button")).find((b) => /sign in/i.test((b.textContent || "").trim()));
      const submitDisabled = !!submitButton && submitButton.hasAttribute("disabled");

      return {
        ok: isAuthenticatedPath,
        path,
        errorText,
        submitDisabled,
      };
    });

    if (outcome.ok) {
      outcome.state = "authenticated";
      break;
    }

    if (outcome.errorText) {
      outcome.state = "auth error shown in UI";
      break;
    }

    if (loginAuthRequestFailed) {
      outcome.state = "auth request failed";
      break;
    }

    if (loginApiOutcome && !loginApiOutcome.ok) {
      outcome.state = "auth API rejected credentials/request";
      break;
    }

    await delay(500);
  }

  page.off("request", onRequest);
  page.off("requestfailed", onRequestFailed);
  page.off("response", onResponse);

  if (!outcome?.ok) {
    const state = outcome?.state || (outcome?.submitDisabled ? "login request still pending" : "login returned without redirect");
    const pendingSummary = Array.from(pendingAuthRequests.entries())
      .slice(0, 3)
      .map(([id, startedAt]) => `${id} pending ${Date.now() - startedAt}ms`)
      .join("; ");
    const recentSummary = authRequests
      .slice(-4)
      .map((e) => `${e.kind}:${e.method} ${e.url}${e.status ? ` -> ${e.status}` : ""}`)
      .join(" | ");

    const apiHint = loginApiOutcome
      ? ` Auth API: ${loginApiOutcome.ok ? "ok" : "error"} (${loginApiOutcome.status})${loginApiOutcome.bodyText ? ` body=${loginApiOutcome.bodyText}` : ""}`
      : loginAuthRequestFailed
        ? ` Auth API: request failed (${loginAuthRequestFailed.method} ${loginAuthRequestFailed.url}) error=${loginAuthRequestFailed.errorText}`
        : loginAuthRequestSeen
          ? ` Auth API: request seen but no auth response captured.${pendingSummary ? ` Pending: ${pendingSummary}.` : ""}${recentSummary ? ` Recent: ${recentSummary}.` : ""}`
          : " Auth API: no auth request observed.";
    throw new Error(`Login did not complete. Path: ${outcome?.path || "unknown"}. State: ${state}. Error: ${outcome?.errorText || "none"}.${apiHint}`);
  }
});

await step("Desk load + primary CTA", async () => {
  await page.goto(`${BASE_URL}/desk`, { waitUntil: "domcontentloaded" });

  const ctaCandidates = [
    "button:has-text('Start Today')",
    "button:has-text('Execute Plan')",
    "button:has-text('Continue Mission')",
    "button:has-text('Initiate')",
    "button:has-text('Access Library')",
  ];

  let cta = null;
  const deadline = Date.now() + 20000;
  while (!cta && Date.now() < deadline) {
    for (const selector of ctaCandidates) {
      const locator = page.locator(selector).first();
      if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
        cta = locator;
        break;
      }
    }
    if (!cta) await page.waitForTimeout(300);
  }

  if (!cta) {
    const observedButtons = (await page.locator("button").allTextContents())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 20);
    throw new Error(`No desk primary CTA found. Buttons seen: ${observedButtons.join(" | ")}`);
  }

  const before = page.url();
  await cta.click();
  await page.waitForTimeout(1500);
  if (page.url() === before) {
    throw new Error("Desk primary CTA did not navigate");
  }
});

await step("MCQ answer submit", async () => {
  await page.goto(`${BASE_URL}/mcqs`, { waitUntil: "domcontentloaded" });

  const testIdCandidates = [
    "mcq-option-a",
    "mcq-option-b",
    "mcq-option-c",
    "mcq-option-d",
  ];

  let option = null;
  for (const testId of testIdCandidates) {
    const locator = page.getByTestId(testId).first();
    if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
      option = locator;
      break;
    }
  }

  // Backward-compatible fallback for older UIs without testids.
  if (!option) {
    const optionCandidates = [
      "button:has-text('Whipple procedure')",
      "button:has-text('Distal pancreatectomy')",
      "button:has-text('Total pancreatectomy')",
      "button:has-text('Frey procedure')",
    ];
    for (const selector of optionCandidates) {
      const locator = page.locator(selector).first();
      if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
        option = locator;
        break;
      }
    }
  }

  if (!option) {
    const buttons = (await page.locator("button").allTextContents())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 20);
    throw new Error(`No MCQ option button found. Buttons seen: ${buttons.join(" | ")}`);
  }

  await option.click();

  const submit = page.getByTestId("mcq-submit").or(page.getByRole("button", { name: /Submit Answer/i })).first();
  await submit.waitFor({ state: "visible", timeout: 15000 });
  await page.waitForFunction(() => {
    const explicit = document.querySelector('[data-testid="mcq-submit"]');
    if (explicit && explicit instanceof HTMLButtonElement) return !explicit.disabled;

    const fallback = Array.from(document.querySelectorAll("button")).find((b) => /submit answer/i.test(b.textContent || ""));
    return !!fallback && !(fallback).hasAttribute("disabled");
  }, null, { timeout: 10000 });
  await submit.click();
});

await step("Settings save", async () => {
  await page.goto(`${BASE_URL}/settings`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Save Settings/i }).click();
  await page.getByText("Saved successfully").waitFor({ timeout: 15000 });
});

await browser.close();
await cleanupServer();
console.log("\n[smoke] All checks passed");
