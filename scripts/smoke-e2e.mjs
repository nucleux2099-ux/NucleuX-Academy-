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
  await page.waitForURL(/\/(dashboard|onboarding|desk)/, { timeout: 20000 });
});

await step("Desk load + start plan", async () => {
  await page.goto(`${BASE_URL}/desk`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Start Today.?s Plan/i }).waitFor({ timeout: 20000 });
  const before = page.url();
  await page.getByRole("button", { name: /Start Today.?s Plan/i }).click();
  await page.waitForTimeout(1200);
  if (page.url() === before) {
    throw new Error("Start Today's Plan did not navigate");
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
