/**
 * NMC CBME — MBBS Year 4 (Final year: major clinicals) master map.
 *
 * v1: high-signal skeleton (enough to power Dashboard navigation).
 */

import type { CBMEBlock } from "./cbme-types";

export const CBME_MBBS_Y4_BLOCKS: CBMEBlock[] = [
  // MEDICINE
  {
    id: "cbme-y4-med-01-cvs-resp",
    year: 4,
    subject: "medicine",
    title: "Medicine: CVS + Respiratory",
    order: 1,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/medicine" },
  },
  {
    id: "cbme-y4-med-02-git-liver",
    year: 4,
    subject: "medicine",
    title: "Medicine: GI + Hepatology",
    order: 2,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/medicine" },
  },
  {
    id: "cbme-y4-med-03-neuro-endo-renal",
    year: 4,
    subject: "medicine",
    title: "Medicine: Neuro + Endocrine + Renal",
    order: 3,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/medicine" },
  },

  // SURGERY — 30 modules (SU1–SU30), 132 competencies → /cbme/surgery for full map
  {
    id: "cbme-y4-surg-01-general",
    year: 4,
    subject: "surgery",
    title: "Surgery: General Principles (SU1–SU16, SU18) — Shock, Burns, Wounds, Nutrition, Periop, Infections, MIS",
    order: 101,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery/general-topics" },
  },
  {
    id: "cbme-y4-surg-02-trauma",
    year: 4,
    subject: "surgery",
    title: "Surgery: Trauma & First Aid (SU17) — BLS, Head Injury, Chest Trauma, Airway",
    order: 102,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/surgery/trauma" },
  },
  {
    id: "cbme-y4-surg-03-head-neck",
    year: 4,
    subject: "surgery",
    title: "Surgery: Head & Neck (SU19–SU21, SU24) — Cleft, Oral Cancer, Salivary, Lymph Nodes",
    order: 103,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery/head-neck" },
  },
  {
    id: "cbme-y4-surg-04-endocrine",
    year: 4,
    subject: "surgery",
    title: "Surgery: Endocrine (SU22–SU23) — Thyroid, Parathyroid, Adrenal",
    order: 104,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery/endocrine" },
  },
  {
    id: "cbme-y4-surg-05-breast",
    year: 4,
    subject: "surgery",
    title: "Surgery: Breast (SU25) — Examination, Benign Disease, Breast Cancer",
    order: 105,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/surgery/breast" },
  },
  {
    id: "cbme-y4-surg-06-thoracic",
    year: 4,
    subject: "surgery",
    title: "Surgery: Cardiothoracic (SU26) — Coronary, Mediastinal, Lung Cancer",
    order: 106,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery/thoracic" },
  },
  {
    id: "cbme-y4-surg-07-git",
    year: 4,
    subject: "surgery",
    title: "Surgery: GI System (SU28) — Esophagus, Stomach, HPB, Small Intestine, Colorectal, Anorectal",
    order: 107,
    tags: ["theory", "viva"],
    links: { libraryPath: "/cbme/surgery" },
  },
  {
    id: "cbme-y4-surg-08-vascular",
    year: 4,
    subject: "surgery",
    title: "Surgery: Vascular (SU27) — Arterial, Venous, DVT, Lymphedema",
    order: 108,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery/vascular" },
  },
  {
    id: "cbme-y4-surg-09-urology",
    year: 4,
    subject: "surgery",
    title: "Surgery: Urology (SU29) — Urolithiasis, BPH, Retention, Stricture",
    order: 109,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/surgery/urology" },
  },
  {
    id: "cbme-y4-surg-10-ortho",
    year: 4,
    subject: "surgery",
    title: "Surgery: Orthopedic Principles (SU30) — Fractures, Bone Tumors, Joint Disease",
    order: 110,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery/orthopedic-principles" },
  },

  // OB-GYN
  {
    id: "cbme-y4-obg-01-obstetrics",
    year: 4,
    subject: "obgyn",
    title: "OBGYN: Obstetrics (antenatal, intrapartum, PPH, emergencies)",
    order: 201,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/obgyn" },
  },
  {
    id: "cbme-y4-obg-02-gyne",
    year: 4,
    subject: "obgyn",
    title: "OBGYN: Gynecology (AUB, fibroid, PID, infertility, oncology basics)",
    order: 202,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/obgyn" },
  },

  // PEDIATRICS
  {
    id: "cbme-y4-peds-01-neonat",
    year: 4,
    subject: "pediatrics",
    title: "Pediatrics: Neonatology + Growth/Development",
    order: 301,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pediatrics" },
  },
  {
    id: "cbme-y4-peds-02-common",
    year: 4,
    subject: "pediatrics",
    title: "Pediatrics: Common conditions (resp/GI/CNS) + Emergencies",
    order: 302,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pediatrics" },
  },

  // ORTHOPEDICS
  {
    id: "cbme-y4-ortho-01-trauma",
    year: 4,
    subject: "orthopedics",
    title: "Orthopedics: Trauma (fractures, dislocations, splints)",
    order: 401,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/orthopedics" },
  },
  {
    id: "cbme-y4-ortho-02-bone-joint",
    year: 4,
    subject: "orthopedics",
    title: "Orthopedics: Bone & Joint disorders (infection, arthritis, tumors basics)",
    order: 402,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/orthopedics" },
  },
];
