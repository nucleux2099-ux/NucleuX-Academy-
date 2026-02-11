/**
 * NMC CBME — MBBS Year 3 (Block-wise) master map.
 *
 * v1: high-signal skeleton (enough to power Dashboard navigation).
 */

import type { CBMEBlock } from "./cbme-types";

export const CBME_MBBS_Y3_BLOCKS: CBMEBlock[] = [
  // PSM / Community Medicine
  {
    id: "cbme-y3-psm-01-epi-bio",
    year: 3,
    subject: "psm",
    title: "Epidemiology + Biostatistics (core)",
    order: 1,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/psm" },
  },
  {
    id: "cbme-y3-psm-02-public-health",
    year: 3,
    subject: "psm",
    title: "Public Health Systems + Programs (India) + Screening",
    order: 2,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/psm" },
  },
  {
    id: "cbme-y3-psm-03-env-occup",
    year: 3,
    subject: "psm",
    title: "Environmental + Occupational Health",
    order: 3,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/psm" },
  },

  // ENT
  {
    id: "cbme-y3-ent-01-ear",
    year: 3,
    subject: "ent",
    title: "ENT: Ear",
    order: 101,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },
  {
    id: "cbme-y3-ent-02-nose",
    year: 3,
    subject: "ent",
    title: "ENT: Nose + PNS",
    order: 102,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },
  {
    id: "cbme-y3-ent-03-throat",
    year: 3,
    subject: "ent",
    title: "ENT: Throat + Larynx",
    order: 103,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },

  // OPHTHALMOLOGY
  {
    id: "cbme-y3-oph-01-general",
    year: 3,
    subject: "ophthalmology",
    title: "Ophthalmology: Anatomy/Physiology + Examination",
    order: 201,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
  {
    id: "cbme-y3-oph-02-anterior",
    year: 3,
    subject: "ophthalmology",
    title: "Ophthalmology: Anterior Segment",
    order: 202,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
  {
    id: "cbme-y3-oph-03-posterior-neuro",
    year: 3,
    subject: "ophthalmology",
    title: "Ophthalmology: Posterior Segment + Neuro-ophthalmology",
    order: 203,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
];
