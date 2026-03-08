export const ATOM_TASK_STATUSES = [
  'queued',
  'running',
  'needs_input',
  'completed',
  'failed',
  'cancelled',
] as const;

export const ATOM_TASK_MODES = ['quick', 'task'] as const;

export const ATOM_TASK_PHASES = [
  'plan',
  'retrieve',
  'reason',
  'draft',
  'finalize',
] as const;

export const ATOM_CONTROL_ACTIONS = ['stop', 'retry', 'continue', 'branch'] as const;

export type AtomTaskStatus = (typeof ATOM_TASK_STATUSES)[number];
export type AtomTaskMode = (typeof ATOM_TASK_MODES)[number];
export type AtomTaskPhase = (typeof ATOM_TASK_PHASES)[number];
export type AtomControlAction = (typeof ATOM_CONTROL_ACTIONS)[number];

export const ATOM_EVENT_TYPES = [
  'task.created',
  'task.started',
  'phase.started',
  'phase.completed',
  'tool.started',
  'tool.output',
  'tool.completed',
  'tool.failed',
  'assistant.delta',
  'artifact.created',
  'artifact.updated',
  'task.needs_input',
  'task.completed',
  'task.failed',
  'task.cancelled',
] as const;

export type AtomEventType = (typeof ATOM_EVENT_TYPES)[number];

export type AtomSourceSelection = {
  level?: string;
  bookIds?: string[];
  preset?: string;
  [key: string]: unknown;
};

export type AtomEventPayload = Record<string, unknown>;

export type AtomTaskEventEnvelope = {
  eventId: number;
  taskId: string;
  type: AtomEventType;
  ts: string;
  payload: AtomEventPayload;
};

export type CreateAtomTaskRequest = {
  message: string;
  mode?: AtomTaskMode;
  sourceSelection?: AtomSourceSelection;
  room?: string;
};

export type AtomTaskControlRequest = {
  action: AtomControlAction;
};
