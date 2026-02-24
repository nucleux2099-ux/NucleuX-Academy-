import type { 
  CaseData, 
  SimulatorStep, 
  SimulatorState, 
  HistoryQuestion,
  ExaminationFinding,
  Investigation,
  InvestigationProgress,
  ManagementOption,
} from '@/lib/types/simulator';

export type {
  CaseData,
  SimulatorStep,
  SimulatorState,
  HistoryQuestion,
  ExaminationFinding,
  Investigation,
  InvestigationProgress,
  ManagementOption,
};

export interface SimulatorActions {
  handleAskQuestion: (question: HistoryQuestion) => void;
  handleExamine: (finding: ExaminationFinding) => void;
  handleOrderInvestigation: (investigation: Investigation) => void;
  handleSelectDiagnosis: (diagnosisId: string) => void;
  handleSelectManagement: (option: ManagementOption) => void;
  goToStep: (step: SimulatorStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
