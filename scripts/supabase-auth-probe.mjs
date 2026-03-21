#!/usr/bin/env node
import dotenv from 'dotenv';
import { createHash } from 'node:crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const rawEmail = process.env.E2E_EMAIL;
const rawPassword = process.env.E2E_PASSWORD;
const email = rawEmail?.trim();
const password = rawPassword?.trim();

function maskEmail(value) {
  if (!value || !value.includes('@')) return 'unset';
  const [local, domain] = value.split('@');
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 1))}@${domain}`;
}

function fingerprint(value) {
  if (!value) return 'unset';
  return createHash('sha256').update(value).digest('hex').slice(0, 10);
}

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const settingsStart = Date.now();
const settingsRes = await fetch(`${supabaseUrl}/auth/v1/settings`, {
  headers: { apikey: anonKey },
});
const settingsLatencyMs = Date.now() - settingsStart;

let settingsBody = null;
try {
  settingsBody = await settingsRes.json();
} catch {
  settingsBody = null;
}

console.log(`settings: status=${settingsRes.status} latencyMs=${settingsLatencyMs}`);
if (settingsBody) {
  const external = settingsBody?.external || {};
  const disableSignup = settingsBody?.disable_signup;
  const mailerAutoconfirm = settingsBody?.mailer_autoconfirm;
  const smsAutoconfirm = settingsBody?.sms_autoconfirm;
  const passwordEnabled = external?.email;
  console.log(
    `settings_flags: password_enabled=${String(passwordEnabled)} disable_signup=${String(disableSignup)} mailer_autoconfirm=${String(mailerAutoconfirm)} sms_autoconfirm=${String(smsAutoconfirm)}`,
  );
}

if (!email || !password) {
  console.log('⚠️ Skipping token probe: E2E_EMAIL/E2E_PASSWORD not set.');
  process.exit(0);
}

if (rawEmail !== email || rawPassword !== password) {
  console.warn('⚠️ E2E credentials contained leading/trailing whitespace; using trimmed values for auth probe.');
}

console.log(`probe: email=${maskEmail(email)} email_sha=${fingerprint(email)} password_sha=${fingerprint(password)}`);

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

try {
  const tokenStart = Date.now();
  const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    signal: controller.signal,
  });
  const tokenLatencyMs = Date.now() - tokenStart;
  const body = await tokenRes.text();

  console.log(`token: status=${tokenRes.status} latencyMs=${tokenLatencyMs}`);
  if (tokenRes.ok) {
    console.log('✅ Supabase password grant reachable and responding.');
    process.exit(0);
  }

  console.error('❌ Password grant returned non-2xx.');
  console.error(body.slice(0, 500));

  let parsed = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = null;
  }

  if (parsed?.error_code === 'invalid_credentials') {
    console.error('next: reset/rotate smoke user password in Supabase Auth, then update E2E_EMAIL/E2E_PASSWORD in .env.local + CI secrets to same pair.');
  }

  process.exit(2);
} catch (err) {
  console.error('❌ Password grant probe failed:', err?.message || String(err));
  process.exit(3);
} finally {
  clearTimeout(timeout);
}
