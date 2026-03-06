// Patient Simulator Types for NucleuX Academy

export type SimulatorStep = 
  | 'presentation'
  | 'history'
  | 'examination'
  | 'investigations'
  | 'management';

export interface PatientVitals {
  pulse: string;
  bp: string;
  temperature: string;
  respiratory_rate: string;
  spo2: string;
}

export interface HistoryQuestion {
  id: string;
  category: 'chief_complaint' | 'history_of_presenting_illness' | 'past_history' | 'family_history' | 'personal_history' | 'drug_history';
  question: string;
  answer: string;
  isRelevant: boolean; // whether this question helps with diagnosis
  points: number; // points awarded for asking
}

export interface ExaminationFinding {
  id: string;
  system: 'general' | 'abdomen' | 'cardiovascular' | 'respiratory' | 'neurological' | 'musculoskeletal';
  area: string;
  finding: string;
  isPositive: boolean; // positive = supports diagnosis
  isClassic: boolean; // is this a classic sign?
  textbookRef?: string;
  points: number;
}

export interface Investigation {
  id: string;
  category: 'laboratory' | 'imaging' | 'special';
  name: string;
  cost: number; // in rupees
  waitTime: number; // in seconds (simulated)
  result: string;
  normalRange?: string;
  isAbnormal: boolean;
  isEssential: boolean; // essential for diagnosis?
  isUnnecessary?: boolean; // wasteful for this case?
  textbookRef?: string;
  points: number;
  penaltyIfUnnecessary?: number;
}

export interface DiagnosisOption {
  id: string;
  name: string;
  isCorrect: boolean;
  partialCredit?: number; // if partially correct (differential)
  explanation: string;
}

export interface ManagementOption {
  id: string;
  type: 'immediate' | 'definitive' | 'supportive' | 'wrong';
  action: string;
  isCorrect: boolean;
  isHarmful?: boolean;
  explanation: string;
  points: number;
  penalty?: number;
}

export interface CaseTextbookReference {
  book: string;
  chapter: string;
  page?: string;
  keyPoint: string;
}

export interface CaseData {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  
  // Patient demographics
  patient: {
    age: number;
    gender: 'male' | 'female';
    occupation?: string;
    setting: string; // Emergency, OPD, Ward, etc.
  };
  
  // Presentation
  presentation: {
    chiefComplaint: string;
    scenario: string;
    vitals: PatientVitals;
    generalAppearance: string;
  };
  
  // History
  history: HistoryQuestion[];
  
  // Examination
  examination: ExaminationFinding[];
  
  // Investigations
  investigations: Investigation[];
  
  // Diagnosis
  diagnosis: {
    primary: DiagnosisOption;
    differentials: DiagnosisOption[];
  };
  
  // Management
  management: ManagementOption[];
  
  // Learning
  textbookReferences: CaseTextbookReference[];
  clinicalPearls: string[];
  
  // Scoring
  scoring: {
    maxHistoryPoints: number;
    maxExamPoints: number;
    maxInvestigationPoints: number;
    diagnosisPoints: number;
    managementPoints: number;
    totalMaxPoints: number;
    passingScore: number;
    excellentScore: number;
  };
}

export interface SimulatorState {
  currentStep: SimulatorStep;
  askedQuestions: string[];
  examinedAreas: string[];
  orderedInvestigations: string[];
  completedInvestigations: string[];
  selectedDiagnosis: string | null;
  selectedManagement: string[];
  score: {
    history: number;
    examination: number;
    investigations: number;
    diagnosis: number;
    management: number;
    penalties: number;
    total: number;
  };
  timeSpent: number; // seconds
  isComplete: boolean;
}

export interface InvestigationProgress {
  id: string;
  status: 'pending' | 'processing' | 'complete';
  progress: number; // 0-100
  startTime: number;
}
