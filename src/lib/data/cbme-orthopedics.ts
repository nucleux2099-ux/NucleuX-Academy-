/**
 * NMC CBME — Orthopedics Curriculum: Complete UG → PG → SS Mapping
 *
 * UG: 14 modules (OR1–OR14)
 * PG: MS Orthopedics systemic topics
 * SS: MCh super-specialty curricula
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type OrthopedicsLevel = "UG" | "PG" | "SS";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface OrthopedicsCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface OrthopedicsUGModule {
  id: string;
  module: string;
  title: string;
  competencies: OrthopedicsCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface OrthopedicsPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface OrthopedicsSSTopic {
  id: string;
  degree: "MCh";
  specialty: string;
  title: string;
  subspecialty: string;
  topicSlugs: string[];
  pgTopicRefs: string[];
}

export interface OrthopedicsSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  ssTopicCount: number;
  levels: OrthopedicsLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const ORTHOPEDICS_SUBSPECIALTIES: OrthopedicsSubspecialtyMap[] = [
  { slug: "general-topics", name: "General Topics", icon: "📋", ugTopicCount: 6, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "trauma-fractures", name: "Trauma & Fractures", icon: "🦴", ugTopicCount: 12, pgTopicCount: 8, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "bone-joint-infections", name: "Bone & Joint Infections", icon: "🦠", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "bone-tumors", name: "Bone Tumors", icon: "🎗️", ugTopicCount: 3, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "spine", name: "Spine", icon: "🔗", ugTopicCount: 4, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "arthroplasty", name: "Arthroplasty & Joint Replacement", icon: "🔧", ugTopicCount: 2, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "pediatric-orthopedics", name: "Pediatric Orthopedics", icon: "🧒", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "sports-medicine", name: "Sports Medicine", icon: "⚽", ugTopicCount: 2, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
];

// ─── UG Modules (OR1–OR14) ──────────────────────────────────────────────────

export const ORTHOPEDICS_UG_MODULES: OrthopedicsUGModule[] = [
  {
    id: "or1", module: "OR1", title: "General Principles of Orthopedics",
    subspecialty: "general-topics", topicSlugs: ["orthopedic-history", "orthopedic-examination"],
    competencies: [
      { code: "OR1.1", text: "Describe and discuss the principles of pre-hospital care and principles of triage", domain: "K", isCore: true },
      { code: "OR1.2", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of fractures of the proximal humerus", domain: "K", isCore: true },
      { code: "OR1.3", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of dislocation of the shoulder joint", domain: "K", isCore: true },
      { code: "OR1.4", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of fractures of shaft of humerus", domain: "K", isCore: true },
      { code: "OR1.5", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of fractures around the elbow", domain: "K", isCore: true },
      { code: "OR1.6", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of fractures of both bones forearm and Galeazzi and Monteggia injuries", domain: "K", isCore: true },
    ],
  },
  {
    id: "or2", module: "OR2", title: "Fracture Management Principles",
    subspecialty: "trauma-fractures", topicSlugs: ["fracture-principles", "cast-application"],
    competencies: [
      { code: "OR2.1", text: "Describe and discuss the principles of fracture management — reduction, immobilization, rehabilitation", domain: "KH", isCore: true },
      { code: "OR2.2", text: "Describe and discuss the mechanism of fracture healing", domain: "K", isCore: true },
      { code: "OR2.3", text: "Describe and discuss the complications of fractures — delayed union, non-union, malunion", domain: "KH", isCore: true },
      { code: "OR2.4", text: "Describe and discuss the principles of internal fixation — plates, nails, screws", domain: "K", isCore: true },
      { code: "OR2.5", text: "Describe and discuss the principles of external fixation", domain: "K", isCore: true },
      { code: "OR2.6", text: "Demonstrate the application of a POP cast and splints on a mannequin", domain: "SH", isCore: true },
      { code: "OR2.7", text: "Describe and discuss the principles of management of open fractures (Gustilo-Anderson)", domain: "KH", isCore: true },
      { code: "OR2.8", text: "Describe and discuss the management of compartment syndrome", domain: "KH", isCore: true },
    ],
  },
  {
    id: "or3", module: "OR3", title: "Upper Limb Fractures",
    subspecialty: "trauma-fractures", topicSlugs: ["upper-limb-fractures"],
    competencies: [
      { code: "OR3.1", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of fractures of the distal radius (Colles, Smith)", domain: "KH", isCore: true },
      { code: "OR3.2", text: "Describe and discuss the clinical features and management of scaphoid fractures", domain: "K", isCore: true },
      { code: "OR3.3", text: "Describe and discuss the clinical features, diagnosis and management of hand injuries including tendon injuries", domain: "K", isCore: true },
    ],
  },
  {
    id: "or4", module: "OR4", title: "Lower Limb Fractures",
    subspecialty: "trauma-fractures", topicSlugs: ["hip-fractures", "tibial-fractures"],
    competencies: [
      { code: "OR4.1", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of fractures of the neck of femur", domain: "KH", isCore: true },
      { code: "OR4.2", text: "Describe and discuss the clinical features and management of intertrochanteric fractures", domain: "KH", isCore: true },
      { code: "OR4.3", text: "Describe and discuss the clinical features and management of fractures of shaft of femur", domain: "KH", isCore: true },
      { code: "OR4.4", text: "Describe and discuss the clinical features and management of fractures around the knee", domain: "KH", isCore: true },
      { code: "OR4.5", text: "Describe and discuss the clinical features and management of tibial shaft fractures", domain: "KH", isCore: true },
      { code: "OR4.6", text: "Describe and discuss the clinical features and management of ankle fractures and injuries", domain: "KH", isCore: true },
    ],
  },
  {
    id: "or5", module: "OR5", title: "Pelvic & Spinal Injuries",
    subspecialty: "spine", topicSlugs: ["pelvic-fractures", "spinal-injuries"],
    competencies: [
      { code: "OR5.1", text: "Describe and discuss the clinical features and management of pelvic fractures", domain: "K", isCore: true },
      { code: "OR5.2", text: "Describe and discuss the clinical features, diagnosis and management of spinal injuries", domain: "K", isCore: true },
      { code: "OR5.3", text: "Describe the principles of immobilization and transport of a patient with spinal injury", domain: "KH", isCore: true },
    ],
  },
  {
    id: "or6", module: "OR6", title: "Dislocations",
    subspecialty: "trauma-fractures", topicSlugs: ["hip-dislocation", "knee-dislocation"],
    competencies: [
      { code: "OR6.1", text: "Describe and discuss the clinical features and management of traumatic dislocation of the hip", domain: "KH", isCore: true },
      { code: "OR6.2", text: "Describe and discuss the clinical features and management of knee injuries and dislocation", domain: "KH", isCore: true },
    ],
  },
  {
    id: "or7", module: "OR7", title: "Bone & Joint Infections",
    subspecialty: "bone-joint-infections", topicSlugs: ["osteomyelitis", "septic-arthritis"],
    competencies: [
      { code: "OR7.1", text: "Describe and discuss the aetiopathogenesis, clinical features, investigations and principles of management of acute and chronic osteomyelitis", domain: "KH", isCore: true },
      { code: "OR7.2", text: "Describe and discuss the clinical features, diagnosis and management of septic arthritis", domain: "KH", isCore: true },
      { code: "OR7.3", text: "Describe and discuss the clinical features and management of tuberculosis of bones and joints", domain: "KH", isCore: true },
      { code: "OR7.4", text: "Describe the clinical features of Pott's spine and its management", domain: "KH", isCore: true },
    ],
  },
  {
    id: "or8", module: "OR8", title: "Bone Tumors",
    subspecialty: "bone-tumors", topicSlugs: ["bone-tumors-benign", "bone-tumors-malignant"],
    competencies: [
      { code: "OR8.1", text: "Describe and discuss the classification, clinical features, investigations and principles of management of benign and malignant bone tumors", domain: "K", isCore: true },
      { code: "OR8.2", text: "Describe and discuss the clinical features of osteosarcoma, Ewing's sarcoma, giant cell tumor", domain: "K", isCore: true },
      { code: "OR8.3", text: "Describe the role of imaging (X-ray, MRI) in bone tumors", domain: "K", isCore: true },
    ],
  },
  {
    id: "or9", module: "OR9", title: "Degenerative Joint Disease",
    subspecialty: "arthroplasty", topicSlugs: ["osteoarthritis-hip", "osteoarthritis-knee"],
    competencies: [
      { code: "OR9.1", text: "Describe and discuss the etiology, clinical features, investigation and management of osteoarthritis", domain: "KH", isCore: true },
      { code: "OR9.2", text: "Describe and discuss the principles of joint replacement surgery", domain: "K", isCore: true },
    ],
  },
  {
    id: "or10", module: "OR10", title: "Rheumatoid Arthritis & Metabolic Bone Disease",
    subspecialty: "general-topics", topicSlugs: ["rheumatoid-orthopedics", "metabolic-bone"],
    competencies: [
      { code: "OR10.1", text: "Describe and discuss the clinical features and management of rheumatoid arthritis from an orthopedic perspective", domain: "K", isCore: true },
      { code: "OR10.2", text: "Describe and discuss the clinical features and management of gout and pseudogout", domain: "K", isCore: true },
      { code: "OR10.3", text: "Describe and discuss the clinical features and management of metabolic bone diseases (osteoporosis, rickets, osteomalacia)", domain: "K", isCore: true },
    ],
  },
  {
    id: "or11", module: "OR11", title: "Pediatric Orthopedics",
    subspecialty: "pediatric-orthopedics", topicSlugs: ["ctev", "ddh", "cerebral-palsy-ortho"],
    competencies: [
      { code: "OR11.1", text: "Describe and discuss the clinical features and management of congenital talipes equinovarus (CTEV/clubfoot)", domain: "KH", isCore: true },
      { code: "OR11.2", text: "Describe and discuss the clinical features, diagnosis and management of developmental dysplasia of the hip (DDH)", domain: "K", isCore: true },
      { code: "OR11.3", text: "Describe the orthopedic management of cerebral palsy", domain: "K", isCore: true },
      { code: "OR11.4", text: "Describe and discuss common pediatric fractures — supracondylar, greenstick, epiphyseal injuries", domain: "KH", isCore: true },
    ],
  },
  {
    id: "or12", module: "OR12", title: "Spine Disorders",
    subspecialty: "spine", topicSlugs: ["low-back-pain", "disc-prolapse"],
    competencies: [
      { code: "OR12.1", text: "Describe and discuss the approach to a patient with low back pain", domain: "KH", isCore: true },
      { code: "OR12.2", text: "Describe and discuss the clinical features and management of intervertebral disc prolapse", domain: "KH", isCore: true },
      { code: "OR12.3", text: "Describe the clinical features and management of spinal stenosis", domain: "K", isCore: true },
      { code: "OR12.4", text: "Describe and discuss the clinical features and management of scoliosis and kyphosis", domain: "K", isCore: true },
    ],
  },
  {
    id: "or13", module: "OR13", title: "Peripheral Nerve Injuries",
    subspecialty: "general-topics", topicSlugs: ["nerve-injuries"],
    competencies: [
      { code: "OR13.1", text: "Describe and discuss the clinical features and management of peripheral nerve injuries", domain: "K", isCore: true },
      { code: "OR13.2", text: "Describe the clinical features of brachial plexus injuries", domain: "K", isCore: true },
      { code: "OR13.3", text: "Describe the principles of nerve repair and tendon transfer", domain: "K", isCore: true },
    ],
  },
  {
    id: "or14", module: "OR14", title: "Sports Injuries & Soft Tissue",
    subspecialty: "sports-medicine", topicSlugs: ["ligament-injuries", "meniscal-injuries"],
    competencies: [
      { code: "OR14.1", text: "Describe and discuss the clinical features and management of common sports injuries (ACL, meniscus, rotator cuff)", domain: "K", isCore: true },
      { code: "OR14.2", text: "Describe the principles of arthroscopy and its applications", domain: "K", isCore: true },
    ],
  },
];

// ─── PG: MS Orthopedics Topics ───────────────────────────────────────────────

export const ORTHOPEDICS_PG_TOPICS: OrthopedicsPGTopic[] = [
  // General Topics
  { id: "pg-gen-01", title: "Orthopedic History, Examination & Imaging", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["orthopedic-history", "orthopedic-examination"], ugModuleRefs: ["OR1"] },
  { id: "pg-gen-02", title: "Biomechanics & Implant Science", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["biomechanics"], ugModuleRefs: ["OR2"] },
  { id: "pg-gen-03", title: "Peripheral Nerve Injuries & Repair", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["nerve-injuries"], ugModuleRefs: ["OR13"] },
  { id: "pg-gen-04", title: "Metabolic Bone Disease & Osteoporosis", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["metabolic-bone"], ugModuleRefs: ["OR10"] },
  { id: "pg-gen-05", title: "Rheumatoid Arthritis — Orthopedic Management", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["rheumatoid-orthopedics"], ugModuleRefs: ["OR10"] },

  // Trauma
  { id: "pg-trau-01", title: "Fracture Healing & Complications", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["fracture-principles"], ugModuleRefs: ["OR2"] },
  { id: "pg-trau-02", title: "Upper Limb Fractures — Complete Management", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["upper-limb-fractures"], ugModuleRefs: ["OR1", "OR3"] },
  { id: "pg-trau-03", title: "Hip Fractures — Neck of Femur & Intertrochanteric", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["hip-fractures"], ugModuleRefs: ["OR4"] },
  { id: "pg-trau-04", title: "Tibial & Ankle Fractures", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["tibial-fractures"], ugModuleRefs: ["OR4"] },
  { id: "pg-trau-05", title: "Open Fractures & Compartment Syndrome", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["open-fractures"], ugModuleRefs: ["OR2"] },
  { id: "pg-trau-06", title: "Dislocations — Hip, Knee, Shoulder", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["hip-dislocation", "knee-dislocation"], ugModuleRefs: ["OR6", "OR1"] },
  { id: "pg-trau-07", title: "Internal Fixation Techniques — Plating, Nailing", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["internal-fixation"], ugModuleRefs: ["OR2"] },
  { id: "pg-trau-08", title: "Polytrauma & ATLS Principles", section: "Trauma", subspecialty: "trauma-fractures", topicSlugs: ["polytrauma"], ugModuleRefs: ["OR1"] },

  // Infections
  { id: "pg-inf-01", title: "Osteomyelitis — Acute & Chronic", section: "Infections", subspecialty: "bone-joint-infections", topicSlugs: ["osteomyelitis"], ugModuleRefs: ["OR7"] },
  { id: "pg-inf-02", title: "Septic Arthritis", section: "Infections", subspecialty: "bone-joint-infections", topicSlugs: ["septic-arthritis"], ugModuleRefs: ["OR7"] },
  { id: "pg-inf-03", title: "Tuberculosis of Bones & Joints", section: "Infections", subspecialty: "bone-joint-infections", topicSlugs: ["tb-bone"], ugModuleRefs: ["OR7"] },
  { id: "pg-inf-04", title: "Prosthetic Joint Infection", section: "Infections", subspecialty: "bone-joint-infections", topicSlugs: ["pji"], ugModuleRefs: ["OR7"] },

  // Tumors
  { id: "pg-tum-01", title: "Benign Bone Tumors & Tumor-like Lesions", section: "Tumors", subspecialty: "bone-tumors", topicSlugs: ["bone-tumors-benign"], ugModuleRefs: ["OR8"] },
  { id: "pg-tum-02", title: "Malignant Bone Tumors — Osteosarcoma, Ewing's", section: "Tumors", subspecialty: "bone-tumors", topicSlugs: ["bone-tumors-malignant"], ugModuleRefs: ["OR8"] },
  { id: "pg-tum-03", title: "Metastatic Bone Disease", section: "Tumors", subspecialty: "bone-tumors", topicSlugs: ["metastatic-bone"], ugModuleRefs: ["OR8"] },
  { id: "pg-tum-04", title: "Soft Tissue Tumors", section: "Tumors", subspecialty: "bone-tumors", topicSlugs: ["soft-tissue-tumors"], ugModuleRefs: [] },

  // Spine
  { id: "pg-sp-01", title: "Low Back Pain — Evaluation & Management", section: "Spine", subspecialty: "spine", topicSlugs: ["low-back-pain"], ugModuleRefs: ["OR12"] },
  { id: "pg-sp-02", title: "Disc Prolapse & Radiculopathy", section: "Spine", subspecialty: "spine", topicSlugs: ["disc-prolapse"], ugModuleRefs: ["OR12"] },
  { id: "pg-sp-03", title: "Spinal Trauma — Fractures & Cord Injury", section: "Spine", subspecialty: "spine", topicSlugs: ["spinal-injuries"], ugModuleRefs: ["OR5"] },
  { id: "pg-sp-04", title: "Scoliosis & Spinal Deformities", section: "Spine", subspecialty: "spine", topicSlugs: ["scoliosis"], ugModuleRefs: ["OR12"] },
  { id: "pg-sp-05", title: "Pott's Spine — Spinal TB", section: "Spine", subspecialty: "spine", topicSlugs: ["potts-spine"], ugModuleRefs: ["OR7"] },

  // Arthroplasty
  { id: "pg-art-01", title: "Total Hip Replacement", section: "Arthroplasty", subspecialty: "arthroplasty", topicSlugs: ["osteoarthritis-hip"], ugModuleRefs: ["OR9"] },
  { id: "pg-art-02", title: "Total Knee Replacement", section: "Arthroplasty", subspecialty: "arthroplasty", topicSlugs: ["osteoarthritis-knee"], ugModuleRefs: ["OR9"] },
  { id: "pg-art-03", title: "Revision Arthroplasty & Complications", section: "Arthroplasty", subspecialty: "arthroplasty", topicSlugs: ["revision-arthroplasty"], ugModuleRefs: ["OR9"] },
  { id: "pg-art-04", title: "Shoulder & Elbow Arthroplasty", section: "Arthroplasty", subspecialty: "arthroplasty", topicSlugs: ["shoulder-arthroplasty"], ugModuleRefs: [] },

  // Pediatric Orthopedics
  { id: "pg-ped-01", title: "CTEV / Clubfoot — Ponseti Method", section: "Pediatric Orthopedics", subspecialty: "pediatric-orthopedics", topicSlugs: ["ctev"], ugModuleRefs: ["OR11"] },
  { id: "pg-ped-02", title: "DDH — Screening & Management", section: "Pediatric Orthopedics", subspecialty: "pediatric-orthopedics", topicSlugs: ["ddh"], ugModuleRefs: ["OR11"] },
  { id: "pg-ped-03", title: "Pediatric Fractures — Supracondylar, Epiphyseal", section: "Pediatric Orthopedics", subspecialty: "pediatric-orthopedics", topicSlugs: ["pediatric-fractures"], ugModuleRefs: ["OR11"] },
  { id: "pg-ped-04", title: "Legg-Calvé-Perthes & SCFE", section: "Pediatric Orthopedics", subspecialty: "pediatric-orthopedics", topicSlugs: ["perthes-scfe"], ugModuleRefs: [] },

  // Sports Medicine
  { id: "pg-spt-01", title: "ACL & PCL Injuries — Reconstruction", section: "Sports Medicine", subspecialty: "sports-medicine", topicSlugs: ["ligament-injuries"], ugModuleRefs: ["OR14"] },
  { id: "pg-spt-02", title: "Meniscal Injuries & Arthroscopy", section: "Sports Medicine", subspecialty: "sports-medicine", topicSlugs: ["meniscal-injuries"], ugModuleRefs: ["OR14"] },
  { id: "pg-spt-03", title: "Rotator Cuff & Shoulder Injuries", section: "Sports Medicine", subspecialty: "sports-medicine", topicSlugs: ["rotator-cuff"], ugModuleRefs: ["OR14"] },
  { id: "pg-spt-04", title: "Tendon Injuries & Overuse Syndromes", section: "Sports Medicine", subspecialty: "sports-medicine", topicSlugs: ["tendon-injuries"], ugModuleRefs: [] },
];

// ─── SS: MCh Orthopedic Super Specialties ────────────────────────────────────

export const ORTHOPEDICS_SS_SPECIALTIES: {
  id: string;
  degree: "MCh";
  title: string;
  slug: string;
  description: string;
  subspecialties: string[];
  pgPrerequisite: string;
}[] = [
  {
    id: "mch-hand-surgery",
    degree: "MCh",
    title: "MCh Hand Surgery",
    slug: "hand-surgery",
    description: "Microsurgery, replantation, tendon repair, nerve repair, congenital hand anomalies",
    subspecialties: ["trauma-fractures", "general-topics"],
    pgPrerequisite: "MS Orthopedics / MS General Surgery",
  },
  {
    id: "mch-pediatric-surgery",
    degree: "MCh",
    title: "MCh Pediatric Surgery",
    slug: "pediatric-surgery",
    description: "Congenital anomalies, pediatric trauma, neonatal surgery (related SS)",
    subspecialties: ["pediatric-orthopedics"],
    pgPrerequisite: "MS General Surgery",
  },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return ORTHOPEDICS_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): OrthopedicsUGModule[] {
  return ORTHOPEDICS_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): OrthopedicsPGTopic[] {
  return ORTHOPEDICS_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
