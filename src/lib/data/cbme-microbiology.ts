/**
 * NMC CBME — Microbiology Curriculum: Complete UG → PG Mapping
 *
 * UG: 8 modules (MI1–MI8), ~60+ competency codes
 * PG: MD Microbiology
 *
 * Mapped to library content/microbiology/ subdirs.
 */

export type MicrobiologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface MicrobiologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface MicrobiologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: MicrobiologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface MicrobiologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface MicrobiologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: MicrobiologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const MICROBIOLOGY_SUBSPECIALTIES: MicrobiologySubspecialtyMap[] = [
  { slug: "general-microbiology", name: "General Microbiology", icon: "🔬", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "immunology", name: "Immunology", icon: "🛡️", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "gram-positive-bacteria", name: "Gram-Positive Bacteria", icon: "🟣", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "gram-negative-bacteria", name: "Gram-Negative Bacteria", icon: "🔴", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "mycobacteria", name: "Mycobacteria & Acid-Fast", icon: "🦠", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "virology", name: "Virology", icon: "🧬", ugTopicCount: 6, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "mycology", name: "Mycology", icon: "🍄", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "parasitology", name: "Parasitology", icon: "🐛", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "systemic-infections", name: "Applied & Clinical", icon: "🏥", ugTopicCount: 4, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "general-topics", name: "Lab & Research", icon: "🧪", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (MI1–MI8) ──────────────────────────────────────────────────

export const MICROBIOLOGY_UG_MODULES: MicrobiologyUGModule[] = [
  // ─── MI1: General Microbiology ───
  {
    id: "mi1", module: "MI1", title: "General Microbiology",
    subspecialty: "general-microbiology", topicSlugs: ["bacterial-morphology", "sterilization", "culture-methods", "bacterial-genetics"],
    competencies: [
      { code: "MI1.1", text: "Describe the history, evolution and scope of microbiology", domain: "K", isCore: true },
      { code: "MI1.2", text: "Describe the morphology and classification of bacteria", domain: "KH", isCore: true },
      { code: "MI1.3", text: "Describe the structure, physiology and growth of bacteria", domain: "KH", isCore: true },
      { code: "MI1.4", text: "Describe the methods of sterilization and disinfection", domain: "KH", isCore: true },
      { code: "MI1.5", text: "Describe the principles of culture media and techniques of bacterial culture", domain: "KH", isCore: true },
      { code: "MI1.6", text: "Describe the bacterial genetics — conjugation, transduction, transformation, mutations", domain: "KH", isCore: true },
      { code: "MI1.7", text: "Describe the mechanisms of antimicrobial resistance", domain: "KH", isCore: true },
      { code: "MI1.8", text: "Describe the normal microbial flora of the human body", domain: "KH", isCore: true },
      { code: "MI1.9", text: "Describe the principles of specimen collection and transport", domain: "SH", isCore: true },
      { code: "MI1.10", text: "Perform Gram staining, Ziehl-Neelsen staining and identify bacteria", domain: "SH", isCore: true },
    ],
  },
  // ─── MI2: Immunology ───
  {
    id: "mi2", module: "MI2", title: "Immunology",
    subspecialty: "immunology", topicSlugs: ["innate-immunity", "adaptive-immunity", "hypersensitivity", "immunodiagnostics"],
    competencies: [
      { code: "MI2.1", text: "Describe the components and functions of innate immunity", domain: "KH", isCore: true },
      { code: "MI2.2", text: "Describe the components of adaptive immunity — humoral and cell-mediated", domain: "KH", isCore: true },
      { code: "MI2.3", text: "Describe the structure, types and functions of antibodies (immunoglobulins)", domain: "KH", isCore: true },
      { code: "MI2.4", text: "Describe the complement system — pathways, functions, deficiencies", domain: "KH", isCore: true },
      { code: "MI2.5", text: "Describe the hypersensitivity reactions — Type I, II, III, IV", domain: "KH", isCore: true },
      { code: "MI2.6", text: "Describe the principles of immunodiagnosis — ELISA, RIA, immunofluorescence", domain: "KH", isCore: true },
      { code: "MI2.7", text: "Describe the principles of vaccines and immunization schedule", domain: "KH", isCore: true },
      { code: "MI2.8", text: "Describe the immunodeficiency diseases — primary and secondary (including AIDS)", domain: "KH", isCore: true },
      { code: "MI2.9", text: "Describe the principles of autoimmunity and autoimmune diseases", domain: "KH", isCore: true },
      { code: "MI2.10", text: "Describe the immunology of transplant rejection and tumor immunity", domain: "K", isCore: true },
    ],
  },
  // ─── MI3: Bacteriology — Gram-Positive ───
  {
    id: "mi3", module: "MI3", title: "Bacteriology — Gram-Positive Cocci & Bacilli",
    subspecialty: "gram-positive-bacteria", topicSlugs: ["staphylococcus", "streptococcus", "clostridium", "corynebacterium"],
    competencies: [
      { code: "MI3.1", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Staphylococcus", domain: "KH", isCore: true },
      { code: "MI3.2", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Streptococcus", domain: "KH", isCore: true },
      { code: "MI3.3", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Pneumococcus", domain: "KH", isCore: true },
      { code: "MI3.4", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Clostridium (tetanus, gas gangrene, botulism)", domain: "KH", isCore: true },
      { code: "MI3.5", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Corynebacterium diphtheriae", domain: "KH", isCore: true },
      { code: "MI3.6", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Bacillus (anthrax)", domain: "KH", isCore: true },
      { code: "MI3.7", text: "Describe the anaerobic bacteria — Bacteroides, Actinomyces, Nocardia", domain: "KH", isCore: true },
    ],
  },
  // ─── MI4: Bacteriology — Gram-Negative ───
  {
    id: "mi4", module: "MI4", title: "Bacteriology — Gram-Negative & Enterobacteriaceae",
    subspecialty: "gram-negative-bacteria", topicSlugs: ["enterobacteriaceae", "pseudomonas", "vibrio", "neisseria", "haemophilus"],
    competencies: [
      { code: "MI4.1", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of E. coli and Klebsiella", domain: "KH", isCore: true },
      { code: "MI4.2", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Salmonella (typhoid fever)", domain: "KH", isCore: true },
      { code: "MI4.3", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Shigella", domain: "KH", isCore: true },
      { code: "MI4.4", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Vibrio cholerae", domain: "KH", isCore: true },
      { code: "MI4.5", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Pseudomonas", domain: "KH", isCore: true },
      { code: "MI4.6", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Neisseria (meningococcus, gonococcus)", domain: "KH", isCore: true },
      { code: "MI4.7", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Haemophilus", domain: "KH", isCore: true },
      { code: "MI4.8", text: "Describe the morphology, culture, pathogenesis, lab diagnosis of Brucella, Bordetella", domain: "KH", isCore: true },
      { code: "MI4.9", text: "Describe the spirochetes — Treponema (syphilis), Leptospira, Borrelia", domain: "KH", isCore: true },
    ],
  },
  // ─── MI5: Mycobacteria ───
  {
    id: "mi5", module: "MI5", title: "Mycobacteria — TB & Leprosy",
    subspecialty: "mycobacteria", topicSlugs: ["tuberculosis", "leprosy", "atypical-mycobacteria"],
    competencies: [
      { code: "MI5.1", text: "Describe the morphology, culture, pathogenesis of Mycobacterium tuberculosis", domain: "KH", isCore: true },
      { code: "MI5.2", text: "Describe the laboratory diagnosis of tuberculosis — microscopy, culture, molecular tests", domain: "KH", isCore: true },
      { code: "MI5.3", text: "Describe the immunology of tuberculosis — tuberculin test, BCG vaccine", domain: "KH", isCore: true },
      { code: "MI5.4", text: "Describe drug resistance in TB — MDR-TB, XDR-TB", domain: "KH", isCore: true },
      { code: "MI5.5", text: "Describe the morphology, pathogenesis, lab diagnosis of Mycobacterium leprae", domain: "KH", isCore: true },
      { code: "MI5.6", text: "Describe the atypical (non-tuberculous) mycobacteria — classification, diseases", domain: "K", isCore: true },
    ],
  },
  // ─── MI6: Virology ───
  {
    id: "mi6", module: "MI6", title: "Virology",
    subspecialty: "virology", topicSlugs: ["general-virology", "herpes-viruses", "hepatitis-viruses", "hiv", "respiratory-viruses", "arboviruses"],
    competencies: [
      { code: "MI6.1", text: "Describe the general properties, classification and replication of viruses", domain: "KH", isCore: true },
      { code: "MI6.2", text: "Describe the pathogenesis, lab diagnosis of Herpes viruses (HSV, VZV, CMV, EBV)", domain: "KH", isCore: true },
      { code: "MI6.3", text: "Describe the pathogenesis, lab diagnosis of hepatitis viruses (A, B, C, D, E)", domain: "KH", isCore: true },
      { code: "MI6.4", text: "Describe the pathogenesis, lab diagnosis of HIV — stages, diagnosis, prevention", domain: "KH", isCore: true },
      { code: "MI6.5", text: "Describe the pathogenesis, lab diagnosis of respiratory viruses — influenza, measles, mumps, rubella", domain: "KH", isCore: true },
      { code: "MI6.6", text: "Describe the pathogenesis, lab diagnosis of rabies virus", domain: "KH", isCore: true },
      { code: "MI6.7", text: "Describe the pathogenesis, lab diagnosis of arboviruses — dengue, chikungunya, Japanese encephalitis", domain: "KH", isCore: true },
      { code: "MI6.8", text: "Describe the pathogenesis, lab diagnosis of enteroviruses — polio, Coxsackie", domain: "KH", isCore: true },
      { code: "MI6.9", text: "Describe the pathogenesis, lab diagnosis of rotavirus and other GI viruses", domain: "KH", isCore: true },
      { code: "MI6.10", text: "Describe the oncogenic viruses — HPV, EBV, HBV, HCV, HTLV", domain: "KH", isCore: true },
    ],
  },
  // ─── MI7: Mycology ───
  {
    id: "mi7", module: "MI7", title: "Mycology",
    subspecialty: "mycology", topicSlugs: ["superficial-mycoses", "deep-mycoses", "opportunistic-fungi"],
    competencies: [
      { code: "MI7.1", text: "Describe the general properties and classification of fungi", domain: "KH", isCore: true },
      { code: "MI7.2", text: "Describe the pathogenesis, lab diagnosis of superficial mycoses — dermatophytes", domain: "KH", isCore: true },
      { code: "MI7.3", text: "Describe the pathogenesis, lab diagnosis of subcutaneous mycoses — sporotrichosis, mycetoma", domain: "KH", isCore: true },
      { code: "MI7.4", text: "Describe the pathogenesis, lab diagnosis of systemic mycoses — histoplasma, coccidioides", domain: "KH", isCore: true },
      { code: "MI7.5", text: "Describe the pathogenesis, lab diagnosis of opportunistic fungi — Candida, Aspergillus, Cryptococcus, Mucor", domain: "KH", isCore: true },
    ],
  },
  // ─── MI8: Parasitology ───
  {
    id: "mi8", module: "MI8", title: "Parasitology",
    subspecialty: "parasitology", topicSlugs: ["protozoa", "helminths", "malaria", "filariasis", "amoebiasis"],
    competencies: [
      { code: "MI8.1", text: "Describe the general properties and classification of parasites", domain: "KH", isCore: true },
      { code: "MI8.2", text: "Describe the life cycle, pathogenesis, lab diagnosis of Plasmodium (malaria)", domain: "KH", isCore: true },
      { code: "MI8.3", text: "Describe the life cycle, pathogenesis, lab diagnosis of Entamoeba histolytica", domain: "KH", isCore: true },
      { code: "MI8.4", text: "Describe the life cycle, pathogenesis, lab diagnosis of Leishmania", domain: "KH", isCore: true },
      { code: "MI8.5", text: "Describe the life cycle, pathogenesis, lab diagnosis of Giardia and Trichomonas", domain: "KH", isCore: true },
      { code: "MI8.6", text: "Describe the life cycle, pathogenesis, lab diagnosis of helminths — Ascaris, hookworm, Enterobius", domain: "KH", isCore: true },
      { code: "MI8.7", text: "Describe the life cycle, pathogenesis, lab diagnosis of filarial worms — Wuchereria", domain: "KH", isCore: true },
      { code: "MI8.8", text: "Describe the life cycle, pathogenesis, lab diagnosis of cestodes — Taenia, Echinococcus", domain: "KH", isCore: true },
      { code: "MI8.9", text: "Describe the life cycle, pathogenesis, lab diagnosis of trematodes — Schistosoma", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MD Microbiology Topics ─────────────────────────────────────────────

export const MICROBIOLOGY_PG_TOPICS: MicrobiologyPGTopic[] = [
  { id: "pg-gen-01", title: "Bacterial Physiology, Genetics & Antimicrobial Resistance", section: "General", subspecialty: "general-microbiology", topicSlugs: ["bacterial-morphology", "bacterial-genetics"], ugModuleRefs: ["MI1"] },
  { id: "pg-gen-02", title: "Sterilization, Disinfection & Infection Control", section: "General", subspecialty: "general-microbiology", topicSlugs: ["sterilization"], ugModuleRefs: ["MI1"] },
  { id: "pg-gen-03", title: "Diagnostic Microbiology — Culture, Molecular & POCT", section: "General", subspecialty: "general-microbiology", topicSlugs: ["culture-methods"], ugModuleRefs: ["MI1"] },
  { id: "pg-imm-01", title: "Innate & Adaptive Immunity — Molecular Mechanisms", section: "Immunology", subspecialty: "immunology", topicSlugs: ["innate-immunity", "adaptive-immunity"], ugModuleRefs: ["MI2"] },
  { id: "pg-imm-02", title: "Immunodiagnostics — ELISA, Flow Cytometry, PCR", section: "Immunology", subspecialty: "immunology", topicSlugs: ["immunodiagnostics"], ugModuleRefs: ["MI2"] },
  { id: "pg-imm-03", title: "Vaccinology & Immunotherapy — Advanced", section: "Immunology", subspecialty: "immunology", topicSlugs: ["innate-immunity"], ugModuleRefs: ["MI2"] },
  { id: "pg-bact-01", title: "Gram-Positive Cocci & Bacilli — Advanced Diagnostics", section: "Bacteriology", subspecialty: "gram-positive-bacteria", topicSlugs: ["staphylococcus", "streptococcus", "clostridium"], ugModuleRefs: ["MI3"] },
  { id: "pg-bact-02", title: "Gram-Positive — Corynebacterium, Bacillus, Anaerobes", section: "Bacteriology", subspecialty: "gram-positive-bacteria", topicSlugs: ["corynebacterium"], ugModuleRefs: ["MI3"] },
  { id: "pg-bact-03", title: "Enterobacteriaceae & GI Pathogens — Advanced", section: "Bacteriology", subspecialty: "gram-negative-bacteria", topicSlugs: ["enterobacteriaceae", "vibrio"], ugModuleRefs: ["MI4"] },
  { id: "pg-bact-04", title: "Pseudomonas, Neisseria & Non-Fermenters", section: "Bacteriology", subspecialty: "gram-negative-bacteria", topicSlugs: ["pseudomonas", "neisseria"], ugModuleRefs: ["MI4"] },
  { id: "pg-bact-05", title: "Spirochetes, Rickettsia & Atypical Bacteria", section: "Bacteriology", subspecialty: "gram-negative-bacteria", topicSlugs: ["haemophilus"], ugModuleRefs: ["MI4"] },
  { id: "pg-myco-01", title: "Tuberculosis — Advanced Diagnostics & Drug Resistance", section: "Mycobacteria", subspecialty: "mycobacteria", topicSlugs: ["tuberculosis"], ugModuleRefs: ["MI5"] },
  { id: "pg-myco-02", title: "Leprosy & Non-Tuberculous Mycobacteria", section: "Mycobacteria", subspecialty: "mycobacteria", topicSlugs: ["leprosy", "atypical-mycobacteria"], ugModuleRefs: ["MI5"] },
  { id: "pg-vir-01", title: "DNA Viruses — Herpes, Adeno, Pox, Papilloma — Advanced", section: "Virology", subspecialty: "virology", topicSlugs: ["herpes-viruses"], ugModuleRefs: ["MI6"] },
  { id: "pg-vir-02", title: "RNA Viruses — Hepatitis, HIV, Respiratory — Advanced", section: "Virology", subspecialty: "virology", topicSlugs: ["hepatitis-viruses", "hiv", "respiratory-viruses"], ugModuleRefs: ["MI6"] },
  { id: "pg-vir-03", title: "Arboviruses, Enteroviruses & Emerging Infections", section: "Virology", subspecialty: "virology", topicSlugs: ["arboviruses"], ugModuleRefs: ["MI6"] },
  { id: "pg-myc-01", title: "Superficial & Subcutaneous Mycoses — Advanced", section: "Mycology", subspecialty: "mycology", topicSlugs: ["superficial-mycoses"], ugModuleRefs: ["MI7"] },
  { id: "pg-myc-02", title: "Systemic & Opportunistic Mycoses — Advanced", section: "Mycology", subspecialty: "mycology", topicSlugs: ["deep-mycoses", "opportunistic-fungi"], ugModuleRefs: ["MI7"] },
  { id: "pg-par-01", title: "Protozoa — Malaria, Amoebiasis, Leishmania — Advanced", section: "Parasitology", subspecialty: "parasitology", topicSlugs: ["malaria", "amoebiasis"], ugModuleRefs: ["MI8"] },
  { id: "pg-par-02", title: "Helminths — Nematodes, Cestodes, Trematodes — Advanced", section: "Parasitology", subspecialty: "parasitology", topicSlugs: ["helminths", "filariasis"], ugModuleRefs: ["MI8"] },
  { id: "pg-par-03", title: "Applied Parasitology & Vector Control", section: "Parasitology", subspecialty: "parasitology", topicSlugs: ["protozoa"], ugModuleRefs: ["MI8"] },
  { id: "pg-app-01", title: "Hospital Infection Control & Antibiotic Stewardship", section: "Applied", subspecialty: "systemic-infections", topicSlugs: [], ugModuleRefs: ["MI1"] },
  { id: "pg-app-02", title: "Syndromic Approach — UTI, RTI, GI Infections, CNS Infections", section: "Applied", subspecialty: "systemic-infections", topicSlugs: [], ugModuleRefs: ["MI3", "MI4", "MI6"] },
  { id: "pg-app-03", title: "Bioterrorism, Emerging Infections & Global Health", section: "Applied", subspecialty: "systemic-infections", topicSlugs: [], ugModuleRefs: [] },
  { id: "pg-lab-01", title: "Quality Assurance & Lab Management", section: "Research", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: ["MI1"] },
  { id: "pg-lab-02", title: "Research Methodology & Biostatistics in Microbiology", section: "Research", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: [] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return MICROBIOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): MicrobiologyUGModule[] {
  return MICROBIOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): MicrobiologyPGTopic[] {
  return MICROBIOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
