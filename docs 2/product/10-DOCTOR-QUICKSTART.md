# Doctor Quickstart: ATOM in Daily Practice

**Related:** [03-ATOM-THREE-PANE-UX-SPEC](./03-ATOM-THREE-PANE-UX-SPEC.md) · [02-PERSONAS-AND-USECASES](./02-PERSONAS-AND-USECASES.md) · [06-QUALITY-SAFETY-GOVERNANCE](./06-QUALITY-SAFETY-GOVERNANCE.md)

## What is this?

A practical guide for doctors to use ATOM in under 5 minutes for common scenarios.

## First 60 seconds setup
1. Open ATOM workspace.
2. In left pane, select relevant sources.
3. Set topic + goal in simple language.
4. Keep response preferences at default unless needed.
5. Ask one focused question in center pane.

---

## Scenario 1: Quick clinical consult prep (OPD/ward)

**Use when:** you need a concise differential + next steps before seeing patient.

Template prompt:
```text
Patient context: [age/sex/key findings].
Give me a focused differential diagnosis with red flags, immediate next investigations, and management priorities.
Keep it concise and practical.
```

Expected output:
- structured differential
- prioritization logic
- actionable next-step list

---

## Scenario 2: Exam revision in 20–30 min

**Use when:** you need rapid high-yield recall.

Template prompt:
```text
Topic: [topic].
Create a high-yield revision note with common traps, examiner-style pitfalls, and 5 self-check questions.
```

Follow-up prompt:
```text
Continue with a tougher version and include common mistakes.
```

---

## Scenario 3: Case teaching prep for juniors

**Use when:** you are preparing short teaching round content.

Template prompt:
```text
I am teaching juniors on [topic/case].
Give me a 10-minute teaching structure:
- 3 learning objectives
- concise explanation flow
- key clinical pearls
- 3 viva-style questions
```

Use right pane artifacts to download and adapt into slide/handout.

---

## Scenario 4: Research synthesis from selected books

**Use when:** you need balanced synthesis, not just one-source summary.

Template prompt:
```text
Using selected sources, synthesize current understanding of [topic].
Provide: core concepts, areas of agreement/disagreement, practical implications, and what to verify further.
```

Tip: select only relevant sources before asking to reduce noise.

---

## Scenario 5: Quality correction loop

**Use when:** answer is partly useful but needs correction.

Steps:
1. Mark assistant response as “Needs fix”.
2. Add quick reason in feedback note.
3. Ask correction prompt:

```text
Revise your previous answer:
- keep what was correct
- fix [specific issue]
- provide a cleaner final structure
```

4. Mark resolved/unresolved after re-check.

---

## Practical do/don’t

## Do
- Ask specific, clinical, bounded questions.
- Use continuation for progressive deepening.
- Download useful artifacts for your notes.

## Don’t
- Use vague prompts (“tell me everything”).
- Mix unrelated topics in one request.
- Assume output is final without clinical judgment.

---

## Quick troubleshooting
- No answer? Check source selection and retry.
- Wrong context? Re-state topic and ask for corrected scope.
- Low quality? Use feedback + correction loop.
- Missing continuity? Verify you are in same session/scope.

## Decisions
- Keep this quickstart centered on clinical utility, not feature discovery.

## Actions
- Add screenshots/GIF walkthrough in next update.
- Add specialty-specific templates (surgery, medicine, OBG, pediatrics).

## Open Questions
- Should quickstart include mandatory safety disclaimer text in each scenario?
- Which 5 templates should be pinned directly in composer UI?
