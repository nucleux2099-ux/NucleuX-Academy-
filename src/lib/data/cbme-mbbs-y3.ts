/**
 * NMC CBME — MBBS Year 3 (Phase 3 Part 1: Clinical transition)
 *
 * Subjects: PSM/Community Medicine, ENT, Ophthalmology
 * + Clinical postings begin, AETCOM integration
 */

import type { CBMEBlock } from "./cbme-types";

export const CBME_MBBS_Y3_BLOCKS: CBMEBlock[] = [
  // =====================
  // PSM / COMMUNITY MEDICINE
  // =====================
  {
    id: "cbme-y3-psm-01-epi-bio",
    year: 3,
    subject: "psm",
    title: "Epidemiology & Biostatistics — Study Design, Measures, Surveillance, Screening",
    order: 1,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },
  {
    id: "cbme-y3-psm-02-communicable",
    year: 3,
    subject: "psm",
    title: "Communicable Diseases — Malaria, TB, HIV, Hepatitis, Rabies, Vector Control",
    order: 2,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },
  {
    id: "cbme-y3-psm-03-ncd",
    year: 3,
    subject: "psm",
    title: "Non-Communicable Diseases — CVD, DM, Cancer, Blindness, Mental Health Programs",
    order: 3,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },
  {
    id: "cbme-y3-psm-04-nutrition",
    year: 3,
    subject: "psm",
    title: "Nutrition & MCH — PEM, Micronutrients, ANC, Immunization, Family Planning",
    order: 4,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },
  {
    id: "cbme-y3-psm-05-env-occup",
    year: 3,
    subject: "psm",
    title: "Environmental & Occupational Health — Water, Sanitation, Air, Waste, Industrial",
    order: 5,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },
  {
    id: "cbme-y3-psm-06-health-systems",
    year: 3,
    subject: "psm",
    title: "Health Systems — Indian PHC, NHM, Ayushman Bharat, Health Legislation, IEC",
    order: 6,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },
  {
    id: "cbme-y3-psm-07-demography",
    year: 3,
    subject: "psm",
    title: "Demography & Health Economics — Census, Vital Statistics, Health Indicators",
    order: 7,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/community-medicine" },
  },

  // =====================
  // ENT
  // =====================
  {
    id: "cbme-y3-ent-01-ear",
    year: 3,
    subject: "ent",
    title: "Ear — Anatomy, CSOM, Otitis Media, Deafness, Mastoiditis, Hearing Tests",
    order: 101,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },
  {
    id: "cbme-y3-ent-02-nose",
    year: 3,
    subject: "ent",
    title: "Nose & PNS — Sinusitis, Epistaxis, DNS, Nasal Polyps, CSF Rhinorrhea",
    order: 102,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },
  {
    id: "cbme-y3-ent-03-throat",
    year: 3,
    subject: "ent",
    title: "Throat & Larynx — Tonsillitis, Adenoids, Laryngeal Tumors, Stridor, Tracheostomy",
    order: 103,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },
  {
    id: "cbme-y3-ent-04-head-neck",
    year: 3,
    subject: "ent",
    title: "Head & Neck — Deep Neck Infections, Foreign Bodies, Sleep Apnea, Neck Masses",
    order: 104,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ent" },
  },

  // =====================
  // OPHTHALMOLOGY
  // =====================
  {
    id: "cbme-y3-oph-01-general",
    year: 3,
    subject: "ophthalmology",
    title: "Ocular Anatomy, Physiology & Examination — Slit Lamp, Fundoscopy, Refraction",
    order: 201,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
  {
    id: "cbme-y3-oph-02-anterior",
    year: 3,
    subject: "ophthalmology",
    title: "Anterior Segment — Conjunctivitis, Corneal Ulcer, Cataract, Glaucoma, Uveitis",
    order: 202,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
  {
    id: "cbme-y3-oph-03-posterior",
    year: 3,
    subject: "ophthalmology",
    title: "Posterior Segment — Retinal Detachment, Diabetic Retinopathy, Optic Neuritis",
    order: 203,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
  {
    id: "cbme-y3-oph-04-neuro-orbit",
    year: 3,
    subject: "ophthalmology",
    title: "Neuro-ophthalmology & Orbit — Squint, Ptosis, Proptosis, Ocular Trauma, Tumors",
    order: 204,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
  {
    id: "cbme-y3-oph-05-community",
    year: 3,
    subject: "ophthalmology",
    title: "Community Ophthalmology — Blindness Prevention, NPCB, Trachoma, Vit A Deficiency",
    order: 205,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/ophthalmology" },
  },
];
