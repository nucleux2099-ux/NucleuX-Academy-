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

  // SURGERY
  {
    id: "cbme-y4-surg-01-general",
    year: 4,
    subject: "surgery",
    title: "Surgery: Principles + Peri-op care + Shock/Trauma basics",
    order: 101,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery" },
  },
  {
    id: "cbme-y4-surg-02-git",
    year: 4,
    subject: "surgery",
    title: "Surgery: GI + HPB (core)",
    order: 102,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery" },
  },
  {
    id: "cbme-y4-surg-03-urology-breast-thyroid",
    year: 4,
    subject: "surgery",
    title: "Surgery: Urology + Breast + Thyroid",
    order: 103,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/surgery" },
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
