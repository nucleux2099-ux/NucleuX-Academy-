#!/usr/bin/env node

const DEFAULT_BASE_URL = "https://nucleuxacademy.io";
const DEFAULT_PATHS = ["/", "/login", "/desk", "/library", "/mcqs", "/atom", "/api/streaks"];
const DEFAULT_ACCEPTED_STATUS = new Set([200, 204, 301, 302, 307, 308, 401]);

function parsePaths(rawValue) {
  if (!rawValue) return DEFAULT_PATHS;
  return rawValue
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function withTrailingSlashRemoved(input) {
  return input.endsWith("/") ? input.slice(0, -1) : input;
}

async function checkPath(baseUrl, path, timeoutMs) {
  const url = new URL(path, `${withTrailingSlashRemoved(baseUrl)}/`).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
    const durationMs = Date.now() - start;
    return {
      path,
      url,
      status: response.status,
      ok: DEFAULT_ACCEPTED_STATUS.has(response.status),
      location: response.headers.get("location"),
      durationMs,
      error: null,
    };
  } catch (error) {
    return {
      path,
      url,
      status: null,
      ok: false,
      location: null,
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function printResults(baseUrl, results) {
  console.log(`health-check target: ${baseUrl}`);
  console.log("");
  for (const result of results) {
    const statusLabel = result.status == null ? "ERR" : String(result.status);
    const line = `${result.ok ? "PASS" : "FAIL"} ${statusLabel} ${result.path} (${result.durationMs}ms)`;
    console.log(line);
    if (result.location) console.log(`  location: ${result.location}`);
    if (result.error) console.log(`  error: ${result.error}`);
  }
  console.log("");
}

async function main() {
  const baseUrl = process.env.HEALTH_BASE_URL || DEFAULT_BASE_URL;
  const timeoutMs = Number(process.env.HEALTH_TIMEOUT_MS || "15000");
  const outputFile = process.env.HEALTH_OUTPUT_FILE || null;
  const paths = parsePaths(process.env.HEALTH_PATHS);

  const results = [];
  for (const path of paths) {
    results.push(await checkPath(baseUrl, path, timeoutMs));
  }

  printResults(baseUrl, results);

  const payload = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    timeoutMs,
    passed: results.every((result) => result.ok),
    results,
  };

  if (outputFile) {
    await import("node:fs/promises").then((fs) =>
      fs.writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8"),
    );
    console.log(`wrote JSON report: ${outputFile}`);
  }

  if (!payload.passed) process.exit(1);
}

await main();
