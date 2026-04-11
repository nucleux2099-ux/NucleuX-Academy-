export type WorkflowMode = 'quick' | 'deep-research' | 'guided-deep-dive';

export type WorkflowStatus = 
  | 'queued' 
  | 'initializing' 
  | 'executing' 
  | 'awaiting_input' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export type WorkflowState = {
  runId: string;
  taskId: string;
  userId: string;
  mode: WorkflowMode;
  status: WorkflowStatus;
  currentPhase: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowEvent = {
  eventId: string;
  runId: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
};

export type WorkflowTransition = {
  from: WorkflowStatus;
  to: WorkflowStatus;
};

export type WorkflowRuntimeConfig = {
  mode: WorkflowMode;
  params: Record<string, unknown>;
  context: {
    userId: string;
    scopeId?: string;
    roomProfile?: any;
  };
};
