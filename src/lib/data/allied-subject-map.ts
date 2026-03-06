// =============================================================================
// SURGERY ALLIED COMPETENCY MAP
// Cross-subject prerequisite and related knowledge for all 175 surgery topics
// Generated: 2026-02-15 | Clinically verified mapping
// =============================================================================

export type AlliedSubject = "anatomy" | "physiology" | "pathology" | "pharmacology" | "microbiology" | "radiology";
export type Relationship = "prerequisite" | "parallel" | "extension";

export interface AlliedLink {
  subject: AlliedSubject;
  topic: string;           // topic slug path in that subject's content dir
  nmcCode?: string;
  relationship: Relationship;
  label: string;
}

export interface TopicRoadmap {
  foundations: AlliedLink[];
  clinical: AlliedLink[];
  extensions: AlliedLink[];
  nextTopics: string[];
  prevTopics: string[];
}

export const SURGERY_ALLIED_MAP: Record<string, TopicRoadmap> = {

  // ===========================================================================
  // GENERAL TOPICS (18 topics)
  // ===========================================================================

  "wound-healing": {
    foundations: [
      { subject: "physiology", topic: "general-physiology/homeostasis", relationship: "prerequisite", label: "Homeostasis basics" },
      { subject: "pathology", topic: "general-pathology/tissue-repair", nmcCode: "PA13.1", relationship: "prerequisite", label: "Tissue repair & regeneration" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", nmcCode: "PA6.1", relationship: "prerequisite", label: "Acute inflammation cascade" },
      { subject: "pathology", topic: "general-pathology/chronic-inflammation", nmcCode: "PA7.1", relationship: "prerequisite", label: "Chronic inflammation & granulation tissue" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "antimicrobials/antifungal-drugs", relationship: "parallel", label: "Topical antimicrobials for wound care" },
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Biofilm in chronic wounds" },
      { subject: "pathology", topic: "general-pathology/cell-injury", nmcCode: "PA2.1", relationship: "parallel", label: "Cell injury mechanisms" },
    ],
    extensions: [
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "extension", label: "Marjolin ulcer in chronic wounds" },
    ],
    nextTopics: ["surgical-infections", "suturing-techniques", "wound-closure", "burns"],
    prevTopics: [],
  },

  "surgical-infections": {
    foundations: [
      { subject: "microbiology", topic: "general-microbiology/sterilization-disinfection", nmcCode: "MI1.1", relationship: "prerequisite", label: "Sterilization & disinfection principles" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", nmcCode: "PA6.1", relationship: "prerequisite", label: "Inflammatory response to infection" },
      { subject: "pathology", topic: "general-pathology/granulomatous-inflammation", relationship: "prerequisite", label: "Granulomatous infections (TB, fungal)" },
      { subject: "microbiology", topic: "general-microbiology/specimen-collection", relationship: "prerequisite", label: "Specimen collection for culture" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "antimicrobials/antifungal-drugs", relationship: "parallel", label: "Antifungal agents in surgical infections" },
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Biofilm & prosthetic infections" },
      { subject: "pathology", topic: "general-pathology/shock-pathology", relationship: "parallel", label: "Septic shock pathology" },
    ],
    extensions: [
      { subject: "microbiology", topic: "systemic-infections/emerging-infections", relationship: "extension", label: "MDR surgical site infections" },
    ],
    nextTopics: ["asepsis-sterilization", "gas-gangrene", "wound-healing"],
    prevTopics: ["wound-healing"],
  },

  "shock": {
    foundations: [
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", nmcCode: "PY5.3", relationship: "prerequisite", label: "Cardiac output & determinants" },
      { subject: "physiology", topic: "cardiovascular-physiology/arterial-blood-pressure", nmcCode: "PY5.6", relationship: "prerequisite", label: "Blood pressure regulation" },
      { subject: "physiology", topic: "cardiovascular-physiology/baroreceptor-reflex", relationship: "prerequisite", label: "Baroreceptor compensatory reflex" },
      { subject: "physiology", topic: "cardiovascular-physiology/microcirculation", relationship: "prerequisite", label: "Microcirculation & tissue perfusion" },
      { subject: "physiology", topic: "general-physiology/body-fluid-compartments", nmcCode: "PY1.5", relationship: "prerequisite", label: "Body fluid compartments & shifts" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/shock-pathology", nmcCode: "PA28.1", relationship: "parallel", label: "Shock pathology — organ damage patterns" },
      { subject: "pharmacology", topic: "cardiovascular-drugs/antihypertensives-overview", relationship: "parallel", label: "Vasopressors & inotropes" },
      { subject: "pathology", topic: "general-pathology/infarction", relationship: "parallel", label: "End-organ ischemic injury" },
    ],
    extensions: [
      { subject: "physiology", topic: "renal-physiology/renal-blood-flow", relationship: "extension", label: "Renal response to shock" },
      { subject: "physiology", topic: "respiratory-physiology/oxygen-transport", relationship: "extension", label: "Oxygen delivery in shock" },
    ],
    nextTopics: ["fluid-electrolytes", "blood-transfusion", "polytrauma-assessment"],
    prevTopics: [],
  },

  "fluid-electrolytes": {
    foundations: [
      { subject: "physiology", topic: "general-physiology/body-fluid-compartments", nmcCode: "PY1.5", relationship: "prerequisite", label: "Body fluid compartments (ICF/ECF)" },
      { subject: "physiology", topic: "renal-physiology/glomerular-filtration", nmcCode: "PY7.2", relationship: "prerequisite", label: "GFR & renal handling of electrolytes" },
      { subject: "physiology", topic: "renal-physiology/acid-base-physiology", nmcCode: "PY7.6", relationship: "prerequisite", label: "Acid-base balance & ABG interpretation" },
      { subject: "physiology", topic: "general-physiology/cell-membrane-transport", nmcCode: "PY1.3", relationship: "prerequisite", label: "Osmosis & membrane transport" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "cardiovascular-drugs/diuretics-pharmacology", nmcCode: "PH3.2", relationship: "parallel", label: "Diuretics & electrolyte effects" },
      { subject: "pathology", topic: "general-pathology/edema-pathology", relationship: "parallel", label: "Edema pathophysiology" },
    ],
    extensions: [
      { subject: "physiology", topic: "renal-physiology/urine-concentration-dilution", relationship: "extension", label: "Urine concentration mechanisms" },
      { subject: "physiology", topic: "endocrine-physiology/adrenal-cortex-physiology", relationship: "extension", label: "Aldosterone in electrolyte balance" },
    ],
    nextTopics: ["shock", "surgical-nutrition", "perioperative-management"],
    prevTopics: [],
  },

  "blood-transfusion": {
    foundations: [
      { subject: "physiology", topic: "blood-immunity/blood-groups", nmcCode: "PY2.5", relationship: "prerequisite", label: "ABO & Rh blood group systems" },
      { subject: "physiology", topic: "blood-immunity/platelets-physiology", nmcCode: "PY2.4", relationship: "prerequisite", label: "Platelet physiology & hemostasis" },
      { subject: "pathology", topic: "hematopathology/coagulation-disorders-path", nmcCode: "PA20.1", relationship: "prerequisite", label: "Coagulation cascade disorders" },
    ],
    clinical: [
      { subject: "pathology", topic: "hematopathology/hemolytic-anemias-path", relationship: "parallel", label: "Transfusion reactions — hemolysis" },
      { subject: "microbiology", topic: "virology/hepatitis-b-virus", relationship: "parallel", label: "Transfusion-transmitted HBV" },
      { subject: "microbiology", topic: "virology/hepatitis-a-virus", relationship: "parallel", label: "Transfusion-transmitted infections" },
    ],
    extensions: [
      { subject: "pharmacology", topic: "chemotherapy/immunosuppressants-pharmacology", relationship: "extension", label: "Immunosuppression in massive transfusion" },
    ],
    nextTopics: ["shock", "perioperative-management", "damage-control-surgery"],
    prevTopics: ["fluid-electrolytes"],
  },

  "burns": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/appendages-function-skin-structure", nmcCode: "AN17.1", relationship: "prerequisite", label: "Skin anatomy & appendages" },
      { subject: "physiology", topic: "general-physiology/body-fluid-compartments", relationship: "prerequisite", label: "Fluid shifts in burns" },
      { subject: "physiology", topic: "cns-physiology/pain-physiology", relationship: "prerequisite", label: "Pain pathways (burn depth assessment)" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/cell-injury", relationship: "parallel", label: "Thermal cell injury patterns" },
      { subject: "pathology", topic: "general-pathology/shock-pathology", relationship: "parallel", label: "Burn shock (hypovolemic)" },
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Burn wound infections — Pseudomonas" },
      { subject: "pharmacology", topic: "antimicrobials/antifungal-drugs", relationship: "parallel", label: "Silver sulfadiazine, topical agents" },
    ],
    extensions: [
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "extension", label: "Marjolin ulcer in burn scars" },
    ],
    nextTopics: ["wound-healing", "fluid-electrolytes", "skin-subcutaneous-tumors"],
    prevTopics: ["fluid-electrolytes", "shock"],
  },

  "asepsis-sterilization": {
    foundations: [
      { subject: "microbiology", topic: "general-microbiology/sterilization-disinfection", nmcCode: "MI1.1", relationship: "prerequisite", label: "Sterilization methods & disinfection levels" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Biofilm formation on surgical instruments" },
    ],
    extensions: [],
    nextTopics: ["surgical-infections", "hospital-waste-management"],
    prevTopics: [],
  },

  "gas-gangrene": {
    foundations: [
      { subject: "microbiology", topic: "general-topics/agents-causative-infectious", relationship: "prerequisite", label: "Clostridium species microbiology" },
      { subject: "pathology", topic: "general-pathology/necrosis-types", nmcCode: "PA3.1", relationship: "prerequisite", label: "Coagulative & liquefactive necrosis" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "parallel", label: "Necrotizing soft tissue infection pathology" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: gas in tissues" },
    ],
    extensions: [],
    nextTopics: ["surgical-infections", "soft-tissue-injuries"],
    prevTopics: ["surgical-infections"],
  },

  "homeostasis": {
    foundations: [
      { subject: "physiology", topic: "general-physiology/homeostasis", nmcCode: "PY1.1", relationship: "prerequisite", label: "Homeostasis & feedback mechanisms" },
      { subject: "physiology", topic: "cns-physiology/temperature-regulation", relationship: "prerequisite", label: "Thermoregulation" },
      { subject: "physiology", topic: "endocrine-physiology/hypothalamic-pituitary-axis", relationship: "prerequisite", label: "Neuroendocrine stress response" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["fluid-electrolytes", "shock"],
    prevTopics: [],
  },

  "hospital-waste-management": {
    foundations: [
      { subject: "microbiology", topic: "general-microbiology/sterilization-disinfection", relationship: "prerequisite", label: "Disinfection levels for waste" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["asepsis-sterilization"],
    prevTopics: ["asepsis-sterilization"],
  },

  "investigations-imaging": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/anatomical-planes-position-relation", nmcCode: "AN1.1", relationship: "prerequisite", label: "Anatomical planes for imaging orientation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Imaging modalities overview (X-ray, USG, CT, MRI)" },
    ],
    extensions: [],
    nextTopics: ["preoperative-assessment"],
    prevTopics: [],
  },

  "minimally-invasive-surgery": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", nmcCode: "AN44.1", relationship: "prerequisite", label: "Trocar placement anatomy" },
      { subject: "physiology", topic: "respiratory-physiology/mechanics-of-breathing", relationship: "prerequisite", label: "Pneumoperitoneum effects on ventilation" },
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Hemodynamic effects of CO₂ insufflation" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "cns-pharmacology/general-anesthetics", relationship: "parallel", label: "Anesthesia for laparoscopy" },
    ],
    extensions: [],
    nextTopics: ["robotic-surgery-basics"],
    prevTopics: ["basic-surgical-skills"],
  },

  "organ-transplantation": {
    foundations: [
      { subject: "physiology", topic: "blood-immunity/adaptive-immunity", relationship: "prerequisite", label: "Adaptive immunity & HLA system" },
      { subject: "microbiology", topic: "immunology/t-cell-immunity", relationship: "prerequisite", label: "T-cell mediated rejection" },
      { subject: "pathology", topic: "general-pathology/chronic-inflammation", relationship: "prerequisite", label: "Chronic rejection pathology" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/immunosuppressants-pharmacology", nmcCode: "PH4.6", relationship: "parallel", label: "Immunosuppressants (cyclosporine, tacrolimus)" },
      { subject: "microbiology", topic: "immunology/immunodeficiency-diseases", relationship: "parallel", label: "Opportunistic infections post-transplant" },
    ],
    extensions: [],
    nextTopics: ["liver-transplant-indications"],
    prevTopics: [],
  },

  "perioperative-management": {
    foundations: [
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Hemodynamic monitoring" },
      { subject: "physiology", topic: "respiratory-physiology/oxygen-transport", relationship: "prerequisite", label: "Oxygenation assessment" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "cns-pharmacology/general-anesthetics", relationship: "parallel", label: "Anesthetic agents & recovery" },
      { subject: "pharmacology", topic: "cns-pharmacology/intravenous-anesthetics", relationship: "parallel", label: "IV anesthetics" },
    ],
    extensions: [],
    nextTopics: ["preoperative-assessment", "fluid-electrolytes"],
    prevTopics: ["preoperative-assessment"],
  },

  "preoperative-assessment": {
    foundations: [
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Cardiac risk assessment (METs)" },
      { subject: "physiology", topic: "respiratory-physiology/lung-volumes-capacities", relationship: "prerequisite", label: "Pulmonary function for surgery" },
    ],
    clinical: [
      { subject: "pathology", topic: "hematopathology/coagulation-disorders-path", relationship: "parallel", label: "Coagulation screen interpretation" },
    ],
    extensions: [],
    nextTopics: ["perioperative-management"],
    prevTopics: [],
  },

  "skin-subcutaneous-tumors": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/appendages-function-skin-structure", nmcCode: "AN17.1", relationship: "prerequisite", label: "Skin layers & appendages anatomy" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", nmcCode: "PA23.1", relationship: "prerequisite", label: "Benign vs malignant neoplasia" },
      { subject: "pathology", topic: "general-pathology/tumor-nomenclature", nmcCode: "PA23.2", relationship: "prerequisite", label: "Tumor nomenclature & classification" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/tumor-genetics", relationship: "parallel", label: "Genetic basis of skin cancers" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Chemotherapy for melanoma" },
    ],
    extensions: [],
    nextTopics: ["oral-cancer", "breast-cancer"],
    prevTopics: ["wound-healing"],
  },

  "surgical-audit": {
    foundations: [],
    clinical: [],
    extensions: [],
    nextTopics: ["surgical-ethics"],
    prevTopics: [],
  },

  "surgical-ethics": {
    foundations: [],
    clinical: [],
    extensions: [],
    nextTopics: ["surgical-audit"],
    prevTopics: [],
  },

  "surgical-nutrition": {
    foundations: [
      { subject: "physiology", topic: "gi-physiology/absorption-carbohydrates", relationship: "prerequisite", label: "Carbohydrate absorption" },
      { subject: "physiology", topic: "gi-physiology/absorption-proteins", relationship: "prerequisite", label: "Protein absorption & metabolism" },
      { subject: "physiology", topic: "gi-physiology/pancreatic-secretion", relationship: "prerequisite", label: "Pancreatic enzyme secretion" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "gi-pharmacology/pancreatic-enzyme-supplements", relationship: "parallel", label: "Pancreatic enzyme supplements (PERT)" },
    ],
    extensions: [],
    nextTopics: ["perioperative-management", "postgastrectomy-syndromes"],
    prevTopics: ["fluid-electrolytes"],
  },

  // ===========================================================================
  // ESOPHAGUS (22 topics)
  // ===========================================================================

  "esophageal-anatomy": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", nmcCode: "AN24.1", relationship: "prerequisite", label: "Superior mediastinum & esophageal relations" },
      { subject: "anatomy", topic: "thorax/diaphragm-anatomy", nmcCode: "AN21.1", relationship: "prerequisite", label: "Diaphragmatic hiatus anatomy" },
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", nmcCode: "AN47.1", relationship: "prerequisite", label: "GEJ anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["les-physiology", "dysphagia", "gerd"],
    prevTopics: [],
  },

  "les-physiology": {
    foundations: [
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Lower esophageal sphincter physiology" },
      { subject: "physiology", topic: "gi-physiology/gi-hormones", relationship: "prerequisite", label: "GI hormones affecting LES tone" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["gerd", "achalasia"],
    prevTopics: ["esophageal-anatomy"],
  },

  "dysphagia": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", relationship: "prerequisite", label: "Esophageal course & constrictions" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Esophageal peristalsis" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Barium swallow interpretation" },
    ],
    extensions: [],
    nextTopics: ["esophageal-cancer", "achalasia", "motility-disorders"],
    prevTopics: ["esophageal-anatomy"],
  },

  "gerd": {
    foundations: [
      { subject: "anatomy", topic: "thorax/diaphragm-anatomy", relationship: "prerequisite", label: "Hiatal anatomy & anti-reflux barrier" },
      { subject: "physiology", topic: "gi-physiology/gastric-secretion", nmcCode: "PY4.3", relationship: "prerequisite", label: "Gastric acid secretion" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "LES tone & transient relaxations" },
    ],
    clinical: [
      { subject: "pathology", topic: "gi-pathology/peptic-ulcer-path", relationship: "parallel", label: "Esophagitis & Barrett pathology" },
      { subject: "pharmacology", topic: "gi-pharmacology/pancreatic-enzyme-supplements", relationship: "parallel", label: "PPIs & H2 blockers" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Barium swallow, pH monitoring" },
    ],
    extensions: [],
    nextTopics: ["barrett-esophagus", "hiatal-hernia", "fundoplication", "surgical-management-gerd"],
    prevTopics: ["esophageal-anatomy", "les-physiology"],
  },

  "barrett-esophagus": {
    foundations: [
      { subject: "pathology", topic: "general-pathology/cellular-adaptations", nmcCode: "PA1.1", relationship: "prerequisite", label: "Metaplasia — intestinal metaplasia" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Dysplasia-carcinoma sequence" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Endoscopic surveillance" },
    ],
    extensions: [],
    nextTopics: ["esophageal-cancer"],
    prevTopics: ["gerd"],
  },

  "achalasia": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", relationship: "prerequisite", label: "Esophageal anatomy & LES" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Esophageal motility & peristalsis" },
      { subject: "physiology", topic: "cns-physiology/autonomic-nervous-system-physiology", relationship: "prerequisite", label: "Myenteric plexus & parasympathetic innervation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Barium swallow — bird-beak sign" },
      { subject: "pathology", topic: "general-pathology/cell-injury", relationship: "parallel", label: "Ganglion cell degeneration" },
    ],
    extensions: [],
    nextTopics: ["heller-myotomy", "poem-procedure", "achalasia-lhm-vs-poem", "esophageal-manometry"],
    prevTopics: ["esophageal-anatomy", "les-physiology"],
  },

  "achalasia-cardia": {
    foundations: [
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "LES physiology" },
      { subject: "physiology", topic: "cns-physiology/autonomic-nervous-system-physiology", relationship: "prerequisite", label: "Enteric nervous system" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Manometry & barium swallow" },
    ],
    extensions: [],
    nextTopics: ["heller-myotomy", "poem-procedure"],
    prevTopics: ["esophageal-anatomy"],
  },

  "achalasia-lhm-vs-poem": {
    foundations: [
      { subject: "anatomy", topic: "thorax/diaphragm-anatomy", relationship: "prerequisite", label: "GEJ surgical anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["achalasia", "heller-myotomy", "poem-procedure"],
  },

  "heller-myotomy": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "GEJ anatomy for myotomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["achalasia-lhm-vs-poem"],
    prevTopics: ["achalasia"],
  },

  "poem-procedure": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Submucosal tunnel anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["achalasia-lhm-vs-poem"],
    prevTopics: ["achalasia"],
  },

  "esophageal-manometry": {
    foundations: [
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Esophageal motility physiology" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["achalasia", "motility-disorders"],
    prevTopics: ["esophageal-anatomy", "les-physiology"],
  },

  "motility-disorders": {
    foundations: [
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Esophageal motility patterns" },
      { subject: "physiology", topic: "cns-physiology/autonomic-nervous-system-physiology", relationship: "prerequisite", label: "Enteric nervous system" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["achalasia", "esophageal-manometry"],
    prevTopics: ["esophageal-anatomy"],
  },

  "esophageal-cancer": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", relationship: "prerequisite", label: "Esophageal relations & lymph nodes" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", nmcCode: "PA23.1", relationship: "prerequisite", label: "SCC vs adenocarcinoma pathology" },
      { subject: "pathology", topic: "general-pathology/tumor-genetics", relationship: "prerequisite", label: "Molecular pathology of esophageal cancer" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Neoadjuvant chemoRT" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT staging, EUS, PET-CT" },
    ],
    extensions: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "extension", label: "Gastric conduit for reconstruction" },
    ],
    nextTopics: ["esophageal-reconstruction"],
    prevTopics: ["barrett-esophagus", "dysphagia"],
  },

  "esophageal-perforation": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", relationship: "prerequisite", label: "Esophageal constrictions (sites of perforation)" },
      { subject: "anatomy", topic: "thorax/pleura", relationship: "prerequisite", label: "Pleural space contamination" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Water-soluble contrast swallow, CT" },
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Mediastinitis microbiology" },
    ],
    extensions: [],
    nextTopics: ["empyema-thoracis"],
    prevTopics: ["esophageal-anatomy"],
  },

  "esophageal-reconstruction": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Gastric pull-up anatomy" },
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Colonic conduit blood supply" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["esophageal-cancer", "caustic-injury-esophagus"],
  },

  "esophageal-atresia": {
    foundations: [
      { subject: "anatomy", topic: "thorax/trachea-bronchi", relationship: "prerequisite", label: "Tracheoesophageal embryology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: coiled NG tube" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["esophageal-anatomy"],
  },

  "caustic-injury-esophagus": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", relationship: "prerequisite", label: "Esophageal constrictions (injury sites)" },
      { subject: "pathology", topic: "general-pathology/cell-injury", relationship: "prerequisite", label: "Chemical cell injury (acid vs alkali)" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Acute corrosive inflammation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT for perforation, contrast study for stricture" },
    ],
    extensions: [
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "extension", label: "SCC risk in caustic stricture" },
    ],
    nextTopics: ["esophageal-reconstruction"],
    prevTopics: ["esophageal-anatomy"],
  },

  "fundoplication": {
    foundations: [
      { subject: "anatomy", topic: "thorax/diaphragm-anatomy", relationship: "prerequisite", label: "Hiatal anatomy for wrap" },
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Gastric fundus anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["gerd", "hiatal-hernia"],
  },

  "surgical-management-gerd": {
    foundations: [
      { subject: "anatomy", topic: "thorax/diaphragm-anatomy", relationship: "prerequisite", label: "Crural anatomy" },
      { subject: "physiology", topic: "gi-physiology/gastric-secretion", relationship: "prerequisite", label: "Acid secretion mechanisms" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["fundoplication"],
    prevTopics: ["gerd"],
  },

  "zenker-diverticulum": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Killian dehiscence (pharyngoesophageal junction)" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Barium swallow — posterior pouch" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["esophageal-anatomy", "dysphagia"],
  },

  // ===========================================================================
  // STOMACH & DUODENUM (8 topics)
  // ===========================================================================

  "gastric-anatomy-physiology": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", nmcCode: "AN47.1", relationship: "prerequisite", label: "Stomach anatomy, blood supply, lymphatics" },
      { subject: "physiology", topic: "gi-physiology/gastric-secretion", nmcCode: "PY4.3", relationship: "prerequisite", label: "Gastric acid secretion (parietal cells, phases)" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", nmcCode: "PY4.4", relationship: "prerequisite", label: "Gastric motility & emptying" },
      { subject: "physiology", topic: "gi-physiology/gi-hormones", nmcCode: "PY4.8", relationship: "prerequisite", label: "GI hormones (gastrin, CCK, secretin)" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["peptic-ulcer-disease", "gastric-cancer", "upper-gi-bleeding"],
    prevTopics: [],
  },

  "peptic-ulcer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Stomach & duodenal anatomy" },
      { subject: "anatomy", topic: "abdomen/duodenum-anatomy", nmcCode: "AN47.4", relationship: "prerequisite", label: "Duodenal anatomy (D1 — ulcer site)" },
      { subject: "physiology", topic: "gi-physiology/gastric-secretion", relationship: "prerequisite", label: "Acid secretion & mucosal defense" },
    ],
    clinical: [
      { subject: "pathology", topic: "gi-pathology/peptic-ulcer-path", nmcCode: "PA24.1", relationship: "parallel", label: "Peptic ulcer pathology" },
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "H. pylori microbiology & diagnosis" },
      { subject: "pharmacology", topic: "gi-pharmacology/pancreatic-enzyme-supplements", relationship: "parallel", label: "PPIs, H2 blockers, antacids" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Endoscopy, CT for perforation" },
    ],
    extensions: [],
    nextTopics: ["upper-gi-bleeding", "gastric-cancer"],
    prevTopics: ["gastric-anatomy-physiology"],
  },

  "peptic-ulcer-disease": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Stomach anatomy & blood supply" },
      { subject: "anatomy", topic: "abdomen/duodenum-anatomy", nmcCode: "AN47.4", relationship: "prerequisite", label: "Duodenal anatomy" },
      { subject: "physiology", topic: "gi-physiology/gastric-secretion", relationship: "prerequisite", label: "Acid-pepsin aggression vs mucosal defense" },
    ],
    clinical: [
      { subject: "pathology", topic: "gi-pathology/peptic-ulcer-path", nmcCode: "PA24.1", relationship: "parallel", label: "PUD pathology & complications" },
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "H. pylori diagnosis & eradication" },
      { subject: "pharmacology", topic: "gi-pharmacology/pancreatic-enzyme-supplements", relationship: "parallel", label: "PPIs, H2 blockers, triple therapy" },
    ],
    extensions: [],
    nextTopics: ["upper-gi-bleeding", "pyloric-stenosis", "postgastrectomy-syndromes"],
    prevTopics: ["gastric-anatomy-physiology"],
  },

  "gastric-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Stomach lymphatic drainage (D1/D2)" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Lauren classification (intestinal vs diffuse)" },
      { subject: "pathology", topic: "general-pathology/cellular-adaptations", relationship: "prerequisite", label: "Intestinal metaplasia sequence" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Perioperative chemotherapy (FLOT)" },
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "H. pylori as Group I carcinogen" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT staging, EUS for T-staging" },
    ],
    extensions: [],
    nextTopics: ["postgastrectomy-syndromes", "gist"],
    prevTopics: ["gastric-anatomy-physiology", "peptic-ulcer-disease"],
  },

  "gist": {
    foundations: [
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Mesenchymal tumors — c-KIT mutation" },
      { subject: "pathology", topic: "general-pathology/tumor-genetics", relationship: "prerequisite", label: "c-KIT/PDGFRA molecular pathology" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Imatinib — targeted therapy" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: exophytic enhancing mass" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["gastric-anatomy-physiology"],
  },

  "postgastrectomy-syndromes": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Post-gastrectomy altered anatomy" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Gastric reservoir function" },
      { subject: "physiology", topic: "gi-physiology/absorption-carbohydrates", relationship: "prerequisite", label: "Rapid carbohydrate absorption (dumping)" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["surgical-nutrition"],
    prevTopics: ["gastric-cancer", "peptic-ulcer-disease"],
  },

  "pyloric-stenosis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Pyloric anatomy" },
      { subject: "physiology", topic: "renal-physiology/acid-base-physiology", relationship: "prerequisite", label: "Hypochloremic metabolic alkalosis" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: pyloric muscle thickness (infantile)" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["peptic-ulcer-disease", "gastric-anatomy-physiology"],
  },

  "upper-gi-bleeding": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/stomach-anatomy", relationship: "prerequisite", label: "Gastric & duodenal arterial supply" },
      { subject: "physiology", topic: "blood-immunity/platelets-physiology", relationship: "prerequisite", label: "Hemostasis & coagulation" },
    ],
    clinical: [
      { subject: "pathology", topic: "gi-pathology/peptic-ulcer-path", relationship: "parallel", label: "PUD as cause of UGIB" },
      { subject: "pharmacology", topic: "gi-pharmacology/pancreatic-enzyme-supplements", relationship: "parallel", label: "IV PPI therapy" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT angiography, endoscopy" },
    ],
    extensions: [],
    nextTopics: ["peptic-ulcer-disease", "portal-hypertension"],
    prevTopics: ["gastric-anatomy-physiology"],
  },

  // ===========================================================================
  // SMALL INTESTINE (10 topics)
  // ===========================================================================

  "small-intestine-anatomy": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", nmcCode: "AN47.8", relationship: "prerequisite", label: "SMA branches & arcades" },
      { subject: "anatomy", topic: "abdomen/inferior-mesenteric-artery", relationship: "prerequisite", label: "IMA territory" },
      { subject: "anatomy", topic: "abdomen/greater-omentum", relationship: "prerequisite", label: "Mesentery & omentum" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["intestinal-obstruction", "acute-appendicitis", "meckels-diverticulum"],
    prevTopics: [],
  },

  "acute-appendicitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/appendix-anatomy", nmcCode: "AN47.5", relationship: "prerequisite", label: "Appendix anatomy — McBurney's point, appendicular artery" },
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", relationship: "prerequisite", label: "Anterior abdominal wall landmarks" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Acute suppurative inflammation" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "Appendiceal flora & peritonitis organisms" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG & CT: appendiceal diameter, fat stranding" },
    ],
    extensions: [],
    nextTopics: ["peritonitis"],
    prevTopics: ["small-intestine-anatomy"],
  },

  "intestinal-obstruction": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Small bowel mesenteric anatomy" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Intestinal peristalsis & obstruction physiology" },
      { subject: "physiology", topic: "general-physiology/body-fluid-compartments", relationship: "prerequisite", label: "Third-space fluid losses" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: air-fluid levels, CT for transition point" },
      { subject: "pathology", topic: "general-pathology/infarction", relationship: "parallel", label: "Strangulation & bowel ischemia" },
    ],
    extensions: [],
    nextTopics: ["mesenteric-ischemia", "bowel-obstruction"],
    prevTopics: ["small-intestine-anatomy"],
  },

  "intestinal-tuberculosis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Ileocecal region anatomy" },
      { subject: "microbiology", topic: "mycobacteria/tuberculin-test", relationship: "prerequisite", label: "M. tuberculosis microbiology" },
      { subject: "pathology", topic: "general-pathology/granulomatous-inflammation", nmcCode: "PA7.2", relationship: "prerequisite", label: "Caseating granuloma pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: pulled-up cecum, strictures" },
    ],
    extensions: [],
    nextTopics: ["abdominal-tuberculosis"],
    prevTopics: ["small-intestine-anatomy"],
  },

  "abdominal-tuberculosis": {
    foundations: [
      { subject: "microbiology", topic: "mycobacteria/tuberculin-test", relationship: "prerequisite", label: "M. tuberculosis diagnosis" },
      { subject: "pathology", topic: "general-pathology/granulomatous-inflammation", relationship: "prerequisite", label: "Granulomatous peritonitis" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: omental thickening, ascites" },
    ],
    extensions: [],
    nextTopics: ["intestinal-obstruction"],
    prevTopics: ["intestinal-tuberculosis"],
  },

  "crohns-disease": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Terminal ileum anatomy" },
      { subject: "pathology", topic: "general-pathology/granulomatous-inflammation", relationship: "prerequisite", label: "Non-caseating granulomas" },
      { subject: "pathology", topic: "general-pathology/chronic-inflammation", relationship: "prerequisite", label: "Transmural chronic inflammation" },
      { subject: "physiology", topic: "blood-immunity/adaptive-immunity", relationship: "prerequisite", label: "Autoimmune mechanisms" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/immunosuppressants-pharmacology", relationship: "parallel", label: "Azathioprine, biologics (anti-TNF)" },
      { subject: "pharmacology", topic: "endocrine-pharmacology/corticosteroids-pharmacology", relationship: "parallel", label: "Corticosteroids in IBD" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT enterography, MRI enterography" },
    ],
    extensions: [],
    nextTopics: ["fistula-in-ano", "intestinal-obstruction"],
    prevTopics: ["small-intestine-anatomy"],
  },

  "meckels-diverticulum": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Vitellointestinal duct embryology" },
      { subject: "pathology", topic: "general-pathology/cellular-adaptations", relationship: "prerequisite", label: "Ectopic gastric mucosa (heterotopia)" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Tc-99m pertechnetate scan" },
    ],
    extensions: [],
    nextTopics: ["intestinal-obstruction", "lower-gi-bleeding"],
    prevTopics: ["small-intestine-anatomy"],
  },

  "mesenteric-ischemia": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "SMA anatomy & watershed areas" },
      { subject: "pathology", topic: "general-pathology/infarction", relationship: "prerequisite", label: "Intestinal infarction pathology" },
      { subject: "pathology", topic: "general-pathology/embolism", relationship: "prerequisite", label: "Arterial embolism" },
      { subject: "pathology", topic: "cardiovascular-pathology/atherosclerosis-pathology", relationship: "prerequisite", label: "Atherosclerotic SMA stenosis" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT angiography — SMA occlusion" },
    ],
    extensions: [],
    nextTopics: ["intestinal-obstruction"],
    prevTopics: ["small-intestine-anatomy"],
  },

  "peritonitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/greater-omentum", relationship: "prerequisite", label: "Peritoneum & peritoneal cavity" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Peritoneal inflammatory response" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "Peritoneal flora — E. coli, Bacteroides" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: free gas under diaphragm" },
    ],
    extensions: [],
    nextTopics: ["damage-control-surgery"],
    prevTopics: ["acute-appendicitis", "peptic-ulcer-disease"],
  },

  "small-bowel-tumors": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Small bowel anatomy & mesentery" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Adenocarcinoma, carcinoid, lymphoma, GIST" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT enterography, capsule endoscopy" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["small-intestine-anatomy"],
  },

  // ===========================================================================
  // COLORECTAL (10 topics)
  // ===========================================================================

  "colorectal-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Colonic blood supply (SMA/IMA)" },
      { subject: "anatomy", topic: "abdomen/inferior-mesenteric-artery", relationship: "prerequisite", label: "IMA & marginal artery" },
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", nmcCode: "AN47.10", relationship: "prerequisite", label: "Rectal anatomy & mesorectal fascia" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Adenoma-carcinoma sequence" },
      { subject: "pathology", topic: "general-pathology/tumor-genetics", relationship: "prerequisite", label: "APC, KRAS, p53 pathway" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "FOLFOX, FOLFIRI, anti-EGFR" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT colonography, MRI pelvis (rectal)" },
    ],
    extensions: [],
    nextTopics: ["rectal-cancer", "colon-cancer", "colostomy-management"],
    prevTopics: [],
  },

  "colon-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Right colon — ileocolic, right colic arteries" },
      { subject: "anatomy", topic: "abdomen/inferior-mesenteric-artery", relationship: "prerequisite", label: "Left colon — left colic, sigmoid arteries" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Adenoma-carcinoma sequence" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Adjuvant FOLFOX" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT staging, colonoscopy" },
    ],
    extensions: [],
    nextTopics: ["colostomy-management"],
    prevTopics: ["colorectal-cancer"],
  },

  "rectal-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Rectal anatomy — TME plane" },
      { subject: "anatomy", topic: "pelvis-perineum/pelvic-floor-anatomy", relationship: "prerequisite", label: "Pelvic floor & levator ani" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRI pelvis for CRM assessment" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Neoadjuvant chemoRT" },
    ],
    extensions: [],
    nextTopics: ["colostomy-management"],
    prevTopics: ["colorectal-cancer"],
  },

  "bowel-obstruction": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Small & large bowel anatomy" },
      { subject: "physiology", topic: "gi-physiology/gastric-motility", relationship: "prerequisite", label: "Peristalsis physiology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: dilated loops, air-fluid levels" },
    ],
    extensions: [],
    nextTopics: ["intestinal-obstruction", "volvulus"],
    prevTopics: [],
  },

  "diverticular-disease": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/inferior-mesenteric-artery", relationship: "prerequisite", label: "Sigmoid colon anatomy & blood supply" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Diverticulitis — acute inflammation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT abdomen — pericolic fat stranding" },
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "Colonic flora in diverticulitis" },
    ],
    extensions: [],
    nextTopics: ["peritonitis", "lower-gi-bleeding"],
    prevTopics: [],
  },

  "ulcerative-colitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Rectal & colonic mucosal anatomy" },
      { subject: "pathology", topic: "general-pathology/chronic-inflammation", relationship: "prerequisite", label: "Mucosal chronic inflammation" },
      { subject: "physiology", topic: "blood-immunity/adaptive-immunity", relationship: "prerequisite", label: "Autoimmune mucosal inflammation" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/immunosuppressants-pharmacology", relationship: "parallel", label: "5-ASA, azathioprine, biologics" },
      { subject: "pharmacology", topic: "endocrine-pharmacology/corticosteroids-pharmacology", relationship: "parallel", label: "Steroids in acute flare" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: lead-pipe colon; CT: toxic megacolon" },
    ],
    extensions: [],
    nextTopics: ["colorectal-cancer", "colostomy-management"],
    prevTopics: [],
  },

  "volvulus": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/inferior-mesenteric-artery", relationship: "prerequisite", label: "Sigmoid mesentery anatomy" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: coffee-bean sign (sigmoid), CT whirl sign" },
    ],
    extensions: [],
    nextTopics: ["bowel-obstruction"],
    prevTopics: [],
  },

  "hirschsprung-disease": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Rectal anatomy & myenteric plexus" },
      { subject: "physiology", topic: "cns-physiology/autonomic-nervous-system-physiology", relationship: "prerequisite", label: "Enteric nervous system (Auerbach plexus)" },
      { subject: "physiology", topic: "gi-physiology/defecation-reflex", relationship: "prerequisite", label: "Defecation reflex physiology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Barium enema: transition zone" },
      { subject: "pathology", topic: "general-pathology/cell-injury", relationship: "parallel", label: "Absent ganglion cells (suction biopsy)" },
    ],
    extensions: [],
    nextTopics: ["bowel-obstruction"],
    prevTopics: [],
  },

  "lower-gi-bleeding": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/inferior-mesenteric-artery", relationship: "prerequisite", label: "Colonic blood supply" },
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Hemorrhoidal plexus" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT angiography, colonoscopy, Tc-99m RBC scan" },
    ],
    extensions: [],
    nextTopics: ["hemorrhoids", "diverticular-disease", "colorectal-cancer"],
    prevTopics: [],
  },

  "colostomy-management": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", relationship: "prerequisite", label: "Stoma site anatomy (rectus sheath)" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["colorectal-cancer", "rectal-cancer"],
  },

  // ===========================================================================
  // ANORECTAL (7 topics)
  // ===========================================================================

  "hemorrhoids": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", nmcCode: "AN47.10", relationship: "prerequisite", label: "Anal canal anatomy — dentate line, hemorrhoidal plexus" },
      { subject: "anatomy", topic: "abdomen/portal-vein-anatomy", relationship: "prerequisite", label: "Portosystemic anastomosis" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/hyperemia-congestion", relationship: "parallel", label: "Venous congestion pathology" },
    ],
    extensions: [],
    nextTopics: ["anal-fissure", "rectal-prolapse"],
    prevTopics: [],
  },

  "anal-fissure": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Anal canal — posterior midline, inferior rectal artery" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "cardiovascular-drugs/antihypertensives-overview", relationship: "parallel", label: "GTN ointment, CCBs for sphincter relaxation" },
    ],
    extensions: [],
    nextTopics: ["fistula-in-ano"],
    prevTopics: ["hemorrhoids"],
  },

  "fistula-in-ano": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Anal sphincters & intersphincteric plane" },
      { subject: "anatomy", topic: "pelvis-perineum/anal-triangle", relationship: "prerequisite", label: "Ischioanal fossa anatomy" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRI pelvis — fistula tract mapping" },
      { subject: "microbiology", topic: "mycobacteria/tuberculin-test", relationship: "parallel", label: "TB fistula (consider in endemic areas)" },
    ],
    extensions: [],
    nextTopics: ["perianal-abscess"],
    prevTopics: ["perianal-abscess"],
  },

  "perianal-abscess": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Anorectal spaces — perianal, ischioanal, pelvirectal" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Abscess formation" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "Mixed flora — E. coli, anaerobes" },
    ],
    extensions: [],
    nextTopics: ["fistula-in-ano"],
    prevTopics: [],
  },

  "rectal-prolapse": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Rectal fixation anatomy" },
      { subject: "anatomy", topic: "pelvis-perineum/pelvic-floor-anatomy", relationship: "prerequisite", label: "Pelvic floor support" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["hemorrhoids"],
  },

  "anal-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Anal canal — dentate line divides SCC vs adenoca" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "SCC pathology" },
    ],
    clinical: [
      { subject: "microbiology", topic: "virology/viral-pathogenesis", relationship: "parallel", label: "HPV & anal cancer" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Nigro protocol (5-FU + mitomycin + RT)" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "anorectal-anomalies": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/rectum-anal-canal", relationship: "prerequisite", label: "Anorectal embryology" },
      { subject: "anatomy", topic: "pelvis-perineum/pelvic-floor-anatomy", relationship: "prerequisite", label: "Puborectalis & levator ani" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Invertogram, distal colostogram" },
    ],
    extensions: [],
    nextTopics: ["colostomy-management"],
    prevTopics: [],
  },

  // ===========================================================================
  // HEPATOBILIARY (19 topics)
  // ===========================================================================

  "liver-anatomy": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", nmcCode: "AN47.6", relationship: "prerequisite", label: "Liver anatomy — Couinaud segments, portal triad" },
      { subject: "anatomy", topic: "abdomen/portal-vein-anatomy", relationship: "prerequisite", label: "Portal vein anatomy & tributaries" },
      { subject: "anatomy", topic: "abdomen/inferior-vena-cava", relationship: "prerequisite", label: "Hepatic veins & IVC" },
      { subject: "physiology", topic: "gi-physiology/liver-functions-physiology", nmcCode: "PY4.6", relationship: "prerequisite", label: "Liver functions — synthesis, detoxification, bile" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["cholelithiasis", "hepatocellular-carcinoma", "liver-abscess", "portal-hypertension"],
    prevTopics: [],
  },

  "cholelithiasis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Biliary anatomy — Calot triangle" },
      { subject: "physiology", topic: "gi-physiology/liver-functions-physiology", relationship: "prerequisite", label: "Bile composition & cholesterol metabolism" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: gallstones, wall thickening" },
      { subject: "pathology", topic: "general-pathology/chronic-inflammation", relationship: "parallel", label: "Chronic cholecystitis pathology" },
    ],
    extensions: [],
    nextTopics: ["acute-cholecystitis", "cholecystitis", "choledocholithiasis", "gallbladder-cancer"],
    prevTopics: ["liver-anatomy"],
  },

  "acute-cholecystitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Calot triangle — cystic artery" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Acute cholecystitis pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: Murphy sign, pericholecystic fluid" },
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "E. coli, Klebsiella in biliary sepsis" },
    ],
    extensions: [],
    nextTopics: ["bile-duct-injury"],
    prevTopics: ["cholelithiasis"],
  },

  "cholecystitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Gallbladder & cystic duct anatomy" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Acute & chronic cholecystitis" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG abdomen" },
    ],
    extensions: [],
    nextTopics: ["acute-cholecystitis", "cholelithiasis"],
    prevTopics: ["cholelithiasis"],
  },

  "choledocholithiasis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "CBD anatomy, ampulla of Vater" },
      { subject: "anatomy", topic: "abdomen/duodenum-anatomy", relationship: "prerequisite", label: "Duodenal relations of CBD" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRCP, EUS for CBD stones" },
    ],
    extensions: [],
    nextTopics: ["obstructive-jaundice", "cholangitis"],
    prevTopics: ["cholelithiasis"],
  },

  "cholangitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Biliary tree anatomy" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Ascending biliary sepsis" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "Biliary organisms — E. coli, Klebsiella, Enterococcus" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: dilated CBD; ERCP" },
      { subject: "pathology", topic: "general-pathology/shock-pathology", relationship: "parallel", label: "Septic shock in cholangitis" },
    ],
    extensions: [],
    nextTopics: ["obstructive-jaundice"],
    prevTopics: ["choledocholithiasis"],
  },

  "obstructive-jaundice": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Biliary tree anatomy (intrahepatic/extrahepatic)" },
      { subject: "physiology", topic: "gi-physiology/liver-functions-physiology", relationship: "prerequisite", label: "Bilirubin metabolism" },
      { subject: "pathology", topic: "general-topics/bilirubin-metabolism", relationship: "prerequisite", label: "Conjugated vs unconjugated jaundice" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG, MRCP, CT for level of obstruction" },
    ],
    extensions: [],
    nextTopics: ["choledocholithiasis", "pancreatic-cancer", "cholangitis"],
    prevTopics: ["liver-anatomy"],
  },

  "bile-duct-injury": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Strasberg classification — biliary anatomy variations" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRCP, ERCP for injury mapping" },
    ],
    extensions: [],
    nextTopics: ["biliary-stricture"],
    prevTopics: ["acute-cholecystitis"],
  },

  "biliary-stricture": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Bismuth classification — biliary anatomy" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRCP for stricture characterization" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["bile-duct-injury"],
  },

  "biliary-dyskinesia": {
    foundations: [
      { subject: "physiology", topic: "gi-physiology/liver-functions-physiology", relationship: "prerequisite", label: "Gallbladder motility & CCK" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "HIDA scan with CCK stimulation" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["cholelithiasis"],
  },

  "choledochal-cyst": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Biliary anatomy — Todani classification" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG, MRCP: cystic biliary dilatation" },
    ],
    extensions: [
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "extension", label: "Cholangiocarcinoma risk" },
    ],
    nextTopics: [],
    prevTopics: ["liver-anatomy"],
  },

  "gallbladder-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Gallbladder — segment IVb/V involvement" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Adenocarcinoma pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: gallbladder mass, liver invasion" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Gemcitabine + cisplatin" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["cholelithiasis"],
  },

  "hepatocellular-carcinoma": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Couinaud segments for resection planning" },
      { subject: "pathology", topic: "gi-pathology/hepatitis-pathology", relationship: "prerequisite", label: "Chronic hepatitis & cirrhosis → HCC" },
      { subject: "pathology", topic: "gi-pathology/alcoholic-liver-disease-path", relationship: "prerequisite", label: "Alcoholic cirrhosis → HCC" },
    ],
    clinical: [
      { subject: "microbiology", topic: "virology/hepatitis-b-virus", relationship: "parallel", label: "HBV as HCC risk factor" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: arterial enhancement & venous washout (LI-RADS)" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Sorafenib, atezolizumab+bevacizumab" },
    ],
    extensions: [],
    nextTopics: ["liver-transplant-indications", "liver-metastases"],
    prevTopics: ["liver-anatomy", "portal-hypertension"],
  },

  "liver-abscess": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Liver anatomy — right lobe predominance" },
      { subject: "anatomy", topic: "abdomen/portal-vein-anatomy", relationship: "prerequisite", label: "Portal vein route of infection" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/gi-infections-micro", relationship: "parallel", label: "Pyogenic — E. coli, Klebsiella" },
      { subject: "microbiology", topic: "general-topics/agents-causative-infectious", relationship: "parallel", label: "Amoebic — E. histolytica" },
      { subject: "pharmacology", topic: "antimicrobials/antiamoebic-drugs", relationship: "parallel", label: "Metronidazole for amoebic abscess" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: hypoechoic lesion, anchovy sauce pus" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["liver-anatomy"],
  },

  "hydatid-cyst": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Liver anatomy — right lobe predominance" },
      { subject: "microbiology", topic: "general-topics/agents-causative-infectious", relationship: "prerequisite", label: "Echinococcus granulosus lifecycle" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: Gharbi classification; CT: daughter cysts" },
      { subject: "pharmacology", topic: "antimicrobials/antiamoebic-drugs", relationship: "parallel", label: "Albendazole preoperative" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["liver-anatomy"],
  },

  "liver-metastases": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Hepatic segmental anatomy for resection" },
      { subject: "anatomy", topic: "abdomen/portal-vein-anatomy", relationship: "prerequisite", label: "Portal venous drainage — metastatic route" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: multiple hypodense lesions; MRI with Primovist" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Conversion chemotherapy (FOLFOX)" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["colorectal-cancer", "hepatocellular-carcinoma"],
  },

  "liver-transplant-indications": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Liver vascular anatomy for transplant" },
      { subject: "physiology", topic: "blood-immunity/adaptive-immunity", relationship: "prerequisite", label: "HLA matching & rejection" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/immunosuppressants-pharmacology", relationship: "parallel", label: "Tacrolimus, MMF post-transplant" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["hepatocellular-carcinoma", "portal-hypertension", "organ-transplantation"],
  },

  "portal-hypertension": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/portal-vein-anatomy", relationship: "prerequisite", label: "Portal venous system & portosystemic anastomoses" },
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Sinusoidal architecture" },
      { subject: "physiology", topic: "gi-physiology/liver-functions-physiology", relationship: "prerequisite", label: "Hepatic sinusoidal pressure" },
    ],
    clinical: [
      { subject: "pathology", topic: "gi-pathology/alcoholic-liver-disease-path", relationship: "parallel", label: "Cirrhosis causing portal HTN" },
      { subject: "pharmacology", topic: "cardiovascular-drugs/antihypertensives-overview", relationship: "parallel", label: "Beta-blockers (propranolol) for variceal prophylaxis" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Doppler USG portal vein, CT: varices, splenomegaly" },
    ],
    extensions: [],
    nextTopics: ["upper-gi-bleeding", "spleen-surgical"],
    prevTopics: ["liver-anatomy"],
  },

  "spleen-surgical": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "Splenic artery & vein anatomy" },
      { subject: "physiology", topic: "blood-immunity/innate-immunity", relationship: "prerequisite", label: "Splenic immune function" },
    ],
    clinical: [
      { subject: "microbiology", topic: "immunology/vaccines-immunology", relationship: "parallel", label: "Post-splenectomy vaccination (pneumococcal, meningococcal)" },
      { subject: "pathology", topic: "hematopathology/hemolytic-anemias-path", relationship: "parallel", label: "Hereditary spherocytosis — splenectomy indication" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["portal-hypertension"],
  },

  // ===========================================================================
  // PANCREAS (3 topics)
  // ===========================================================================

  "acute-pancreatitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/duodenum-anatomy", relationship: "prerequisite", label: "Pancreatic anatomy & ductal system" },
      { subject: "anatomy", topic: "abdomen/lesser-sac", relationship: "prerequisite", label: "Lesser sac — pancreatic collections" },
      { subject: "physiology", topic: "gi-physiology/pancreatic-secretion", nmcCode: "PY4.5", relationship: "prerequisite", label: "Pancreatic enzyme secretion & activation" },
    ],
    clinical: [
      { subject: "pathology", topic: "gi-pathology/acute-pancreatitis-path", nmcCode: "PA25.1", relationship: "parallel", label: "Acute pancreatitis pathology — fat necrosis, hemorrhagic" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT severity index (Balthazar/modified CTSI)" },
      { subject: "pathology", topic: "general-pathology/shock-pathology", relationship: "parallel", label: "SIRS & organ failure in severe pancreatitis" },
    ],
    extensions: [],
    nextTopics: ["chronic-pancreatitis"],
    prevTopics: ["cholelithiasis"],
  },

  "chronic-pancreatitis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/duodenum-anatomy", relationship: "prerequisite", label: "Pancreatic duct anatomy" },
      { subject: "physiology", topic: "gi-physiology/pancreatic-secretion", relationship: "prerequisite", label: "Exocrine pancreatic function" },
      { subject: "physiology", topic: "endocrine-physiology/hypothalamic-pituitary-axis", relationship: "prerequisite", label: "Endocrine pancreas — diabetes" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "gi-pharmacology/pancreatic-enzyme-supplements", relationship: "parallel", label: "PERT for exocrine insufficiency" },
      { subject: "pharmacology", topic: "endocrine-pharmacology/oral-hypoglycemics-pharmacology", relationship: "parallel", label: "Diabetes management in CP" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: calcifications, dilated duct; MRCP" },
    ],
    extensions: [],
    nextTopics: ["pancreatic-cancer"],
    prevTopics: ["acute-pancreatitis"],
  },

  "pancreatic-cancer": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/duodenum-anatomy", relationship: "prerequisite", label: "Pancreatic head & periampullary anatomy" },
      { subject: "anatomy", topic: "abdomen/superior-mesenteric-artery", relationship: "prerequisite", label: "SMA/SMV — vascular involvement" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Ductal adenocarcinoma pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: pancreatic protocol, vascular encasement" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "FOLFIRINOX, gemcitabine + nab-paclitaxel" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["obstructive-jaundice", "chronic-pancreatitis"],
  },

  // ===========================================================================
  // HERNIA (6 topics)
  // ===========================================================================

  "inguinal-canal-anatomy": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/inguinal-region-anatomy", nmcCode: "AN44.5", relationship: "prerequisite", label: "Inguinal canal — walls, rings, Hesselbach triangle" },
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", relationship: "prerequisite", label: "Anterior abdominal wall layers" },
      { subject: "anatomy", topic: "pelvis-perineum/spermatic-cord-anatomy", relationship: "prerequisite", label: "Spermatic cord contents" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["inguinal-hernia", "femoral-hernia"],
    prevTopics: [],
  },

  "inguinal-hernia": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/inguinal-region-anatomy", nmcCode: "AN44.5", relationship: "prerequisite", label: "Inguinal canal anatomy — direct vs indirect" },
      { subject: "anatomy", topic: "pelvis-perineum/spermatic-cord-anatomy", relationship: "prerequisite", label: "Spermatic cord — hernia relations" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG for occult hernia" },
    ],
    extensions: [],
    nextTopics: ["femoral-hernia", "incisional-hernia"],
    prevTopics: ["inguinal-canal-anatomy"],
  },

  "femoral-hernia": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/femoral-triangle", nmcCode: "AN15.1", relationship: "prerequisite", label: "Femoral canal — boundaries, femoral ring" },
      { subject: "anatomy", topic: "abdomen/inguinal-region-anatomy", relationship: "prerequisite", label: "Inguinal ligament & lacunar ligament" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["inguinal-canal-anatomy"],
  },

  "incisional-hernia": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", relationship: "prerequisite", label: "Abdominal wall layers & fascial planes" },
      { subject: "anatomy", topic: "abdomen/rectus-sheath", relationship: "prerequisite", label: "Rectus sheath anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["wound-healing"],
  },

  "umbilical-hernia": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/umbilical-region", relationship: "prerequisite", label: "Umbilical anatomy & linea alba" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "hiatal-hernia": {
    foundations: [
      { subject: "anatomy", topic: "thorax/diaphragm-anatomy", nmcCode: "AN21.1", relationship: "prerequisite", label: "Esophageal hiatus & phrenoesophageal ligament" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Barium swallow: sliding vs paraesophageal" },
    ],
    extensions: [],
    nextTopics: ["gerd", "fundoplication"],
    prevTopics: ["esophageal-anatomy"],
  },

  // ===========================================================================
  // HEAD & NECK (13 topics)
  // ===========================================================================

  "thyroid-anatomy-physiology": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", nmcCode: "AN35.1", relationship: "prerequisite", label: "Thyroid gland anatomy — blood supply, RLN, parathyroids" },
      { subject: "physiology", topic: "endocrine-physiology/thyroid-hormones-physiology", nmcCode: "PY8.2", relationship: "prerequisite", label: "T3/T4 synthesis, regulation, actions" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["thyroid-swellings", "thyrotoxicosis", "thyroid-cancer"],
    prevTopics: [],
  },

  "thyroid-swellings": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid anatomy — lobes, isthmus, fascial planes" },
      { subject: "physiology", topic: "endocrine-physiology/thyroid-hormones-physiology", relationship: "prerequisite", label: "Thyroid hormone physiology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG thyroid, FNAC, thyroid scan" },
      { subject: "pathology", topic: "endocrine-pathology/graves-disease-path", relationship: "parallel", label: "Diffuse toxic goiter pathology" },
    ],
    extensions: [],
    nextTopics: ["solitary-thyroid-nodule", "thyroid-cancer", "thyrotoxicosis"],
    prevTopics: ["thyroid-anatomy-physiology"],
  },

  "thyrotoxicosis": {
    foundations: [
      { subject: "physiology", topic: "endocrine-physiology/thyroid-hormones-physiology", relationship: "prerequisite", label: "T3/T4 actions & feedback" },
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Cardiac effects of thyrotoxicosis" },
    ],
    clinical: [
      { subject: "pathology", topic: "endocrine-pathology/graves-disease-path", relationship: "parallel", label: "Graves disease pathology" },
      { subject: "pharmacology", topic: "endocrine-pharmacology/corticosteroids-pharmacology", relationship: "parallel", label: "Antithyroid drugs (carbimazole, PTU)" },
      { subject: "microbiology", topic: "immunology/b-cell-immunity", relationship: "parallel", label: "TSH receptor antibodies" },
    ],
    extensions: [],
    nextTopics: ["thyroid-swellings"],
    prevTopics: ["thyroid-anatomy-physiology"],
  },

  "solitary-thyroid-nodule": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid anatomy" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG TIRADS, FNAC, thyroid scan" },
      { subject: "pathology", topic: "endocrine-pathology/thyroid-cancer-path", relationship: "parallel", label: "FNAC — Bethesda classification" },
    ],
    extensions: [],
    nextTopics: ["thyroid-cancer"],
    prevTopics: ["thyroid-swellings"],
  },

  "thyroid-cancer": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid anatomy — RLN, lymph node levels" },
      { subject: "pathology", topic: "endocrine-pathology/thyroid-cancer-path", nmcCode: "PA32.1", relationship: "prerequisite", label: "Papillary, follicular, medullary, anaplastic thyroid cancer" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "RAI therapy, tyrosine kinase inhibitors" },
      { subject: "pathology", topic: "endocrine-pathology/men-syndromes-path", relationship: "parallel", label: "MEN2 — medullary thyroid cancer" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG neck, whole-body RAI scan" },
    ],
    extensions: [],
    nextTopics: ["neck-dissection"],
    prevTopics: ["solitary-thyroid-nodule", "thyroid-swellings"],
  },

  "thyroid-examination": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Surface anatomy of thyroid" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["thyroid-swellings"],
    prevTopics: ["thyroid-anatomy-physiology"],
  },

  "thyroid-disorders-surgical": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid surgical anatomy — Berry ligament, RLN" },
      { subject: "physiology", topic: "endocrine-physiology/thyroid-hormones-physiology", relationship: "prerequisite", label: "Thyroid function" },
    ],
    clinical: [
      { subject: "physiology", topic: "endocrine-physiology/calcium-metabolism-physiology", relationship: "parallel", label: "Post-thyroidectomy hypocalcemia" },
    ],
    extensions: [],
    nextTopics: ["thyroid-cancer", "thyrotoxicosis"],
    prevTopics: ["thyroid-anatomy-physiology"],
  },

  "thyroid-nodules-cancer": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid anatomy" },
      { subject: "pathology", topic: "endocrine-pathology/thyroid-cancer-path", relationship: "prerequisite", label: "Thyroid neoplasia pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG TIRADS, FNAC" },
    ],
    extensions: [],
    nextTopics: ["thyroid-cancer"],
    prevTopics: ["solitary-thyroid-nodule"],
  },

  "parathyroid": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Parathyroid location — posterior thyroid" },
      { subject: "physiology", topic: "endocrine-physiology/calcium-metabolism-physiology", nmcCode: "PY8.4", relationship: "prerequisite", label: "PTH & calcium metabolism" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Sestamibi scan, USG neck" },
      { subject: "pathology", topic: "endocrine-pathology/men-syndromes-path", relationship: "parallel", label: "MEN1 — parathyroid adenoma" },
    ],
    extensions: [],
    nextTopics: ["parathyroid-disorders"],
    prevTopics: ["thyroid-anatomy-physiology"],
  },

  "parathyroid-disorders": {
    foundations: [
      { subject: "physiology", topic: "endocrine-physiology/calcium-metabolism-physiology", relationship: "prerequisite", label: "Calcium homeostasis — PTH, calcitonin, vitamin D" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Sestamibi, 4D-CT parathyroid" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["parathyroid"],
  },

  "adrenal-glands": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/autonomic-nerves-abdomen", relationship: "prerequisite", label: "Adrenal gland anatomy & blood supply" },
      { subject: "physiology", topic: "endocrine-physiology/adrenal-cortex-physiology", nmcCode: "PY8.5", relationship: "prerequisite", label: "Cortisol, aldosterone, androgens" },
      { subject: "physiology", topic: "endocrine-physiology/adrenal-medulla", relationship: "prerequisite", label: "Catecholamines (pheochromocytoma)" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: adrenal incidentaloma characterization" },
      { subject: "pathology", topic: "endocrine-pathology/men-syndromes-path", relationship: "parallel", label: "MEN2 — pheochromocytoma" },
      { subject: "pharmacology", topic: "cardiovascular-drugs/antihypertensives-overview", relationship: "parallel", label: "Alpha-blockade before pheo surgery" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "thyroglossal-cyst": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid embryology — foramen cecum to isthmus" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: midline cystic swelling" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["thyroid-anatomy-physiology"],
  },

  "branchial-cyst-cystic-hygroma": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Anterior & posterior triangle anatomy" },
      { subject: "anatomy", topic: "head-neck/cervical-fascia", relationship: "prerequisite", label: "Cervical fascia layers" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG/MRI: cystic neck mass" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "cervical-lymphadenopathy": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Cervical lymph node levels (I-VI)" },
    ],
    clinical: [
      { subject: "pathology", topic: "hematopathology/hodgkin-lymphoma-path", relationship: "parallel", label: "Hodgkin lymphoma — cervical LAP" },
      { subject: "pathology", topic: "hematopathology/non-hodgkin-lymphoma-path", relationship: "parallel", label: "NHL" },
      { subject: "microbiology", topic: "mycobacteria/tuberculin-test", relationship: "parallel", label: "Tubercular lymphadenitis" },
    ],
    extensions: [],
    nextTopics: ["neck-dissection"],
    prevTopics: [],
  },

  "neck-dissection": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Neck levels & triangles" },
      { subject: "anatomy", topic: "head-neck/accessory-nerve", relationship: "prerequisite", label: "Spinal accessory nerve (CN XI)" },
      { subject: "anatomy", topic: "head-neck/carotid-sheath", relationship: "prerequisite", label: "Carotid sheath & IJV" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["oral-cancer", "thyroid-cancer"],
  },

  "oral-cancer": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Lymphatic drainage of oral cavity" },
      { subject: "anatomy", topic: "head-neck/facial-nerve-anatomy", relationship: "prerequisite", label: "Marginal mandibular nerve" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Oral SCC pathology" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Cisplatin-based chemoRT" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRI for DOI, CT for nodes" },
    ],
    extensions: [],
    nextTopics: ["neck-dissection", "leukoplakia"],
    prevTopics: ["leukoplakia"],
  },

  "leukoplakia": {
    foundations: [
      { subject: "pathology", topic: "general-pathology/cellular-adaptations", relationship: "prerequisite", label: "Dysplasia & premalignant changes" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["oral-cancer"],
    prevTopics: [],
  },

  "parotid-tumors": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/parotid-gland-anatomy", relationship: "prerequisite", label: "Parotid gland — facial nerve, retromandibular vein" },
      { subject: "anatomy", topic: "head-neck/facial-nerve-anatomy", relationship: "prerequisite", label: "Facial nerve branches through parotid" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "MRI parotid, FNAC" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "parallel", label: "Pleomorphic adenoma, Warthin tumor, mucoepidermoid" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["salivary-glands"],
  },

  "salivary-glands": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/parotid-gland-anatomy", relationship: "prerequisite", label: "Salivary gland anatomy — parotid, submandibular, sublingual" },
      { subject: "physiology", topic: "gi-physiology/salivary-secretion", nmcCode: "PY4.1", relationship: "prerequisite", label: "Salivary secretion physiology" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["parotid-tumors"],
    prevTopics: [],
  },

  "cleft-lip-palate": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/facial-muscles", relationship: "prerequisite", label: "Facial development embryology" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  // ===========================================================================
  // BREAST (6 topics)
  // ===========================================================================

  "breast-anatomy-examination": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/axilla", nmcCode: "AN9.1", relationship: "prerequisite", label: "Axillary anatomy — levels of lymph nodes" },
      { subject: "anatomy", topic: "thorax/intercostal-muscles", relationship: "prerequisite", label: "Chest wall & pectoralis major" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["benign-breast-disease", "breast-cancer"],
    prevTopics: [],
  },

  "benign-breast-disease": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/axilla", relationship: "prerequisite", label: "Breast anatomy" },
      { subject: "physiology", topic: "endocrine-physiology/reproductive-hormones-female", relationship: "prerequisite", label: "Estrogen & progesterone on breast" },
      { subject: "pathology", topic: "reproductive-pathology/fibrocystic-changes", relationship: "prerequisite", label: "Fibrocystic changes pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Mammography, USG breast (BI-RADS)" },
    ],
    extensions: [],
    nextTopics: ["breast-cancer"],
    prevTopics: ["breast-anatomy-examination"],
  },

  "breast-cancer": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/axilla", relationship: "prerequisite", label: "Axillary lymph node levels (I, II, III)" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "IDC, ILC, DCIS — breast cancer types" },
      { subject: "pathology", topic: "general-pathology/tumor-genetics", relationship: "prerequisite", label: "BRCA1/2, HER2, ER/PR" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "AC-T, trastuzumab, tamoxifen" },
      { subject: "pharmacology", topic: "chemotherapy/alkylating-agents", relationship: "parallel", label: "Cyclophosphamide in breast cancer" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Mammography, MRI breast, PET-CT staging" },
    ],
    extensions: [],
    nextTopics: ["breast-reconstruction", "neck-dissection"],
    prevTopics: ["benign-breast-disease", "breast-anatomy-examination"],
  },

  "breast-abscess": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/axilla", relationship: "prerequisite", label: "Breast anatomy — periareolar ductal system" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Abscess formation" },
    ],
    clinical: [
      { subject: "microbiology", topic: "general-topics/agents-causative-infectious", relationship: "parallel", label: "S. aureus in lactational abscess" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["breast-anatomy-examination"],
  },

  "nipple-discharge": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/axilla", relationship: "prerequisite", label: "Breast ductal anatomy" },
      { subject: "physiology", topic: "endocrine-physiology/reproductive-hormones-female", relationship: "prerequisite", label: "Prolactin & lactation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Ductography, USG" },
    ],
    extensions: [],
    nextTopics: ["breast-cancer"],
    prevTopics: ["breast-anatomy-examination"],
  },

  "breast-reconstruction": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/axilla", relationship: "prerequisite", label: "Chest wall anatomy for flaps" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["breast-cancer"],
  },

  // ===========================================================================
  // ENDOCRINE (7 topics - covered above in head-neck + adrenal)
  // ===========================================================================
  // thyroid-anatomy-physiology, thyroid-swellings, thyrotoxicosis,
  // solitary-thyroid-nodule, thyroid-cancer, parathyroid, adrenal-glands
  // are already mapped above

  // ===========================================================================
  // THORACIC (6 topics)
  // ===========================================================================

  "pneumothorax-hemothorax": {
    foundations: [
      { subject: "anatomy", topic: "thorax/pleura", nmcCode: "AN22.1", relationship: "prerequisite", label: "Pleural anatomy — parietal, visceral" },
      { subject: "anatomy", topic: "thorax/intercostal-muscles", relationship: "prerequisite", label: "Intercostal space — safe triangle for ICD" },
      { subject: "physiology", topic: "respiratory-physiology/mechanics-of-breathing", nmcCode: "PY6.2", relationship: "prerequisite", label: "Intrapleural pressure & lung mechanics" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CXR: absent lung markings, white-out hemithorax" },
    ],
    extensions: [],
    nextTopics: ["chest-tube-insertion", "chest-trauma"],
    prevTopics: [],
  },

  "empyema-thoracis": {
    foundations: [
      { subject: "anatomy", topic: "thorax/pleura", relationship: "prerequisite", label: "Pleural space anatomy" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Pleural suppuration stages" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/respiratory-tract-infections-micro", relationship: "parallel", label: "Pleural infection organisms" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT: loculated pleural collection" },
    ],
    extensions: [],
    nextTopics: ["chest-tube-insertion"],
    prevTopics: ["pneumothorax-hemothorax"],
  },

  "lung-cancer": {
    foundations: [
      { subject: "anatomy", topic: "thorax/lung-anatomy", nmcCode: "AN24.3", relationship: "prerequisite", label: "Lung anatomy — lobes, segments, hilum" },
      { subject: "anatomy", topic: "thorax/bronchopulmonary-segments", relationship: "prerequisite", label: "Bronchopulmonary segments for resection" },
      { subject: "anatomy", topic: "thorax/hilum-of-lung", relationship: "prerequisite", label: "Hilar structures" },
      { subject: "pathology", topic: "respiratory-pathology/lung-cancer-pathology", nmcCode: "PA30.1", relationship: "prerequisite", label: "SCC, adenocarcinoma, small cell — pathology" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Platinum-based chemo, immunotherapy" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT chest, PET-CT staging, bronchoscopy" },
      { subject: "pathology", topic: "general-pathology/paraneoplastic-syndromes", relationship: "parallel", label: "Paraneoplastic syndromes (SIADH, Cushing)" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "mediastinal-diseases": {
    foundations: [
      { subject: "anatomy", topic: "thorax/superior-mediastinum", relationship: "prerequisite", label: "Mediastinal compartments & contents" },
      { subject: "anatomy", topic: "thorax/great-vessels", relationship: "prerequisite", label: "Great vessels anatomy" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT chest: anterior/middle/posterior mass" },
      { subject: "pathology", topic: "hematopathology/hodgkin-lymphoma-path", relationship: "parallel", label: "Mediastinal lymphoma" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "thoracic-outlet-syndrome": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/brachial-plexus", relationship: "prerequisite", label: "Brachial plexus anatomy" },
      { subject: "anatomy", topic: "upper-limb/brachial-plexus-anatomy", relationship: "prerequisite", label: "Scalene triangle anatomy" },
      { subject: "anatomy", topic: "thorax/thoracic-wall", relationship: "prerequisite", label: "First rib & cervical rib" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CXR: cervical rib, CT/MR angiography" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "coronary-heart-disease-surgery": {
    foundations: [
      { subject: "anatomy", topic: "thorax/coronary-arteries", nmcCode: "AN23.4", relationship: "prerequisite", label: "Coronary artery anatomy — LAD, LCx, RCA" },
      { subject: "anatomy", topic: "thorax/heart-anatomy", relationship: "prerequisite", label: "Cardiac chambers & great vessels" },
      { subject: "physiology", topic: "cardiovascular-physiology/coronary-circulation", nmcCode: "PY5.8", relationship: "prerequisite", label: "Coronary blood flow & autoregulation" },
      { subject: "pathology", topic: "cardiovascular-pathology/atherosclerosis-pathology", nmcCode: "PA27.1", relationship: "prerequisite", label: "Atherosclerosis pathogenesis" },
      { subject: "pathology", topic: "cardiovascular-pathology/myocardial-infarction-path", relationship: "prerequisite", label: "MI pathology" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Coronary angiography, CT coronary angiogram" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  // ===========================================================================
  // TRAUMA (8 topics)
  // ===========================================================================

  "polytrauma-assessment": {
    foundations: [
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Hemodynamic assessment" },
      { subject: "physiology", topic: "respiratory-physiology/oxygen-transport", relationship: "prerequisite", label: "Oxygenation in trauma" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Trauma CT (pan-scan), FAST USG" },
      { subject: "pathology", topic: "general-pathology/shock-pathology", relationship: "parallel", label: "Hemorrhagic shock" },
    ],
    extensions: [],
    nextTopics: ["abdominal-trauma", "chest-trauma", "head-injury", "damage-control-surgery"],
    prevTopics: ["shock", "first-aid-bls"],
  },

  "first-aid-bls": {
    foundations: [
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Basic hemodynamics for resuscitation" },
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Airway anatomy for BLS" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["airway-management", "polytrauma-assessment"],
    prevTopics: [],
  },

  "airway-management": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/nasal-cavity-anatomy", relationship: "prerequisite", label: "Upper airway anatomy" },
      { subject: "anatomy", topic: "thorax/trachea-bronchi", relationship: "prerequisite", label: "Tracheal anatomy" },
      { subject: "physiology", topic: "respiratory-physiology/mechanics-of-breathing", relationship: "prerequisite", label: "Respiratory mechanics" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "cns-pharmacology/general-anesthetics", relationship: "parallel", label: "RSI drugs — suxamethonium, propofol" },
    ],
    extensions: [],
    nextTopics: ["tracheostomy"],
    prevTopics: ["first-aid-bls"],
  },

  "head-injury": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/meninges", relationship: "prerequisite", label: "Meninges — epidural, subdural, subarachnoid spaces" },
      { subject: "anatomy", topic: "head-neck/skull-bones", relationship: "prerequisite", label: "Skull vault & base fracture sites" },
      { subject: "anatomy", topic: "head-neck/cranial-fossae", relationship: "prerequisite", label: "Anterior, middle, posterior cranial fossa" },
      { subject: "physiology", topic: "cardiovascular-physiology/cerebral-circulation", relationship: "prerequisite", label: "Cerebral blood flow & autoregulation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT brain: EDH (lenticular), SDH (crescent)" },
      { subject: "pathology", topic: "neuropathology/cerebrovascular-disease-path", relationship: "parallel", label: "Intracranial hemorrhage pathology" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["polytrauma-assessment"],
  },

  "chest-trauma": {
    foundations: [
      { subject: "anatomy", topic: "thorax/pleura", relationship: "prerequisite", label: "Pleural space anatomy" },
      { subject: "anatomy", topic: "thorax/heart-anatomy", relationship: "prerequisite", label: "Pericardium — cardiac tamponade" },
      { subject: "anatomy", topic: "thorax/thoracic-wall", relationship: "prerequisite", label: "Rib fracture anatomy" },
      { subject: "physiology", topic: "respiratory-physiology/mechanics-of-breathing", relationship: "prerequisite", label: "Flail chest & paradoxical breathing" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CXR, FAST, CT chest" },
    ],
    extensions: [],
    nextTopics: ["pneumothorax-hemothorax", "chest-tube-insertion"],
    prevTopics: ["polytrauma-assessment"],
  },

  "abdominal-trauma": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/liver-anatomy", relationship: "prerequisite", label: "Liver & spleen (most injured solid organs)" },
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", relationship: "prerequisite", label: "Abdominal wall regions for injury assessment" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "FAST USG, CT abdomen with contrast" },
    ],
    extensions: [],
    nextTopics: ["damage-control-surgery"],
    prevTopics: ["polytrauma-assessment"],
  },

  "soft-tissue-injuries": {
    foundations: [
      { subject: "pathology", topic: "general-pathology/tissue-repair", relationship: "prerequisite", label: "Wound healing phases" },
      { subject: "pathology", topic: "general-pathology/acute-inflammation", relationship: "prerequisite", label: "Inflammatory response to trauma" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Wound infection prevention" },
    ],
    extensions: [],
    nextTopics: ["wound-healing"],
    prevTopics: [],
  },

  "blast-missile-injuries": {
    foundations: [
      { subject: "physiology", topic: "respiratory-physiology/mechanics-of-breathing", relationship: "prerequisite", label: "Blast lung — barotrauma" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CXR, CT for blast injuries" },
    ],
    extensions: [],
    nextTopics: ["polytrauma-assessment"],
    prevTopics: [],
  },

  // ===========================================================================
  // PROCEDURES (7 topics)
  // ===========================================================================

  "basic-surgical-skills": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/anatomical-planes-position-relation", relationship: "prerequisite", label: "Anatomical planes & positions" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["suturing-techniques", "wound-closure"],
    prevTopics: [],
  },

  "suturing-techniques": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/appendages-function-skin-structure", relationship: "prerequisite", label: "Skin layers for suture depth" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["wound-closure"],
    prevTopics: ["basic-surgical-skills"],
  },

  "wound-closure": {
    foundations: [
      { subject: "pathology", topic: "general-pathology/tissue-repair", relationship: "prerequisite", label: "Primary vs secondary vs tertiary healing" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["suturing-techniques", "wound-healing"],
  },

  "chest-tube-insertion": {
    foundations: [
      { subject: "anatomy", topic: "thorax/intercostal-muscles", relationship: "prerequisite", label: "Intercostal space — safe triangle" },
      { subject: "anatomy", topic: "thorax/pleura", relationship: "prerequisite", label: "Pleural space anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["pneumothorax-hemothorax", "chest-trauma"],
  },

  "tracheostomy": {
    foundations: [
      { subject: "anatomy", topic: "head-neck/triangles-of-neck", relationship: "prerequisite", label: "Anterior triangle — pretracheal space" },
      { subject: "anatomy", topic: "thorax/trachea-bronchi", relationship: "prerequisite", label: "Tracheal anatomy — rings, relations" },
      { subject: "anatomy", topic: "head-neck/thyroid-gland-anatomy", relationship: "prerequisite", label: "Thyroid isthmus (retract or divide)" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["airway-management"],
  },

  "damage-control-surgery": {
    foundations: [
      { subject: "physiology", topic: "cardiovascular-physiology/cardiac-output", relationship: "prerequisite", label: "Lethal triad — hypothermia, acidosis, coagulopathy" },
      { subject: "physiology", topic: "renal-physiology/acid-base-physiology", relationship: "prerequisite", label: "Metabolic acidosis in trauma" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/shock-pathology", relationship: "parallel", label: "Hemorrhagic shock" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["polytrauma-assessment", "abdominal-trauma"],
  },

  "robotic-surgery-basics": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/anterior-abdominal-wall", relationship: "prerequisite", label: "Port placement anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: ["minimally-invasive-surgery"],
  },

  // ===========================================================================
  // VASCULAR (9 topics)
  // ===========================================================================

  "arterial-disease": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", nmcCode: "AN15.6", relationship: "prerequisite", label: "Lower limb arterial supply" },
      { subject: "pathology", topic: "cardiovascular-pathology/atherosclerosis-pathology", nmcCode: "PA27.1", relationship: "prerequisite", label: "Atherosclerosis pathogenesis" },
      { subject: "physiology", topic: "cardiovascular-physiology/arterial-blood-pressure", relationship: "prerequisite", label: "Peripheral vascular resistance" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "cardiovascular-drugs/antihypertensives-overview", relationship: "parallel", label: "Antihypertensives, antiplatelets, statins" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Doppler USG, CT angiography, DSA" },
    ],
    extensions: [],
    nextTopics: ["gangrene-amputation", "diabetic-foot"],
    prevTopics: [],
  },

  "varicose-veins": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", relationship: "prerequisite", label: "Saphenous veins — GSV, SSV anatomy" },
      { subject: "anatomy", topic: "lower-limb/femoral-triangle", relationship: "prerequisite", label: "Saphenofemoral junction" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Venous duplex USG" },
    ],
    extensions: [],
    nextTopics: ["venous-disease", "dvt"],
    prevTopics: [],
  },

  "dvt": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", relationship: "prerequisite", label: "Deep venous system of lower limb" },
      { subject: "pathology", topic: "general-pathology/embolism", nmcCode: "PA11.1", relationship: "prerequisite", label: "Virchow triad & thromboembolism" },
      { subject: "physiology", topic: "blood-immunity/platelets-physiology", relationship: "prerequisite", label: "Coagulation cascade" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Venous duplex USG, D-dimer" },
      { subject: "pathology", topic: "hematopathology/coagulation-disorders-path", relationship: "parallel", label: "Thrombophilia workup" },
    ],
    extensions: [],
    nextTopics: ["dvt-pulmonary-embolism"],
    prevTopics: [],
  },

  "dvt-pulmonary-embolism": {
    foundations: [
      { subject: "anatomy", topic: "thorax/lung-anatomy", relationship: "prerequisite", label: "Pulmonary vasculature" },
      { subject: "pathology", topic: "general-pathology/embolism", relationship: "prerequisite", label: "Pulmonary thromboembolism pathology" },
      { subject: "physiology", topic: "respiratory-physiology/oxygen-transport", relationship: "prerequisite", label: "V/Q mismatch in PE" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CTPA (CT pulmonary angiography)" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["dvt"],
  },

  "venous-disease": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", relationship: "prerequisite", label: "Venous anatomy of lower limb" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["varicose-veins", "dvt"],
    prevTopics: [],
  },

  "diabetic-foot": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", relationship: "prerequisite", label: "Foot arterial supply (ATA, PTA, dorsalis pedis)" },
      { subject: "anatomy", topic: "lower-limb/foot-arches", relationship: "prerequisite", label: "Foot anatomy" },
      { subject: "anatomy", topic: "lower-limb/nerves-lower-limb", relationship: "prerequisite", label: "Peripheral nerve distribution (neuropathy)" },
      { subject: "pathology", topic: "cardiovascular-pathology/atherosclerosis-pathology", relationship: "prerequisite", label: "Diabetic microangiopathy" },
    ],
    clinical: [
      { subject: "microbiology", topic: "systemic-infections/biofilm-infections", relationship: "parallel", label: "Polymicrobial infection in diabetic foot" },
      { subject: "pharmacology", topic: "endocrine-pharmacology/oral-hypoglycemics-pharmacology", relationship: "parallel", label: "Glycemic control" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray foot (osteomyelitis), Doppler" },
    ],
    extensions: [],
    nextTopics: ["gangrene-amputation"],
    prevTopics: ["arterial-disease"],
  },

  "gangrene-amputation": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", relationship: "prerequisite", label: "Arterial supply for amputation level" },
      { subject: "pathology", topic: "general-pathology/necrosis-types", relationship: "prerequisite", label: "Dry vs wet gangrene pathology" },
      { subject: "pathology", topic: "general-pathology/infarction", relationship: "prerequisite", label: "Tissue ischemia" },
    ],
    clinical: [
      { subject: "microbiology", topic: "general-topics/agents-causative-infectious", relationship: "parallel", label: "Gas gangrene — Clostridium" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["arterial-disease", "diabetic-foot"],
  },

  "lymphatic-system": {
    foundations: [
      { subject: "anatomy", topic: "thorax/thoracic-duct", relationship: "prerequisite", label: "Thoracic duct anatomy" },
      { subject: "physiology", topic: "cardiovascular-physiology/lymphatic-system", relationship: "prerequisite", label: "Lymphatic circulation physiology" },
    ],
    clinical: [
      { subject: "pathology", topic: "general-pathology/edema-pathology", relationship: "parallel", label: "Lymphedema pathology" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "vascular-trauma": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/blood-supply-lower-limb", relationship: "prerequisite", label: "Major arterial anatomy" },
      { subject: "anatomy", topic: "upper-limb/blood-supply-upper-limb", relationship: "prerequisite", label: "Upper limb vascular anatomy" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT angiography" },
    ],
    extensions: [],
    nextTopics: ["gangrene-amputation"],
    prevTopics: ["polytrauma-assessment"],
  },

  // ===========================================================================
  // UROLOGY (11 topics)
  // ===========================================================================

  "urinary-symptoms-investigations": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/urinary-bladder-anatomy", nmcCode: "AN48.1", relationship: "prerequisite", label: "Bladder anatomy" },
      { subject: "anatomy", topic: "pelvis-perineum/male-urethra", relationship: "prerequisite", label: "Male urethra anatomy" },
      { subject: "physiology", topic: "renal-physiology/renal-function-tests", relationship: "prerequisite", label: "Renal function tests" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG KUB, IVU, CT urogram" },
    ],
    extensions: [],
    nextTopics: ["urolithiasis", "bph", "urinary-retention"],
    prevTopics: [],
  },

  "urolithiasis": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/urinary-bladder-anatomy", relationship: "prerequisite", label: "Ureteric anatomy — sites of constriction" },
      { subject: "physiology", topic: "renal-physiology/glomerular-filtration", relationship: "prerequisite", label: "Renal handling of calcium, urate, oxalate" },
      { subject: "physiology", topic: "renal-physiology/urine-concentration-dilution", relationship: "prerequisite", label: "Urine supersaturation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "CT KUB (non-contrast), USG" },
      { subject: "pharmacology", topic: "cardiovascular-drugs/diuretics-pharmacology", relationship: "parallel", label: "Thiazides for calcium stones" },
    ],
    extensions: [],
    nextTopics: ["urinary-retention"],
    prevTopics: ["urinary-symptoms-investigations"],
  },

  "bph": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/urinary-bladder-anatomy", relationship: "prerequisite", label: "Prostate & bladder neck anatomy" },
      { subject: "physiology", topic: "endocrine-physiology/reproductive-hormones-male", relationship: "prerequisite", label: "DHT & prostatic growth" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "autonomic-pharmacology/alpha-blockers", relationship: "parallel", label: "Tamsulosin, 5-alpha reductase inhibitors" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG prostate, uroflowmetry" },
      { subject: "pathology", topic: "reproductive-pathology/prostate-cancer-path", relationship: "parallel", label: "Differentiate BPH from prostate cancer" },
    ],
    extensions: [],
    nextTopics: ["urinary-retention"],
    prevTopics: ["urinary-symptoms-investigations"],
  },

  "urinary-retention": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/urinary-bladder-anatomy", relationship: "prerequisite", label: "Bladder & prostate anatomy" },
      { subject: "physiology", topic: "cns-physiology/autonomic-nervous-system-physiology", relationship: "prerequisite", label: "Micturition reflex" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG: post-void residual" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["bph", "urolithiasis"],
  },

  "hydrocele": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/spermatic-cord-anatomy", relationship: "prerequisite", label: "Tunica vaginalis & processus vaginalis" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG scrotum: transillumination" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "torsion-testis": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/spermatic-cord-anatomy", relationship: "prerequisite", label: "Spermatic cord — testicular artery, bell-clapper deformity" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "Color Doppler USG: absent blood flow" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "undescended-testis": {
    foundations: [
      { subject: "anatomy", topic: "abdomen/inguinal-region-anatomy", relationship: "prerequisite", label: "Inguinal canal & testicular descent path" },
      { subject: "physiology", topic: "endocrine-physiology/reproductive-hormones-male", relationship: "prerequisite", label: "Testosterone & testicular descent" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG, MRI for intra-abdominal testis" },
      { subject: "pathology", topic: "reproductive-pathology/testicular-tumors-path", relationship: "parallel", label: "Increased malignancy risk" },
    ],
    extensions: [],
    nextTopics: ["testicular-tumors"],
    prevTopics: [],
  },

  "testicular-tumors": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/spermatic-cord-anatomy", relationship: "prerequisite", label: "Testicular anatomy & lymphatic drainage (para-aortic)" },
      { subject: "pathology", topic: "reproductive-pathology/testicular-tumors-path", nmcCode: "PA33.1", relationship: "prerequisite", label: "Seminoma vs NSGCT pathology" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "BEP chemotherapy" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "USG scrotum, CT staging, tumor markers" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["undescended-testis"],
  },

  "carcinoma-penis": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/penis-anatomy", relationship: "prerequisite", label: "Penile anatomy & inguinal lymphatics" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Penile SCC pathology" },
    ],
    clinical: [
      { subject: "microbiology", topic: "virology/viral-pathogenesis", relationship: "parallel", label: "HPV in penile SCC" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["phimosis-paraphimosis"],
  },

  "phimosis-paraphimosis": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/penis-anatomy", relationship: "prerequisite", label: "Prepuce anatomy" },
    ],
    clinical: [],
    extensions: [],
    nextTopics: ["carcinoma-penis"],
    prevTopics: [],
  },

  "urethral-stricture": {
    foundations: [
      { subject: "anatomy", topic: "pelvis-perineum/male-urethra", relationship: "prerequisite", label: "Male urethra — prostatic, membranous, bulbar, penile" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "RGU & MCU for stricture delineation" },
    ],
    extensions: [],
    nextTopics: ["urinary-retention"],
    prevTopics: [],
  },

  // ===========================================================================
  // ORTHOPEDIC PRINCIPLES (4 topics)
  // ===========================================================================

  "fracture-principles": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/anatomical-bone-given-important", relationship: "prerequisite", label: "Bone anatomy & blood supply" },
      { subject: "pathology", topic: "general-pathology/tissue-repair", relationship: "prerequisite", label: "Fracture healing — callus formation" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: fracture classification, alignment" },
    ],
    extensions: [],
    nextTopics: ["bone-tumors"],
    prevTopics: [],
  },

  "bone-tumors": {
    foundations: [
      { subject: "anatomy", topic: "general-topics/anatomical-bone-given-important", relationship: "prerequisite", label: "Bone anatomy — metaphysis, diaphysis, epiphysis" },
      { subject: "pathology", topic: "general-pathology/neoplasia-overview", relationship: "prerequisite", label: "Bone tumor classification" },
      { subject: "pathology", topic: "general-pathology/tumor-nomenclature", relationship: "prerequisite", label: "Osteosarcoma, Ewing, chondrosarcoma" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: sunburst, onion-peel; MRI for extent" },
      { subject: "pharmacology", topic: "chemotherapy/principles-of-chemotherapy", relationship: "parallel", label: "Neoadjuvant chemo for osteosarcoma" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: ["fracture-principles"],
  },

  "joint-diseases": {
    foundations: [
      { subject: "anatomy", topic: "lower-limb/hip-joint", relationship: "prerequisite", label: "Hip joint anatomy" },
      { subject: "anatomy", topic: "lower-limb/knee-joint", relationship: "prerequisite", label: "Knee joint anatomy" },
      { subject: "pathology", topic: "general-pathology/chronic-inflammation", relationship: "prerequisite", label: "Rheumatoid arthritis pathology" },
    ],
    clinical: [
      { subject: "pharmacology", topic: "autacoids-nsaids/nsaids", relationship: "parallel", label: "NSAIDs, DMARDs" },
      { subject: "radiology", topic: "general", relationship: "parallel", label: "X-ray: joint space, erosions; MRI" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "peripheral-nerve-injuries": {
    foundations: [
      { subject: "anatomy", topic: "upper-limb/nerves-upper-limb", relationship: "prerequisite", label: "Upper limb nerve anatomy — median, ulnar, radial" },
      { subject: "anatomy", topic: "lower-limb/nerves-lower-limb", relationship: "prerequisite", label: "Lower limb nerve anatomy — sciatic, femoral, CPN" },
      { subject: "anatomy", topic: "upper-limb/brachial-plexus-anatomy", relationship: "prerequisite", label: "Brachial plexus anatomy" },
      { subject: "physiology", topic: "nerve-muscle/nerve-conduction", nmcCode: "PY10.4", relationship: "prerequisite", label: "Nerve conduction & degeneration" },
    ],
    clinical: [
      { subject: "radiology", topic: "general", relationship: "parallel", label: "NCS/EMG, MRI neurography" },
    ],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  // ===========================================================================
  // CASES & GRINDE MAPS (non-clinical topic dirs — minimal mapping)
  // ===========================================================================

  "cases": {
    foundations: [],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

  "grinde-maps": {
    foundations: [],
    clinical: [],
    extensions: [],
    nextTopics: [],
    prevTopics: [],
  },

};