#!/usr/bin/env tsx

/**
 * Capture marketing screenshots (including authenticated room pages) using Playwright.
 *
 * Usage:
 *   BASE_URL=http://localhost:3100 \
 *   DEMO_EMAIL="..." DEMO_PASSWORD="..." \
 *   tsx scripts/capture-marketing-screens.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://localhost:3100';
const email = process.env.DEMO_EMAIL ?? "";
const password = process.env.DEMO_PASSWORD ?? "";

if (!email || !password) {
  console.error('Missing DEMO_EMAIL or DEMO_PASSWORD env vars.');
  process.exit(1);
}

const outDir = path.join(process.cwd(), 'public', 'marketing', 'screens');
fs.mkdirSync(outDir, { recursive: true });

async function shot(page: any, urlPath: string, outName: string) {
  const url = `${baseUrl}${urlPath}`;
  console.log(`→ ${urlPath}  =>  ${outName}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  // Give UI a beat to settle
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, outName), fullPage: true });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Login
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });

  // Robust selectors (avoid relying on label association)
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);

  // Prefer form submit button text used in UI
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for redirect away from /login
  await page.waitForURL((u) => !u.pathname.endsWith('/login'), { timeout: 30000 });

  // Capture authenticated room pages
  const targets: Array<[string, string]> = [
    ['/library', 'library.png'],
    ['/classroom', 'classroom.png'],
    ['/exam-centre', 'exam-centre.png'],
    ['/arena', 'arena.png'],
    ['/community', 'common-room.png'],
    ['/backstage', 'backstage.png'],
    ['/dashboard', 'dashboard.png'],
  ];

  for (const [p, file] of targets) {
    try {
      await shot(page, p, file);
    } catch (e: any) {
      console.warn(`! Failed to capture ${p}: ${e?.message || e}`);
    }
  }

  await browser.close();
  console.log('Done. Saved to public/marketing/screens');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
