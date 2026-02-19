import { existsSync } from "node:fs";
import { join } from "node:path";

import { CBME_MBBS_Y1_BLOCKS } from "../src/lib/data/cbme-mbbs-y1";
import { CBME_MBBS_Y2_BLOCKS } from "../src/lib/data/cbme-mbbs-y2";
import { CBME_MBBS_Y3_BLOCKS } from "../src/lib/data/cbme-mbbs-y3";
import { CBME_MBBS_Y4_BLOCKS } from "../src/lib/data/cbme-mbbs-y4";
import { PG_CURRICULA } from "../src/lib/data/cbme-pg";
import { SS_CURRICULA } from "../src/lib/data/cbme-ss";
import { SUBJECTS } from "../src/lib/data/subjects";
import { getCurriculumRoute, resolveCanonicalSubjectSlug } from "../src/lib/data/cbme-aliases";

const ROOT = process.cwd();
const CONTENT_ROOT = join(ROOT, "content");

const errors: string[] = [];
const warnings: string[] = [];

function err(msg: string) {
  errors.push(msg);
}

function warn(msg: string) {
  warnings.push(msg);
}

const ugBlocks = [
  ...CBME_MBBS_Y1_BLOCKS,
  ...CBME_MBBS_Y2_BLOCKS,
  ...CBME_MBBS_Y3_BLOCKS,
  ...CBME_MBBS_Y4_BLOCKS,
];

// 1) Unique IDs
const allIds = [
  ...ugBlocks.map((b) => b.id),
  ...PG_CURRICULA.map((c) => c.id),
  ...SS_CURRICULA.map((c) => c.id),
];

const seen = new Set<string>();
for (const id of allIds) {
  if (seen.has(id)) err(`Duplicate id: ${id}`);
  seen.add(id);
}

// 2) Validate UG libraryPath targets
for (const block of ugBlocks) {
  const p = block.links?.libraryPath;
  if (!p) continue;

  if (p.startsWith("/library/")) {
    const rel = p.replace(/^\/library\//, "");
    const fsPath = join(CONTENT_ROOT, rel);

    // only check first segment + full path if not dynamic
    const first = rel.split("/")[0];
    const firstPath = join(CONTENT_ROOT, first);

    if (!existsSync(firstPath)) {
      err(`UG block ${block.id}: missing content subject folder for ${p}`);
      continue;
    }

    if (rel.includes("/") && !existsSync(fsPath)) {
      warn(`UG block ${block.id}: deep path not found (${p}), subject exists`);
    }
  } else if (!p.startsWith("/cbme/")) {
    err(`UG block ${block.id}: unsupported libraryPath '${p}'`);
  }
}

// 3) Validate librarySubject on PG/SS
const subjectSlugs = new Set(SUBJECTS.map((s) => s.slug));

for (const c of [...PG_CURRICULA, ...SS_CURRICULA]) {
  if (!c.librarySubject) continue;
  const canonical = resolveCanonicalSubjectSlug(c.librarySubject);
  if (!subjectSlugs.has(canonical)) {
    err(`${c.id}: librarySubject '${c.librarySubject}' is not a known subject`);
  }
}

// 4) Validate PG/SS deep libraryPath when present
for (const c of [...PG_CURRICULA, ...SS_CURRICULA]) {
  if (!c.libraryPath) continue;

  if (!c.libraryPath.startsWith("/library/")) {
    err(`${c.id}: libraryPath '${c.libraryPath}' must start with /library/`);
    continue;
  }

  const rel = c.libraryPath.replace(/^\/library\//, "");
  const first = rel.split("/")[0];
  const firstPath = join(CONTENT_ROOT, first);

  if (!existsSync(firstPath)) {
    err(`${c.id}: libraryPath subject folder missing for '${c.libraryPath}'`);
    continue;
  }

  if (rel.includes("/")) {
    const deepPath = join(CONTENT_ROOT, rel);
    if (!existsSync(deepPath)) {
      warn(`${c.id}: deep libraryPath not found '${c.libraryPath}' (subject exists)`);
    }
  }
}

// 5) Validate route generation
for (const c of [...PG_CURRICULA, ...SS_CURRICULA]) {
  const route = getCurriculumRoute(c.id);
  if (!route.startsWith("/cbme/")) {
    err(`${c.id}: generated route '${route}' is invalid`);
  }
}

// 6) Coverage warning
const pgMapped = PG_CURRICULA.filter((c) => !!c.librarySubject).length;
const ssMapped = SS_CURRICULA.filter((c) => !!c.librarySubject).length;

if (pgMapped / PG_CURRICULA.length < 0.5) {
  warn(`PG mapping low: ${pgMapped}/${PG_CURRICULA.length} have librarySubject`);
}
if (ssMapped / SS_CURRICULA.length < 0.5) {
  warn(`SS mapping low: ${ssMapped}/${SS_CURRICULA.length} have librarySubject`);
}

console.log("CBME validation summary");
console.log(`- UG blocks: ${ugBlocks.length}`);
console.log(`- PG curricula: ${PG_CURRICULA.length}`);
console.log(`- SS curricula: ${SS_CURRICULA.length}`);
console.log(`- Subjects: ${SUBJECTS.length}`);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("\n✅ CBME link validation passed");
