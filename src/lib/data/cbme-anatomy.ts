/**
 * NMC CBME — Anatomy Curriculum: Complete UG → PG Mapping
 *
 * UG: 80 modules (AN1–AN80), ~250+ competency codes
 * PG: MD Anatomy
 *
 * Mapped to library content/anatomy/ subdirs.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type AnatomyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface AnatomyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface AnatomyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: AnatomyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface AnatomyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface AnatomySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: AnatomyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const ANATOMY_SUBSPECIALTIES: AnatomySubspecialtyMap[] = [
  { slug: "general-topics", name: "General Anatomy", icon: "🧬", ugTopicCount: 14, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "upper-limb", name: "Upper Limb", icon: "💪", ugTopicCount: 11, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "lower-limb", name: "Lower Limb", icon: "🦵", ugTopicCount: 11, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "thorax", name: "Thorax", icon: "🫁", ugTopicCount: 6, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "abdomen", name: "Abdomen", icon: "🟡", ugTopicCount: 11, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "pelvis-perineum", name: "Pelvis & Perineum", icon: "🦴", ugTopicCount: 6, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "head-neck", name: "Head & Neck", icon: "🗣️", ugTopicCount: 14, pgTopicCount: 4, levels: ["UG", "PG"] },
];

// ─── UG Modules (AN1–AN80) ──────────────────────────────────────────────────

export const ANATOMY_UG_MODULES: AnatomyUGModule[] = [
  // ─── General Anatomy (AN1–AN14) ───
  {
    id: "an1", module: "AN1", title: "Introduction to Anatomy",
    subspecialty: "general-topics", topicSlugs: ["introduction"],
    competencies: [
      { code: "AN1.1", text: "Describe and demonstrate the anatomical position, terms used in anatomy and demonstrate movements at joints", domain: "KH", isCore: true },
      { code: "AN1.2", text: "Describe general plan of human body, types of tissues and their characteristics", domain: "K", isCore: true },
    ],
  },
  {
    id: "an2", module: "AN2", title: "Bones & Cartilages",
    subspecialty: "general-topics", topicSlugs: ["bones-cartilages"],
    competencies: [
      { code: "AN2.1", text: "Describe the general features, classification and structure of bones", domain: "KH", isCore: true },
      { code: "AN2.2", text: "Describe the general features, classification and structure of cartilages", domain: "KH", isCore: true },
      { code: "AN2.3", text: "Describe the process of ossification and growth of bones", domain: "KH", isCore: true },
      { code: "AN2.4", text: "Describe and demonstrate the skeleton of upper and lower limb", domain: "KH", isCore: true },
      { code: "AN2.5", text: "Describe and demonstrate features of individual bones of upper and lower limb", domain: "KH", isCore: true },
      { code: "AN2.6", text: "Describe and demonstrate features of vertebrae, ribs, sternum, skull bones", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an3", module: "AN3", title: "Joints",
    subspecialty: "general-topics", topicSlugs: ["joints"],
    competencies: [
      { code: "AN3.1", text: "Describe the general features, classification, structure and biomechanics of joints", domain: "KH", isCore: true },
      { code: "AN3.2", text: "Describe and demonstrate the type, articular surfaces, ligaments, relations, movements and blood supply of shoulder joint", domain: "KH", isCore: true },
      { code: "AN3.3", text: "Describe and demonstrate the type, articular surfaces, ligaments, relations, movements and blood supply of elbow joint", domain: "KH", isCore: true },
      { code: "AN3.4", text: "Describe and demonstrate the type, articular surfaces, ligaments, relations, movements and blood supply of hip joint", domain: "KH", isCore: true },
      { code: "AN3.5", text: "Describe and demonstrate the type, articular surfaces, ligaments, relations, movements and blood supply of knee joint", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an4", module: "AN4", title: "Muscles",
    subspecialty: "general-topics", topicSlugs: ["muscles"],
    competencies: [
      { code: "AN4.1", text: "Describe the general features, classification and structure of muscles", domain: "KH", isCore: true },
      { code: "AN4.2", text: "Describe the origin, insertion, nerve supply and action of muscles of upper limb", domain: "KH", isCore: true },
      { code: "AN4.3", text: "Describe the origin, insertion, nerve supply and action of muscles of lower limb", domain: "KH", isCore: true },
      { code: "AN4.4", text: "Describe the origin, insertion, nerve supply and action of muscles of trunk", domain: "KH", isCore: true },
      { code: "AN4.5", text: "Describe the origin, insertion, nerve supply and action of muscles of head and neck", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an5", module: "AN5", title: "Cardiovascular System — General",
    subspecialty: "general-topics", topicSlugs: ["cardiovascular-general"],
    competencies: [
      { code: "AN5.1", text: "Describe the general plan of blood vascular system", domain: "KH", isCore: true },
      { code: "AN5.2", text: "Describe the structure of blood vessels — arteries, veins and capillaries", domain: "KH", isCore: true },
      { code: "AN5.3", text: "Describe the general plan of lymphatic system", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an6", module: "AN6", title: "Nervous System — General",
    subspecialty: "general-topics", topicSlugs: ["nervous-system-general"],
    competencies: [
      { code: "AN6.1", text: "Describe the general plan and organization of nervous system", domain: "KH", isCore: true },
      { code: "AN6.2", text: "Describe the structure and functions of neuron, synapse and neuroglia", domain: "KH", isCore: true },
      { code: "AN6.3", text: "Describe the classification and types of nerve fibers", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an7", module: "AN7", title: "Skin & Fascia",
    subspecialty: "general-topics", topicSlugs: ["skin-fascia"],
    competencies: [
      { code: "AN7.1", text: "Describe the structure and functions of skin", domain: "KH", isCore: true },
      { code: "AN7.2", text: "Describe the types and functions of fascia", domain: "KH", isCore: true },
      { code: "AN7.3", text: "Describe the types of glands in the skin", domain: "K", isCore: true },
    ],
  },
  {
    id: "an8", module: "AN8", title: "Body Fluids & Lymphatic System",
    subspecialty: "general-topics", topicSlugs: ["body-fluids-lymphatics"],
    competencies: [
      { code: "AN8.1", text: "Describe the composition and functions of body fluids", domain: "KH", isCore: true },
      { code: "AN8.2", text: "Describe the lymphatic drainage and its clinical significance", domain: "KH", isCore: true },
      { code: "AN8.3", text: "Describe the development of lymphatic system", domain: "K", isCore: true },
    ],
  },
  {
    id: "an9", module: "AN9", title: "Surface Anatomy — General",
    subspecialty: "general-topics", topicSlugs: ["surface-anatomy-general"],
    competencies: [
      { code: "AN9.1", text: "Describe and demonstrate important surface landmarks of the body", domain: "SH", isCore: true },
      { code: "AN9.2", text: "Describe and demonstrate the surface projections of important viscera", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an10", module: "AN10", title: "Genetics",
    subspecialty: "general-topics", topicSlugs: ["genetics"],
    competencies: [
      { code: "AN10.1", text: "Describe the structure of DNA and RNA and their functions", domain: "K", isCore: true },
      { code: "AN10.2", text: "Describe cell division — mitosis and meiosis", domain: "KH", isCore: true },
      { code: "AN10.3", text: "Describe the principles of genetics — Mendelian and non-Mendelian inheritance", domain: "KH", isCore: true },
      { code: "AN10.4", text: "Describe chromosomal aberrations with clinical examples", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an11", module: "AN11", title: "Histology — General",
    subspecialty: "general-topics", topicSlugs: ["histology-general"],
    competencies: [
      { code: "AN11.1", text: "Describe the structure of cell and its organelles", domain: "KH", isCore: true },
      { code: "AN11.2", text: "Describe the types and characteristics of epithelial tissue", domain: "KH", isCore: true },
      { code: "AN11.3", text: "Describe the types and characteristics of connective tissue", domain: "KH", isCore: true },
      { code: "AN11.4", text: "Describe the types and characteristics of muscular tissue", domain: "KH", isCore: true },
      { code: "AN11.5", text: "Describe the types and characteristics of nervous tissue", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an12", module: "AN12", title: "Embryology — General",
    subspecialty: "general-topics", topicSlugs: ["embryology-general"],
    competencies: [
      { code: "AN12.1", text: "Describe the stages of human development — fertilization, cleavage, implantation", domain: "KH", isCore: true },
      { code: "AN12.2", text: "Describe the formation of germ layers and their derivatives", domain: "KH", isCore: true },
      { code: "AN12.3", text: "Describe the development and functions of placenta", domain: "KH", isCore: true },
      { code: "AN12.4", text: "Describe the development of fetal membranes and their abnormalities", domain: "KH", isCore: true },
      { code: "AN12.5", text: "Describe the formation of twins and its types", domain: "K", isCore: true },
    ],
  },
  {
    id: "an13", module: "AN13", title: "Radiological Anatomy — General",
    subspecialty: "general-topics", topicSlugs: ["radiological-anatomy"],
    competencies: [
      { code: "AN13.1", text: "Identify the normal radiological anatomy of bones and joints", domain: "SH", isCore: true },
      { code: "AN13.2", text: "Identify the normal radiological anatomy of chest and abdomen", domain: "SH", isCore: true },
      { code: "AN13.3", text: "Identify the normal CT and MRI anatomy", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an14", module: "AN14", title: "Microanatomy Techniques",
    subspecialty: "general-topics", topicSlugs: ["microanatomy-techniques"],
    competencies: [
      { code: "AN14.1", text: "Describe and demonstrate the steps of tissue processing and staining", domain: "SH", isCore: true },
      { code: "AN14.2", text: "Identify the microscopic structure of tissues and organs under the microscope", domain: "SH", isCore: true },
    ],
  },
  // ─── Upper Limb (AN15–AN25) ───
  {
    id: "an15", module: "AN15", title: "Pectoral Region & Breast",
    subspecialty: "upper-limb", topicSlugs: ["pectoral-region"],
    competencies: [
      { code: "AN15.1", text: "Describe the attachment, nerve supply and action of pectoralis major and minor", domain: "KH", isCore: true },
      { code: "AN15.2", text: "Describe the anatomy of breast including its blood supply, lymphatic drainage and applied anatomy", domain: "KH", isCore: true },
      { code: "AN15.3", text: "Describe the boundaries and contents of the axilla", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an16", module: "AN16", title: "Axilla & Brachial Plexus",
    subspecialty: "upper-limb", topicSlugs: ["axilla-brachial-plexus"],
    competencies: [
      { code: "AN16.1", text: "Describe the formation, branches and relations of brachial plexus", domain: "KH", isCore: true },
      { code: "AN16.2", text: "Describe the axillary artery, its parts, branches and relations", domain: "KH", isCore: true },
      { code: "AN16.3", text: "Describe the course and relations of axillary vein", domain: "KH", isCore: true },
      { code: "AN16.4", text: "Describe the groups and drainage of axillary lymph nodes", domain: "KH", isCore: true },
      { code: "AN16.5", text: "Describe the clinical anatomy of injuries to brachial plexus — Erb's palsy, Klumpke's palsy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an17", module: "AN17", title: "Arm & Forearm",
    subspecialty: "upper-limb", topicSlugs: ["arm-forearm"],
    competencies: [
      { code: "AN17.1", text: "Describe the muscles of front of arm and cubital fossa with their nerve supply", domain: "KH", isCore: true },
      { code: "AN17.2", text: "Describe the muscles of back of arm with their nerve supply", domain: "KH", isCore: true },
      { code: "AN17.3", text: "Describe the muscles of front of forearm with their nerve supply", domain: "KH", isCore: true },
      { code: "AN17.4", text: "Describe the muscles of back of forearm with their nerve supply", domain: "KH", isCore: true },
      { code: "AN17.5", text: "Describe the brachial artery and its clinical importance", domain: "KH", isCore: true },
      { code: "AN17.6", text: "Describe the course, relations and branches of radial and ulnar arteries", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an18", module: "AN18", title: "Hand",
    subspecialty: "upper-limb", topicSlugs: ["hand"],
    competencies: [
      { code: "AN18.1", text: "Describe the muscles of hand, their nerve supply and actions", domain: "KH", isCore: true },
      { code: "AN18.2", text: "Describe the carpal tunnel and its clinical significance", domain: "KH", isCore: true },
      { code: "AN18.3", text: "Describe the anatomical snuff box and its contents", domain: "KH", isCore: true },
      { code: "AN18.4", text: "Describe the fibrous flexor sheaths and synovial sheaths of hand", domain: "KH", isCore: true },
      { code: "AN18.5", text: "Describe the palmar spaces and their clinical significance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an19", module: "AN19", title: "Nerves of Upper Limb",
    subspecialty: "upper-limb", topicSlugs: ["nerves-upper-limb"],
    competencies: [
      { code: "AN19.1", text: "Describe the course, relations and branches of median nerve", domain: "KH", isCore: true },
      { code: "AN19.2", text: "Describe the course, relations and branches of ulnar nerve", domain: "KH", isCore: true },
      { code: "AN19.3", text: "Describe the course, relations and branches of radial nerve", domain: "KH", isCore: true },
      { code: "AN19.4", text: "Describe the course, relations and branches of musculocutaneous nerve", domain: "KH", isCore: true },
      { code: "AN19.5", text: "Describe the clinical effects of injury to median, ulnar, radial nerves — wrist drop, claw hand, ape hand", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an20", module: "AN20", title: "Shoulder Joint",
    subspecialty: "upper-limb", topicSlugs: ["shoulder-joint"],
    competencies: [
      { code: "AN20.1", text: "Describe the type, articular surfaces, ligaments, relations, movements, blood supply of shoulder joint", domain: "KH", isCore: true },
      { code: "AN20.2", text: "Describe the rotator cuff muscles and their role in stability", domain: "KH", isCore: true },
      { code: "AN20.3", text: "Describe the mechanisms and types of shoulder dislocation", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an21", module: "AN21", title: "Elbow, Radioulnar & Wrist Joints",
    subspecialty: "upper-limb", topicSlugs: ["elbow-wrist-joints"],
    competencies: [
      { code: "AN21.1", text: "Describe the type, articular surfaces, ligaments, relations, movements of elbow joint", domain: "KH", isCore: true },
      { code: "AN21.2", text: "Describe the type, articular surfaces, ligaments, movements of radioulnar joints", domain: "KH", isCore: true },
      { code: "AN21.3", text: "Describe the type, articular surfaces, ligaments, movements of wrist joint", domain: "KH", isCore: true },
      { code: "AN21.4", text: "Describe and demonstrate the surface anatomy of upper limb", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an22", module: "AN22", title: "Venous Drainage of Upper Limb",
    subspecialty: "upper-limb", topicSlugs: ["veins-upper-limb"],
    competencies: [
      { code: "AN22.1", text: "Describe the superficial and deep veins of upper limb", domain: "KH", isCore: true },
      { code: "AN22.2", text: "Describe the cephalic and basilic veins and their clinical importance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an23", module: "AN23", title: "Scapular Region & Back",
    subspecialty: "upper-limb", topicSlugs: ["scapular-region"],
    competencies: [
      { code: "AN23.1", text: "Describe the muscles of scapular region and their nerve supply", domain: "KH", isCore: true },
      { code: "AN23.2", text: "Describe the anastomosis around scapula", domain: "KH", isCore: true },
      { code: "AN23.3", text: "Describe the triangle of auscultation", domain: "K", isCore: true },
    ],
  },
  {
    id: "an24", module: "AN24", title: "Bones of Upper Limb — Applied",
    subspecialty: "upper-limb", topicSlugs: ["bones-upper-limb"],
    competencies: [
      { code: "AN24.1", text: "Describe and identify the features of humerus, radius, ulna, bones of hand", domain: "KH", isCore: true },
      { code: "AN24.2", text: "Describe the applied anatomy of fractures of upper limb bones", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an25", module: "AN25", title: "Development of Upper Limb",
    subspecialty: "upper-limb", topicSlugs: ["development-upper-limb"],
    competencies: [
      { code: "AN25.1", text: "Describe the development of upper limb including its rotation and congenital anomalies", domain: "K", isCore: true },
    ],
  },
  // ─── Lower Limb (AN26–AN36) ───
  {
    id: "an26", module: "AN26", title: "Front of Thigh",
    subspecialty: "lower-limb", topicSlugs: ["front-thigh"],
    competencies: [
      { code: "AN26.1", text: "Describe the muscles of front of thigh with their nerve supply and actions", domain: "KH", isCore: true },
      { code: "AN26.2", text: "Describe the femoral triangle — boundaries, contents and relations", domain: "KH", isCore: true },
      { code: "AN26.3", text: "Describe the femoral artery, its branches and clinical significance", domain: "KH", isCore: true },
      { code: "AN26.4", text: "Describe the femoral vein, femoral canal and femoral hernia", domain: "KH", isCore: true },
      { code: "AN26.5", text: "Describe the femoral nerve and its branches", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an27", module: "AN27", title: "Medial & Back of Thigh",
    subspecialty: "lower-limb", topicSlugs: ["medial-back-thigh"],
    competencies: [
      { code: "AN27.1", text: "Describe the adductor group of muscles with their nerve supply", domain: "KH", isCore: true },
      { code: "AN27.2", text: "Describe the hamstring muscles with their nerve supply", domain: "KH", isCore: true },
      { code: "AN27.3", text: "Describe the obturator nerve and its clinical significance", domain: "KH", isCore: true },
      { code: "AN27.4", text: "Describe the sciatic nerve — course, relations, branches", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an28", module: "AN28", title: "Gluteal Region",
    subspecialty: "lower-limb", topicSlugs: ["gluteal-region"],
    competencies: [
      { code: "AN28.1", text: "Describe the muscles of gluteal region with their nerve supply", domain: "KH", isCore: true },
      { code: "AN28.2", text: "Describe the gluteal arteries and their anastomosis", domain: "KH", isCore: true },
      { code: "AN28.3", text: "Describe the safe site for intramuscular injection in gluteal region", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an29", module: "AN29", title: "Popliteal Fossa & Back of Leg",
    subspecialty: "lower-limb", topicSlugs: ["popliteal-fossa"],
    competencies: [
      { code: "AN29.1", text: "Describe the boundaries, floor, roof and contents of popliteal fossa", domain: "KH", isCore: true },
      { code: "AN29.2", text: "Describe the muscles of back of leg with their nerve supply", domain: "KH", isCore: true },
      { code: "AN29.3", text: "Describe the popliteal artery and its branches", domain: "KH", isCore: true },
      { code: "AN29.4", text: "Describe the tibial nerve in the leg", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an30", module: "AN30", title: "Front & Lateral Compartment of Leg",
    subspecialty: "lower-limb", topicSlugs: ["leg-anterior-lateral"],
    competencies: [
      { code: "AN30.1", text: "Describe the muscles of front and lateral compartment of leg with their nerve supply", domain: "KH", isCore: true },
      { code: "AN30.2", text: "Describe the anterior tibial and dorsalis pedis arteries", domain: "KH", isCore: true },
      { code: "AN30.3", text: "Describe the common peroneal nerve and its branches", domain: "KH", isCore: true },
      { code: "AN30.4", text: "Describe the clinical features of foot drop due to common peroneal nerve injury", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an31", module: "AN31", title: "Foot",
    subspecialty: "lower-limb", topicSlugs: ["foot"],
    competencies: [
      { code: "AN31.1", text: "Describe the muscles of sole of foot with their nerve supply", domain: "KH", isCore: true },
      { code: "AN31.2", text: "Describe the arches of foot and factors maintaining them", domain: "KH", isCore: true },
      { code: "AN31.3", text: "Describe the clinical significance of flat foot and club foot", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an32", module: "AN32", title: "Hip Joint",
    subspecialty: "lower-limb", topicSlugs: ["hip-joint"],
    competencies: [
      { code: "AN32.1", text: "Describe the type, articular surfaces, ligaments, relations, movements, blood supply of hip joint", domain: "KH", isCore: true },
      { code: "AN32.2", text: "Describe the blood supply of head of femur and its clinical significance", domain: "KH", isCore: true },
      { code: "AN32.3", text: "Describe the mechanisms and types of hip joint dislocation", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an33", module: "AN33", title: "Knee Joint",
    subspecialty: "lower-limb", topicSlugs: ["knee-joint"],
    competencies: [
      { code: "AN33.1", text: "Describe the type, articular surfaces, ligaments, relations, movements, blood supply of knee joint", domain: "KH", isCore: true },
      { code: "AN33.2", text: "Describe the menisci — attachments, blood supply, functions and injuries", domain: "KH", isCore: true },
      { code: "AN33.3", text: "Describe the locking and unlocking mechanism of knee joint", domain: "KH", isCore: true },
      { code: "AN33.4", text: "Describe the bursae around knee joint and their clinical significance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an34", module: "AN34", title: "Ankle & Foot Joints",
    subspecialty: "lower-limb", topicSlugs: ["ankle-foot-joints"],
    competencies: [
      { code: "AN34.1", text: "Describe the type, articular surfaces, ligaments, movements of ankle joint", domain: "KH", isCore: true },
      { code: "AN34.2", text: "Describe the subtalar and transverse tarsal joints", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an35", module: "AN35", title: "Venous Drainage of Lower Limb",
    subspecialty: "lower-limb", topicSlugs: ["veins-lower-limb"],
    competencies: [
      { code: "AN35.1", text: "Describe the great and small saphenous veins — course, tributaries, clinical significance", domain: "KH", isCore: true },
      { code: "AN35.2", text: "Describe the perforating veins and their role in varicose veins", domain: "KH", isCore: true },
      { code: "AN35.3", text: "Describe and demonstrate the surface anatomy of lower limb", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an36", module: "AN36", title: "Bones of Lower Limb — Applied",
    subspecialty: "lower-limb", topicSlugs: ["bones-lower-limb"],
    competencies: [
      { code: "AN36.1", text: "Describe and identify the features of femur, tibia, fibula, bones of foot", domain: "KH", isCore: true },
      { code: "AN36.2", text: "Describe the applied anatomy of fractures of lower limb bones", domain: "KH", isCore: true },
      { code: "AN36.3", text: "Describe the development of lower limb including its rotation and congenital anomalies", domain: "K", isCore: true },
    ],
  },
  // ─── Thorax (AN37–AN42) ───
  {
    id: "an37", module: "AN37", title: "Thoracic Wall & Diaphragm",
    subspecialty: "thorax", topicSlugs: ["thoracic-wall"],
    competencies: [
      { code: "AN37.1", text: "Describe the thoracic wall — intercostal muscles, intercostal nerves and vessels", domain: "KH", isCore: true },
      { code: "AN37.2", text: "Describe the diaphragm — origin, insertion, openings, nerve supply, actions", domain: "KH", isCore: true },
      { code: "AN37.3", text: "Describe the mechanics of respiration", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an38", module: "AN38", title: "Pleura & Lungs",
    subspecialty: "thorax", topicSlugs: ["pleura-lungs"],
    competencies: [
      { code: "AN38.1", text: "Describe the pleura — parts, blood supply, nerve supply, pleural recesses", domain: "KH", isCore: true },
      { code: "AN38.2", text: "Describe the gross anatomy of lungs — lobes, fissures, hilum, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN38.3", text: "Describe the bronchopulmonary segments and their clinical significance", domain: "KH", isCore: true },
      { code: "AN38.4", text: "Describe the histology of trachea, bronchi and lung", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an39", module: "AN39", title: "Mediastinum",
    subspecialty: "thorax", topicSlugs: ["mediastinum"],
    competencies: [
      { code: "AN39.1", text: "Describe the subdivisions, boundaries and contents of mediastinum", domain: "KH", isCore: true },
      { code: "AN39.2", text: "Describe the superior mediastinum and great vessels", domain: "KH", isCore: true },
      { code: "AN39.3", text: "Describe the posterior mediastinum — esophagus, thoracic duct, azygos system", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an40", module: "AN40", title: "Heart & Pericardium",
    subspecialty: "thorax", topicSlugs: ["heart-pericardium"],
    competencies: [
      { code: "AN40.1", text: "Describe the external features, chambers and valves of heart", domain: "KH", isCore: true },
      { code: "AN40.2", text: "Describe the blood supply of heart — coronary arteries and cardiac veins", domain: "KH", isCore: true },
      { code: "AN40.3", text: "Describe the conducting system of heart", domain: "KH", isCore: true },
      { code: "AN40.4", text: "Describe the pericardium — layers, sinuses, blood supply", domain: "KH", isCore: true },
      { code: "AN40.5", text: "Describe the development of heart and great vessels", domain: "KH", isCore: true },
      { code: "AN40.6", text: "Describe the congenital anomalies of heart — ASD, VSD, PDA, ToF", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an41", module: "AN41", title: "Development of Thorax",
    subspecialty: "thorax", topicSlugs: ["development-thorax"],
    competencies: [
      { code: "AN41.1", text: "Describe the development of lungs and trachea", domain: "K", isCore: true },
      { code: "AN41.2", text: "Describe the development of diaphragm and its congenital anomalies", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an42", module: "AN42", title: "Surface & Radiological Anatomy of Thorax",
    subspecialty: "thorax", topicSlugs: ["surface-anatomy-thorax"],
    competencies: [
      { code: "AN42.1", text: "Describe and demonstrate the surface anatomy of thorax — heart, lungs, pleura", domain: "SH", isCore: true },
      { code: "AN42.2", text: "Identify the normal chest radiograph and CT anatomy of thorax", domain: "SH", isCore: true },
    ],
  },
  // ─── Abdomen (AN43–AN53) ───
  {
    id: "an43", module: "AN43", title: "Anterior Abdominal Wall",
    subspecialty: "abdomen", topicSlugs: ["anterior-abdominal-wall"],
    competencies: [
      { code: "AN43.1", text: "Describe the layers of anterior abdominal wall and their clinical significance", domain: "KH", isCore: true },
      { code: "AN43.2", text: "Describe the rectus sheath — formation, contents and applied anatomy", domain: "KH", isCore: true },
      { code: "AN43.3", text: "Describe the inguinal canal — walls, contents, relations", domain: "KH", isCore: true },
      { code: "AN43.4", text: "Describe the anatomy of inguinal and femoral hernia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an44", module: "AN44", title: "Peritoneum",
    subspecialty: "abdomen", topicSlugs: ["peritoneum"],
    competencies: [
      { code: "AN44.1", text: "Describe the peritoneum — parietal, visceral, peritoneal cavity, folds, pouches", domain: "KH", isCore: true },
      { code: "AN44.2", text: "Describe the greater and lesser omentum", domain: "KH", isCore: true },
      { code: "AN44.3", text: "Describe the mesentery and its clinical significance", domain: "KH", isCore: true },
      { code: "AN44.4", text: "Describe the subphrenic spaces and paracolic gutters", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an45", module: "AN45", title: "Stomach & Duodenum",
    subspecialty: "abdomen", topicSlugs: ["stomach-duodenum"],
    competencies: [
      { code: "AN45.1", text: "Describe the gross anatomy of stomach — parts, relations, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN45.2", text: "Describe the gross anatomy of duodenum — parts, relations, blood supply", domain: "KH", isCore: true },
      { code: "AN45.3", text: "Describe the histology of stomach and duodenum", domain: "KH", isCore: true },
      { code: "AN45.4", text: "Describe the development of stomach and duodenum", domain: "K", isCore: true },
    ],
  },
  {
    id: "an46", module: "AN46", title: "Small & Large Intestine",
    subspecialty: "abdomen", topicSlugs: ["intestines"],
    competencies: [
      { code: "AN46.1", text: "Describe the gross anatomy of jejunum and ileum — differences, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN46.2", text: "Describe the Meckel's diverticulum and its clinical significance", domain: "KH", isCore: true },
      { code: "AN46.3", text: "Describe the gross anatomy of large intestine — parts, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN46.4", text: "Describe the appendix — position, blood supply, clinical significance", domain: "KH", isCore: true },
      { code: "AN46.5", text: "Describe the development of gut — midgut rotation and its anomalies", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an47", module: "AN47", title: "Liver, Gallbladder & Biliary System",
    subspecialty: "abdomen", topicSlugs: ["liver-biliary"],
    competencies: [
      { code: "AN47.1", text: "Describe the gross anatomy of liver — lobes, surfaces, relations, blood supply, portal system", domain: "KH", isCore: true },
      { code: "AN47.2", text: "Describe the histology of liver — hepatic lobule, portal triad", domain: "KH", isCore: true },
      { code: "AN47.3", text: "Describe the extrahepatic biliary apparatus — gallbladder, bile ducts", domain: "KH", isCore: true },
      { code: "AN47.4", text: "Describe the development of liver, gallbladder and biliary system", domain: "K", isCore: true },
      { code: "AN47.5", text: "Describe the portal vein — formation, tributaries, porto-systemic anastomoses", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an48", module: "AN48", title: "Pancreas & Spleen",
    subspecialty: "abdomen", topicSlugs: ["pancreas-spleen"],
    competencies: [
      { code: "AN48.1", text: "Describe the gross anatomy of pancreas — parts, relations, blood supply, duct system", domain: "KH", isCore: true },
      { code: "AN48.2", text: "Describe the histology of pancreas — exocrine and endocrine parts", domain: "KH", isCore: true },
      { code: "AN48.3", text: "Describe the gross anatomy of spleen — relations, blood supply, applied anatomy", domain: "KH", isCore: true },
      { code: "AN48.4", text: "Describe the development of pancreas and spleen", domain: "K", isCore: true },
    ],
  },
  {
    id: "an49", module: "AN49", title: "Kidney & Ureter",
    subspecialty: "abdomen", topicSlugs: ["kidney-ureter"],
    competencies: [
      { code: "AN49.1", text: "Describe the gross anatomy of kidney — surfaces, relations, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN49.2", text: "Describe the histology of kidney — cortex, medulla, nephron", domain: "KH", isCore: true },
      { code: "AN49.3", text: "Describe the gross anatomy of ureter — course, relations, blood supply, constrictions", domain: "KH", isCore: true },
      { code: "AN49.4", text: "Describe the development of kidney and ureter and their congenital anomalies", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an50", module: "AN50", title: "Suprarenal Gland",
    subspecialty: "abdomen", topicSlugs: ["suprarenal-gland"],
    competencies: [
      { code: "AN50.1", text: "Describe the gross anatomy of suprarenal gland — relations, blood supply", domain: "KH", isCore: true },
      { code: "AN50.2", text: "Describe the histology of suprarenal gland — cortex and medulla", domain: "KH", isCore: true },
      { code: "AN50.3", text: "Describe the development of suprarenal gland", domain: "K", isCore: true },
    ],
  },
  {
    id: "an51", module: "AN51", title: "Posterior Abdominal Wall",
    subspecialty: "abdomen", topicSlugs: ["posterior-abdominal-wall"],
    competencies: [
      { code: "AN51.1", text: "Describe the muscles of posterior abdominal wall — psoas, quadratus lumborum, iliacus", domain: "KH", isCore: true },
      { code: "AN51.2", text: "Describe the abdominal aorta — branches and relations", domain: "KH", isCore: true },
      { code: "AN51.3", text: "Describe the inferior vena cava — formation, tributaries, relations", domain: "KH", isCore: true },
      { code: "AN51.4", text: "Describe the lumbar plexus — formation, branches", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an52", module: "AN52", title: "Development of GI Tract",
    subspecialty: "abdomen", topicSlugs: ["development-gi"],
    competencies: [
      { code: "AN52.1", text: "Describe the development of foregut, midgut and hindgut", domain: "KH", isCore: true },
      { code: "AN52.2", text: "Describe the congenital anomalies of GI tract", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an53", module: "AN53", title: "Surface & Radiological Anatomy of Abdomen",
    subspecialty: "abdomen", topicSlugs: ["surface-anatomy-abdomen"],
    competencies: [
      { code: "AN53.1", text: "Describe and demonstrate the surface anatomy of abdomen — abdominal viscera", domain: "SH", isCore: true },
      { code: "AN53.2", text: "Identify the normal radiological anatomy of abdominal organs", domain: "SH", isCore: true },
    ],
  },
  // ─── Pelvis & Perineum (AN54–AN59) ───
  {
    id: "an54", module: "AN54", title: "Bony Pelvis",
    subspecialty: "pelvis-perineum", topicSlugs: ["bony-pelvis"],
    competencies: [
      { code: "AN54.1", text: "Describe the bony pelvis — hip bone, sacrum, coccyx", domain: "KH", isCore: true },
      { code: "AN54.2", text: "Describe the types of pelvis and sex differences", domain: "KH", isCore: true },
      { code: "AN54.3", text: "Describe the pelvic diameters and their obstetric significance", domain: "KH", isCore: true },
      { code: "AN54.4", text: "Describe the pelvic floor — muscles of pelvic diaphragm", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an55", module: "AN55", title: "Pelvic Viscera — Male",
    subspecialty: "pelvis-perineum", topicSlugs: ["pelvic-viscera-male"],
    competencies: [
      { code: "AN55.1", text: "Describe the gross anatomy of urinary bladder — relations, blood supply, nerve supply", domain: "KH", isCore: true },
      { code: "AN55.2", text: "Describe the gross anatomy of prostate — lobes, relations, blood supply", domain: "KH", isCore: true },
      { code: "AN55.3", text: "Describe the gross anatomy of rectum — relations, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN55.4", text: "Describe the male urethra — parts, relations, applied anatomy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an56", module: "AN56", title: "Pelvic Viscera — Female",
    subspecialty: "pelvis-perineum", topicSlugs: ["pelvic-viscera-female"],
    competencies: [
      { code: "AN56.1", text: "Describe the gross anatomy of uterus — parts, relations, supports, blood supply", domain: "KH", isCore: true },
      { code: "AN56.2", text: "Describe the gross anatomy of ovary and uterine tubes", domain: "KH", isCore: true },
      { code: "AN56.3", text: "Describe the histology of uterus, ovary and uterine tube", domain: "KH", isCore: true },
      { code: "AN56.4", text: "Describe the development of uterus, vagina and their congenital anomalies", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an57", module: "AN57", title: "Perineum",
    subspecialty: "pelvis-perineum", topicSlugs: ["perineum"],
    competencies: [
      { code: "AN57.1", text: "Describe the perineum — boundaries, urogenital and anal triangles", domain: "KH", isCore: true },
      { code: "AN57.2", text: "Describe the ischioanal fossa — boundaries, contents", domain: "KH", isCore: true },
      { code: "AN57.3", text: "Describe the perineal body and its clinical significance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an58", module: "AN58", title: "Pelvic Blood Vessels & Nerves",
    subspecialty: "pelvis-perineum", topicSlugs: ["pelvic-vessels-nerves"],
    competencies: [
      { code: "AN58.1", text: "Describe the internal iliac artery — branches and distribution", domain: "KH", isCore: true },
      { code: "AN58.2", text: "Describe the sacral plexus — formation, branches", domain: "KH", isCore: true },
      { code: "AN58.3", text: "Describe the autonomic innervation of pelvic organs", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an59", module: "AN59", title: "Development of Reproductive System",
    subspecialty: "pelvis-perineum", topicSlugs: ["development-reproductive"],
    competencies: [
      { code: "AN59.1", text: "Describe the development of gonads and genital ducts", domain: "KH", isCore: true },
      { code: "AN59.2", text: "Describe the development of external genitalia and their anomalies", domain: "KH", isCore: true },
      { code: "AN59.3", text: "Describe the development of urinary bladder and urethra", domain: "K", isCore: true },
    ],
  },
  // ─── Head & Neck (AN60–AN73) ───
  {
    id: "an60", module: "AN60", title: "Scalp & Face",
    subspecialty: "head-neck", topicSlugs: ["scalp-face"],
    competencies: [
      { code: "AN60.1", text: "Describe the layers of scalp and their clinical significance", domain: "KH", isCore: true },
      { code: "AN60.2", text: "Describe the muscles of facial expression and their nerve supply", domain: "KH", isCore: true },
      { code: "AN60.3", text: "Describe the facial artery and vein and dangerous area of face", domain: "KH", isCore: true },
      { code: "AN60.4", text: "Describe the sensory innervation of face — trigeminal nerve branches", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an61", module: "AN61", title: "Parotid Region & Facial Nerve",
    subspecialty: "head-neck", topicSlugs: ["parotid-facial-nerve"],
    competencies: [
      { code: "AN61.1", text: "Describe the parotid gland — location, relations, blood supply, nerve supply", domain: "KH", isCore: true },
      { code: "AN61.2", text: "Describe the facial nerve — course, branches and clinical significance", domain: "KH", isCore: true },
      { code: "AN61.3", text: "Describe the applied anatomy of parotid gland tumors and facial nerve palsy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an62", module: "AN62", title: "Temporal & Infratemporal Regions",
    subspecialty: "head-neck", topicSlugs: ["temporal-infratemporal"],
    competencies: [
      { code: "AN62.1", text: "Describe the muscles of mastication with their nerve supply", domain: "KH", isCore: true },
      { code: "AN62.2", text: "Describe the temporomandibular joint — type, articular surfaces, ligaments, movements", domain: "KH", isCore: true },
      { code: "AN62.3", text: "Describe the maxillary artery — parts and branches", domain: "KH", isCore: true },
      { code: "AN62.4", text: "Describe the mandibular nerve — branches and distribution", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an63", module: "AN63", title: "Triangles of Neck",
    subspecialty: "head-neck", topicSlugs: ["triangles-neck"],
    competencies: [
      { code: "AN63.1", text: "Describe the anterior triangle of neck — boundaries, subdivisions, contents", domain: "KH", isCore: true },
      { code: "AN63.2", text: "Describe the posterior triangle of neck — boundaries, contents", domain: "KH", isCore: true },
      { code: "AN63.3", text: "Describe the sternocleidomastoid and trapezius muscles", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an64", module: "AN64", title: "Thyroid & Parathyroid",
    subspecialty: "head-neck", topicSlugs: ["thyroid-parathyroid"],
    competencies: [
      { code: "AN64.1", text: "Describe the gross anatomy of thyroid gland — relations, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN64.2", text: "Describe the development of thyroid gland and its anomalies", domain: "KH", isCore: true },
      { code: "AN64.3", text: "Describe the parathyroid glands — location, blood supply", domain: "KH", isCore: true },
      { code: "AN64.4", text: "Describe the histology of thyroid and parathyroid glands", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an65", module: "AN65", title: "Pharynx & Palate",
    subspecialty: "head-neck", topicSlugs: ["pharynx-palate"],
    competencies: [
      { code: "AN65.1", text: "Describe the pharynx — parts, muscles, nerve supply, blood supply", domain: "KH", isCore: true },
      { code: "AN65.2", text: "Describe the waldeyer's lymphatic ring", domain: "KH", isCore: true },
      { code: "AN65.3", text: "Describe the palate — hard and soft palate, muscles, blood supply", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an66", module: "AN66", title: "Larynx",
    subspecialty: "head-neck", topicSlugs: ["larynx"],
    competencies: [
      { code: "AN66.1", text: "Describe the cartilages, membranes, ligaments of larynx", domain: "KH", isCore: true },
      { code: "AN66.2", text: "Describe the muscles of larynx — intrinsic and extrinsic", domain: "KH", isCore: true },
      { code: "AN66.3", text: "Describe the nerve supply of larynx and effects of recurrent laryngeal nerve injury", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an67", module: "AN67", title: "Tongue & Oral Cavity",
    subspecialty: "head-neck", topicSlugs: ["tongue-oral-cavity"],
    competencies: [
      { code: "AN67.1", text: "Describe the gross anatomy of tongue — muscles, nerve supply, blood supply, lymphatic drainage", domain: "KH", isCore: true },
      { code: "AN67.2", text: "Describe the development of tongue", domain: "K", isCore: true },
      { code: "AN67.3", text: "Describe the salivary glands — submandibular, sublingual — and their ducts", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an68", module: "AN68", title: "Nose & Paranasal Sinuses",
    subspecialty: "head-neck", topicSlugs: ["nose-sinuses"],
    competencies: [
      { code: "AN68.1", text: "Describe the lateral wall of nose — bones, meatuses, blood supply", domain: "KH", isCore: true },
      { code: "AN68.2", text: "Describe the paranasal sinuses — location, drainage, nerve supply", domain: "KH", isCore: true },
      { code: "AN68.3", text: "Describe the development of nose and paranasal sinuses", domain: "K", isCore: true },
    ],
  },
  {
    id: "an69", module: "AN69", title: "Orbit & Eye",
    subspecialty: "head-neck", topicSlugs: ["orbit-eye"],
    competencies: [
      { code: "AN69.1", text: "Describe the bony orbit — walls, foramina, relations", domain: "KH", isCore: true },
      { code: "AN69.2", text: "Describe the extraocular muscles — origin, insertion, nerve supply, actions", domain: "KH", isCore: true },
      { code: "AN69.3", text: "Describe the optic nerve and its relations", domain: "KH", isCore: true },
      { code: "AN69.4", text: "Describe the development of eye and its congenital anomalies", domain: "K", isCore: true },
    ],
  },
  {
    id: "an70", module: "AN70", title: "Ear",
    subspecialty: "head-neck", topicSlugs: ["ear"],
    competencies: [
      { code: "AN70.1", text: "Describe the external ear — auricle, external acoustic meatus", domain: "KH", isCore: true },
      { code: "AN70.2", text: "Describe the middle ear — walls, contents, ossicles", domain: "KH", isCore: true },
      { code: "AN70.3", text: "Describe the internal ear — bony and membranous labyrinth", domain: "KH", isCore: true },
      { code: "AN70.4", text: "Describe the development of ear", domain: "K", isCore: true },
    ],
  },
  {
    id: "an71", module: "AN71", title: "Cranial Nerves",
    subspecialty: "head-neck", topicSlugs: ["cranial-nerves"],
    competencies: [
      { code: "AN71.1", text: "Describe the cranial nerves — nuclei, course, branches, distribution", domain: "KH", isCore: true },
      { code: "AN71.2", text: "Describe the trigeminal nerve — divisions, branches, distribution", domain: "KH", isCore: true },
      { code: "AN71.3", text: "Describe the vagus nerve — course, branches, distribution", domain: "KH", isCore: true },
      { code: "AN71.4", text: "Describe the glossopharyngeal and hypoglossal nerves", domain: "KH", isCore: true },
      { code: "AN71.5", text: "Describe the accessory nerve and its clinical significance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an72", module: "AN72", title: "Brain & Spinal Cord",
    subspecialty: "head-neck", topicSlugs: ["brain-spinal-cord"],
    competencies: [
      { code: "AN72.1", text: "Describe the parts of brain — cerebrum, cerebellum, brain stem", domain: "KH", isCore: true },
      { code: "AN72.2", text: "Describe the cerebral cortex — lobes, sulci, gyri, functional areas", domain: "KH", isCore: true },
      { code: "AN72.3", text: "Describe the blood supply of brain — circle of Willis", domain: "KH", isCore: true },
      { code: "AN72.4", text: "Describe the ventricular system and CSF circulation", domain: "KH", isCore: true },
      { code: "AN72.5", text: "Describe the meninges — dura, arachnoid, pia mater", domain: "KH", isCore: true },
      { code: "AN72.6", text: "Describe the spinal cord — segments, tracts, blood supply", domain: "KH", isCore: true },
      { code: "AN72.7", text: "Describe the development of nervous system and its congenital anomalies", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an73", module: "AN73", title: "Head & Neck — Surface & Radiological Anatomy",
    subspecialty: "head-neck", topicSlugs: ["surface-anatomy-head-neck"],
    competencies: [
      { code: "AN73.1", text: "Describe and demonstrate the surface anatomy of head and neck", domain: "SH", isCore: true },
      { code: "AN73.2", text: "Identify the normal radiological anatomy of head and neck — skull X-ray, CT, MRI", domain: "SH", isCore: true },
    ],
  },
  // ─── Histology Special (AN74–AN76) ───
  {
    id: "an74", module: "AN74", title: "Histology of Organs — I",
    subspecialty: "general-topics", topicSlugs: ["histology-organs-1"],
    competencies: [
      { code: "AN74.1", text: "Identify and describe the histology of esophagus, stomach, small intestine, large intestine", domain: "SH", isCore: true },
      { code: "AN74.2", text: "Identify and describe the histology of liver, gallbladder, pancreas", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an75", module: "AN75", title: "Histology of Organs — II",
    subspecialty: "general-topics", topicSlugs: ["histology-organs-2"],
    competencies: [
      { code: "AN75.1", text: "Identify and describe the histology of kidney, ureter, urinary bladder", domain: "SH", isCore: true },
      { code: "AN75.2", text: "Identify and describe the histology of testis, epididymis, ovary, uterus, uterine tube", domain: "SH", isCore: true },
      { code: "AN75.3", text: "Identify and describe the histology of skin and its appendages", domain: "SH", isCore: true },
    ],
  },
  {
    id: "an76", module: "AN76", title: "Histology of Organs — III",
    subspecialty: "general-topics", topicSlugs: ["histology-organs-3"],
    competencies: [
      { code: "AN76.1", text: "Identify and describe the histology of eye — cornea, retina, lens", domain: "SH", isCore: true },
      { code: "AN76.2", text: "Identify and describe the histology of blood vessels — artery, vein, capillary", domain: "SH", isCore: true },
      { code: "AN76.3", text: "Identify and describe the histology of lymph node, spleen, thymus, tonsil", domain: "SH", isCore: true },
    ],
  },
  // ─── Embryology Special (AN77–AN78) ───
  {
    id: "an77", module: "AN77", title: "Embryology — Branchial Apparatus",
    subspecialty: "head-neck", topicSlugs: ["branchial-apparatus"],
    competencies: [
      { code: "AN77.1", text: "Describe the branchial arches — derivatives of arches, pouches, clefts, membranes", domain: "KH", isCore: true },
      { code: "AN77.2", text: "Describe the development of face, palate and their anomalies — cleft lip, cleft palate", domain: "KH", isCore: true },
    ],
  },
  {
    id: "an78", module: "AN78", title: "Embryology — CVS & Urogenital",
    subspecialty: "general-topics", topicSlugs: ["embryology-cvs-urogenital"],
    competencies: [
      { code: "AN78.1", text: "Describe the development of cardiovascular system — heart, aortic arches, fetal circulation", domain: "KH", isCore: true },
      { code: "AN78.2", text: "Describe the development of urogenital system — kidney, ureter, bladder, gonads", domain: "KH", isCore: true },
    ],
  },
  // ─── Neuroanatomy (AN79) ───
  {
    id: "an79", module: "AN79", title: "Neuroanatomy — Tracts & Pathways",
    subspecialty: "head-neck", topicSlugs: ["neuroanatomy-tracts"],
    competencies: [
      { code: "AN79.1", text: "Describe the ascending tracts — dorsal column, spinothalamic, spinocerebellar", domain: "KH", isCore: true },
      { code: "AN79.2", text: "Describe the descending tracts — pyramidal and extrapyramidal", domain: "KH", isCore: true },
      { code: "AN79.3", text: "Describe the basal ganglia — components, connections, functions", domain: "KH", isCore: true },
      { code: "AN79.4", text: "Describe the thalamus — nuclei, connections, functions", domain: "KH", isCore: true },
      { code: "AN79.5", text: "Describe the hypothalamus — nuclei, connections, functions", domain: "KH", isCore: true },
      { code: "AN79.6", text: "Describe the cerebellum — lobes, nuclei, connections, functions", domain: "KH", isCore: true },
      { code: "AN79.7", text: "Describe the brainstem — external features, internal structure, cranial nerve nuclei", domain: "KH", isCore: true },
    ],
  },
  // ─── Cross-sectional Anatomy (AN80) ───
  {
    id: "an80", module: "AN80", title: "Cross-sectional & Living Anatomy",
    subspecialty: "general-topics", topicSlugs: ["cross-sectional-anatomy"],
    competencies: [
      { code: "AN80.1", text: "Describe and identify cross-sectional anatomy of thorax at important levels", domain: "SH", isCore: true },
      { code: "AN80.2", text: "Describe and identify cross-sectional anatomy of abdomen at important levels", domain: "SH", isCore: true },
      { code: "AN80.3", text: "Describe and identify cross-sectional anatomy of pelvis at important levels", domain: "SH", isCore: true },
    ],
  },
];

// ─── PG: MD Anatomy Topics ──────────────────────────────────────────────────

export const ANATOMY_PG_TOPICS: AnatomyPGTopic[] = [
  // General
  { id: "pg-gen-01", title: "Gross Anatomy — Upper Limb, Lower Limb, Thorax, Abdomen, Pelvis, Head & Neck", section: "General", subspecialty: "general-topics", topicSlugs: ["gross-anatomy"], ugModuleRefs: ["AN15", "AN16", "AN17", "AN26", "AN37", "AN43", "AN54", "AN60"] },
  { id: "pg-gen-02", title: "Neuroanatomy — Brain, Spinal Cord, Cranial Nerves, Tracts", section: "General", subspecialty: "head-neck", topicSlugs: ["brain-spinal-cord", "cranial-nerves", "neuroanatomy-tracts"], ugModuleRefs: ["AN71", "AN72", "AN79"] },
  { id: "pg-gen-03", title: "Microanatomy — Histology of All Organs & Tissues", section: "General", subspecialty: "general-topics", topicSlugs: ["histology-general", "histology-organs-1", "histology-organs-2", "histology-organs-3"], ugModuleRefs: ["AN11", "AN74", "AN75", "AN76"] },
  { id: "pg-gen-04", title: "Embryology — General & Systemic Development", section: "General", subspecialty: "general-topics", topicSlugs: ["embryology-general", "embryology-cvs-urogenital"], ugModuleRefs: ["AN12", "AN77", "AN78"] },
  // Regional
  { id: "pg-reg-01", title: "Applied Anatomy of Upper Limb — Brachial Plexus Injuries, Nerve Palsies, Fractures", section: "Regional", subspecialty: "upper-limb", topicSlugs: ["axilla-brachial-plexus", "nerves-upper-limb"], ugModuleRefs: ["AN16", "AN19", "AN24"] },
  { id: "pg-reg-02", title: "Applied Anatomy of Lower Limb — Fractures, Nerve Injuries, Compartments", section: "Regional", subspecialty: "lower-limb", topicSlugs: ["front-thigh", "gluteal-region", "knee-joint"], ugModuleRefs: ["AN26", "AN28", "AN33", "AN36"] },
  { id: "pg-reg-03", title: "Applied Anatomy of Thorax — Heart, Lungs, Great Vessels", section: "Regional", subspecialty: "thorax", topicSlugs: ["heart-pericardium", "pleura-lungs", "mediastinum"], ugModuleRefs: ["AN38", "AN39", "AN40"] },
  { id: "pg-reg-04", title: "Applied Anatomy of Abdomen — GI Tract, Liver, Kidney", section: "Regional", subspecialty: "abdomen", topicSlugs: ["stomach-duodenum", "liver-biliary", "kidney-ureter"], ugModuleRefs: ["AN45", "AN47", "AN49"] },
  { id: "pg-reg-05", title: "Applied Anatomy of Pelvis & Perineum", section: "Regional", subspecialty: "pelvis-perineum", topicSlugs: ["bony-pelvis", "pelvic-viscera-male", "pelvic-viscera-female"], ugModuleRefs: ["AN54", "AN55", "AN56"] },
  { id: "pg-reg-06", title: "Applied Anatomy of Head & Neck — Cranial Fossae, Orbit, Neck Spaces", section: "Regional", subspecialty: "head-neck", topicSlugs: ["scalp-face", "parotid-facial-nerve", "triangles-neck", "orbit-eye"], ugModuleRefs: ["AN60", "AN61", "AN63", "AN69"] },
  // Research & Teaching
  { id: "pg-res-01", title: "Genetics, Cytogenetics & Molecular Biology", section: "Research", subspecialty: "general-topics", topicSlugs: ["genetics"], ugModuleRefs: ["AN10"] },
  { id: "pg-res-02", title: "Radiological & Cross-sectional Anatomy", section: "Research", subspecialty: "general-topics", topicSlugs: ["radiological-anatomy", "cross-sectional-anatomy"], ugModuleRefs: ["AN13", "AN80"] },
  { id: "pg-res-03", title: "Surface Anatomy & Clinical Correlation", section: "Research", subspecialty: "upper-limb", topicSlugs: ["surface-anatomy-general"], ugModuleRefs: ["AN9", "AN21", "AN35", "AN42", "AN53", "AN73"] },
  { id: "pg-res-04", title: "Anatomical Techniques — Dissection, Histochemistry, Immunohistochemistry", section: "Research", subspecialty: "general-topics", topicSlugs: ["microanatomy-techniques"], ugModuleRefs: ["AN14"] },
  { id: "pg-res-05", title: "Research Methodology & Biostatistics in Anatomy", section: "Research", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: [] },
  { id: "pg-reg-07", title: "Applied Anatomy of Abdomen — Peritoneum, Posterior Wall", section: "Regional", subspecialty: "abdomen", topicSlugs: ["peritoneum", "posterior-abdominal-wall"], ugModuleRefs: ["AN44", "AN51"] },
  { id: "pg-reg-08", title: "Applied Anatomy of Lower Limb — Foot, Ankle, Vessels", section: "Regional", subspecialty: "lower-limb", topicSlugs: ["foot", "ankle-foot-joints", "veins-lower-limb"], ugModuleRefs: ["AN31", "AN34", "AN35"] },
  { id: "pg-reg-09", title: "Applied Anatomy of Thorax — Development & Congenital Anomalies", section: "Regional", subspecialty: "thorax", topicSlugs: ["development-thorax", "surface-anatomy-thorax"], ugModuleRefs: ["AN41", "AN42"] },
  { id: "pg-reg-10", title: "Applied Anatomy of Abdomen — Development of GI Tract", section: "Regional", subspecialty: "abdomen", topicSlugs: ["development-gi", "surface-anatomy-abdomen"], ugModuleRefs: ["AN52", "AN53"] },
  { id: "pg-reg-11", title: "Applied Anatomy of Pelvis — Development & Vessels", section: "Regional", subspecialty: "pelvis-perineum", topicSlugs: ["pelvic-vessels-nerves", "development-reproductive"], ugModuleRefs: ["AN58", "AN59"] },
  { id: "pg-reg-12", title: "Applied Anatomy of Head & Neck — Ear, Nose, Larynx, Pharynx", section: "Regional", subspecialty: "head-neck", topicSlugs: ["ear", "nose-sinuses", "larynx", "pharynx-palate"], ugModuleRefs: ["AN65", "AN66", "AN68", "AN70"] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return ANATOMY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): AnatomyUGModule[] {
  return ANATOMY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): AnatomyPGTopic[] {
  return ANATOMY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
