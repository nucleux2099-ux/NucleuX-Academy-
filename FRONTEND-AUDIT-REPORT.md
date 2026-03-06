# NucleuX Academy — Frontend Audit Report

**Date:** 2026-02-15  
**Auditor:** Vishwakarma 🛠️  
**Status:** Analysis Only — No fixes applied

---

## Issue 1: Missing Sections on CBME Page

### 1.1 UG Block Count Discrepancy — **Severity: Medium**

**Expected:** 81 UG blocks (24 + 20 + 18 + 19 as stated)  
**Actual:** 79 UG blocks (24 + 20 + **16** + 19)

The Y3 file (`cbme-mbbs-y3.ts`) has **16 blocks**, not 18. Two blocks are missing.

```
File                    Stated  Actual
cbme-mbbs-y1.ts         24      24 ✅
cbme-mbbs-y2.ts         20      20 ✅
cbme-mbbs-y3.ts         18      16 ❌ (2 missing)
cbme-mbbs-y4.ts         19      19 ✅
```

The tab counter on the CBME page dynamically counts via `PHASE_MAP.reduce()` (line ~97), so it correctly shows 79, but the **specification says 81**. Two Y3 subjects need to be added.

**Rendering:** All blocks that exist in data DO render. The UG tab iterates all phases → extracts unique subjects → renders blocks per subject. No blocks are silently dropped.

### 1.2 PG `librarySubject` Mismatch — **Severity: Critical**

**File:** `src/lib/data/cbme-pg.ts:116`

```typescript
librarySubject: "forensic-medicine",
```

**But** the library subject slug is `"forensic"` (see `src/lib/data/subjects.ts`).

This means clicking "📚 Library →" on the Forensic Medicine PG entry links to `/library/forensic-medicine` which is a **404**. The correct slug is `/library/forensic`.

**Affected entries:** MD Forensic Medicine & Toxicology (1 PG entry)

**All other PG `librarySubject` values match library slugs:** anatomy, biochemistry, medicine, microbiology, obgyn, orthopedics, pathology, pediatrics, pharmacology, physiology, surgery ✅

### 1.3 SS `librarySubject` Coverage — **Severity: Low**

Of 46 SS entries, **25 have `librarySubject`** set. The remaining 21 have no library link — they render without a "📚 Library →" link. This is expected for super-specialties that don't map to a single library subject (e.g., DM Cardiology, MCh Neurosurgery), but worth noting.

All SS `librarySubject` values that are set match valid library slugs ✅.

### 1.4 Search — **Severity: None (Working)**

Search works across all three tabs:
- **UG tab** (line ~131): filters by `b.title` and `subj` name
- **PG tab** (line ~177): filters by `c.title`, `c.subject`, and `c.description`
- **SS tab** (line ~220): filters by `c.title`, `c.subject`, and `c.description`

### 1.5 Surgery Sub-page Link — **Severity: None (Working)**

The CBME page links to `/cbme/surgery` (line ~268) and `src/app/(app)/cbme/surgery/page.tsx` exists and imports from `cbme-surgery.ts` correctly.

### 1.6 `/competencies` vs `/cbme` — **Severity: Critical**

**Two completely separate pages exist:**

| Route | File | Purpose |
|-------|------|---------|
| `/cbme` | `src/app/(app)/cbme/page.tsx` | NMC curriculum browser (UG/PG/SS tabs, data-file driven) |
| `/competencies` | `src/app/(app)/competencies/page.tsx` | Competency tracker with progress bars, mock completion data |

**The Sidebar** (`src/components/Sidebar.tsx:38`) links to **`/competencies`**, labeled "CBME":
```typescript
{ href: "/competencies", icon: Target, label: "CBME", description: "Competencies" },
```

**The `/cbme` page has NO sidebar link.** Users cannot reach `/cbme` from the sidebar navigation. There is **no redirect** between these routes (checked `middleware.ts` and `next.config`).

**The BottomNav** (`src/components/BottomNav.tsx`) has **neither** `/cbme` nor `/competencies` — only `/library`.

**Recommendation:** Decide which page is the canonical CBME page, redirect the other, and update Sidebar link.

---

## Issue 2: Old Library Pages Running Alongside New Ones

### 2.1 Dead Components — **Severity: Medium**

Four old library components exist but are **imported by NOTHING**:

| File | Lines | Status |
|------|-------|--------|
| `src/components/LibraryLayout.tsx` | Wraps AtomLibrarian | **DEAD CODE** — zero imports |
| `src/components/library/SystemNav.tsx` | Old numbered prefixes (01-general-topics, 02-head-neck) | **DEAD CODE** — zero imports |
| `src/components/library/TopicCard.tsx` | Old topic card | **DEAD CODE** — zero imports |
| `src/components/library/ContentViewer.tsx` | Content viewer | **DEAD CODE** — zero imports |

Verified via: `grep -rn` across entire `src/app/` directory for any of these component names — **zero results**.

### 2.2 No Route Conflicts — **Severity: None**

The new library uses dynamic routes at `src/app/(app)/library/[subject]/[subspecialty]/[topic]/`. There are no old static library routes conflicting.

### 2.3 Recommendation

Delete all 4 dead component files. They add confusion and maintenance burden:
```
src/components/LibraryLayout.tsx
src/components/library/SystemNav.tsx
src/components/library/TopicCard.tsx
src/components/library/ContentViewer.tsx
```

---

## Issue 3: Navigation Consistency

### 3.1 Sidebar `/competencies` vs `/cbme` — **Severity: Critical**

(See Issue 1.6 above.) The sidebar's "CBME" link goes to `/competencies`, not `/cbme`. No redirect exists.

### 3.2 SubspecialtyClient Back Button Inconsistency — **Severity: Medium**

**File:** `src/app/(app)/library/[subject]/[subspecialty]/SubspecialtyClient.tsx`

The **breadcrumb** (line 87-98) correctly shows: `Library > {Subject} > {Subspecialty}`

But the **ArrowLeft back button** (line 105-108) goes to `/library` (skipping the subject level):

```tsx
// Line 105-108: Back button goes to /library (WRONG)
<Link href="/library" className="p-2 rounded-lg ...">
  <ArrowLeft className="w-5 h-5 text-[#A0B0BC]" />
</Link>
```

**Should be:** `/library/${subject.slug}` to match the breadcrumb hierarchy.

### 3.3 TopicClient Back Navigation — **Severity: None (Correct)**

**File:** `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`

The TopicClient has **correct** hierarchical navigation:
- Breadcrumb (line 1700-1706): `Library > Subject > Subspecialty > Topic` ✅
- ArrowLeft (line 1717): goes to `/library/${subject.slug}/${subspecialty.slug}?mode=${viewMode}` ✅ (correct parent)

### 3.4 SurgeryHub Integration — **Severity: Low**

The Surgery hub at `/cbme/surgery` is a standalone page. It imports its own data from `cbme-surgery.ts` and links correctly from `/cbme`. However, it's a CBME sub-page, NOT a library sub-page, so it follows a different navigation pattern. Cross-links from surgery CBME entries to `/library/surgery` work correctly (slug matches).

### 3.5 CBME → Library Cross-links — **Severity: Critical (1 broken)**

Only the PG Forensic Medicine entry links to `/library/forensic-medicine` which **doesn't exist** (library slug is `forensic`). All other cross-links work. See Issue 1.2.

### 3.6 BottomNav (Mobile) — **Severity: Medium**

**File:** `src/components/BottomNav.tsx:19`

BottomNav includes `/library` ✅ but has **no link to CBME/Competencies**. On mobile, users cannot access CBME from bottom navigation.

---

## Summary

| # | Issue | Severity | Quick Fix? |
|---|-------|----------|------------|
| 1.2 | `forensic-medicine` → `forensic` slug mismatch | **Critical** | Yes — change string in cbme-pg.ts:116 |
| 1.6 / 3.1 | `/competencies` vs `/cbme` dual pages, sidebar links wrong one | **Critical** | Medium — needs decision on canonical page |
| 1.1 | Y3 has 16 blocks not 18 | **Medium** | Add 2 missing subject blocks |
| 3.2 | SubspecialtyClient back button skips subject level | **Medium** | Yes — change `/library` to `/library/${subject.slug}` |
| 2.1 | 4 dead library components | **Medium** | Yes — delete files |
| 3.6 | BottomNav missing CBME link | **Medium** | Yes — add nav item |
| 1.3 | 21 SS entries without library links | **Low** | Ongoing content work |
| 3.4 | SurgeryHub separate nav pattern | **Low** | By design |
