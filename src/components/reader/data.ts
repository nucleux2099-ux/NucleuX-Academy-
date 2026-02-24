export const topicData = {
  id: "gastric-cancer",
  title: "Gastric Cancer: Surgical Management",
  subtitle: "A comprehensive guide to diagnosis, staging, and treatment",
  source: {
    book: "Maingot's Abdominal Operations",
    edition: "12th Edition",
    chapter: "Chapter 22",
    pages: "521-548",
  },
  category: "Surgery",
  readTime: 25,
  rating: 4.9,
  totalRatings: 128,
  lastUpdated: "2026-02-01",
  progress: 65,
  isBookmarked: true,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: `Gastric cancer remains one of the leading causes of cancer-related mortality worldwide. Despite declining incidence in Western countries, it continues to pose significant challenges in diagnosis and management.

**Epidemiology**

Gastric cancer shows marked geographic variation:
• **High incidence areas:** Japan, Korea, Eastern Europe, South America
• **Low incidence areas:** North America, Western Europe, Africa

The intestinal type is more common in high-incidence areas and is associated with environmental factors, while the diffuse type shows more uniform distribution globally.

**Risk Factors**

Understanding risk factors is crucial for prevention and early detection:

| Factor | Relative Risk |
|--------|---------------|
| H. pylori infection | 3-6x |
| Family history | 2-3x |
| Previous gastric surgery | 2-4x |
| Pernicious anemia | 2-3x |
| Blood type A | 1.2x |

The declining incidence in Western countries correlates with improved food preservation (refrigeration), decreased smoking, and successful H. pylori treatment.`,
    },
    {
      id: "classification",
      title: "Classification & Staging",
      content: `## Lauren Classification

The Lauren classification remains clinically relevant for treatment planning:

**Intestinal Type (50-60%)**
• Well-differentiated glandular structures
• Often preceded by intestinal metaplasia
• Better prognosis
• More common in elderly males
• Responds better to chemotherapy

**Diffuse Type (30-40%)**
• Poorly cohesive cells infiltrating the gastric wall
• "Signet ring" cells characteristic
• Linitis plastica (leather bottle stomach) variant
• Worse prognosis
• Earlier age of onset
• Requires wider surgical margins (6cm vs 5cm)

**Mixed Type (10%)**
• Features of both types
• Prognosis intermediate

---

## TNM Staging (8th Edition)

Accurate staging is fundamental to treatment planning.

### T Stage (Primary Tumor)

| Stage | Definition |
|-------|------------|
| Tis | Carcinoma in situ |
| T1a | Lamina propria or muscularis mucosae |
| T1b | Submucosa |
| T2 | Muscularis propria |
| T3 | Subserosa |
| T4a | Serosa (visceral peritoneum) |
| T4b | Adjacent structures |

### N Stage (Regional Nodes)

**Critical Point:** Minimum 15 lymph nodes required for accurate staging.

| Stage | Nodes Involved |
|-------|----------------|
| N0 | No metastasis |
| N1 | 1-2 nodes |
| N2 | 3-6 nodes |
| N3a | 7-15 nodes |
| N3b | >15 nodes |

### M Stage
• **M0:** No distant metastasis
• **M1:** Distant metastasis present`,
    },
    {
      id: "surgical-principles",
      title: "Surgical Principles",
      content: `## Goals of Curative Surgery

1. **Complete (R0) resection** — No residual tumor
2. **Adequate lymphadenectomy** — D2 dissection standard
3. **Safe anastomosis** — Minimize leaks
4. **Functional preservation** — When oncologically safe

## Extent of Gastrectomy

### Distal/Subtotal Gastrectomy

**Indications:**
• Antral and distal body tumors
• Intestinal type histology
• Ability to achieve 5cm proximal margin

**Advantages:**
• Preserves gastric reservoir function
• Better nutritional outcomes
• Lower morbidity
• Quality of life benefits

**Reconstruction Options:**
• Billroth I (gastroduodenostomy) — limited use
• Billroth II (gastrojejunostomy)
• Roux-en-Y gastrojejunostomy — preferred

---

### Total Gastrectomy

**Indications:**
• Proximal tumors
• Diffuse type (need 6cm margin)
• Linitis plastica
• Multifocal disease
• Hereditary diffuse gastric cancer (HDGC)

**Technical Points:**
• Complete removal of stomach with 2-5cm esophageal margin
• Splenectomy only for direct invasion (not routine)
• Roux-en-Y esophagojejunostomy reconstruction
• Consider jejunal pouch for improved quality of life

> "If you cannot achieve a 5cm proximal margin with subtotal gastrectomy, proceed to total gastrectomy. Never compromise margins."
> — **Dr. Keiichi Maruyama**, National Cancer Center Japan

---

## Lymphadenectomy

### D1 Dissection
Perigastric nodes along lesser and greater curvatures (stations 1-6)

### D2 Dissection (Standard of Care)
D1 + nodes along:
• Left gastric artery (station 7)
• Common hepatic artery (station 8)
• Celiac axis (station 9)
• Splenic hilum (station 10)
• Splenic artery (station 11)

**Evidence:** DUTCH trial showed D2 with experienced surgeons had similar mortality to D1 but better locoregional control.`,
    },
    {
      id: "multimodal-therapy",
      title: "Multimodal Therapy",
      content: `## Perioperative Chemotherapy

### FLOT Regimen (Current Standard)

Based on FLOT4 trial showing superiority over ECF/ECX:

| Agent | Dose | Schedule |
|-------|------|----------|
| 5-Fluorouracil | 2600 mg/m² | 24h infusion |
| Leucovorin | 200 mg/m² | Day 1 |
| Oxaliplatin | 85 mg/m² | Day 1 |
| Docetaxel | 50 mg/m² | Day 1 |

**Schedule:** 4 cycles preop + 4 cycles postop (q2 weeks)

**FLOT4 Results:**
• Overall survival: 50 months (FLOT) vs 35 months (ECF)
• Pathologic complete response: 16% vs 6%
• R0 resection rate: 85% vs 78%

---

## Adjuvant Options

### Chemoradiation (Macdonald Protocol)
• 5-FU/leucovorin + 45Gy radiation
• For patients who did not receive neoadjuvant therapy
• Particularly if <D2 lymphadenectomy

### Adjuvant Chemotherapy
• S-1 monotherapy (Asian data)
• XELOX (Western option)
• Duration: 6-12 months

---

## Targeted Therapy

### HER2+ Disease (~15-20%)
• **Trastuzumab** added to chemotherapy
• ToGA trial: improved survival in metastatic setting
• Testing recommended for all advanced cases

### Immunotherapy
• **Nivolumab** (anti-PD-1) showing promise
• CheckMate 649: first-line in combination with chemo
• PD-L1 CPS score guides selection`,
    },
    {
      id: "prognosis",
      title: "Prognosis & Follow-up",
      content: `## Stage-Specific Survival

| Stage | 5-Year Survival | Notes |
|-------|-----------------|-------|
| IA | 94% | T1N0 — Consider endoscopic resection |
| IB | 88% | T1N1 or T2N0 |
| IIA | 82% | T1N2 or T2N1 or T3N0 |
| IIB | 69% | T1N3a or T2N2 or T3N1 or T4aN0 |
| IIIA | 54% | Various T3-4, N1-2 combinations |
| IIIB | 36% | T3N3a or T4aN3a or T4bN1-2 |
| IIIC | 18% | T4aN3b or T4bN3 |
| IV | <5% | Any T, any N, M1 |

## Prognostic Factors

**Favorable:**
• Intestinal type histology
• Distal tumor location
• <4 positive nodes
• Complete (R0) resection
• Response to neoadjuvant therapy

**Unfavorable:**
• Diffuse/signet ring histology
• Linitis plastica
• Positive margins (R1/R2)
• Peritoneal involvement
• Poor differentiation

---

## Surveillance Protocol

| Timeframe | Investigations |
|-----------|----------------|
| Every 3-6 months (Years 1-2) | H&P, CBC, CMP, CEA |
| Every 6-12 months (Years 3-5) | H&P, CBC, CMP, CEA |
| Annually (After Year 5) | H&P, B12 levels |

**Imaging:** CT chest/abdomen/pelvis every 6-12 months for 3 years if high-risk features.

**Endoscopy:** Annual upper GI endoscopy for subtotal gastrectomy patients (stump cancer risk 1-2%).`,
    },
  ],
  keyPoints: [
    "D2 lymphadenectomy is the standard of care for curative intent",
    "FLOT is the preferred perioperative chemotherapy regimen",
    "Minimum 15 lymph nodes required for accurate staging",
    "Lauren classification guides surgical margin requirements",
    "HER2 testing recommended for all advanced cases",
  ],
  citations: [
    { id: 1, text: "D2 lymphadenectomy standard", source: "Maingot's Abdominal Operations, 12th Ed", page: "528" },
    { id: 2, text: "FLOT4 trial results", source: "Al-Batran et al., Lancet 2019;393:1948-57", page: "" },
    { id: 3, text: "TNM 8th Edition staging", source: "AJCC Cancer Staging Manual, 8th Ed", page: "203-220" },
  ],
};
