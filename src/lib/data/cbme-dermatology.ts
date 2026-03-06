/**
 * NMC CBME — Dermatology, Venereology & Leprosy Curriculum: Complete UG → PG Mapping
 *
 * UG: 16 modules (DR1–DR16), NMC competency codes
 * PG: MD Dermatology syllabus topics
 */

export type DermatologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface DermatologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface DermatologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: DermatologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface DermatologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface DermatologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: DermatologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const DERMATOLOGY_SUBSPECIALTIES: DermatologySubspecialtyMap[] = [
  { slug: "general-dermatology", name: "General Dermatology", icon: "🧴", ugTopicCount: 12, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "infections-infestations", name: "Infections & Infestations", icon: "🦠", ugTopicCount: 10, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "leprosy", name: "Leprosy", icon: "🩹", ugTopicCount: 4, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "sexually-transmitted-infections", name: "STIs & Venereology", icon: "⚕️", ugTopicCount: 5, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (DR1–DR16) ──────────────────────────────────────────────────

export const DERMATOLOGY_UG_MODULES: DermatologyUGModule[] = [
  {
    id: "dr1", module: "DR1", title: "Skin: Structure & Function",
    subspecialty: "general-dermatology", topicSlugs: ["skin-anatomy"],
    competencies: [
      { code: "DR1.1", text: "Enumerate and describe the structure and function of skin", domain: "K", isCore: true },
      { code: "DR1.2", text: "Describe the morphology of primary and secondary skin lesions", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr2", module: "DR2", title: "Approach to Dermatological Diagnosis",
    subspecialty: "general-dermatology", topicSlugs: ["dermatological-diagnosis"],
    competencies: [
      { code: "DR2.1", text: "Identify and differentiate dermatological lesions based on morphological characteristics", domain: "SH", isCore: true },
      { code: "DR2.2", text: "Perform a systematic examination of the skin", domain: "SH", isCore: true },
    ],
  },
  {
    id: "dr3", module: "DR3", title: "Eczema & Dermatitis",
    subspecialty: "general-dermatology", topicSlugs: ["eczema", "contact-dermatitis"],
    competencies: [
      { code: "DR3.1", text: "Describe the aetiology, pathogenesis, clinical features, classification and management of eczema", domain: "KH", isCore: true },
      { code: "DR3.2", text: "Enumerate and describe the clinical features and management of contact dermatitis", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr4", module: "DR4", title: "Psoriasis & Papulosquamous Disorders",
    subspecialty: "general-dermatology", topicSlugs: ["psoriasis", "lichen-planus"],
    competencies: [
      { code: "DR4.1", text: "Describe the aetiology, pathogenesis, clinical features and management of psoriasis", domain: "KH", isCore: true },
      { code: "DR4.2", text: "Describe the clinical features and management of lichen planus", domain: "KH", isCore: true },
      { code: "DR4.3", text: "Enumerate and describe the clinical features of pityriasis rosea", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr5", module: "DR5", title: "Vesiculobullous Disorders",
    subspecialty: "general-dermatology", topicSlugs: ["pemphigus", "bullous-pemphigoid"],
    competencies: [
      { code: "DR5.1", text: "Describe the aetiology, pathogenesis, clinical features, classification and management of pemphigus and bullous pemphigoid", domain: "KH", isCore: true },
      { code: "DR5.2", text: "Differentiate pemphigus from pemphigoid clinically and on investigations", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr6", module: "DR6", title: "Drug Reactions",
    subspecialty: "general-dermatology", topicSlugs: ["drug-eruptions", "sjs-ten"],
    competencies: [
      { code: "DR6.1", text: "Describe the aetiology, pathogenesis, clinical features and management of cutaneous drug reactions", domain: "KH", isCore: true },
      { code: "DR6.2", text: "Describe the clinical features and emergency management of SJS and TEN", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr7", module: "DR7", title: "Pigmentary Disorders",
    subspecialty: "general-dermatology", topicSlugs: ["vitiligo", "melasma"],
    competencies: [
      { code: "DR7.1", text: "Describe the aetiology, pathogenesis, clinical features and management of vitiligo", domain: "KH", isCore: true },
      { code: "DR7.2", text: "Describe the clinical features and management of melasma and other pigmentary disorders", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr8", module: "DR8", title: "Bacterial Skin Infections",
    subspecialty: "infections-infestations", topicSlugs: ["pyoderma", "bacterial-skin-infections"],
    competencies: [
      { code: "DR8.1", text: "Enumerate and describe the aetiology, clinical features and management of bacterial skin infections (impetigo, folliculitis, cellulitis, abscess)", domain: "KH", isCore: true },
      { code: "DR8.2", text: "Describe the clinical features and management of staphylococcal scalded skin syndrome", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr9", module: "DR9", title: "Fungal Skin Infections",
    subspecialty: "infections-infestations", topicSlugs: ["dermatophytosis", "candidiasis"],
    competencies: [
      { code: "DR9.1", text: "Describe the aetiology, clinical features and management of dermatophytosis", domain: "KH", isCore: true },
      { code: "DR9.2", text: "Describe the clinical features and management of candidiasis and deep fungal infections", domain: "KH", isCore: true },
      { code: "DR9.3", text: "Demonstrate the KOH preparation technique for fungal diagnosis", domain: "SH", isCore: true },
    ],
  },
  {
    id: "dr10", module: "DR10", title: "Viral Skin Infections",
    subspecialty: "infections-infestations", topicSlugs: ["herpes-simplex", "herpes-zoster", "warts", "molluscum"],
    competencies: [
      { code: "DR10.1", text: "Describe the aetiology, clinical features and management of viral infections — herpes simplex, herpes zoster, warts, molluscum contagiosum", domain: "KH", isCore: true },
      { code: "DR10.2", text: "Describe the mucocutaneous manifestations of HIV", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr11", module: "DR11", title: "Parasitic Skin Infections",
    subspecialty: "infections-infestations", topicSlugs: ["scabies", "pediculosis"],
    competencies: [
      { code: "DR11.1", text: "Describe the aetiology, clinical features and management of scabies and pediculosis", domain: "KH", isCore: true },
      { code: "DR11.2", text: "Describe the clinical features and management of cutaneous leishmaniasis", domain: "K", isCore: false },
    ],
  },
  {
    id: "dr12", module: "DR12", title: "Leprosy",
    subspecialty: "leprosy", topicSlugs: ["leprosy-classification", "leprosy-management", "leprosy-reactions"],
    competencies: [
      { code: "DR12.1", text: "Describe the aetiology, pathogenesis, clinical features, classification and management of leprosy", domain: "KH", isCore: true },
      { code: "DR12.2", text: "Describe the management of leprosy reactions (Type 1 and Type 2)", domain: "KH", isCore: true },
      { code: "DR12.3", text: "Describe the deformities and disabilities of leprosy and rehabilitation", domain: "KH", isCore: true },
      { code: "DR12.4", text: "Describe the National Leprosy Eradication Programme (NLEP)", domain: "K", isCore: true },
    ],
  },
  {
    id: "dr13", module: "DR13", title: "Sexually Transmitted Infections",
    subspecialty: "sexually-transmitted-infections", topicSlugs: ["syphilis", "gonorrhoea", "chancroid"],
    competencies: [
      { code: "DR13.1", text: "Describe the aetiology, clinical features, classification and management of syphilis", domain: "KH", isCore: true },
      { code: "DR13.2", text: "Describe the aetiology, clinical features and management of gonococcal and non-gonococcal urethritis", domain: "KH", isCore: true },
      { code: "DR13.3", text: "Describe the syndromic approach to STI management", domain: "KH", isCore: true },
      { code: "DR13.4", text: "Describe the aetiology, clinical features and management of genital ulcer diseases (chancroid, LGV, donovanosis)", domain: "KH", isCore: true },
      { code: "DR13.5", text: "Describe the clinical features and management of HIV-related skin manifestations", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr14", module: "DR14", title: "Urticaria & Erythema",
    subspecialty: "general-dermatology", topicSlugs: ["urticaria", "erythema-nodosum"],
    competencies: [
      { code: "DR14.1", text: "Describe the clinical features and management of urticaria and angioedema", domain: "KH", isCore: true },
      { code: "DR14.2", text: "Describe the clinical features and management of erythema nodosum and erythema multiforme", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr15", module: "DR15", title: "Skin Tumors",
    subspecialty: "general-dermatology", topicSlugs: ["skin-tumors", "melanoma"],
    competencies: [
      { code: "DR15.1", text: "Enumerate and describe the clinical features and management of benign and malignant skin tumors", domain: "KH", isCore: true },
      { code: "DR15.2", text: "Describe the clinical features and management of melanoma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "dr16", module: "DR16", title: "Connective Tissue Disorders",
    subspecialty: "general-dermatology", topicSlugs: ["lupus-skin", "scleroderma-skin"],
    competencies: [
      { code: "DR16.1", text: "Describe the cutaneous features of connective tissue disorders (SLE, scleroderma, dermatomyositis)", domain: "KH", isCore: true },
      { code: "DR16.2", text: "Describe the skin manifestations of systemic diseases", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MD Dermatology Syllabus Topics ──────────────────────────────────────

export const DERMATOLOGY_PG_TOPICS: DermatologyPGTopic[] = [
  { id: "pg-gen-01", title: "Eczema, Psoriasis & Papulosquamous Disorders", section: "General Dermatology", subspecialty: "general-dermatology", topicSlugs: ["eczema", "psoriasis", "lichen-planus"], ugModuleRefs: ["DR3", "DR4"] },
  { id: "pg-gen-02", title: "Vesiculobullous & Autoimmune Skin Diseases", section: "General Dermatology", subspecialty: "general-dermatology", topicSlugs: ["pemphigus", "bullous-pemphigoid"], ugModuleRefs: ["DR5", "DR16"] },
  { id: "pg-gen-03", title: "Drug Reactions — SJS, TEN, DRESS", section: "General Dermatology", subspecialty: "general-dermatology", topicSlugs: ["drug-eruptions", "sjs-ten"], ugModuleRefs: ["DR6"] },
  { id: "pg-gen-04", title: "Dermatosurgery & Skin Tumors", section: "General Dermatology", subspecialty: "general-dermatology", topicSlugs: ["skin-tumors", "melanoma"], ugModuleRefs: ["DR15"] },
  { id: "pg-inf-01", title: "Cutaneous Infections — Bacterial, Fungal, Viral", section: "Infections", subspecialty: "infections-infestations", topicSlugs: ["pyoderma", "dermatophytosis", "herpes-simplex"], ugModuleRefs: ["DR8", "DR9", "DR10"] },
  { id: "pg-inf-02", title: "Parasitic Infestations & Tropical Dermatology", section: "Infections", subspecialty: "infections-infestations", topicSlugs: ["scabies", "pediculosis"], ugModuleRefs: ["DR11"] },
  { id: "pg-inf-03", title: "Mycology — Deep Fungal Infections, Mycetoma", section: "Infections", subspecialty: "infections-infestations", topicSlugs: ["candidiasis"], ugModuleRefs: ["DR9"] },
  { id: "pg-lep-01", title: "Leprosy — Diagnosis, MDT, Reactions, Rehabilitation", section: "Leprosy", subspecialty: "leprosy", topicSlugs: ["leprosy-classification", "leprosy-management", "leprosy-reactions"], ugModuleRefs: ["DR12"] },
  { id: "pg-sti-01", title: "STIs — Syphilis, Gonorrhoea, Genital Ulcers", section: "Venereology", subspecialty: "sexually-transmitted-infections", topicSlugs: ["syphilis", "gonorrhoea", "chancroid"], ugModuleRefs: ["DR13"] },
  { id: "pg-sti-02", title: "HIV Dermatology & Syndromic Management", section: "Venereology", subspecialty: "sexually-transmitted-infections", topicSlugs: ["syphilis"], ugModuleRefs: ["DR13"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return DERMATOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): DermatologyUGModule[] {
  return DERMATOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): DermatologyPGTopic[] {
  return DERMATOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
