# NucleuX Academy — Fresh Routing Audit

**Date:** February 20, 2026
**Auditor:** ATOM / Antigravity

This is a fresh, manual audit of the `src/app/(app)` directory routing structure to clarify the purpose of seemingly duplicate "rooms".

## Findings

### 1. `dashboard` vs `desk`

* **Status:** Not duplicates.
* **Finding:** `/dashboard` is a 9-line file that simply contains an immediate client-side redirect (`router.replace("/desk")`).
* **Purpose:** `/desk` contains the actual 800-line rich dashboard implementation (the "My Desk" room). `/dashboard` acts as a fallback alias.
* **Action:** Both should be preserved.

### 2. `library` vs `read`

* **Status:** Not duplicates.
* **Finding:** `/library` is the main browsing interface (grid of subjects, search, filtering). `/read` does not have a `page.tsx` of its own; it only contains a dynamic route `/read/[id]/page.tsx`.
* **Purpose:** `/library` is the catalog. `/read/[id]` is the actual document viewer UI where users read a specific topic, take notes, and see progress.
* **Action:** Both are critical and should be preserved.

### 3. `classroom` vs `watch`

* **Status:** Not duplicates.
* **Finding:** Similar to Library vs Read. `/classroom` contains the main index of decks, live AI sessions, and templates. `/watch` only contains a dynamic route `/watch/[id]/page.tsx`.
* **Purpose:** `/classroom` is the catalog/room entry. `/watch/[id]` is likely the video/lecture player interface.
* **Action:** Both are critical and should be preserved.

### 4. `mcqs` vs `exam-centre` vs `practice`

* **Status:** Distinct but related features.
* **Finding:**
  * `/mcqs` is a quick-start interface specifically for taking multiple-choice questions (Quick 10, Full 50-Q Test).
  * `/exam-centre` is a massive hub interface that includes PYQs, Patient Simulators, Clinical Flows, Guided Learning, and Practical Exams.
  * `/practice` only contains a dynamic route (`/practice/[id]`).
* **Purpose:** `/exam-centre` is the overarching "Training Centre" room. `/mcqs` is a specific tool within that domain. `/practice/[id]` is the execution environment for specific tests.
* **Action:** All serve distinct purposes in the room structure and should be preserved.

### 5. `cbme` vs `competencies`

* **Status:** Not duplicates.
* **Finding:** `/competencies` is a 6-line file containing a server-side redirect (`redirect("/cbme")`).
* **Purpose:** `/cbme` contains the massive, data-driven NMC curriculum browser (UG/PG/SS tabs). `/competencies` is purely a redirect alias (likely because the Sidebar links to `/competencies`).
* **Action:** Both should be preserved, as the sidebar currently relies on the `/competencies` route to redirect properly.

## Conclusion

The previous automated audit reports misinterpreted distinct architectural concepts (hub vs viewer, aliases vs implementations) as "duplicate/dead code".
**No files need to be deleted.** The routing structure accurately reflects a complex "room" architecture where users browse in one route (`/library`) and consume content in another (`/read/[id]`).
