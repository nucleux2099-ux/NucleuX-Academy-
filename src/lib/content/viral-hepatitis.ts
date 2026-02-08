/**
 * Viral Hepatitis - Full Medical Content
 * 
 * Comprehensive content covering:
 * - Hepatitis A, B, C, D, E
 * - Serology, Natural History, Management
 * - Depth-stratified for MBBS/PG/Super Specialty
 * 
 * Sources: Sleisenger 11th Ed, Harrison's 22nd Ed
 */

export const VIRAL_HEPATITIS_CONTENT = {
  id: 'med-gi-viral-hepatitis',
  name: 'Viral Hepatitis',
  
  concepts: [
    {
      id: 'overview',
      title: 'Overview & Classification',
      depth: 'mbbs',
      icon: '🦠',
      content: `
## Definition

**Viral Hepatitis** = Inflammation of the liver caused by hepatotropic viruses

> 📚 **Source:** Sleisenger 11th Ed, Ch.80-83: Hepatitis A, B, C, D, E

---

## Classification of Hepatitis Viruses

| Virus | Family | Genome | Transmission | Chronicity |
|-------|--------|--------|--------------|------------|
| **HAV** | Picornaviridae | RNA | Fecal-oral | Never |
| **HBV** | Hepadnaviridae | DNA | Parenteral, sexual, vertical | Yes |
| **HCV** | Flaviviridae | RNA | Parenteral | Yes (70-85%) |
| **HDV** | Deltaviridae | RNA (defective) | Parenteral | Only with HBV |
| **HEV** | Hepeviridae | RNA | Fecal-oral, zoonotic | Rarely |

### Quick Memory Aid

> **"Vowels are oral, Consonants are parenteral"**
> - **A** and **E** = Fecal-**O**ral (vowels)
> - **B**, **C**, **D** = Parenteral (blood, sex)

---

## Clinical Syndromes

### Acute Hepatitis

\`\`\`
Phases:
1. Incubation period (varies by virus)
2. Pre-icteric/prodromal phase (1-2 weeks)
   - Fatigue, malaise, anorexia
   - Nausea, vomiting
   - RUQ discomfort
   - Fever (in HAV)
   
3. Icteric phase (2-4 weeks)
   - Jaundice, dark urine, pale stools
   - Pruritus
   - Hepatomegaly

4. Recovery/convalescent phase
\`\`\`

### Outcomes of Acute Hepatitis

| Outcome | Description |
|---------|-------------|
| **Complete recovery** | Most common for HAV, HEV |
| **Fulminant hepatitis** | <1% (higher in HEV pregnant, HAV elderly) |
| **Chronic hepatitis** | HBV (5-10% adults), HCV (70-85%) |
| **Carrier state** | HBV, rarely HEV |

---

## Laboratory Findings

### Typical Pattern in Acute Hepatitis

| Test | Change | Peak |
|------|--------|------|
| **ALT/AST** | ↑↑↑ (10-100x) | ALT > AST |
| **Bilirubin** | ↑ (variable) | With jaundice |
| **ALP** | Normal or ↑ (<3x) | |
| **Albumin** | Normal | Unless severe |
| **PT/INR** | Normal or ↑ | Elevated = severe |

> 💎 **Clinical Pearl**: ALT > AST in viral hepatitis; AST > ALT (>2:1) suggests alcoholic hepatitis

### Serological Diagnosis

Different markers for each virus - detailed in subsequent sections

---

## Comparison Table

| Feature | HAV | HBV | HCV | HDV | HEV |
|---------|-----|-----|-----|-----|-----|
| **Incubation** | 15-50d | 30-180d | 14-180d | 30-180d | 15-60d |
| **Onset** | Acute | Insidious | Insidious | Variable | Acute |
| **Severity** | Mild-moderate | Moderate | Usually mild | Severe | Mild (severe in pregnancy) |
| **Fulminant** | <1% | <1% | Rare | Up to 20% | 1-2% (20% in pregnancy) |
| **Chronicity** | 0% | 5-10% (adult) | 70-85% | With HBV | Rare |
| **Carrier** | No | Yes | No | Yes | Rare |
| **HCC risk** | No | Yes | Yes | Yes (with HBV) | No |
| **Vaccine** | Yes | Yes | No | HBV vaccine | Yes (in China) |
`
    },
    {
      id: 'hepatitis-a',
      title: 'Hepatitis A',
      depth: 'mbbs',
      icon: '🅰️',
      content: `
## Virology

- **Family**: Picornaviridae
- **Genome**: Single-stranded RNA
- **Stability**: Resistant to acid, heat (56°C × 30 min)
- **Single serotype**: Vaccine protects against all strains

---

## Epidemiology

### Transmission

- **Fecal-oral route** (primary)
- Contaminated water, food (shellfish)
- Person-to-person (household, daycare)
- Sexual (MSM)
- Rarely parenteral (blood during viremia)

### Risk Groups

- Travelers to endemic areas
- MSM
- IV drug users
- Close contacts of cases
- Daycare workers/children

---

## Clinical Features

### Timeline

\`\`\`
Day 0: Infection
        ↓
Days 15-50: Incubation (avg 28 days)
        ↓
Week 1-2: Prodrome
  - Fever (often high)
  - Malaise, fatigue
  - Anorexia, nausea
  - RUQ pain
        ↓
Week 2-4: Icteric phase
  - Jaundice
  - Hepatomegaly
  - Pruritus
        ↓
Weeks 4-12: Recovery
\`\`\`

### Age-dependent Presentation

| Age | Symptomatic | Jaundice | Mortality |
|-----|-------------|----------|-----------|
| **<6 years** | <30% | <10% | Very rare |
| **6-14 years** | 40-50% | Variable | Rare |
| **Adults** | >70% | >70% | 0.3-0.6% |
| **>50 years** | >70% | >70% | 1.8% |

> 💎 **Clinical Pearl**: HAV is usually ASYMPTOMATIC in children but SYMPTOMATIC in adults

---

## Diagnosis

### Serology

| Marker | Interpretation |
|--------|----------------|
| **IgM anti-HAV** | Acute infection (current or recent) |
| **IgG anti-HAV** | Past infection or vaccination (immunity) |
| **HAV RNA** | Research only (not routine) |

### Serological Timeline

\`\`\`
                  Symptoms
                     |
        |----Viremia (in stool/blood)---|
             |--------IgM anti-HAV (3-6 months)--------|
                  |----------IgG anti-HAV (lifelong)----------→

Weeks:  0    2    4    6    8    10   12   ...
\`\`\`

---

## Treatment

### Supportive Care (No specific antiviral)

- Rest (as needed)
- Hydration
- Avoid hepatotoxic drugs, alcohol
- Monitor for fulminant hepatitis

### Fulminant Hepatitis (Rare)

- Liver transplant evaluation
- Supportive ICU care

---

## Prevention

### Vaccination

| Vaccine | Schedule | Efficacy |
|---------|----------|----------|
| **HAVRIX** | 2 doses (0, 6-12 months) | >95% |
| **VAQTA** | 2 doses (0, 6-18 months) | >95% |
| **Twinrix** (HAV+HBV) | 3 doses (0, 1, 6 months) | Combined |

### Post-Exposure Prophylaxis

| Age/Risk | Within 2 weeks | After 2 weeks |
|----------|----------------|---------------|
| **Healthy 1-40 years** | HAV vaccine preferred | Vaccine |
| **>40 years, immunocompromised** | IG + Vaccine | Vaccine alone |
| **Infants <12 months** | IG (0.1 mL/kg) | - |

> 📝 **Exam Tip**: HAV vaccine is preferred over immunoglobulin for post-exposure prophylaxis in healthy individuals aged 1-40 years

---

## Prognosis

- **No chronicity** (100% clearance)
- **Relapsing hepatitis**: 10-15% (resolve spontaneously)
- **Fulminant hepatitis**: <0.5% (higher in elderly, chronic liver disease)
- **Cholestatic hepatitis**: Prolonged jaundice >10 weeks
`
    },
    {
      id: 'hepatitis-b',
      title: 'Hepatitis B',
      depth: 'mbbs',
      icon: '🅱️',
      content: `
## Virology

- **Family**: Hepadnaviridae
- **Genome**: Partially double-stranded DNA
- **Unique feature**: Uses reverse transcriptase (like retroviruses)
- **Envelope**: Contains HBsAg

### Viral Particles

| Particle | Description |
|----------|-------------|
| **Dane particle** | Complete virion (42 nm) |
| **Spherical particles** | HBsAg excess (22 nm) |
| **Filamentous particles** | HBsAg excess (22 nm diameter) |

### Viral Antigens

| Antigen | Location | Significance |
|---------|----------|--------------|
| **HBsAg** | Surface | Marker of infection |
| **HBcAg** | Core | Not detectable in serum |
| **HBeAg** | Core-derived | Marker of replication, high infectivity |

---

## Epidemiology

### Transmission

\`\`\`
Parenteral:
  - Blood transfusion (rare now)
  - Needle-stick injury
  - IV drug use
  - Hemodialysis

Sexual:
  - Heterosexual
  - MSM

Vertical (Mother-to-child):
  - Perinatal (most common in endemic areas)
  - In utero (rare)
\`\`\`

### Global Prevalence

| Endemicity | HBsAg Prevalence | Regions |
|------------|------------------|---------|
| **High** | ≥8% | Sub-Saharan Africa, East Asia |
| **Intermediate** | 2-8% | Mediterranean, Eastern Europe |
| **Low** | <2% | North America, Western Europe |

---

## Natural History

### Outcomes Based on Age at Infection

| Age at Infection | Chronic Infection | HCC Risk |
|------------------|-------------------|----------|
| **Perinatal** | 90% | High |
| **1-5 years** | 25-50% | Moderate |
| **Adults** | 5-10% | Lower |

### Phases of Chronic HBV (Simplified)

| Phase | HBeAg | HBV DNA | ALT | Liver Disease |
|-------|-------|---------|-----|---------------|
| **Immune tolerant** | + | Very high | Normal | Minimal |
| **Immune active (HBeAg+)** | + | High | Elevated | Active |
| **Inactive carrier** | - | Low (<2000) | Normal | Minimal |
| **Reactivation (HBeAg-)** | - | Moderate-High | Elevated | Active |

---

## Serology - The Key to HBV

### Marker Interpretation

| Marker | Meaning |
|--------|---------|
| **HBsAg** | Active infection (acute or chronic) |
| **Anti-HBs** | Immunity (resolved or vaccinated) |
| **HBeAg** | High replication, high infectivity |
| **Anti-HBe** | Lower replication (usually) |
| **IgM Anti-HBc** | Acute infection |
| **IgG Anti-HBc** | Past or current infection (NOT from vaccine) |
| **HBV DNA** | Viral load (quantitative) |

### Common Serological Patterns

| Scenario | HBsAg | Anti-HBs | Anti-HBc IgM | Anti-HBc IgG | HBeAg | Anti-HBe |
|----------|-------|----------|--------------|--------------|-------|----------|
| **Acute infection** | + | - | + | + | + | - |
| **Chronic infection** | + | - | - | + | ± | ± |
| **Recovered** | - | + | - | + | - | + |
| **Vaccinated** | - | + | - | - | - | - |
| **Window period** | - | - | + | + | - | - |

> 💎 **Clinical Pearl**: Anti-HBc IgG positive + Anti-HBs positive = RECOVERED. Anti-HBc IgG negative + Anti-HBs positive = VACCINATED.

---

## Serological Timeline (Acute HBV)

\`\`\`
                    Symptoms
                       |
     |------HBsAg------|
          |---HBeAg---|
               |-------IgM anti-HBc-------|
                         |--------Anti-HBe--------→
                              |-----Anti-HBs (immunity)-----→
                              |-----IgG anti-HBc (lifelong)→
     |------------------------HBV DNA-------------------------|
     
Months: 0   1   2   3   4   5   6   7   8   9   10  11  12
\`\`\`

---

## Prevention

### Vaccination

**Schedule:**
- Birth dose (within 24 hours)
- 3-dose series: 0, 1-2, 6 months

**Efficacy:**
- >95% seroprotection
- Anti-HBs ≥10 mIU/mL = protective

### Post-Exposure Prophylaxis

| Exposure | Vaccinated (Anti-HBs ≥10) | Unvaccinated |
|----------|---------------------------|--------------|
| **Needle-stick** | No action | HBIG + Vaccine series |
| **Perinatal** | N/A | HBIG + Vaccine at birth |
| **Sexual** | No action | HBIG + Vaccine |

> 📝 **Exam Tip**: Perinatal HBIG + Vaccine prevents 95% of vertical transmission. Without prophylaxis, HBeAg+ mothers transmit to 90% of infants.
`
    },
    {
      id: 'hepatitis-b-treatment',
      title: 'Hepatitis B Treatment',
      depth: 'pg',
      icon: '💊',
      content: `
## Treatment Goals

\`\`\`
1. Suppress HBV DNA (undetectable)
2. Normalize ALT
3. Achieve HBeAg seroconversion (if HBeAg+)
4. Achieve HBsAg loss (functional cure) - rare
5. Prevent cirrhosis, HCC, death
\`\`\`

---

## Who to Treat

### Indications for Treatment

| Criteria | Treat? |
|----------|--------|
| **HBeAg+ with ALT >2× ULN + HBV DNA >20,000** | Yes |
| **HBeAg- with ALT >2× ULN + HBV DNA >2,000** | Yes |
| **Cirrhosis + detectable HBV DNA** | Yes (any level) |
| **Family history of HCC** | Lower threshold |
| **Extrahepatic manifestations** | Yes |
| **Pre-chemotherapy/immunosuppression** | Yes (prophylaxis) |

### When NOT to Treat

- Immune tolerant phase (high DNA, normal ALT, no fibrosis) - controversial
- Inactive carrier (HBsAg+, HBeAg-, low DNA, normal ALT)

---

## Treatment Options

### Nucleos(t)ide Analogues (First-line)

| Drug | Class | Dose | Resistance |
|------|-------|------|------------|
| **Entecavir** | Nucleoside | 0.5mg daily | Very low |
| **Tenofovir DF** | Nucleotide | 300mg daily | None |
| **Tenofovir AF (TAF)** | Nucleotide | 25mg daily | None |

**Preferred agents:**
- Entecavir, Tenofovir DF, or TAF (high barrier to resistance)

**Avoid:**
- Lamivudine, Adefovir, Telbivudine (high resistance rates)

### Pegylated Interferon

| Drug | Dose | Duration |
|------|------|----------|
| **Peg-IFN α-2a** | 180 μg SC weekly | 48 weeks |

**Advantages:**
- Finite duration
- Higher HBsAg loss rates
- No resistance

**Disadvantages:**
- Side effects (flu-like, cytopenias, depression)
- Contraindicated in decompensated cirrhosis
- Less effective in high DNA levels

---

## Treatment Monitoring

### On-Treatment Monitoring

| Test | Frequency |
|------|-----------|
| **HBV DNA** | Every 3-6 months until undetectable, then every 6-12 months |
| **ALT** | Every 3 months initially, then every 6 months |
| **HBeAg/Anti-HBe** | Every 6-12 months if HBeAg+ |
| **HBsAg** | Annually (quantitative if available) |
| **Creatinine** | Every 6-12 months (especially Tenofovir) |

### Treatment Endpoints

| Endpoint | Definition |
|----------|------------|
| **Virological** | Undetectable HBV DNA |
| **Biochemical** | Normal ALT |
| **Serological** | HBeAg seroconversion, HBsAg loss |
| **Histological** | Improvement in inflammation/fibrosis |

---

## Duration of Therapy

### NUC Therapy

| Scenario | Duration |
|----------|----------|
| **HBeAg+ without cirrhosis** | Until HBeAg seroconversion + 12 months consolidation |
| **HBeAg- without cirrhosis** | Indefinite (until HBsAg loss) |
| **Cirrhosis** | Indefinite (do not stop) |

### Pegylated Interferon

- Fixed duration: 48 weeks
- Response assessed at week 12, 24, 48

---

## Special Populations

### HBV Reactivation

**Risk Factors:**
- Chemotherapy (especially rituximab, anti-CD20)
- Immunosuppression
- Stem cell/organ transplant

**Prevention:**
\`\`\`
Screen all patients before immunosuppression:
  - HBsAg, Anti-HBc, Anti-HBs

If HBsAg+:
  - Start antiviral before immunosuppression
  - Continue 6-12 months after stopping

If HBsAg-, Anti-HBc+:
  - Monitor HBV DNA, consider prophylaxis if high-risk therapy
\`\`\`

### Pregnancy

- Tenofovir is preferred (Pregnancy category B)
- Treat if HBV DNA >200,000 in 3rd trimester (reduce vertical transmission)
- Infant receives HBIG + vaccine at birth

---

## HCC Surveillance

### Who to Screen

All patients with:
- Cirrhosis (any cause)
- Chronic HBV even without cirrhosis if:
  - Asian male >40 or female >50
  - African >20
  - Family history of HCC

### Protocol

- Ultrasound every 6 months
- ± AFP (controversial, not sensitive)
`
    },
    {
      id: 'hepatitis-c',
      title: 'Hepatitis C',
      depth: 'mbbs',
      icon: '©️',
      content: `
## Virology

- **Family**: Flaviviridae
- **Genome**: Single-stranded RNA
- **Genotypes**: 6 major (GT1 most common globally)
- **High mutation rate**: Evades immune response

### Genotype Distribution

| Genotype | Distribution | Treatment Response |
|----------|--------------|-------------------|
| **GT1** | Global (46%) | Historically harder, now excellent |
| **GT2** | Global | Excellent |
| **GT3** | South Asia | More fibrogenic, needs longer Rx |
| **GT4** | Middle East, Africa | Good |
| **GT5, 6** | Rare | Good |

---

## Epidemiology

### Transmission

\`\`\`
Most efficient:
  - Blood transfusion (pre-1992)
  - IV drug use (most common current)
  - Needle-stick injury

Less efficient:
  - Sexual (MSM with HIV, multiple partners)
  - Vertical (<5%, higher if HIV co-infected)
  - Healthcare-associated
  - Tattoos/piercings (unsterile)

NOT transmitted:
  - Casual contact
  - Breastfeeding (unless cracked nipples)
  - Food, water
\`\`\`

### Risk Groups

- IV drug users (past or present)
- Blood transfusion/organ transplant pre-1992
- Hemodialysis patients
- HIV-positive individuals
- Healthcare workers with exposure
- Children of HCV+ mothers
- Incarcerated persons

---

## Natural History

### Acute HCV

- **Usually asymptomatic** (70-80%)
- Jaundice in 20-30%
- Fulminant hepatitis rare

### Outcomes

\`\`\`
Acute HCV Infection
        ↓
    ┌───────┴───────┐
    ↓               ↓
Clearance      Chronic HCV
(15-25%)       (75-85%)
                    ↓
            ┌───────┴───────┐
            ↓               ↓
      Stable disease    Progressive
      (slow fibrosis)   fibrosis
                            ↓
                    Cirrhosis (10-20% over 20-30 years)
                            ↓
                    ┌───────┴───────┐
                    ↓               ↓
            Decompensation     HCC (1-5%/year)
\`\`\`

### Factors Accelerating Progression

| Factor | Effect |
|--------|--------|
| **Alcohol** | Major accelerator |
| **HIV co-infection** | 3x faster fibrosis |
| **HBV co-infection** | Accelerated |
| **Male sex** | Faster progression |
| **Age at infection >40** | Faster |
| **Obesity/MASH** | Synergistic |

---

## Diagnosis

### Screening Algorithm

\`\`\`
Step 1: Anti-HCV antibody
        ↓
    ┌───────┴───────┐
    ↓               ↓
Negative         Positive
(No HCV)              ↓
              Step 2: HCV RNA
                      ↓
              ┌───────┴───────┐
              ↓               ↓
         Negative         Positive
    (Past infection/    (Active infection)
     false positive)
\`\`\`

### Test Interpretation

| Anti-HCV | HCV RNA | Interpretation |
|----------|---------|----------------|
| Negative | Not done | No HCV exposure |
| Positive | Positive | Active HCV infection |
| Positive | Negative | Resolved HCV (or false positive Ab) |
| Negative | Positive | Early acute HCV (window period) |

### Additional Testing

| Test | Purpose |
|------|---------|
| **HCV genotype** | Guide treatment duration |
| **HCV RNA (quantitative)** | Confirm infection, monitor treatment |
| **Liver fibrosis** | FibroScan, FIB-4, or biopsy |
| **HBV, HIV testing** | Co-infection screening |

---

## Extrahepatic Manifestations

### Common Associations

| Manifestation | Mechanism |
|---------------|-----------|
| **Cryoglobulinemia** | Mixed (Type II/III) - vasculitis, purpura, neuropathy |
| **Membranoproliferative GN** | Immune complex deposition |
| **Porphyria cutanea tarda** | Iron dysregulation |
| **Lichen planus** | Immune-mediated |
| **B-cell lymphoma** | Chronic antigenic stimulation |
| **Diabetes mellitus** | Insulin resistance |

> 💎 **Clinical Pearl**: Treat HCV to resolve cryoglobulinemia and associated vasculitis!
`
    },
    {
      id: 'hepatitis-c-treatment',
      title: 'Hepatitis C Treatment',
      depth: 'pg',
      icon: '💊',
      content: `
## DAA Revolution

**Direct-Acting Antivirals (DAAs)** have transformed HCV treatment:
- Cure rates >95% (SVR12)
- All-oral regimens
- 8-12 weeks duration
- Minimal side effects
- Pan-genotypic options available

---

## Treatment Goals

\`\`\`
Primary Endpoint: SVR12 (Sustained Virological Response)
  = Undetectable HCV RNA 12 weeks after treatment

SVR12 = CURE (>99% remain virus-free long-term)
\`\`\`

---

## Who to Treat

> **All patients with chronic HCV should be treated** (unless limited life expectancy from other causes)

### Prioritization

| Priority | Patients |
|----------|----------|
| **Highest** | Advanced fibrosis (F3-F4) |
| **High** | Post-transplant, cryoglobulinemia, GN |
| **High** | HIV or HBV co-infection |
| **High** | High transmission risk (PWID, MSM) |
| **Treat all** | All others (simplified treatment) |

---

## Current DAA Regimens

### Pan-Genotypic Regimens (Preferred)

| Regimen | Duration | Notes |
|---------|----------|-------|
| **Sofosbuvir/Velpatasvir** (Epclusa) | 8-12 weeks | Pan-genotypic, first-line |
| **Glecaprevir/Pibrentasvir** (Mavyret) | 8-12 weeks | Pan-genotypic, first-line |
| **Sofosbuvir/Velpatasvir/Voxilaprevir** (Vosevi) | 12 weeks | Salvage for prior DAA failure |

### Treatment Duration

| Scenario | Duration |
|----------|----------|
| **Treatment-naïve, non-cirrhotic** | 8 weeks |
| **Treatment-naïve, compensated cirrhosis** | 12 weeks |
| **Treatment-experienced** | 12 weeks or longer |
| **Decompensated cirrhosis** | 12 weeks (ribavirin may be added) |

---

## Pre-Treatment Assessment

### Required Tests

\`\`\`
1. Confirm active infection: HCV RNA (quantitative)
2. Determine genotype (if not using pan-genotypic)
3. Assess fibrosis: FibroScan or FIB-4
4. Check for co-infections: HBV, HIV
5. Assess renal function (for sofosbuvir)
6. Drug interaction check
\`\`\`

### Fibrosis Assessment

| Stage | Interpretation | HCC Surveillance |
|-------|----------------|------------------|
| **F0-F1** | No/minimal fibrosis | Not needed |
| **F2** | Significant fibrosis | Consider |
| **F3** | Advanced fibrosis | Yes |
| **F4** | Cirrhosis | Yes (lifelong, even after SVR) |

---

## Monitoring During Treatment

| Test | Timing |
|------|--------|
| **HCV RNA** | Week 4 (optional), EOT, SVR12 |
| **CBC, LFTs** | Week 4 (if ribavirin used) |
| **Drug adherence** | Each visit |

### Post-SVR Monitoring

| Fibrosis Stage | Post-SVR Follow-up |
|----------------|-------------------|
| **F0-F2** | Discharge after SVR12 confirmed |
| **F3-F4** | HCC surveillance every 6 months (lifelong) |

> ⚠️ **Critical**: Cirrhotic patients need HCC surveillance FOREVER, even after SVR!

---

## Special Populations

### Decompensated Cirrhosis

- Use ribavirin-free regimens if possible
- Avoid protease inhibitors (contraindicated in Child-Pugh B/C)
- Sofosbuvir/Velpatasvir ± Ribavirin

### Post-Liver Transplant

- Treat with DAAs
- Drug interactions with immunosuppressants
- High SVR rates

### HBV Co-infection

- Risk of HBV reactivation during/after HCV treatment
- Monitor HBV DNA
- Treat HBV if reactivation occurs

### Chronic Kidney Disease

- Glecaprevir/Pibrentasvir (no renal adjustment)
- Sofosbuvir not recommended if eGFR <30

---

## Treatment Failure

### Causes

- Non-adherence
- Drug interactions
- Resistance-associated substitutions (RAS)

### Management

| Prior Regimen | Salvage Option |
|---------------|----------------|
| **NS5A-containing** | Sofosbuvir/Velpatasvir/Voxilaprevir × 12 weeks |
| **Sofosbuvir + RBV** | Add NS5A inhibitor |
| **PI failure** | Add sofosbuvir + NS5A |

---

## Prevention

- **No vaccine available**
- Harm reduction for PWID
- Blood/organ screening
- Safe injection practices
- "Treatment as Prevention" strategy
`
    },
    {
      id: 'hepatitis-d-e',
      title: 'Hepatitis D & E',
      depth: 'mbbs',
      icon: '🔤',
      content: `
## Hepatitis D (Delta)

### Virology

- **Defective virus** - requires HBV for replication
- Smallest known animal virus
- Uses HBsAg as its envelope
- Single-stranded circular RNA

### Epidemiology

- Found only in HBV-infected patients
- Endemic in: Mediterranean, Amazon, Central Africa
- Transmission: Same as HBV (parenteral, sexual, vertical)
- ~5% of HBV patients worldwide

### Patterns of Infection

| Pattern | Description | Prognosis |
|---------|-------------|-----------|
| **Co-infection** | Simultaneous HBV + HDV | Usually acute, resolves (95%) |
| **Superinfection** | HDV in chronic HBV carrier | Usually chronic (90%), severe |

> 💎 **Clinical Pearl**: Superinfection is MORE severe than co-infection - chronic HDV develops in 90%

### Clinical Features

- More severe than HBV alone
- Higher rates of:
  - Fulminant hepatitis (up to 20% in superinfection)
  - Cirrhosis development
  - Faster progression

### Diagnosis

| Marker | Interpretation |
|--------|----------------|
| **Anti-HDV (total)** | Exposure to HDV |
| **Anti-HDV IgM** | Active/recent infection |
| **HDV RNA** | Active replication |

**Must have HBsAg+ to have HDV**

### Treatment

- **Pegylated interferon** × 48 weeks (only approved therapy)
- Treat underlying HBV
- **Bulevirtide** (entry inhibitor) - approved in Europe
- Liver transplant for decompensated cirrhosis

### Prevention

- **HBV vaccination** prevents HDV
- No specific HDV vaccine

---

## Hepatitis E

### Virology

- **Family**: Hepeviridae
- **Genome**: Single-stranded RNA
- **Genotypes**: 
  - GT1, GT2: Human (developing countries)
  - GT3, GT4: Zoonotic (developed countries)

### Epidemiology

| Genotype | Transmission | Regions |
|----------|--------------|---------|
| **GT1** | Waterborne outbreaks | Asia, Africa |
| **GT2** | Waterborne | Mexico, Africa |
| **GT3** | Zoonotic (pigs, deer) | Europe, Americas |
| **GT4** | Zoonotic | China, Japan |

### Transmission

\`\`\`
Fecal-oral:
  - Contaminated water (outbreaks)
  - Person-to-person (less common than HAV)

Zoonotic (GT3, GT4):
  - Undercooked pork/wild game
  - Organ meats (liver)

Other:
  - Blood transfusion (rare)
  - Vertical transmission
\`\`\`

### Clinical Features

#### Acute HEV

- Similar to HAV
- Incubation: 15-60 days
- Usually self-limiting
- Jaundice in 75% of symptomatic cases

#### Special Populations

| Population | Concern |
|------------|---------|
| **Pregnant women (GT1)** | 20-25% mortality, especially 3rd trimester |
| **Immunocompromised** | Chronic infection (GT3) |
| **Chronic liver disease** | ACLF risk |

> ⚠️ **Critical**: HEV is the most dangerous viral hepatitis in pregnancy - mortality up to 25%!

### Diagnosis

| Marker | Interpretation |
|--------|----------------|
| **IgM Anti-HEV** | Acute infection |
| **IgG Anti-HEV** | Past exposure (unreliable) |
| **HEV RNA** | Active infection (more sensitive) |

### Treatment

#### Acute HEV
- Supportive care
- Self-limiting in immunocompetent

#### Chronic HEV (Immunocompromised)
\`\`\`
1. Reduce immunosuppression if possible
2. If persists: Ribavirin × 12 weeks
3. Alternative: PEG-interferon
\`\`\`

### Prevention

- Safe water supply
- Proper sanitation
- Avoid undercooked pork/game
- **Vaccine**: Approved in China (Hecolin), not widely available
`
    },
    {
      id: 'comparison-summary',
      title: 'Comprehensive Comparison',
      depth: 'pg',
      icon: '📊',
      content: `
## Master Comparison Table

| Feature | HAV | HBV | HCV | HDV | HEV |
|---------|-----|-----|-----|-----|-----|
| **Genome** | RNA | DNA | RNA | RNA | RNA |
| **Family** | Picorna | Hepadna | Flavi | Delta | Hepe |
| **Transmission** | Fecal-oral | Parenteral, sexual, vertical | Parenteral | Parenteral | Fecal-oral, zoonotic |
| **Incubation** | 15-50d | 30-180d | 14-180d | 30-180d | 15-60d |
| **Chronicity** | 0% | 5-10% (adult) | 70-85% | 90% (superinfection) | Rare (immunocompromised) |
| **Fulminant** | <1% | <1% | Rare | Up to 20% | 1-2% (20% pregnant) |
| **HCC Risk** | No | Yes | Yes | Yes | No |
| **Vaccine** | Yes | Yes | No | HBV vaccine | China only |
| **Treatment** | Supportive | NUCs, PEG-IFN | DAAs (cure) | PEG-IFN, Bulevirtide | Supportive, Ribavirin |

---

## Serological Markers Summary

### HAV
- **IgM anti-HAV** = Acute infection
- **IgG anti-HAV** = Immunity (past infection or vaccine)

### HBV
- **HBsAg** = Active infection
- **Anti-HBs** = Immunity
- **Anti-HBc IgM** = Acute infection
- **Anti-HBc IgG** = Ever infected (not from vaccine)
- **HBeAg** = High replication
- **HBV DNA** = Viral load

### HCV
- **Anti-HCV** = Ever exposed
- **HCV RNA** = Active infection

### HDV
- **Anti-HDV** = Exposure
- **HDV RNA** = Active infection
- Must have **HBsAg+** for HDV

### HEV
- **IgM anti-HEV** = Acute infection
- **HEV RNA** = Active infection (preferred)

---

## Treatment Summary

| Virus | Acute Treatment | Chronic Treatment |
|-------|-----------------|-------------------|
| **HAV** | Supportive | N/A (no chronicity) |
| **HBV** | Usually supportive | Entecavir, Tenofovir, PEG-IFN |
| **HCV** | Consider early DAAs | DAAs (SOF/VEL or G/P) - curative |
| **HDV** | Supportive | PEG-IFN ± Bulevirtide |
| **HEV** | Supportive | Reduce immunosuppression, Ribavirin |

---

## Vaccination Summary

| Vaccine | Type | Schedule | Duration |
|---------|------|----------|----------|
| **HAV** | Inactivated | 2 doses (0, 6-12 mo) | Lifelong |
| **HBV** | Recombinant | 3 doses (0, 1, 6 mo) | Check titer at 1-2 months post |
| **Twinrix** | HAV + HBV | 3 doses (0, 1, 6 mo) | Combined protection |
| **HEV** | Recombinant | 3 doses (China only) | Unknown duration |

---

## High-Yield Exam Points

| Topic | Key Point |
|-------|-----------|
| **HAV in children** | Usually asymptomatic |
| **HAV in adults** | Usually symptomatic with jaundice |
| **HBV chronicity** | 90% if perinatal, 5-10% if adult |
| **HCV chronicity** | 70-85% overall |
| **Most chronic** | HCV > HBV |
| **HDV requirement** | Needs HBsAg for replication |
| **HDV superinfection** | 90% chronic, more severe |
| **HEV pregnancy** | 20-25% mortality in 3rd trimester |
| **HCC risk** | HBV, HCV, HDV (not HAV, HEV) |
| **HCV cure rate** | >95% with DAAs |
| **Anti-HBc alone** | Can mean: Window, resolved, occult HBV |
| **Vaccine immunity marker** | Anti-HBs alone (no anti-HBc) |
`
    }
  ],

  keyPoints: [
    "Vowels (A, E) are fecal-oral; Consonants (B, C, D) are parenteral",
    "HAV: Never chronic, vaccine available, worse in adults",
    "HBV: 5-10% chronic in adults, 90% if perinatal; DNA virus using reverse transcriptase",
    "HCV: 70-85% become chronic; DAAs achieve >95% cure rate",
    "HDV: Defective virus requiring HBV; superinfection = 90% chronic",
    "HEV: Most dangerous in pregnancy (20-25% mortality); chronic in immunocompromised",
    "Anti-HBc IgG distinguishes recovered (present) from vaccinated (absent)",
  ],

  mnemonics: [
    {
      title: "Hepatitis Transmission",
      content: `**Vowels = Oral (Fecal-Oral)**
- H**A**V → **A**limentary (gut)
- H**E**V → **E**nteric (gut)

**Consonants = Blood/Parenteral**
- H**B**V → **B**lood
- H**C**V → **C**irculation
- H**D**V → **D**epends on HBV`,
    },
    {
      title: "HBV Serology: Who is Immune?",
      content: `**Vaccinated**: Anti-HBs ONLY (no anti-HBc)
  - "**V**accine makes **V**ery few markers"

**Recovered**: Anti-HBs +