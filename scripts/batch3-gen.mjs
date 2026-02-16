#!/usr/bin/env node
// Batch 3 Content Generator — Medicine Topics
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = '/Users/adityachandrabhatla/nucleux-academy/content/medicine';

// Topic data: [subspec, slug, title, highYield, nmcCode, prereqs[], related[], {content seeds}]
const TOPICS = [
// GASTROENTEROLOGY
['gastroenterology','acid-peptic-disease','Acid Peptic Disease',true,'IM5.1',['gerd-medical'],['upper-gi-bleeding-medical']],
['gastroenterology','acute-liver-failure','Acute Liver Failure',true,'IM5.9',['liver-cirrhosis'],['drug-induced-liver-injury']],
['gastroenterology','alcoholic-liver-disease','Alcoholic Liver Disease',true,'IM5.10',['liver-cirrhosis'],['acute-liver-failure']],
['gastroenterology','chronic-pancreatitis-medical','Chronic Pancreatitis',false,'IM5.14',[],['alcoholic-liver-disease']],
['gastroenterology','drug-induced-liver-injury','Drug-Induced Liver Injury',true,'IM5.11',['acute-liver-failure'],['liver-cirrhosis']],
['gastroenterology','gerd-medical','GERD (Gastroesophageal Reflux Disease)',true,'IM5.2',[],['acid-peptic-disease']],
['gastroenterology','gi-motility-disorders','GI Motility Disorders',false,'IM5.15',['gerd-medical'],['inflammatory-bowel-disease']],
['gastroenterology','hepatitis-b','Hepatitis B',true,'IM5.6',[],['hepatitis-c','liver-cirrhosis']],
['gastroenterology','hepatitis-c','Hepatitis C',true,'IM5.7',[],['hepatitis-b','liver-cirrhosis']],
['gastroenterology','inflammatory-bowel-disease','Inflammatory Bowel Disease',true,'IM5.4',[],['lower-gi-bleeding-medical']],
['gastroenterology','liver-cirrhosis','Liver Cirrhosis',true,'IM5.8',['hepatitis-b'],['acute-liver-failure','alcoholic-liver-disease']],
['gastroenterology','lower-gi-bleeding-medical','Lower GI Bleeding',true,'IM5.13',['inflammatory-bowel-disease'],['upper-gi-bleeding-medical']],
['gastroenterology','upper-gi-bleeding-medical','Upper GI Bleeding',true,'IM5.3',['acid-peptic-disease','liver-cirrhosis'],['lower-gi-bleeding-medical']],
// INFECTIOUS DISEASES
['infectious-diseases','antiretroviral-therapy','Antiretroviral Therapy',true,'IM8.5',['hiv-aids'],['opportunistic-infections-hiv']],
['infectious-diseases','catheter-related-infections','Catheter-Related Infections',false,'IM8.14',[],['ventilator-associated-pneumonia']],
['infectious-diseases','fungal-infections-systemic','Systemic Fungal Infections',false,'IM8.11',[],['opportunistic-infections-hiv']],
['infectious-diseases','hiv-aids','HIV/AIDS',true,'IM8.4',[],['antiretroviral-therapy','opportunistic-infections-hiv']],
['infectious-diseases','hiv-prevention','HIV Prevention',true,'IM8.6',['hiv-aids'],['antiretroviral-therapy']],
['infectious-diseases','malaria','Malaria',true,'IM8.1',[],['tropical-infections']],
['infectious-diseases','opportunistic-infections-hiv','Opportunistic Infections in HIV',true,'IM8.7',['hiv-aids'],['fungal-infections-systemic']],
['infectious-diseases','parasitic-infections-systemic','Systemic Parasitic Infections',false,'IM8.12',[],['malaria','tropical-infections']],
['infectious-diseases','tropical-infections','Tropical Infections',true,'IM8.2',[],['malaria']],
['infectious-diseases','urinary-tract-infections','Urinary Tract Infections',true,'IM8.9',[],['catheter-related-infections']],
['infectious-diseases','ventilator-associated-pneumonia','Ventilator-Associated Pneumonia',true,'IM8.13',[],['catheter-related-infections']],
// EMERGENCY
['emergency','acute-coronary-syndrome-em','Acute Coronary Syndrome — Emergency',true,'IM24.1',['chest-pain-approach'],['cpr-acls-bls']],
['emergency','acute-stroke-em','Acute Stroke — Emergency',true,'IM24.2',[],['primary-survey-atls']],
['emergency','anaphylaxis-emergency','Anaphylaxis — Emergency',true,'IM24.3',[],['breathlessness-approach']],
['emergency','breathlessness-approach','Approach to Breathlessness',true,'IM24.5',[],['chest-pain-approach']],
['emergency','chest-pain-approach','Approach to Chest Pain',true,'IM24.4',[],['acute-coronary-syndrome-em']],
['emergency','chest-trauma-em','Chest Trauma — Emergency',true,'IM24.10',['primary-survey-atls'],['breathlessness-approach']],
['emergency','cpr-acls-bls','CPR / ACLS / BLS',true,'IM24.6',[],['primary-survey-atls']],
['emergency','gi-bleeding-approach','Approach to GI Bleeding',true,'IM24.7',[],[]],
['emergency','organophosphate-poisoning','Organophosphate Poisoning',true,'IM24.11',['poisoning-general-approach'],['paracetamol-overdose']],
['emergency','paracetamol-overdose','Paracetamol Overdose',true,'IM24.12',['poisoning-general-approach'],['organophosphate-poisoning']],
['emergency','poisoning-general-approach','Poisoning — General Approach',true,'IM24.8',[],['organophosphate-poisoning','paracetamol-overdose']],
['emergency','primary-survey-atls','Primary Survey / ATLS',true,'IM24.9',[],['cpr-acls-bls','chest-trauma-em']],
// CRITICAL CARE
['critical-care','arterial-line','Arterial Line',false,'IM24.15',['fluid-resuscitation'],['non-invasive-ventilation']],
['critical-care','brain-death','Brain Death',true,'IM24.18',[],['organ-donation','end-of-life-icu']],
['critical-care','chest-tube-icu','Chest Tube in ICU',false,'IM24.16',[],['non-invasive-ventilation']],
['critical-care','end-of-life-icu','End-of-Life Care in ICU',false,'IM24.20',['brain-death'],['organ-donation']],
['critical-care','fluid-resuscitation','Fluid Resuscitation',true,'IM24.13',[],['nutrition-icu']],
['critical-care','hepatic-failure-icu','Hepatic Failure in ICU',true,'IM24.17',[],['fluid-resuscitation']],
['critical-care','lumbar-puncture','Lumbar Puncture',false,'IM24.19',[],[]],
['critical-care','non-invasive-ventilation','Non-Invasive Ventilation',true,'IM24.14',[],['chest-tube-icu']],
['critical-care','nutrition-icu','Nutrition in ICU',false,'IM24.21',['fluid-resuscitation'],[]],
['critical-care','organ-donation','Organ Donation',false,'IM24.22',['brain-death'],['end-of-life-icu']],
// GERIATRICS
['geriatrics','delirium-geriatric','Delirium in the Elderly',true,'IM23.1',['geriatric-assessment'],['falls-in-elderly']],
['geriatrics','end-of-life-care','End-of-Life Care',true,'IM23.6',[],['pressure-ulcers']],
['geriatrics','falls-in-elderly','Falls in the Elderly',true,'IM23.2',['geriatric-assessment'],['osteoporosis-geriatric']],
['geriatrics','geriatric-assessment','Comprehensive Geriatric Assessment',true,'IM23.3',[],['delirium-geriatric','falls-in-elderly']],
['geriatrics','osteoporosis-geriatric','Osteoporosis in Elderly',true,'IM23.4',['geriatric-assessment'],['falls-in-elderly']],
['geriatrics','pressure-ulcers','Pressure Ulcers',false,'IM23.5',[],['end-of-life-care']],
['geriatrics','urinary-incontinence-geriatric','Urinary Incontinence in Elderly',true,'IM23.7',['geriatric-assessment'],[]],
// DERMATOLOGY
['dermatology','dermatomyositis-skin','Dermatomyositis — Skin Manifestations',true,'IM19.1',[],['lupus-skin']],
['dermatology','drug-eruptions','Drug Eruptions',true,'IM20.1',[],['lupus-skin']],
['dermatology','lupus-skin','Lupus — Skin Manifestations',true,'IM19.2',[],['scleroderma-skin','dermatomyositis-skin']],
['dermatology','scleroderma-skin','Scleroderma — Skin Manifestations',false,'IM19.3',[],['lupus-skin']],
// PSYCHIATRY
['psychiatry','alcohol-use-disorder','Alcohol Use Disorder',true,'IM22.1',[],['cannabis-use-disorder','opioid-use-disorder']],
['psychiatry','bipolar-disorder','Bipolar Disorder',true,'IM22.3',[],['schizoaffective-disorder','psychiatric-emergencies']],
['psychiatry','cannabis-use-disorder','Cannabis Use Disorder',false,'IM22.2',[],['alcohol-use-disorder']],
['psychiatry','delusional-disorder','Delusional Disorder',false,'IM22.4',[],['schizoaffective-disorder']],
['psychiatry','opioid-use-disorder','Opioid Use Disorder',true,'IM22.5',[],['alcohol-use-disorder']],
['psychiatry','psychiatric-emergencies','Psychiatric Emergencies',true,'IM22.6',[],['bipolar-disorder']],
['psychiatry','schizoaffective-disorder','Schizoaffective Disorder',false,'IM22.7',[],['bipolar-disorder','delusional-disorder']],
// GENERAL TOPICS
['general-topics','aetiology','Approach to Etiology of Disease',false,'IM26.1',[],['diagnostic-work']],
['general-topics','aetiology-determine-develop-diagnostic','Diagnostic Approach to Etiology',false,'IM26.2',['aetiology'],['diagnostic-work']],
['general-topics','and-discuss-the-epidemiology-pathogenesis-clinical','Epidemiology and Pathogenesis',false,'IM26.3',[],['aetiology']],
['general-topics','antecedents-risk','Risk Factors and Antecedents',false,'IM26.4',[],['factors-inherited-modifiable-risk']],
['general-topics','area-plant-poisons-seen','Plant Poisons',false,'IM26.5',[],['area-poisonous-snakes-your']],
['general-topics','area-poisonous-snakes-your','Snake Bite Management',true,'IM26.6',[],['area-plant-poisons-seen']],
['general-topics','basis-biochemical-physiologic','Biochemical and Physiologic Basis of Disease',false,'IM26.7',[],['aetiology']],
['general-topics','cad-factors-relationship-risk','CAD Risk Factors',true,'IM26.8',[],['factors-inherited-modifiable-risk']],
['general-topics','caloric-consequences-protein','Protein-Calorie Malnutrition',true,'IM26.9',[],[]],
['general-topics','cholera-drop-hanging-specimen','Cholera — Diagnosis and Management',true,'IM26.10',[],[]],
['general-topics','choose-diagnose-diagnostic-interpret','Choosing Diagnostic Tests',false,'IM26.11',[],['diagnostic-work']],
['general-topics','choose-diagnostic-interpret-testing','Diagnostic Testing in Young Adults',false,'IM26.12',['choose-diagnose-diagnostic-interpret'],[]],
['general-topics','colonoscopy-endoscopy-indications','Endoscopy and Colonoscopy — Indications',true,'IM26.13',[],[]],
['general-topics','correct-interpret-mannequin-technique','Clinical Skills — Mannequin Techniques',false,'IM26.14',[],['establishes-examination-perform-systematic']],
['general-topics','diagnostic-work','Diagnostic Workup',false,'IM26.15',[],['choose-diagnose-diagnostic-interpret']],
['general-topics','differential-generate-prioritise','Generating Differential Diagnosis',true,'IM26.16',[],['diagnostic-work']],
['general-topics','document-elicit-history-present','History Taking and Documentation',true,'IM26.17',[],['establishes-examination-perform-systematic']],
['general-topics','dose-indications-pharmacology-side','Clinical Pharmacology Principles',true,'IM26.18',[],[]],
['general-topics','establishes-examination-perform-systematic','Systematic Clinical Examination',true,'IM26.19',['document-elicit-history-present'],[]],
['general-topics','factors-inherited-modifiable-risk','Inherited and Modifiable Risk Factors',false,'IM26.20',[],['cad-factors-relationship-risk']],
['general-topics','government-iodisation-programs','Iodisation Programs',false,'IM26.21',[],[]],
['general-topics','host-influence-response','Host Response and Immune Influence',false,'IM26.22',[],['aetiology']],
['general-topics','indications-interpret-results-tests','Interpreting Test Results',false,'IM26.23',['diagnostic-work'],[]],
['general-topics','laboratory','Laboratory Investigations',false,'IM26.24',[],['indications-interpret-results-tests']],
['general-topics','professional-qualities-roles','Professional Qualities and Roles',false,'IM26.25',[],[]],
// ONCOLOGY (NEW)
['oncology','lung-cancer','Lung Cancer',true,'IM26.30',[],['chemotherapy-principles']],
['oncology','breast-cancer-medical','Breast Cancer — Medical Management',true,'IM26.31',['chemotherapy-principles'],['tumor-markers']],
['oncology','colorectal-cancer-medical','Colorectal Cancer — Medical Management',true,'IM26.32',['chemotherapy-principles'],['tumor-markers']],
['oncology','lymphoma','Lymphoma (Hodgkin and Non-Hodgkin)',true,'IM26.33',[],['leukemia-overview']],
['oncology','leukemia-overview','Leukemia Overview',true,'IM26.34',[],['lymphoma']],
['oncology','palliative-care','Palliative Care',true,'IM26.35',[],[]],
['oncology','chemotherapy-principles','Chemotherapy Principles',true,'IM26.36',[],['tumor-markers']],
['oncology','tumor-markers','Tumor Markers',true,'IM26.37',[],['chemotherapy-principles']],
// TOXICOLOGY (NEW)
['toxicology','organophosphate-poisoning','Organophosphate Poisoning',true,'IM24.11',[],['paracetamol-overdose']],
['toxicology','paracetamol-overdose','Paracetamol Overdose',true,'IM24.12',[],['drug-overdose']],
['toxicology','snake-bite','Snake Bite',true,'IM24.23',[],[]],
['toxicology','corrosive-ingestion','Corrosive Ingestion',true,'IM24.24',[],[]],
['toxicology','mushroom-poisoning','Mushroom Poisoning',false,'IM24.25',[],[]],
['toxicology','alcohol-poisoning','Alcohol Poisoning',true,'IM24.26',[],['drug-overdose']],
['toxicology','drug-overdose','Drug Overdose (Benzodiazepines, Opioids, TCA)',true,'IM24.27',[],['paracetamol-overdose']],
['toxicology','heavy-metal-poisoning','Heavy Metal Poisoning',true,'IM24.28',[],[]],
];

function writeMeta(dir, title, slug, hy, nmc, prereqs, related) {
  const pYaml = prereqs.length ? prereqs.map(p=>`  - "${p}"`).join('\n') : '  []';
  const rYaml = related.length ? related.map(r=>`  - "${r}"`).join('\n') : '  []';
  const pDet = prereqs.length ? prereqs.map(p=>`    - slug: "${p}"\n      reason: "Foundation knowledge"`).join('\n') : '  []';
  const rDet = related.length ? related.map(r=>`    - slug: "${r}"\n      reason: "Clinically related"\n      relationship: "clinical"`).join('\n') : '  []';
  
  writeFileSync(join(dir,'_meta.yaml'), `title: "${title}"
slug: ${slug}
depth: "UG"
highYield: ${hy}
nmc_codes:
  - "${nmc}"
prerequisites:
${pYaml}
related_topics:
${rYaml}
enrichment:
  nmcCodes:
    - code: "${nmc}"
      text: "${title} — NMC competency"
      domain: "KH"
  prerequisite_details:
${pDet}
  related_details:
${rDet}
`);
}

let stats = { meta: 0, explorer: 0, examPrep: 0, skipped: 0 };

for (const [sub, slug, title, hy, nmc, prereqs, related] of TOPICS) {
  const dir = join(BASE, sub, slug);
  mkdirSync(dir, { recursive: true });
  
  // Always rewrite _meta.yaml
  writeMeta(dir, title, slug, hy, nmc, prereqs, related);
  stats.meta++;
  
  // Track what needs content
  const needsExplorer = !existsSync(join(dir, 'explorer.md'));
  const needsExam = !existsSync(join(dir, 'exam-prep.md'));
  
  if (needsExplorer) stats.explorer++;
  else stats.skipped++;
  if (needsExam) stats.examPrep++;
  else stats.skipped++;
  
  // Output what needs content generation
  if (needsExplorer || needsExam) {
    console.log(`NEED_CONTENT|${sub}|${slug}|${title}|${needsExplorer?'explorer':''}|${needsExam?'exam':''}`);
  }
}

// Create subspecialty _meta.yaml for new ones
for (const sub of ['oncology', 'toxicology']) {
  const metaPath = join(BASE, sub, '_meta.yaml');
  if (!existsSync(metaPath)) {
    writeFileSync(metaPath, `title: "${sub[0].toUpperCase()+sub.slice(1)}"\nslug: ${sub}\n`);
  }
}

console.log(`\nStats: ${stats.meta} meta updated, ${stats.explorer} explorer needed, ${stats.examPrep} exam-prep needed, ${stats.skipped} existing skipped`);
