#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'content', 'medicine');

// ============================================================
// TOPIC DEFINITIONS
// ============================================================

const topics = {
  cardiology: {
    'acute-coronary-syndrome': {
      title: 'Acute Coronary Syndrome',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.21', 'IM2.5', 'IM2.14', 'IM2.16'],
      prerequisites: ['coronary-artery-disease', 'hypertension'],
      related: ['myocardial-infarction', 'heart-failure', 'atrial-fibrillation'],
      enrichment: {
        nmcCodes: [
          { code: 'IM1.21', text: 'Describe aetiology, presentation, diagnosis and management of ACS', domain: 'SH' },
          { code: 'IM2.5', text: 'Describe pathophysiology, clinical features, ECG changes in ACS', domain: 'KH' },
          { code: 'IM2.14', text: 'Discuss role of interventional cardiology in ACS', domain: 'KH' },
          { code: 'IM2.16', text: 'Enumerate indications and interpret cardiac biomarkers', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'coronary-artery-disease', reason: 'ACS is an acute manifestation of CAD' },
          { slug: 'hypertension', reason: 'Major modifiable risk factor for ACS' },
        ],
        relatedDetails: [
          { slug: 'myocardial-infarction', reason: 'STEMI/NSTEMI are subtypes of ACS', rel: 'clinical' },
          { slug: 'heart-failure', reason: 'Common complication of ACS', rel: 'clinical' },
        ],
      },
    },
    'atrial-fibrillation': {
      title: 'Atrial Fibrillation',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.19', 'IM1.28', 'IM1.7'],
      prerequisites: ['heart-failure', 'hypertension'],
      related: ['heart-block', 'valvular-heart-disease', 'mitral-stenosis'],
      enrichment: {
        nmcCodes: [
          { code: 'IM1.19', text: 'Describe aetiology, classification and management of AF', domain: 'KH' },
          { code: 'IM1.28', text: 'Discuss anticoagulation in AF and stroke prevention', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'AF and HF frequently coexist and worsen each other' },
          { slug: 'hypertension', reason: 'Most common cause of AF' },
        ],
        relatedDetails: [
          { slug: 'mitral-stenosis', reason: 'Classic valvular cause of AF', rel: 'clinical' },
          { slug: 'heart-block', reason: 'Differential for irregular rhythms', rel: 'clinical' },
        ],
      },
    },
    'cardiac-tamponade': {
      title: 'Cardiac Tamponade',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.17', 'IM3.5'],
      prerequisites: ['pericardial-effusion', 'pericarditis-acute'],
      related: ['pericardial-effusion', 'heart-failure'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.17', text: 'Describe clinical features and emergency management of cardiac tamponade', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'pericardial-effusion', reason: 'Tamponade results from rapid or large pericardial effusion' },
          { slug: 'pericarditis-acute', reason: 'Common cause of effusion leading to tamponade' },
        ],
        relatedDetails: [
          { slug: 'pericardial-effusion', reason: 'Tamponade is a complication of pericardial effusion', rel: 'clinical' },
          { slug: 'heart-failure', reason: 'Both present with elevated JVP and hypotension', rel: 'clinical' },
        ],
      },
    },
    'cardiac-transplant': {
      title: 'Cardiac Transplant',
      depth: 'PG', highYield: false,
      nmc_codes: ['IM2.17', 'IM3.14'],
      prerequisites: ['heart-failure', 'dilated-cardiomyopathy'],
      related: ['heart-failure', 'renal-transplant'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.17', text: 'Discuss indications and complications of cardiac transplant', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'End-stage HF is the primary indication for cardiac transplant' },
          { slug: 'dilated-cardiomyopathy', reason: 'Most common indication for transplant' },
        ],
        relatedDetails: [
          { slug: 'renal-transplant', reason: 'Shared principles of transplant immunology', rel: 'clinical' },
        ],
      },
    },
    'coronary-artery-disease': {
      title: 'Coronary Artery Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.2', 'IM2.3', 'IM2.5', 'IM2.9', 'IM10.1'],
      prerequisites: ['hypertension'],
      related: ['acute-coronary-syndrome', 'myocardial-infarction', 'heart-failure'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.1', text: 'Describe and discuss aetiology and risk factors for CAD', domain: 'KH' },
          { code: 'IM2.5', text: 'Describe pathophysiology and clinical features of CAD', domain: 'KH' },
          { code: 'IM2.9', text: 'Discuss management of stable angina', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'hypertension', reason: 'Major risk factor for atherosclerosis' },
        ],
        relatedDetails: [
          { slug: 'acute-coronary-syndrome', reason: 'ACS is acute complication of CAD', rel: 'clinical' },
          { slug: 'myocardial-infarction', reason: 'MI results from complete coronary occlusion', rel: 'clinical' },
        ],
      },
    },
    'dilated-cardiomyopathy': {
      title: 'Dilated Cardiomyopathy',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM3.1', 'IM3.5', 'IM3.7'],
      prerequisites: ['heart-failure'],
      related: ['hypertrophic-cardiomyopathy', 'heart-failure', 'myocarditis'],
      enrichment: {
        nmcCodes: [
          { code: 'IM3.1', text: 'Describe aetiology and types of cardiomyopathy', domain: 'KH' },
          { code: 'IM3.5', text: 'Discuss clinical features and management of DCM', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'DCM is a major cause of systolic heart failure' },
        ],
        relatedDetails: [
          { slug: 'hypertrophic-cardiomyopathy', reason: 'Differential diagnosis of cardiomyopathy', rel: 'clinical' },
          { slug: 'myocarditis', reason: 'Viral myocarditis can cause DCM', rel: 'clinical' },
        ],
      },
    },
    'endocarditis': {
      title: 'Infective Endocarditis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.12', 'IM1.13', 'IM1.14'],
      prerequisites: ['valvular-heart-disease'],
      related: ['mitral-stenosis', 'heart-failure', 'acute-coronary-syndrome'],
      enrichment: {
        nmcCodes: [
          { code: 'IM1.12', text: 'Describe aetiology, pathogenesis, clinical features and diagnosis of IE', domain: 'KH' },
          { code: 'IM1.13', text: 'Discuss Duke criteria and management of IE', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'valvular-heart-disease', reason: 'Damaged valves predispose to IE' },
        ],
        relatedDetails: [
          { slug: 'mitral-stenosis', reason: 'RHD-damaged valves are at risk for IE', rel: 'clinical' },
          { slug: 'heart-failure', reason: 'Valvular destruction in IE leads to HF', rel: 'clinical' },
        ],
      },
    },
    'heart-block': {
      title: 'Heart Block',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.19', 'IM1.28', 'IM1.4', 'IM1.7'],
      prerequisites: ['coronary-artery-disease'],
      related: ['atrial-fibrillation', 'myocardial-infarction', 'heart-failure'],
      enrichment: {
        nmcCodes: [
          { code: 'IM1.19', text: 'Describe types and ECG features of heart block', domain: 'KH' },
          { code: 'IM1.28', text: 'Discuss indications for temporary and permanent pacing', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'coronary-artery-disease', reason: 'Ischemia is a common cause of heart block' },
        ],
        relatedDetails: [
          { slug: 'atrial-fibrillation', reason: 'Both are conduction/rhythm disorders', rel: 'clinical' },
          { slug: 'myocardial-infarction', reason: 'Inferior MI commonly causes heart block', rel: 'clinical' },
        ],
      },
    },
    'heart-failure': {
      title: 'Heart Failure',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM3.1', 'IM3.2', 'IM3.3', 'IM3.5', 'IM3.7', 'IM3.9', 'IM3.14'],
      prerequisites: ['coronary-artery-disease', 'hypertension'],
      related: ['dilated-cardiomyopathy', 'valvular-heart-disease', 'acute-coronary-syndrome'],
      enrichment: {
        nmcCodes: [
          { code: 'IM3.1', text: 'Define and classify heart failure', domain: 'KH' },
          { code: 'IM3.5', text: 'Describe clinical features and diagnosis of HF', domain: 'KH' },
          { code: 'IM3.7', text: 'Discuss pharmacological management of HF', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'coronary-artery-disease', reason: 'IHD is the most common cause of HF' },
          { slug: 'hypertension', reason: 'Chronic HTN leads to diastolic dysfunction' },
        ],
        relatedDetails: [
          { slug: 'dilated-cardiomyopathy', reason: 'DCM is a major cause of HFrEF', rel: 'clinical' },
          { slug: 'valvular-heart-disease', reason: 'Valvular lesions lead to HF', rel: 'clinical' },
        ],
      },
    },
    'hypertension': {
      title: 'Hypertension',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM8.2', 'IM8.3', 'IM8.4', 'IM8.14', 'IM8.19'],
      prerequisites: [],
      related: ['coronary-artery-disease', 'heart-failure', 'chronic-kidney-disease', 'renovascular-hypertension'],
      enrichment: {
        nmcCodes: [
          { code: 'IM8.2', text: 'Define and classify hypertension', domain: 'KH' },
          { code: 'IM8.4', text: 'Describe end-organ damage in hypertension', domain: 'KH' },
          { code: 'IM8.14', text: 'Discuss pharmacological management of hypertension', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'coronary-artery-disease', reason: 'HTN is major risk factor for CAD', rel: 'clinical' },
          { slug: 'chronic-kidney-disease', reason: 'HTN causes and results from CKD', rel: 'clinical' },
        ],
      },
    },
    'hypertrophic-cardiomyopathy': {
      title: 'Hypertrophic Cardiomyopathy',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM3.1', 'IM3.5'],
      prerequisites: ['heart-failure'],
      related: ['dilated-cardiomyopathy', 'heart-failure', 'heart-block'],
      enrichment: {
        nmcCodes: [
          { code: 'IM3.1', text: 'Describe types and genetics of cardiomyopathy including HCM', domain: 'KH' },
          { code: 'IM3.5', text: 'Discuss clinical features, diagnosis and management of HCM', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'HCM causes diastolic heart failure' },
        ],
        relatedDetails: [
          { slug: 'dilated-cardiomyopathy', reason: 'Differential diagnosis of cardiomyopathy', rel: 'clinical' },
          { slug: 'heart-block', reason: 'HCM can cause arrhythmias and sudden death', rel: 'clinical' },
        ],
      },
    },
    'mitral-stenosis': {
      title: 'Mitral Stenosis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.1', 'IM1.5', 'IM1.7', 'IM1.9'],
      prerequisites: ['valvular-heart-disease'],
      related: ['atrial-fibrillation', 'heart-failure', 'endocarditis', 'pulmonary-hypertension'],
      enrichment: {
        nmcCodes: [
          { code: 'IM1.1', text: 'Describe aetiology and pathophysiology of mitral stenosis', domain: 'KH' },
          { code: 'IM1.5', text: 'Discuss auscultatory findings and diagnosis of MS', domain: 'KH' },
          { code: 'IM1.9', text: 'Describe surgical and interventional management of MS', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'valvular-heart-disease', reason: 'MS is a specific valvular lesion' },
        ],
        relatedDetails: [
          { slug: 'atrial-fibrillation', reason: 'AF is the most common complication of MS', rel: 'clinical' },
          { slug: 'pulmonary-hypertension', reason: 'MS leads to pulmonary venous hypertension', rel: 'clinical' },
        ],
      },
    },
    'myocardial-infarction': {
      title: 'Myocardial Infarction',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.5', 'IM2.7', 'IM2.9', 'IM2.11', 'IM2.14'],
      prerequisites: ['coronary-artery-disease', 'acute-coronary-syndrome'],
      related: ['heart-failure', 'heart-block', 'pericarditis-acute', 'cardiac-tamponade'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.5', text: 'Describe pathophysiology and ECG changes in MI', domain: 'KH' },
          { code: 'IM2.7', text: 'Discuss thrombolysis and PCI in STEMI', domain: 'KH' },
          { code: 'IM2.11', text: 'Describe complications of MI', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'coronary-artery-disease', reason: 'MI results from coronary atherosclerosis' },
          { slug: 'acute-coronary-syndrome', reason: 'MI is a subtype of ACS' },
        ],
        relatedDetails: [
          { slug: 'heart-failure', reason: 'Post-MI LV dysfunction leads to HF', rel: 'clinical' },
          { slug: 'heart-block', reason: 'Inferior MI causes AV block', rel: 'clinical' },
        ],
      },
    },
    'myocarditis': {
      title: 'Myocarditis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM3.1', 'IM2.16'],
      prerequisites: ['heart-failure'],
      related: ['dilated-cardiomyopathy', 'pericarditis-acute', 'heart-failure'],
      enrichment: {
        nmcCodes: [
          { code: 'IM3.1', text: 'Describe aetiology, pathogenesis and clinical features of myocarditis', domain: 'KH' },
          { code: 'IM2.16', text: 'Interpret cardiac biomarkers in myocarditis', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'Myocarditis presents with acute heart failure' },
        ],
        relatedDetails: [
          { slug: 'dilated-cardiomyopathy', reason: 'Chronic myocarditis leads to DCM', rel: 'clinical' },
          { slug: 'pericarditis-acute', reason: 'Myopericarditis is a common overlap', rel: 'clinical' },
        ],
      },
    },
    'pericardial-effusion': {
      title: 'Pericardial Effusion',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.17', 'IM3.9'],
      prerequisites: ['pericarditis-acute'],
      related: ['cardiac-tamponade', 'heart-failure', 'pericarditis-acute'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.17', text: 'Describe aetiology, diagnosis and management of pericardial effusion', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'pericarditis-acute', reason: 'Pericarditis is the most common cause of effusion' },
        ],
        relatedDetails: [
          { slug: 'cardiac-tamponade', reason: 'Large effusion causes tamponade', rel: 'clinical' },
        ],
      },
    },
    'pericarditis-acute': {
      title: 'Acute Pericarditis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.21', 'IM2.5', 'IM2.11', 'IM2.16', 'IM2.20'],
      prerequisites: ['coronary-artery-disease'],
      related: ['pericardial-effusion', 'cardiac-tamponade', 'myocarditis', 'myocardial-infarction'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.5', text: 'Describe clinical features and ECG changes in pericarditis', domain: 'KH' },
          { code: 'IM2.20', text: 'Differentiate pericarditis from MI on ECG', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'coronary-artery-disease', reason: 'Must differentiate pericarditis from ACS' },
        ],
        relatedDetails: [
          { slug: 'pericardial-effusion', reason: 'Pericarditis causes effusion', rel: 'clinical' },
          { slug: 'cardiac-tamponade', reason: 'Complication of pericarditis with effusion', rel: 'clinical' },
          { slug: 'myocardial-infarction', reason: 'Key differential — chest pain with ECG changes', rel: 'clinical' },
        ],
      },
    },
    'pulmonary-hypertension': {
      title: 'Pulmonary Hypertension',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.17', 'IM3.5'],
      prerequisites: ['heart-failure', 'mitral-stenosis'],
      related: ['heart-failure', 'mitral-stenosis', 'pulmonary-embolism', 'interstitial-lung-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.17', text: 'Classify pulmonary hypertension and describe management', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'Left heart failure is the most common cause of PH' },
          { slug: 'mitral-stenosis', reason: 'MS causes pulmonary venous hypertension' },
        ],
        relatedDetails: [
          { slug: 'pulmonary-embolism', reason: 'Chronic PE causes Group 4 PH (CTEPH)', rel: 'clinical' },
          { slug: 'interstitial-lung-disease', reason: 'ILD causes Group 3 PH', rel: 'clinical' },
        ],
      },
    },
    'valvular-heart-disease': {
      title: 'Valvular Heart Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM1.1', 'IM1.5', 'IM1.7', 'IM1.9', 'IM1.11'],
      prerequisites: ['heart-failure'],
      related: ['mitral-stenosis', 'endocarditis', 'heart-failure', 'atrial-fibrillation'],
      enrichment: {
        nmcCodes: [
          { code: 'IM1.1', text: 'Describe aetiology and pathophysiology of valvular heart disease', domain: 'KH' },
          { code: 'IM1.5', text: 'Discuss auscultatory findings in valvular lesions', domain: 'KH' },
          { code: 'IM1.11', text: 'Describe indications for surgery in VHD', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'VHD leads to heart failure if untreated' },
        ],
        relatedDetails: [
          { slug: 'mitral-stenosis', reason: 'MS is the prototypical valvular lesion', rel: 'clinical' },
          { slug: 'endocarditis', reason: 'VHD predisposes to infective endocarditis', rel: 'clinical' },
        ],
      },
    },
  },
  pulmonology: {
    'asthma': {
      title: 'Bronchial Asthma',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM6.1', 'IM6.2', 'IM6.3', 'IM6.5', 'IM6.7'],
      prerequisites: [],
      related: ['copd', 'pneumonia', 'pulmonary-embolism'],
      enrichment: {
        nmcCodes: [
          { code: 'IM6.1', text: 'Define and classify bronchial asthma', domain: 'KH' },
          { code: 'IM6.3', text: 'Discuss stepwise management of asthma', domain: 'KH' },
          { code: 'IM6.7', text: 'Describe management of acute severe asthma', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'copd', reason: 'Key differential for obstructive airway disease', rel: 'clinical' },
        ],
      },
    },
    'bronchiectasis': {
      title: 'Bronchiectasis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.3'],
      prerequisites: ['pneumonia'],
      related: ['copd', 'lung-abscess', 'pneumonia'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.1', text: 'Describe aetiology and pathogenesis of bronchiectasis', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'pneumonia', reason: 'Recurrent infections cause bronchiectasis' },
        ],
        relatedDetails: [
          { slug: 'copd', reason: 'Both are chronic airway diseases', rel: 'clinical' },
          { slug: 'lung-abscess', reason: 'Complication of bronchiectasis', rel: 'clinical' },
        ],
      },
    },
    'copd': {
      title: 'Chronic Obstructive Pulmonary Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM6.1', 'IM6.2', 'IM6.3', 'IM6.5', 'IM6.7', 'IM6.9'],
      prerequisites: [],
      related: ['asthma', 'pneumonia', 'pulmonary-hypertension', 'pneumothorax'],
      enrichment: {
        nmcCodes: [
          { code: 'IM6.1', text: 'Define and classify COPD', domain: 'KH' },
          { code: 'IM6.5', text: 'Discuss GOLD staging and management', domain: 'KH' },
          { code: 'IM6.9', text: 'Describe management of acute exacerbation of COPD', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'asthma', reason: 'Key differential — reversible vs irreversible obstruction', rel: 'clinical' },
          { slug: 'pneumothorax', reason: 'Complication of bullous COPD', rel: 'clinical' },
        ],
      },
    },
    'interstitial-lung-disease': {
      title: 'Interstitial Lung Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.3', 'IM2.5'],
      prerequisites: [],
      related: ['pulmonary-hypertension', 'lung-cancer', 'copd'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.1', text: 'Describe aetiology and classification of ILD', domain: 'KH' },
          { code: 'IM2.5', text: 'Discuss clinical features and HRCT findings in ILD', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'pulmonary-hypertension', reason: 'ILD causes Group 3 PH', rel: 'clinical' },
          { slug: 'lung-cancer', reason: 'IPF increases lung cancer risk', rel: 'clinical' },
        ],
      },
    },
    'lung-abscess': {
      title: 'Lung Abscess',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.3'],
      prerequisites: ['pneumonia'],
      related: ['pneumonia', 'bronchiectasis', 'lung-cancer'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.1', text: 'Describe aetiology and pathogenesis of lung abscess', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'pneumonia', reason: 'Aspiration pneumonia is the most common cause' },
        ],
        relatedDetails: [
          { slug: 'lung-cancer', reason: 'Post-obstructive abscess occurs in lung cancer', rel: 'clinical' },
        ],
      },
    },
    'lung-cancer': {
      title: 'Lung Cancer',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.3'],
      prerequisites: ['copd'],
      related: ['pleural-effusion', 'pulmonary-embolism', 'interstitial-lung-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.1', text: 'Describe types, staging and clinical features of lung cancer', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'copd', reason: 'Smoking is shared risk factor for COPD and lung cancer' },
        ],
        relatedDetails: [
          { slug: 'pleural-effusion', reason: 'Malignant effusion is common in lung cancer', rel: 'clinical' },
        ],
      },
    },
    'pleural-effusion': {
      title: 'Pleural Effusion',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM3.9', 'IM2.1'],
      prerequisites: ['heart-failure', 'pneumonia'],
      related: ['pneumonia', 'lung-cancer', 'nephrotic-syndrome'],
      enrichment: {
        nmcCodes: [
          { code: 'IM3.9', text: 'Describe Light criteria and management of pleural effusion', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'HF is the most common cause of transudative effusion' },
          { slug: 'pneumonia', reason: 'Parapneumonic effusion/empyema' },
        ],
        relatedDetails: [
          { slug: 'lung-cancer', reason: 'Malignant effusion', rel: 'clinical' },
          { slug: 'nephrotic-syndrome', reason: 'Hypoalbuminemia causes transudative effusion', rel: 'clinical' },
        ],
      },
    },
    'pneumonia': {
      title: 'Pneumonia',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM4.1', 'IM4.3', 'IM4.5', 'IM4.7', 'IM4.9'],
      prerequisites: [],
      related: ['pleural-effusion', 'lung-abscess', 'copd', 'asthma'],
      enrichment: {
        nmcCodes: [
          { code: 'IM4.1', text: 'Define and classify pneumonia', domain: 'KH' },
          { code: 'IM4.5', text: 'Describe CURB-65 severity scoring', domain: 'KH' },
          { code: 'IM4.7', text: 'Discuss empirical antibiotic therapy for pneumonia', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'pleural-effusion', reason: 'Parapneumonic effusion is complication', rel: 'clinical' },
          { slug: 'lung-abscess', reason: 'Necrotizing pneumonia leads to abscess', rel: 'clinical' },
        ],
      },
    },
    'pneumothorax': {
      title: 'Pneumothorax',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.17'],
      prerequisites: ['copd'],
      related: ['copd', 'pleural-effusion', 'cardiac-tamponade'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.17', text: 'Describe clinical features and emergency management of pneumothorax', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'copd', reason: 'Bullous COPD predisposes to secondary pneumothorax' },
        ],
        relatedDetails: [
          { slug: 'cardiac-tamponade', reason: 'Both cause acute cardiovascular compromise — tension pneumothorax mimics tamponade', rel: 'clinical' },
        ],
      },
    },
    'pulmonary-embolism': {
      title: 'Pulmonary Embolism',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM2.1', 'IM2.5', 'IM2.17'],
      prerequisites: ['heart-failure'],
      related: ['pulmonary-hypertension', 'pneumothorax', 'pleural-effusion'],
      enrichment: {
        nmcCodes: [
          { code: 'IM2.5', text: 'Describe pathophysiology, Wells score and diagnosis of PE', domain: 'KH' },
          { code: 'IM2.17', text: 'Discuss emergency management and thrombolysis in PE', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'heart-failure', reason: 'Immobility and stasis in HF predispose to DVT/PE' },
        ],
        relatedDetails: [
          { slug: 'pulmonary-hypertension', reason: 'Chronic PE causes CTEPH', rel: 'clinical' },
        ],
      },
    },
  },
  nephrology: {
    'acute-kidney-injury': {
      title: 'Acute Kidney Injury',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.2', 'IM9.3', 'IM9.5', 'IM9.7'],
      prerequisites: [],
      related: ['chronic-kidney-disease', 'glomerulonephritis', 'electrolyte-disorders'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Define and classify AKI using KDIGO criteria', domain: 'KH' },
          { code: 'IM9.3', text: 'Describe pre-renal, intrinsic and post-renal causes of AKI', domain: 'KH' },
          { code: 'IM9.7', text: 'Discuss indications for dialysis in AKI', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'chronic-kidney-disease', reason: 'AKI can progress to CKD', rel: 'clinical' },
          { slug: 'electrolyte-disorders', reason: 'Hyperkalemia and acidosis in AKI', rel: 'clinical' },
        ],
      },
    },
    'chronic-kidney-disease': {
      title: 'Chronic Kidney Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.5', 'IM9.7', 'IM9.9'],
      prerequisites: ['acute-kidney-injury'],
      related: ['diabetic-nephropathy', 'hypertension', 'renal-transplant', 'electrolyte-disorders'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Define and stage CKD using GFR and albuminuria', domain: 'KH' },
          { code: 'IM9.5', text: 'Discuss management of CKD complications', domain: 'KH' },
          { code: 'IM9.9', text: 'Describe renoprotective strategies', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'acute-kidney-injury', reason: 'AKI can transition to CKD' },
        ],
        relatedDetails: [
          { slug: 'diabetic-nephropathy', reason: 'DM is the most common cause of CKD', rel: 'clinical' },
          { slug: 'renal-transplant', reason: 'Transplant is definitive treatment for ESKD', rel: 'clinical' },
        ],
      },
    },
    'diabetic-nephropathy': {
      title: 'Diabetic Nephropathy',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.5'],
      prerequisites: ['chronic-kidney-disease'],
      related: ['nephrotic-syndrome', 'hypertension', 'chronic-kidney-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe pathogenesis and staging of diabetic nephropathy', domain: 'KH' },
          { code: 'IM9.5', text: 'Discuss BP targets and SGLT2 inhibitors in diabetic nephropathy', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'chronic-kidney-disease', reason: 'Diabetic nephropathy is the leading cause of CKD' },
        ],
        relatedDetails: [
          { slug: 'nephrotic-syndrome', reason: 'Advanced DN presents with nephrotic-range proteinuria', rel: 'clinical' },
        ],
      },
    },
    'electrolyte-disorders': {
      title: 'Electrolyte Disorders',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.3', 'IM9.5', 'IM9.7'],
      prerequisites: ['acute-kidney-injury'],
      related: ['acute-kidney-injury', 'chronic-kidney-disease', 'renal-tubular-acidosis'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.3', text: 'Describe approach to hypo/hypernatremia and hypo/hyperkalemia', domain: 'KH' },
          { code: 'IM9.7', text: 'Discuss emergency management of hyperkalemia', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'acute-kidney-injury', reason: 'AKI commonly causes electrolyte disturbances' },
        ],
        relatedDetails: [
          { slug: 'renal-tubular-acidosis', reason: 'RTA causes specific electrolyte patterns', rel: 'clinical' },
          { slug: 'chronic-kidney-disease', reason: 'CKD causes chronic electrolyte imbalance', rel: 'clinical' },
        ],
      },
    },
    'glomerulonephritis': {
      title: 'Glomerulonephritis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3', 'IM9.5'],
      prerequisites: [],
      related: ['nephritic-syndrome', 'nephrotic-syndrome', 'iga-nephropathy', 'acute-kidney-injury'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Classify glomerulonephritis and describe pathological patterns', domain: 'KH' },
          { code: 'IM9.5', text: 'Discuss clinical features and management of GN', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'nephritic-syndrome', reason: 'GN is the pathological basis of nephritic syndrome', rel: 'clinical' },
          { slug: 'iga-nephropathy', reason: 'Most common GN worldwide', rel: 'clinical' },
        ],
      },
    },
    'iga-nephropathy': {
      title: 'IgA Nephropathy',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: ['glomerulonephritis'],
      related: ['nephritic-syndrome', 'glomerulonephritis', 'chronic-kidney-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe pathogenesis and clinical features of IgA nephropathy', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'glomerulonephritis', reason: 'IgA nephropathy is a type of GN' },
        ],
        relatedDetails: [
          { slug: 'nephritic-syndrome', reason: 'Presents with episodic gross hematuria', rel: 'clinical' },
          { slug: 'chronic-kidney-disease', reason: 'Progressive IgAN leads to CKD', rel: 'clinical' },
        ],
      },
    },
    'minimal-change-disease': {
      title: 'Minimal Change Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: ['nephrotic-syndrome'],
      related: ['nephrotic-syndrome', 'glomerulonephritis'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe pathology and clinical features of minimal change disease', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'nephrotic-syndrome', reason: 'MCD is the most common cause of nephrotic syndrome in children' },
        ],
        relatedDetails: [
          { slug: 'nephrotic-syndrome', reason: 'MCD presents as nephrotic syndrome', rel: 'clinical' },
          { slug: 'glomerulonephritis', reason: 'MCD is a glomerular disease', rel: 'clinical' },
        ],
      },
    },
    'nephritic-syndrome': {
      title: 'Nephritic Syndrome',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3', 'IM9.5'],
      prerequisites: ['glomerulonephritis'],
      related: ['nephrotic-syndrome', 'iga-nephropathy', 'glomerulonephritis', 'acute-kidney-injury'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe clinical features and causes of nephritic syndrome', domain: 'KH' },
          { code: 'IM9.3', text: 'Discuss workup of nephritic syndrome including complement levels', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'glomerulonephritis', reason: 'Nephritic syndrome is the clinical manifestation of GN' },
        ],
        relatedDetails: [
          { slug: 'nephrotic-syndrome', reason: 'Nephritic vs nephrotic — key differential', rel: 'clinical' },
          { slug: 'iga-nephropathy', reason: 'Common cause of nephritic presentation', rel: 'clinical' },
        ],
      },
    },
    'nephrotic-syndrome': {
      title: 'Nephrotic Syndrome',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3', 'IM9.5'],
      prerequisites: ['glomerulonephritis'],
      related: ['minimal-change-disease', 'diabetic-nephropathy', 'nephritic-syndrome'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe clinical features and causes of nephrotic syndrome', domain: 'KH' },
          { code: 'IM9.5', text: 'Discuss management of nephrotic syndrome including steroids', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'glomerulonephritis', reason: 'Glomerular diseases cause nephrotic syndrome' },
        ],
        relatedDetails: [
          { slug: 'minimal-change-disease', reason: 'MCD is the most common cause in children', rel: 'clinical' },
          { slug: 'diabetic-nephropathy', reason: 'Most common secondary cause in adults', rel: 'clinical' },
        ],
      },
    },
    'polycystic-kidney-disease': {
      title: 'Polycystic Kidney Disease',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: ['chronic-kidney-disease'],
      related: ['chronic-kidney-disease', 'hypertension', 'renal-transplant'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe genetics, clinical features and complications of ADPKD', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'chronic-kidney-disease', reason: 'ADPKD is a common genetic cause of CKD' },
        ],
        relatedDetails: [
          { slug: 'hypertension', reason: 'Early HTN is hallmark of ADPKD', rel: 'clinical' },
          { slug: 'renal-transplant', reason: 'ADPKD is common indication for transplant', rel: 'clinical' },
        ],
      },
    },
    'renal-artery-stenosis': {
      title: 'Renal Artery Stenosis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: ['hypertension', 'chronic-kidney-disease'],
      related: ['renovascular-hypertension', 'acute-kidney-injury', 'chronic-kidney-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe aetiology, diagnosis and management of renal artery stenosis', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'hypertension', reason: 'RAS causes secondary hypertension' },
          { slug: 'chronic-kidney-disease', reason: 'Ischemic nephropathy from RAS causes CKD' },
        ],
        relatedDetails: [
          { slug: 'renovascular-hypertension', reason: 'RAS is the cause of renovascular HTN', rel: 'clinical' },
          { slug: 'acute-kidney-injury', reason: 'Bilateral RAS or ACEi in RAS causes AKI', rel: 'clinical' },
        ],
      },
    },
    'renal-transplant': {
      title: 'Renal Transplant',
      depth: 'PG', highYield: false,
      nmc_codes: ['IM9.7', 'IM9.9'],
      prerequisites: ['chronic-kidney-disease'],
      related: ['chronic-kidney-disease', 'acute-kidney-injury', 'polycystic-kidney-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.7', text: 'Discuss indications, immunosuppression and complications of renal transplant', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'chronic-kidney-disease', reason: 'ESKD is the indication for renal transplant' },
        ],
        relatedDetails: [
          { slug: 'acute-kidney-injury', reason: 'Graft rejection presents as AKI', rel: 'clinical' },
        ],
      },
    },
    'renal-tubular-acidosis': {
      title: 'Renal Tubular Acidosis',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3', 'IM9.5'],
      prerequisites: ['electrolyte-disorders'],
      related: ['electrolyte-disorders', 'chronic-kidney-disease', 'nephrotic-syndrome'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Classify and describe types of RTA', domain: 'KH' },
          { code: 'IM9.3', text: 'Discuss approach to non-anion gap metabolic acidosis', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'electrolyte-disorders', reason: 'RTA causes specific electrolyte patterns' },
        ],
        relatedDetails: [
          { slug: 'chronic-kidney-disease', reason: 'Type 4 RTA occurs in CKD', rel: 'clinical' },
        ],
      },
    },
    'renovascular-hypertension': {
      title: 'Renovascular Hypertension',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: ['hypertension', 'renal-artery-stenosis'],
      related: ['renal-artery-stenosis', 'hypertension', 'chronic-kidney-disease'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe causes and approach to renovascular hypertension', domain: 'KH' },
        ],
        prereqDetails: [
          { slug: 'hypertension', reason: 'Renovascular HTN is a form of secondary hypertension' },
          { slug: 'renal-artery-stenosis', reason: 'RAS is the underlying cause' },
        ],
        relatedDetails: [
          { slug: 'chronic-kidney-disease', reason: 'Ischemic nephropathy from RAS', rel: 'clinical' },
        ],
      },
    },
    'urinalysis-interpretation': {
      title: 'Urinalysis Interpretation',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: [],
      related: ['glomerulonephritis', 'urinary-tract-infection', 'nephrotic-syndrome', 'nephritic-syndrome'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Interpret urinalysis findings in renal disease', domain: 'KH' },
          { code: 'IM9.3', text: 'Describe urine microscopy findings — casts, cells, crystals', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'glomerulonephritis', reason: 'RBC casts indicate GN', rel: 'clinical' },
          { slug: 'urinary-tract-infection', reason: 'Pyuria and bacteriuria indicate UTI', rel: 'clinical' },
        ],
      },
    },
    'urinary-tract-infection': {
      title: 'Urinary Tract Infection',
      depth: 'UG', highYield: true,
      nmc_codes: ['IM9.1', 'IM9.3'],
      prerequisites: [],
      related: ['acute-kidney-injury', 'urinalysis-interpretation'],
      enrichment: {
        nmcCodes: [
          { code: 'IM9.1', text: 'Describe aetiology, classification and management of UTI', domain: 'KH' },
        ],
        prereqDetails: [],
        relatedDetails: [
          { slug: 'acute-kidney-injury', reason: 'Pyelonephritis can cause AKI', rel: 'clinical' },
          { slug: 'urinalysis-interpretation', reason: 'Urinalysis is key to UTI diagnosis', rel: 'clinical' },
        ],
      },
    },
  },
};

// ============================================================
// HELPER: Generate _meta.yaml
// ============================================================
function genMeta(slug, t) {
  let yaml = `title: "${t.title}"
slug: ${slug}
depth: "${t.depth}"
highYield: ${t.highYield}
nmc_codes:
${t.nmc_codes.map(c => `  - "${c}"`).join('\n')}
prerequisites:
${t.prerequisites.length ? t.prerequisites.map(p => `  - "${p}"`).join('\n') : '  []'}
related_topics:
${t.related.length ? t.related.map(r => `  - "${r}"`).join('\n') : '  []'}
enrichment:
  nmcCodes:
${t.enrichment.nmcCodes.map(n => `    - code: "${n.code}"
      text: "${n.text}"
      domain: "${n.domain}"`).join('\n')}
  prerequisite_details:
${t.enrichment.prereqDetails.length ? t.enrichment.prereqDetails.map(p => `    - slug: "${p.slug}"
      reason: "${p.reason}"`).join('\n') : '    []'}
  related_details:
${t.enrichment.relatedDetails.length ? t.enrichment.relatedDetails.map(r => `    - slug: "${r.slug}"
      reason: "${r.reason}"
      relationship: "${r.rel}"`).join('\n') : '    []'}
`;
  return yaml;
}

// ============================================================
// WRITE ALL _meta.yaml files
// ============================================================
for (const [dept, topicsMap] of Object.entries(topics)) {
  for (const [slug, t] of Object.entries(topicsMap)) {
    // Map pericarditis to pericarditis-acute dir, valvular-heart-disease has no dir (only .md file)
    let dirName = slug;
    const dirPath = path.join(BASE, dept, dirName);
    
    // Create dir if doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    const metaPath = path.join(dirPath, '_meta.yaml');
    fs.writeFileSync(metaPath, genMeta(slug, t));
    console.log(`✓ ${dept}/${slug}/_meta.yaml`);
  }
}

console.log('\n✅ All _meta.yaml files written');
