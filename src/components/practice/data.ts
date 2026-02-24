export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  reference: { book: string; chapter: string; page: string };
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  highYield: boolean;
  image?: string;
  imageCaption?: string;
  pyq?: { exam: string; year: number };
}

export type ConfidenceLevel = "guessing" | "unsure" | "sure" | "very-sure" | null;
export type QuizMode = "practice" | "results" | "review";

export const confidenceConfig: Record<string, { label: string; color: string; expected: number }> = {
  "guessing": { label: "Guessing", color: "#E57373", expected: 25 },
  "unsure": { label: "Unsure", color: "#C9A86C", expected: 50 },
  "sure": { label: "Sure", color: "#5BB3B3", expected: 75 },
  "very-sure": { label: "Very Sure", color: "#7BA69E", expected: 95 },
};

export const questions: Question[] = [
  {
    id: 1,
    question: "A 58-year-old male presents with progressive dysphagia to solids for 3 months and 10 kg weight loss. Endoscopy reveals an ulcerated mass at the gastroesophageal junction. Biopsy shows adenocarcinoma. CT shows no distant metastasis. What is the most appropriate next step in management?",
    options: [
      "Immediate surgical resection with D2 lymphadenectomy",
      "Staging laparoscopy followed by neoadjuvant chemotherapy",
      "Definitive chemoradiation therapy",
      "Palliative chemotherapy with best supportive care"
    ],
    correctAnswer: 1,
    explanation: `**Correct Answer: Staging laparoscopy followed by neoadjuvant chemotherapy**

For locally advanced gastric/GEJ adenocarcinoma without distant metastasis on imaging:

1. **Staging laparoscopy** is recommended to rule out peritoneal disease (present in 20-30% of patients with negative CT)

2. **Neoadjuvant chemotherapy** (FLOT regimen) is the standard of care for resectable disease:
   • Improves R0 resection rates
   • Provides survival benefit over surgery alone
   • Allows assessment of tumor response

**Why other options are incorrect:**
• **A:** Immediate surgery without neoadjuvant therapy is suboptimal for locally advanced disease
• **C:** Definitive chemoradiation is for unresectable or medically inoperable cases
• **D:** Palliative approach is premature given potentially resectable disease`,
    reference: { book: "Maingot's Abdominal Operations", chapter: "Ch. 22", page: "525" },
    topic: "Gastric Cancer",
    difficulty: "Hard",
    highYield: true,
    pyq: { exam: "NEET-PG", year: 2023 },
  },
  {
    id: 2,
    question: "Which of the following is the most important prognostic factor in gastric cancer?",
    options: ["Tumor size", "Lauren classification", "TNM stage", "HER2 status"],
    correctAnswer: 2,
    explanation: `**Correct Answer: TNM stage**

TNM staging is the most important prognostic factor:

• **Stage I:** >90% 5-year survival
• **Stage II:** 60-80% 5-year survival
• **Stage III:** 20-50% 5-year survival  
• **Stage IV:** <5% 5-year survival

**Other factors and their roles:**
• **Lauren classification:** Prognostic but less important than stage
• **Tumor size:** Not directly in TNM (T stage is depth, not size)
• **HER2 status:** Predictive for targeted therapy, not primary prognostic factor`,
    reference: { book: "AJCC Cancer Staging Manual", chapter: "8th Ed", page: "203" },
    topic: "Gastric Cancer",
    difficulty: "Easy",
    highYield: true,
    pyq: { exam: "AIIMS", year: 2022 },
  },
  {
    id: 3,
    question: "A D2 lymphadenectomy for gastric cancer includes removal of nodes along all of the following EXCEPT:",
    options: ["Left gastric artery", "Common hepatic artery", "Para-aortic region", "Splenic artery"],
    correctAnswer: 2,
    explanation: `**Correct Answer: Para-aortic region**

**D2 lymphadenectomy includes:**
• **D1 stations (1-6):** Perigastric nodes
• **Station 7:** Left gastric artery
• **Station 8:** Common hepatic artery
• **Station 9:** Celiac axis
• **Station 10:** Splenic hilum
• **Station 11:** Splenic artery

**Para-aortic nodes (Station 16)** are NOT part of standard D2 dissection:
• Included in D3/extended dissection
• No proven survival benefit
• Increased morbidity
• Consider only for clinical trials`,
    reference: { book: "Japanese Gastric Cancer Treatment Guidelines", chapter: "5th Ed", page: "10" },
    topic: "Surgical Oncology",
    difficulty: "Medium",
    highYield: true,
  },
  {
    id: 4,
    question: "The FLOT chemotherapy regimen for gastric cancer includes all of the following drugs EXCEPT:",
    options: ["Docetaxel", "Oxaliplatin", "Epirubicin", "5-Fluorouracil"],
    correctAnswer: 2,
    explanation: `**Correct Answer: Epirubicin**

**FLOT regimen components:**
• **F** - 5-Fluorouracil (2600 mg/m², 24h infusion)
• **L** - Leucovorin (200 mg/m²)
• **O** - Oxaliplatin (85 mg/m²)
• **T** - Docetaxel (Taxotere) (50 mg/m²)

**Epirubicin** is part of the older ECF/ECX regimens, which FLOT has replaced based on the FLOT4 trial showing:
• Better overall survival (50 vs 35 months)
• Higher pathologic complete response (16% vs 6%)
• Improved R0 resection rate (85% vs 78%)`,
    reference: { book: "Al-Batran et al., Lancet", chapter: "2019", page: "393:1948-57" },
    topic: "Medical Oncology",
    difficulty: "Medium",
    highYield: true,
  },
  {
    id: 5,
    question: "A 45-year-old woman with diffuse-type gastric cancer (signet ring cell) is planned for surgical resection. What is the recommended proximal margin?",
    options: ["3 cm", "4 cm", "5 cm", "6 cm"],
    correctAnswer: 3,
    explanation: `**Correct Answer: 6 cm**

Margin requirements based on Lauren classification:

| Type | Recommended Margin |
|------|-------------------|
| Intestinal | 5 cm (or 4 cm if confirmed R0 on frozen) |
| Diffuse | 6 cm |
| Mixed | 6 cm |

**Rationale for wider margins in diffuse type:**
• Submucosal spread pattern
• Ill-defined tumor borders
• Higher risk of positive margins
• Associated with worse prognosis

**Clinical Pearl:** If 5-6 cm proximal margin cannot be achieved with subtotal gastrectomy, proceed to total gastrectomy.`,
    reference: { book: "Maingot's Abdominal Operations", chapter: "Ch. 22", page: "530" },
    topic: "Surgical Oncology",
    difficulty: "Medium",
    highYield: true,
    pyq: { exam: "NEET-PG", year: 2024 },
  },
  {
    id: 6,
    question: "A 55-year-old male presents with abdominal pain and weight loss. CT scan is shown above. What is the most likely diagnosis?",
    options: ["Pancreatic adenocarcinoma", "Chronic pancreatitis", "Pancreatic pseudocyst", "Insulinoma"],
    correctAnswer: 0,
    explanation: `**Correct Answer: Pancreatic adenocarcinoma**

The CT image shows classic features of pancreatic head adenocarcinoma:

**Key Imaging Findings:**
• **Double duct sign** — Dilated CBD + dilated pancreatic duct
• **Hypodense mass** in pancreatic head
• **Upstream pancreatic atrophy**
• **Vascular encasement** (if present)

**Why other options are incorrect:**
• **Chronic pancreatitis:** Would show calcifications, irregular duct, no mass
• **Pseudocyst:** Well-defined fluid collection, not solid mass
• **Insulinoma:** Small, hypervascular tumor (not hypodense)

**Clinical Pearl:** Double duct sign in a patient >50y with painless jaundice = pancreatic cancer until proven otherwise.`,
    reference: { book: "Blumgart's Surgery of the Liver", chapter: "Ch. 45", page: "712" },
    topic: "Hepatobiliary",
    difficulty: "Medium",
    highYield: true,
    image: "/images/mcq/ct-pancreas-double-duct.jpg",
    imageCaption: "CT Abdomen (Axial view) - Note the double duct sign",
    pyq: { exam: "AIIMS", year: 2023 },
  },
];
