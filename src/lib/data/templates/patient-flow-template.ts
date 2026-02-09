/**
 * Patient Flow Template - Clinical Decision Pathway
 * Topic: Approach to Upper GI Bleeding
 * 
 * Interactive clinical algorithm with decision nodes
 */

// ============== TYPE DEFINITIONS ==============

export interface DecisionNode {
  id: string;
  type: 'entry' | 'decision' | 'investigation' | 'diagnosis' | 'treatment' | 'endpoint';
  title: string;
  content: string;
  isEmergency?: boolean;
  timeframe?: string;
}

export interface DecisionBranch {
  fromNodeId: string;
  toNodeId: string;
  condition: string;
  label: 'yes' | 'no' | 'option' | 'proceed';
  explanation?: string;
}

export interface ScoringSystem {
  name: string;
  purpose: string;
  components: {
    parameter: string;
    scoring: { condition: string; points: number }[];
  }[];
  interpretation: { range: string; meaning: string; action: string }[];
  reference: string;
}

export interface EmergencyFlag {
  condition: string;
  action: string;
  timeframe: string;
  rationale: string;
}

export interface PatientFlowPathway {
  id: string;
  title: string;
  entryPoint: string;
  targetAudience: string[];
  estimatedTime: number;
  lastUpdated: string;
  
  // Pathway Components
  nodes: DecisionNode[];
  branches: DecisionBranch[];
  
  // Scoring Systems
  scoringSystems: ScoringSystem[];
  
  // Emergency Protocols
  emergencyFlags: EmergencyFlag[];
  
  // Key Pathways
  pathways: {
    name: string;
    description: string;
    nodeSequence: string[];
  }[];
  
  // Learning
  learningObjectives: string[];
  clinicalPearls: string[];
  commonPitfalls: string[];
  
  // References
  references: string[];
}

// ============== SAMPLE CONTENT ==============

export const upperGIBleedingFlow: PatientFlowPathway = {
  id: "FLOW-GI-UGIB-001",
  title: "Approach to Upper Gastrointestinal Bleeding",
  entryPoint: "Patient with hematemesis, melena, or coffee-ground vomiting",
  targetAudience: ["Internship", "NEET-PG", "DNB", "Emergency Medicine"],
  estimatedTime: 45,
  lastUpdated: "2024-12-15",
  
  nodes: [
    // ENTRY NODE
    {
      id: "N1",
      type: "entry",
      title: "🚨 Patient Presents with UGIB",
      content: `**Presenting Features:**
- Hematemesis (fresh blood or coffee-ground)
- Melena (black tarry stools)
- Hematochezia (if massive UGIB)
- Signs of hypovolemia

**Initial Actions:**
1. Secure airway (especially if altered consciousness)
2. 2 large bore IV cannulas (16-18G)
3. Type and crossmatch 4-6 units
4. Foley catheter for urine output monitoring
5. NGT placement (controversial but can help)`,
      isEmergency: true,
      timeframe: "0-5 minutes"
    },
    
    // DECISION: HEMODYNAMIC STATUS
    {
      id: "N2",
      type: "decision",
      title: "⚡ Assess Hemodynamic Stability",
      content: `**Hemodynamically UNSTABLE if ANY:**
- SBP <90 mmHg OR MAP <65 mmHg
- Heart rate >100/min
- Postural drop >20 mmHg systolic
- Altered consciousness
- Cool, clammy peripheries
- Urine output <0.5 mL/kg/hr
- Signs of shock

**Class of Hemorrhage:**
| Class | Blood Loss | HR | BP | Mental Status |
|-------|------------|-----|-----|---------------|
| I | <15% (<750mL) | <100 | Normal | Normal |
| II | 15-30% (750-1500) | 100-120 | Normal | Anxious |
| III | 30-40% (1500-2000) | 120-140 | ↓ | Confused |
| IV | >40% (>2000) | >140 | ↓↓ | Lethargic |`,
      isEmergency: true,
      timeframe: "5-10 minutes"
    },
    
    // UNSTABLE PATHWAY
    {
      id: "N3",
      type: "treatment",
      title: "🆘 Emergency Resuscitation",
      content: `**AGGRESSIVE RESUSCITATION:**

1. **Fluid Resuscitation**
   - Crystalloids: 1-2L bolus (NS/RL)
   - Target MAP >65 mmHg
   - Avoid over-resuscitation (dilutional coagulopathy)

2. **Blood Transfusion**
   - Restrictive strategy: Transfuse if Hb <7 g/dL
   - Liberal if: Cardiac disease, ongoing hemorrhage, shock
   - Target Hb: 7-9 g/dL
   - Massive Transfusion Protocol if >4 units in 1 hour

3. **Correct Coagulopathy**
   - FFP if INR >1.5 (target <1.5)
   - Platelets if <50,000 (target >50,000)
   - Reverse anticoagulants (Vitamin K, PCC, Idarucizumab)

4. **Vasopressors**
   - Norepinephrine if fluid-refractory
   - Consider Terlipressin if suspected variceal bleed

5. **Prokinetics (if emergent endoscopy)**
   - Erythromycin 250mg IV (improves visualization)`,
      isEmergency: true,
      timeframe: "0-30 minutes"
    },
    
    // INVESTIGATION NODE
    {
      id: "N4",
      type: "investigation",
      title: "🔬 Initial Workup",
      content: `**STAT Investigations:**
- CBC: Hb, Hct, Platelets
- Coagulation: PT/INR, aPTT
- Metabolic: Urea, Creatinine, Electrolytes
- LFTs (if liver disease suspected)
- Type and Screen → Crossmatch
- ABG (if unstable)
- ECG (especially in elderly)

**BUN:Creatinine Ratio:**
- Ratio >20:1 → Suggests upper GI source
- Blood digestion increases urea absorption

**Calculate Severity Scores:**
- Glasgow-Blatchford Score (pre-endoscopy)
- Rockall Score (post-endoscopy)`,
      timeframe: "15-30 minutes"
    },
    
    // DECISION: BLATCHFORD SCORE
    {
      id: "N5",
      type: "decision",
      title: "📊 Glasgow-Blatchford Score (GBS)",
      content: `**Pre-Endoscopy Risk Stratification**

Calculate GBS to determine need for intervention:

| Parameter | Finding | Score |
|-----------|---------|-------|
| **BUN (mmol/L)** | 6.5-7.9 | +2 |
| | 8.0-9.9 | +3 |
| | 10.0-24.9 | +4 |
| | ≥25 | +6 |
| **Hemoglobin (g/dL) - Men** | 12.0-12.9 | +1 |
| | 10.0-11.9 | +3 |
| | <10 | +6 |
| **Hemoglobin (g/dL) - Women** | 10.0-11.9 | +1 |
| | <10 | +6 |
| **Systolic BP (mmHg)** | 100-109 | +1 |
| | 90-99 | +2 |
| | <90 | +3 |
| **Other markers** | Pulse ≥100 | +1 |
| | Melena | +1 |
| | Syncope | +2 |
| | Hepatic disease | +2 |
| | Cardiac failure | +2 |

**Maximum Score: 23**`,
      timeframe: "During workup"
    },
    
    // LOW RISK (GBS 0-1)
    {
      id: "N6",
      type: "endpoint",
      title: "✅ Low Risk - Outpatient Management",
      content: `**GBS = 0:**
- <1% need intervention
- Safe for outpatient management

**Outpatient Plan:**
1. Oral PPI (Omeprazole 40mg BD)
2. Elective OGD within 24-72 hours
3. Return precautions given
4. Close follow-up arranged

**Discharge Criteria:**
- Hemodynamically stable
- No syncope
- Normal Hb
- No comorbidities
- Reliable patient with support`
    },
    
    // HIGH RISK (GBS ≥1)
    {
      id: "N7",
      type: "treatment",
      title: "🏥 Admit for Endoscopy",
      content: `**Pre-Endoscopy Medication:**

1. **IV PPI (HIGH DOSE)**
   - Pantoprazole 80mg bolus → 8mg/hr infusion
   - OR Omeprazole 80mg bolus → 8mg/hr x 72 hours
   - Continue until definitive hemostasis

2. **Prokinetics (if high-risk/poor visualization expected)**
   - Erythromycin 250mg IV 30-90 min before scope
   - Improves visualization by 35%

3. **Suspected Variceal Bleed:**
   - Terlipressin 2mg IV bolus → 1mg q4-6h (or Octreotide)
   - Prophylactic antibiotics: Ceftriaxone 1g IV OD
   - DO NOT DELAY endoscopy for these

**NPO status** for endoscopy`,
      timeframe: "Pre-endoscopy"
    },
    
    // DECISION: TIMING OF ENDOSCOPY
    {
      id: "N8",
      type: "decision",
      title: "⏱️ Timing of Endoscopy",
      content: `**Urgent Endoscopy (<12 hours):**
- Hemodynamic instability despite resuscitation
- Active hematemesis
- GBS ≥12
- Suspected variceal bleeding

**Early Endoscopy (12-24 hours):**
- Stable high-risk patients (GBS ≥1)
- Most UGIB patients fall here
- Standard of care per guidelines

**Delayed (>24 hours):**
- Low-risk, stable patients
- GBS 0, can be outpatient

**VERY URGENT (<6 hours):**
- Exsanguinating hemorrhage
- Unstable despite massive transfusion
- Consider angiography if scope impossible`,
      timeframe: "Decision point"
    },
    
    // ENDOSCOPY FINDINGS - DECISION
    {
      id: "N9",
      type: "decision",
      title: "🔍 Endoscopy: Variceal or Non-Variceal?",
      content: `**VARICEAL CAUSES (15-20%):**
- Esophageal varices
- Gastric varices
- Portal hypertensive gastropathy

**Clinical Clues for Variceal:**
- Known liver disease/cirrhosis
- Stigmata of CLD (ascites, spider nevi, splenomegaly)
- Thrombocytopenia
- Prolonged PT/INR

**NON-VARICEAL CAUSES (80-85%):**
- Peptic ulcer disease (35-50%)
- Gastritis/duodenitis (20%)
- Mallory-Weiss tear (5-15%)
- Erosive esophagitis (5-15%)
- Malignancy (2-5%)
- Dieulafoy lesion (1-2%)
- Angiodysplasia (1-2%)
- Aortoenteric fistula (rare but fatal)`
    },
    
    // VARICEAL PATHWAY
    {
      id: "N10",
      type: "treatment",
      title: "🔴 Variceal Bleed Management",
      content: `**ENDOSCOPIC THERAPY:**

1. **Esophageal Varices:**
   - Band Ligation (EVL) - Preferred
   - 6-8 bands per session
   - Repeat every 2-4 weeks until obliteration

2. **Gastric Varices:**
   - GOV1 (lesser curve extension): EVL or cyanoacrylate
   - GOV2/IGV: Cyanoacrylate glue injection
   - Consider TIPS if refractory

**MEDICAL THERAPY (continue 3-5 days):**
- Terlipressin 2mg q4-6h OR Octreotide 50μg bolus → 25-50μg/hr
- Prophylactic antibiotics: Ceftriaxone 1g OD x 7 days
- Lactulose for hepatic encephalopathy prevention

**IF REFRACTORY (fails 2 endoscopic attempts):**
- TIPS (Transjugular Intrahepatic Portosystemic Shunt)
- Salvage: Sengstaken-Blakemore tube (bridge to TIPS)
- Balloon tamponade max 24 hours`,
      isEmergency: true
    },
    
    // NON-VARICEAL PATHWAY
    {
      id: "N11",
      type: "treatment",
      title: "🟡 Non-Variceal Bleed Management",
      content: `**FORREST CLASSIFICATION FOR PEPTIC ULCERS:**

| Class | Description | Rebleed Risk | Intervention |
|-------|-------------|--------------|--------------|
| **Ia** | Spurting hemorrhage | 90% | Endoscopic Rx |
| **Ib** | Oozing hemorrhage | 50% | Endoscopic Rx |
| **IIa** | Visible vessel | 40-50% | Endoscopic Rx |
| **IIb** | Adherent clot | 20-30% | ?Remove + Treat |
| **IIc** | Flat pigmented spot | 5-10% | PPI only |
| **III** | Clean base | <5% | PPI only |

**ENDOSCOPIC HEMOSTASIS:**
1. Injection: Epinephrine 1:10,000 (dilution effect)
2. Thermal: Bipolar/heater probe, APC
3. Mechanical: Hemoclips (preferred), TC-325 powder

**DUAL THERAPY** (Injection + Thermal/Mechanical) preferred for high-risk lesions.`,
      timeframe: "During endoscopy"
    },
    
    // POST-ENDOSCOPY CARE
    {
      id: "N12",
      type: "investigation",
      title: "📋 Calculate Post-Endoscopy Rockall Score",
      content: `**Complete Rockall Score (Post-Endoscopy):**

| Variable | Finding | Score |
|----------|---------|-------|
| **Age** | <60 | 0 |
| | 60-79 | 1 |
| | ≥80 | 2 |
| **Shock** | None (SBP≥100, HR<100) | 0 |
| | Tachycardia (SBP≥100, HR≥100) | 1 |
| | Hypotension (SBP<100) | 2 |
| **Comorbidity** | None | 0 |
| | CHF, IHD, major morbidity | 2 |
| | Renal/liver failure, malignancy | 3 |
| **Diagnosis** | MW tear, no lesion | 0 |
| | All other diagnoses | 1 |
| | Upper GI malignancy | 2 |
| **Stigmata** | None, dark spot only | 0 |
| | Blood, clot, vessel, spurting | 2 |

**Interpretation:**
- Score 0-2: Low risk (rebleed 4.3%, mortality 0.1%)
- Score 3-4: Intermediate
- Score 5-6: High risk (rebleed 24%, mortality 11%)
- Score ≥7: Very high risk (mortality 22-44%)`
    },
    
    // HIGH-DOSE PPI
    {
      id: "N13",
      type: "treatment",
      title: "💊 Post-Endoscopy PPI Therapy",
      content: `**HIGH-RISK STIGMATA (Forrest Ia, Ib, IIa, IIb):**
- IV PPI infusion x 72 hours
- Pantoprazole 80mg bolus → 8mg/hr continuous infusion
- Then oral PPI BD for 2 weeks → OD for 4-8 weeks

**LOW-RISK STIGMATA (Forrest IIc, III):**
- Oral PPI BD can be started
- Early oral intake (24-48 hours)
- Shorter hospital stay

**H. pylori Testing:**
- Test ALL patients with peptic ulcer
- CLO test, histology, or stool antigen
- Treat if positive (PPI + Amox + Clarithro x 14 days)
- Confirm eradication at 4 weeks

**NSAID/Aspirin Management:**
- Stop NSAIDs if possible
- Low-dose aspirin: Restart in 3-5 days (if CV indication)
- Add PPI lifelong if NSAID/aspirin needed`
    },
    
    // REBLEEDING
    {
      id: "N14",
      type: "decision",
      title: "🔁 Rebleeding After Endoscopy?",
      content: `**Signs of Rebleeding:**
- Fresh hematemesis or melena
- Hb drop >2g/dL in 24h despite transfusion
- Hemodynamic instability
- Rising BUN
- Tachycardia, hypotension

**Risk Factors for Rebleeding:**
- Initial hemodynamic instability
- Active bleeding at endoscopy
- Large ulcer (>2cm)
- Posterior duodenal ulcer
- Lesser curve gastric ulcer
- Coagulopathy
- High Rockall score`
    },
    
    // SECOND ENDOSCOPY
    {
      id: "N15",
      type: "treatment",
      title: "🔄 Second-Look Endoscopy",
      content: `**Routine second-look NOT recommended**

**Indications for Repeat Endoscopy:**
- Clinical evidence of rebleeding
- High-risk ulcers with suboptimal initial therapy

**Management of Rebleeding:**
1. Repeat endoscopy - first-line
2. If fails → Interventional radiology (TAE)
3. If fails → Surgery

**SURGICAL OPTIONS:**
- Duodenal ulcer: Oversewing ± pyloroplasty/vagotomy
- Gastric ulcer: Wedge resection or oversewing
- Mortality of emergency surgery: 20-30%`,
      timeframe: "If rebleeding occurs"
    },
    
    // FINAL ENDPOINT: STABLE
    {
      id: "N16",
      type: "endpoint",
      title: "✅ Discharge Planning",
      content: `**Discharge Criteria:**
- Hemodynamically stable ≥48 hours
- No rebleeding
- Tolerating oral diet
- Hb stable (no transfusion needed)
- Rockall ≤2

**Discharge Medications:**
1. PPI (oral) - dose based on etiology
2. H. pylori eradication if positive
3. Stop/modify NSAIDs
4. Restart anticoagulants with GI protection

**Follow-up:**
- GI clinic in 4-6 weeks
- Repeat OGD at 8 weeks for gastric ulcers (r/o malignancy)
- H. pylori eradication confirmation`
    },
    
    // SURGERY ENDPOINT
    {
      id: "N17",
      type: "endpoint",
      title: "🔪 Surgical Intervention",
      content: `**INDICATIONS FOR SURGERY:**
- Failed endoscopic control (2 attempts)
- Hemodynamic instability despite massive transfusion
- >6 units transfused in 24 hours
- Visible vessel >2mm
- Giant ulcer (>2cm)
- Aortoenteric fistula (emergency)

**SURGICAL PROCEDURES:**
**Duodenal Ulcer:**
- Duodenotomy + oversewing of bleeder
- Consider truncal vagotomy + pyloroplasty

**Gastric Ulcer:**
- Wedge/sleeve resection with biopsy
- Partial gastrectomy if large/malignant

**Aortoenteric Fistula:**
- Emergency laparotomy
- Aortic repair + GI reconstruction
- Very high mortality (30-50%)`
    }
  ],
  
  branches: [
    // From Entry to Hemodynamic Assessment
    { fromNodeId: "N1", toNodeId: "N2", condition: "Initial stabilization done", label: "proceed" },
    
    // Hemodynamic Decision
    { fromNodeId: "N2", toNodeId: "N3", condition: "Unstable (SBP<90, HR>100, shock)", label: "yes", explanation: "Requires aggressive resuscitation before endoscopy" },
    { fromNodeId: "N2", toNodeId: "N4", condition: "Stable", label: "no", explanation: "Proceed to workup while monitoring" },
    
    // Resuscitation to Investigation
    { fromNodeId: "N3", toNodeId: "N4", condition: "After initial resuscitation", label: "proceed" },
    
    // Investigation to Blatchford
    { fromNodeId: "N4", toNodeId: "N5", condition: "Calculate risk score", label: "proceed" },
    
    // Blatchford Decision
    { fromNodeId: "N5", toNodeId: "N6", condition: "GBS = 0", label: "option", explanation: "Very low risk, safe for outpatient" },
    { fromNodeId: "N5", toNodeId: "N7", condition: "GBS ≥ 1", label: "option", explanation: "Need admission and endoscopy" },
    
    // Admission to Timing Decision
    { fromNodeId: "N7", toNodeId: "N8", condition: "Patient admitted", label: "proceed" },
    
    // Timing to Endoscopy
    { fromNodeId: "N8", toNodeId: "N9", condition: "Endoscopy performed", label: "proceed" },
    
    // Variceal vs Non-Variceal
    { fromNodeId: "N9", toNodeId: "N10", condition: "Variceal source", label: "option", explanation: "Liver disease, varices seen" },
    { fromNodeId: "N9", toNodeId: "N11", condition: "Non-variceal source", label: "option", explanation: "Peptic ulcer, erosions, etc." },
    
    // Post-treatment to Rockall
    { fromNodeId: "N10", toNodeId: "N12", condition: "Post-hemostasis", label: "proceed" },
    { fromNodeId: "N11", toNodeId: "N12", condition: "Post-hemostasis", label: "proceed" },
    
    // Rockall to PPI
    { fromNodeId: "N12", toNodeId: "N13", condition: "Continue care", label: "proceed" },
    
    // PPI to Rebleed Decision
    { fromNodeId: "N13", toNodeId: "N14", condition: "Monitor for rebleeding", label: "proceed" },
    
    // Rebleed Decision
    { fromNodeId: "N14", toNodeId: "N16", condition: "No rebleeding", label: "no", explanation: "Stable for discharge" },
    { fromNodeId: "N14", toNodeId: "N15", condition: "Rebleeding occurs", label: "yes", explanation: "Needs repeat intervention" },
    
    // Second Look Outcomes
    { fromNodeId: "N15", toNodeId: "N16", condition: "Rebleed controlled", label: "option" },
    { fromNodeId: "N15", toNodeId: "N17", condition: "Endoscopy fails", label: "option", explanation: "Consider surgery/IR" }
  ],
  
  scoringSystems: [
    {
      name: "Glasgow-Blatchford Score (GBS)",
      purpose: "Pre-endoscopy risk stratification - identifies need for intervention",
      components: [
        {
          parameter: "BUN (mmol/L)",
          scoring: [
            { condition: "<6.5", points: 0 },
            { condition: "6.5-7.9", points: 2 },
            { condition: "8.0-9.9", points: 3 },
            { condition: "10.0-24.9", points: 4 },
            { condition: "≥25", points: 6 }
          ]
        },
        {
          parameter: "Hemoglobin - Men (g/dL)",
          scoring: [
            { condition: "≥13", points: 0 },
            { condition: "12.0-12.9", points: 1 },
            { condition: "10.0-11.9", points: 3 },
            { condition: "<10", points: 6 }
          ]
        },
        {
          parameter: "Hemoglobin - Women (g/dL)",
          scoring: [
            { condition: "≥12", points: 0 },
            { condition: "10.0-11.9", points: 1 },
            { condition: "<10", points: 6 }
          ]
        },
        {
          parameter: "Systolic BP (mmHg)",
          scoring: [
            { condition: "≥110", points: 0 },
            { condition: "100-109", points: 1 },
            { condition: "90-99", points: 2 },
            { condition: "<90", points: 3 }
          ]
        },
        {
          parameter: "Other markers",
          scoring: [
            { condition: "Pulse ≥100", points: 1 },
            { condition: "Melena", points: 1 },
            { condition: "Syncope", points: 2 },
            { condition: "Hepatic disease", points: 2 },
            { condition: "Cardiac failure", points: 2 }
          ]
        }
      ],
      interpretation: [
        { range: "0", meaning: "Very low risk", action: "Consider outpatient management" },
        { range: "1-5", meaning: "Low-intermediate risk", action: "Inpatient, endoscopy within 24h" },
        { range: "6-11", meaning: "Intermediate-high risk", action: "Inpatient, endoscopy within 12-24h" },
        { range: "≥12", meaning: "High risk", action: "Urgent endoscopy <12h, consider ICU" }
      ],
      reference: "Blatchford O et al. Lancet 2000;356:1318-21"
    },
    {
      name: "Rockall Score (Complete)",
      purpose: "Post-endoscopy risk stratification - predicts rebleeding and mortality",
      components: [
        {
          parameter: "Age (years)",
          scoring: [
            { condition: "<60", points: 0 },
            { condition: "60-79", points: 1 },
            { condition: "≥80", points: 2 }
          ]
        },
        {
          parameter: "Shock",
          scoring: [
            { condition: "No shock (SBP≥100, HR<100)", points: 0 },
            { condition: "Tachycardia (SBP≥100, HR≥100)", points: 1 },
            { condition: "Hypotension (SBP<100)", points: 2 }
          ]
        },
        {
          parameter: "Comorbidity",
          scoring: [
            { condition: "None", points: 0 },
            { condition: "CHF, IHD, major morbidity", points: 2 },
            { condition: "Renal failure, liver failure, metastatic malignancy", points: 3 }
          ]
        },
        {
          parameter: "Diagnosis",
          scoring: [
            { condition: "Mallory-Weiss, no lesion seen", points: 0 },
            { condition: "All other diagnoses", points: 1 },
            { condition: "GI malignancy", points: 2 }
          ]
        },
        {
          parameter: "Stigmata of recent hemorrhage",
          scoring: [
            { condition: "None or dark spot only", points: 0 },
            { condition: "Blood, adherent clot, visible vessel, spurting", points: 2 }
          ]
        }
      ],
      interpretation: [
        { range: "0-2", meaning: "Low risk", action: "Mortality <1%, consider early discharge" },
        { range: "3-4", meaning: "Intermediate risk", action: "Rebleed 10%, Mortality 5%" },
        { range: "5-6", meaning: "High risk", action: "Rebleed 25%, Mortality 11%" },
        { range: "≥7", meaning: "Very high risk", action: "Rebleed 40%, Mortality 22-44%" }
      ],
      reference: "Rockall TA et al. Gut 1996;38:316-21"
    }
  ],
  
  emergencyFlags: [
    {
      condition: "Massive hematemesis with shock",
      action: "Activate massive transfusion protocol, call GI and surgical backup",
      timeframe: "Immediate",
      rationale: "Exsanguinating hemorrhage needs simultaneous resuscitation and source control"
    },
    {
      condition: "Suspected aortoenteric fistula",
      action: "Emergent vascular surgery consultation, prepare for laparotomy",
      timeframe: "<30 minutes",
      rationale: "Herald bleed may precede catastrophic exsanguination. High index of suspicion if prior aortic graft."
    },
    {
      condition: "Variceal bleed with encephalopathy",
      action: "Airway protection (intubation), TIPS evaluation if refractory",
      timeframe: "Immediate",
      rationale: "Aspiration risk very high, hepatic decompensation"
    },
    {
      condition: "Refractory bleeding despite 2 endoscopic attempts",
      action: "Interventional radiology for angioembolization OR emergency surgery",
      timeframe: "<1 hour after failed second attempt",
      rationale: "Further endoscopy unlikely to succeed, need alternative hemostatic approach"
    },
    {
      condition: "Transfusion requirement >6 units in 24 hours",
      action: "Consider early surgical/IR intervention regardless of endoscopic success",
      timeframe: "Ongoing assessment",
      rationale: "Massive transfusion associated with poor outcomes, early definitive control preferred"
    }
  ],
  
  pathways: [
    {
      name: "Low-Risk Outpatient Pathway",
      description: "GBS = 0, stable patient, safe for discharge with elective endoscopy",
      nodeSequence: ["N1", "N2", "N4", "N5", "N6"]
    },
    {
      name: "Standard Non-Variceal Pathway",
      description: "Most common pathway - peptic ulcer disease management",
      nodeSequence: ["N1", "N2", "N4", "N5", "N7", "N8", "N9", "N11", "N12", "N13", "N14", "N16"]
    },
    {
      name: "Variceal Bleed Pathway",
      description: "Cirrhotic patient with esophageal varices",
      nodeSequence: ["N1", "N2", "N3", "N4", "N5", "N7", "N8", "N9", "N10", "N12", "N13", "N14", "N16"]
    },
    {
      name: "Refractory Bleed → Surgery Pathway",
      description: "Failed endoscopic control requiring surgical intervention",
      nodeSequence: ["N1", "N2", "N3", "N4", "N5", "N7", "N8", "N9", "N11", "N12", "N13", "N14", "N15", "N17"]
    }
  ],
  
  learningObjectives: [
    "Perform rapid assessment of hemodynamic stability in UGIB",
    "Calculate and interpret Glasgow-Blatchford Score for risk stratification",
    "Differentiate variceal from non-variceal upper GI bleeding",
    "Apply Forrest classification to determine endoscopic intervention",
    "Calculate Complete Rockall Score for post-endoscopy risk",
    "Manage refractory bleeding with appropriate escalation"
  ],
  
  clinicalPearls: [
    "🔴 GBS = 0 is the ONLY score that predicts safe outpatient management",
    "🔵 BUN:Creatinine ratio >20:1 strongly suggests upper GI source",
    "🟢 Restrictive transfusion (Hb <7) improves outcomes vs liberal (Hb <9)",
    "🟡 Erythromycin 250mg IV before endoscopy improves visualization by 35%",
    "🔴 In varices: Antibiotics reduce mortality (Ceftriaxone 1g x 7 days)",
    "🟣 PPI infusion only benefits high-risk stigmata (Forrest Ia, Ib, IIa, IIb)"
  ],
  
  commonPitfalls: [
    "❌ Delaying resuscitation while waiting for endoscopy",
    "❌ Using hemoglobin to assess bleeding severity acutely (takes 24-72h to equilibrate)",
    "❌ Giving liberal transfusions (increases rebleeding in varices)",
    "❌ Stopping aspirin in high cardiac risk patients (restart in 3-5 days)",
    "❌ Not testing for H. pylori in ALL peptic ulcers",
    "❌ Discharging without confirming H. pylori eradication (4-week stool antigen)",
    "❌ Not repeating OGD for gastric ulcers (must r/o malignancy at 8 weeks)"
  ],
  
  references: [
    "NICE Guidelines NG141: Acute upper gastrointestinal bleeding in over 16s (2012, updated 2016)",
    "Barkun AN et al. International Consensus Guidelines on Managing Patients with NVUGIB. Ann Intern Med 2019;171:805-822",
    "de Franchis R. Baveno VII - Renewing consensus in portal hypertension. J Hepatol 2022;76:959-974",
    "Laine L, Jensen DM. Management of Patients With Ulcer Bleeding. Am J Gastroenterol 2012;107:345-60",
    "Stanley AJ et al. Comparison of risk scoring systems for UGIB. BMJ 2017;356:i6432",
    "Shackelford's Surgery of the Alimentary Tract, 9th Ed, Chapter 14: Upper GI Hemorrhage",
    "Sabiston Textbook of Surgery, 22nd Ed, Chapter 47: Stomach"
  ]
};

// ============== HELPER FUNCTIONS ==============

export function calculateBlatchfordScore(params: {
  bunMmol: number;
  hbGdl: number;
  isMale: boolean;
  sbp: number;
  pulse: number;
  hasMelena: boolean;
  hasSyncope: boolean;
  hasHepaticDisease: boolean;
  hasCardiacFailure: boolean;
}): { score: number; risk: string; recommendation: string } {
  let score = 0;
  
  // BUN scoring
  if (params.bunMmol >= 25) score += 6;
  else if (params.bunMmol >= 10) score += 4;
  else if (params.bunMmol >= 8) score += 3;
  else if (params.bunMmol >= 6.5) score += 2;
  
  // Hemoglobin scoring
  if (params.isMale) {
    if (params.hbGdl < 10) score += 6;
    else if (params.hbGdl < 12) score += 3;
    else if (params.hbGdl < 13) score += 1;
  } else {
    if (params.hbGdl < 10) score += 6;
    else if (params.hbGdl < 12) score += 1;
  }
  
  // Blood pressure
  if (params.sbp < 90) score += 3;
  else if (params.sbp < 100) score += 2;
  else if (params.sbp < 110) score += 1;
  
  // Other markers
  if (params.pulse >= 100) score += 1;
  if (params.hasMelena) score += 1;
  if (params.hasSyncope) score += 2;
  if (params.hasHepaticDisease) score += 2;
  if (params.hasCardiacFailure) score += 2;
  
  let risk: string;
  let recommendation: string;
  
  if (score === 0) {
    risk = "Very low risk (<1% need intervention)";
    recommendation = "Consider outpatient management with elective OGD";
  } else if (score <= 5) {
    risk = "Low-intermediate risk";
    recommendation = "Admit, endoscopy within 24 hours";
  } else if (score <= 11) {
    risk = "Intermediate-high risk";
    recommendation = "Admit, endoscopy within 12-24 hours";
  } else {
    risk = "High risk";
    recommendation = "Urgent endoscopy <12 hours, consider ICU";
  }
  
  return { score, risk, recommendation };
}

export function calculateRockallScore(params: {
  age: number;
  sbp: number;
  hr: number;
  comorbidity: 'none' | 'cardiac' | 'organ_failure';
  diagnosis: 'mallory_weiss' | 'other' | 'malignancy';
  stigmata: 'none' | 'blood_vessel';
}): { score: number; rebleedRisk: string; mortalityRisk: string } {
  let score = 0;
  
  // Age
  if (params.age >= 80) score += 2;
  else if (params.age >= 60) score += 1;
  
  // Shock
  if (params.sbp < 100) score += 2;
  else if (params.hr >= 100) score += 1;
  
  // Comorbidity
  if (params.comorbidity === 'organ_failure') score += 3;
  else if (params.comorbidity === 'cardiac') score += 2;
  
  // Diagnosis
  if (params.diagnosis === 'malignancy') score += 2;
  else if (params.diagnosis === 'other') score += 1;
  
  // Stigmata
  if (params.stigmata === 'blood_vessel') score += 2;
  
  let rebleedRisk: string;
  let mortalityRisk: string;
  
  if (score <= 2) {
    rebleedRisk = "4.3%";
    mortalityRisk = "<1%";
  } else if (score <= 4) {
    rebleedRisk = "10%";
    mortalityRisk = "5%";
  } else if (score <= 6) {
    rebleedRisk = "24%";
    mortalityRisk = "11%";
  } else {
    rebleedRisk = "40%";
    mortalityRisk = "22-44%";
  }
  
  return { score, rebleedRisk, mortalityRisk };
}

export default upperGIBleedingFlow;
