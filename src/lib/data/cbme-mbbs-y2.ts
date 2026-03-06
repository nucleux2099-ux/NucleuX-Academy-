/**
 * NMC CBME — MBBS Year 2 (Phase 2: Pre-clinical → Para-clinical transition)
 *
 * Subjects: Pathology, Pharmacology, Microbiology, Forensic Medicine
 * + Early clinical exposure (ECE) begins
 */

import type { CBMEBlock } from "./cbme-types";

export const CBME_MBBS_Y2_BLOCKS: CBMEBlock[] = [
  // =====================
  // PATHOLOGY
  // =====================
  {
    id: "cbme-y2-path-01-general",
    year: 2,
    subject: "pathology",
    title: "General Pathology — Cell Injury, Inflammation, Repair, Hemodynamic Disorders",
    order: 1,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },
  {
    id: "cbme-y2-path-02-hematology",
    year: 2,
    subject: "pathology",
    title: "Hematology — Anemia, Leukemia, Coagulation Disorders, Blood Banking",
    order: 2,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },
  {
    id: "cbme-y2-path-03-systemic",
    year: 2,
    subject: "pathology",
    title: "Systemic Pathology — CVS, Respiratory, GIT, Liver, Kidney, Endocrine",
    order: 3,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },
  {
    id: "cbme-y2-path-04-neoplasia",
    year: 2,
    subject: "pathology",
    title: "Neoplasia — Oncogenesis, Grading, Staging, Tumor Markers, Cytology",
    order: 4,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },
  {
    id: "cbme-y2-path-05-immunopath",
    year: 2,
    subject: "pathology",
    title: "Immunopathology & Genetic Disorders — Autoimmunity, Transplant, Amyloidosis",
    order: 5,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pathology" },
  },

  // =====================
  // PHARMACOLOGY
  // =====================
  {
    id: "cbme-y2-pharma-01-general",
    year: 2,
    subject: "pharmacology",
    title: "General Pharmacology — Pharmacokinetics, Pharmacodynamics, Drug Interactions",
    order: 101,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharma-02-ans",
    year: 2,
    subject: "pharmacology",
    title: "Autonomic Nervous System — Cholinergic, Adrenergic, Ganglionic Drugs",
    order: 102,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharma-03-cns",
    year: 2,
    subject: "pharmacology",
    title: "CNS Pharmacology — Analgesics, Anesthetics, Antiepileptics, Psychopharmacology",
    order: 103,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharma-04-cvs-renal",
    year: 2,
    subject: "pharmacology",
    title: "CVS & Renal — Antihypertensives, Antiarrhythmics, Diuretics, Antianginals",
    order: 104,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharma-05-antimicrobials",
    year: 2,
    subject: "pharmacology",
    title: "Antimicrobials — Antibiotics, Antifungals, Antivirals, Antimalarials, Anti-TB",
    order: 105,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharma-06-autacoids-endo",
    year: 2,
    subject: "pharmacology",
    title: "Autacoids, GIT, Endocrine — Antihistamines, PPIs, Insulin, Steroids, Thyroid Drugs",
    order: 106,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },
  {
    id: "cbme-y2-pharma-07-chemo",
    year: 2,
    subject: "pharmacology",
    title: "Chemotherapy & Immunopharmacology — Anticancer Drugs, Immunosuppressants",
    order: 107,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/pharmacology" },
  },

  // =====================
  // MICROBIOLOGY
  // =====================
  {
    id: "cbme-y2-micro-01-general",
    year: 2,
    subject: "microbiology",
    title: "General Microbiology — Sterilization, Culture, Microscopy, Immunology Basics",
    order: 201,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-02-bacteriology",
    year: 2,
    subject: "microbiology",
    title: "Systematic Bacteriology — Gram+, Gram−, Mycobacteria, Spirochetes, Anaerobes",
    order: 202,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-03-virology",
    year: 2,
    subject: "microbiology",
    title: "Virology — DNA/RNA Viruses, HIV, Hepatitis, Rabies, Dengue, COVID",
    order: 203,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-04-parasitology",
    year: 2,
    subject: "microbiology",
    title: "Parasitology & Mycology — Malaria, Filaria, Helminths, Dermatophytes, Candida",
    order: 204,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },
  {
    id: "cbme-y2-micro-05-clinical",
    year: 2,
    subject: "microbiology",
    title: "Clinical & Applied Microbiology — Hospital Infections, Bioterrorism, Vaccines",
    order: 205,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/microbiology" },
  },

  // =====================
  // FORENSIC MEDICINE
  // =====================
  {
    id: "cbme-y2-forensic-01-medicolegal",
    year: 2,
    subject: "forensic",
    title: "Medicolegal — Death, Autopsy, Identification, Medical Jurisprudence, Ethics",
    order: 301,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/forensic-medicine" },
  },
  {
    id: "cbme-y2-forensic-02-trauma",
    year: 2,
    subject: "forensic",
    title: "Forensic Trauma — Mechanical Injuries, Firearms, Asphyxia, Sexual Offenses",
    order: 302,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/forensic-medicine" },
  },
  {
    id: "cbme-y2-forensic-03-toxicology",
    year: 2,
    subject: "forensic",
    title: "Toxicology — Poisoning (Corrosive, Metallic, Organic), Substance Abuse, Snakebite",
    order: 303,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/forensic-medicine" },
  },
];
