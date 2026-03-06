import type { Template } from "./types";

export const defaultTemplates: Template[] = [
  {
    templateId: "tpl_topic_summary",
    title: "Topic Summary (5 bullets)",
    kind: "slide",
    payload: {
      heading: "<Topic> — Summary",
      bullets: [
        "Definition (1 line)",
        "Pathophysiology / mechanism",
        "Clinical features / red flags",
        "Diagnosis / key tests",
        "Management (first steps + definitive)",
      ],
      speakerNotes: "Use this as the opening slide for quick revision.",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    templateId: "tpl_case_slide",
    title: "Case Slide (Hx/PE/DDx/Plan)",
    kind: "slide",
    payload: {
      heading: "Case: <short title>",
      bullets: [
        "Hx: ",
        "PE: ",
        "DDx (top 3): ",
        "Plan: ",
      ],
      speakerNotes: "Keep the case anonymized. Focus on decision points.",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    templateId: "tpl_algorithm",
    title: "Algorithm Slide (steps + red flags)",
    kind: "slide",
    payload: {
      heading: "Algorithm: <Topic>",
      bullets: [
        "Step 1: ",
        "Step 2: ",
        "Step 3: ",
        "Red flags / when to escalate: ",
      ],
      speakerNotes: "Teach the rule, then exceptions.",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    templateId: "tpl_mcq_review",
    title: "MCQ Review (traps + why wrong)",
    kind: "slide",
    payload: {
      heading: "MCQ Review: <question theme>",
      bullets: [
        "Correct answer: ",
        "Why correct (mechanism): ",
        "Common trap: ",
        "Why option B is wrong: ",
        "1 takeaway rule: ",
      ],
      speakerNotes: "Make the takeaway rule testable (1-line).",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
