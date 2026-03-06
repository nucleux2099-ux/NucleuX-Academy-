# Documentation Index

This directory contains both:
- Canonical engineering docs (start here)
- Historical planning/audit/spec artifacts

## Canonical Docs
- `docs/ARCHITECTURE.md`: System architecture, data flows, and core runtime boundaries.
- `docs/CODEBASE-MAP.md`: Directory-level and route-level map of the repository.
- `docs/DEVELOPMENT.md`: Local setup, environment variables, DB bootstrap, and validation commands.
- `docs/API-REFERENCE.md`: Internal API route contracts under `src/app/api`.
- `docs/CONTENT-SYSTEM.md`: Content model, file conventions, loader behavior, and authoring workflow.
- `docs/LLM-HANDBOOK.md`: Fast operational context for AI coding agents.
- `docs/DATABASE.md`: Canonical database bootstrap and migration operations guide.
- `docs/TESTING.md`: Current testing model, CI coverage, and validation matrix.
- `docs/ROUTE-STATUS.md`: Route maturity map (data-backed vs mock-heavy).
- `docs/DEPLOYMENT.md`: Platform-agnostic deployment and rollback runbook.
- `docs/TROUBLESHOOTING.md`: Incident-style troubleshooting playbook for common failures.

## Root-Level Companion Docs
- `README.md`: Project overview + quick start.
- `AGENTS.md`: LLM/human operator quick guide.
- `CONTRIBUTING.md`: Contribution and quality gate expectations.

## Legacy / Historical Docs
The following files are retained for product context and historical decisions. They may not fully match current implementation:
- Design and UI artifacts: `docs/DESIGN-DOCS.md`, `docs/DESIGN-SYSTEM.md`, `docs/COLOR-SYSTEM-V2.md`, `docs/UI-IMPROVEMENT-LOG.md`
- Content and schema planning: `docs/CONTENT_STANDARD.md`, `docs/LIBRARY-STRUCTURE.md`, `docs/SCHEMA-DESIGN.md`, `docs/DATABASE-SCHEMA.md`
- Specs and planning snapshots: `docs/specs/*`, `docs/ROADMAP-CLASSROOM-REVIEW-MCQ.md`, `docs/ATOM-LANDING-PAGE-PLAN.md`, meeting logs

## Recommended Reading Order
1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `docs/CODEBASE-MAP.md`
4. `docs/DEVELOPMENT.md`
5. `docs/API-REFERENCE.md` and/or `docs/CONTENT-SYSTEM.md` depending on task
6. `docs/DATABASE.md`, `docs/TESTING.md`, `docs/ROUTE-STATUS.md` as needed
7. `docs/DEPLOYMENT.md`, `docs/TROUBLESHOOTING.md` for operations
