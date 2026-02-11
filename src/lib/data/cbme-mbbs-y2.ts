/**
 * NMC CBME — MBBS Year 2 (Block-wise) master map.
 *
 * v1: high-signal skeleton (enough to power Dashboard navigation).
 */

import type { CBMEBlock } from "./cbme-types";

export const CBME_MBBS_Y2_BLOCKS: CBMEBlock[] = [
  // PATHOLOGY
  {
    id: "cbme-y2-path-01-general",
    year: 2,
    subject: "pathology",
    title: "General Pathology (cell injury, inflammation, healing, neoplasia)",
    order: 1,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },
  {
    id: "cbme-y2-path-02-hematology",
    year: 2,
    subject: "pathology",
    title: "Hematology + Lymphoid System",
    order: 2,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },
  {
    id: "cbme-y2-path-03-systemic",
    year: 2,
    subject: "pathology",
    title: "Systemic Pathology (organ systems)",
    order: 3,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },

  // PHARMACOLOGY
  {
    id: "cbme-y2-pharm-01-general",
    year: 2,
    subject: "pharmacology",
    title: "General Pharmacology (PK/PD, ADRs, receptors)",
    order: 101,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharm-02-autonomic",
    year: 2,
    subject: "pharmacology",
    title: "Autonomic Pharmacology",
    order: 102,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharm-03-cns",
    year: 2,
    subject: "pharmacology",
    title: "CNS Pharmacology",
    order: 103,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharm-04-antimicrobials",
    year: 2,
    subject: "pharmacology",
    title: "Antimicrobials (principles + major classes)",
    order: 104,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },

  // MICROBIOLOGY
  {
    id: "cbme-y2-micro-01-immunology",
    year: 2,
    subject: "microbiology",
    title: "Immunology (core concepts + lab basics)",
    order: 201,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-02-bacteriology",
    year: 2,
    subject: "microbiology",
    title: "Bacteriology (systematic + infections)",
    order: 202,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-03-virology",
    year: 2,
    subject: "microbiology",
    title: "Virology",
    order: 203,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-04-parasitology-fungi",
    year: 2,
    subject: "microbiology",
    title: "Parasitology + Mycology",
    order: 204,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },

  // FORENSIC
  {
    id: "cbme-y2-fmt-01-general",
    year: 2,
    subject: "forensic",
    title: "Forensic Medicine (basics, medico-legal system, documentation)",
    order: 301,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/forensic" },
  },
  {
    id: "cbme-y2-fmt-02-injuries-poisoning",
    year: 2,
    subject: "forensic",
    title: "Injuries + Toxicology (core)",
    order: 302,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/forensic" },
  },
];
