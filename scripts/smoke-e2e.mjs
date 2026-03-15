#!/usr/bin/env node
import { chromium } from "playwright";

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

async function step(name, fn) {
  try {
    console.log(`\n[smoke] ${name}`);
    await fn();
    console.log(`[smoke] PASS: ${name}`);
  } catch (error) {
    console.error(`[smoke] FAIL: ${name}`);
    console.error(error);
    await browser.close();
    process.exit(1);
  }
}

await step("Login", async () => {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("you@example.com").fill(EMAIL);
  await page.getByPlaceholder("••••••••").fill(PASSWORD);
  await page.getByRole("button", { name: /Sign In/i }).click();
  await page.waitForFunction(() => /\/(dashboard|onboarding|desk)$/.test(window.location.pathname), null, { timeout: 20000 });
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
  await page.getByRole("button", { name: /^A\s/ }).click();
  await page.getByRole("button", { name: /Submit Answer/i }).click();
});

await step("Settings save", async () => {
  await page.goto(`${BASE_URL}/settings`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Save Settings/i }).click();
  await page.getByText("Saved successfully").waitFor({ timeout: 15000 });
});

await browser.close();
console.log("\n[smoke] All checks passed");
