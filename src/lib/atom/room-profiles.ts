import type { QuickStartLevel } from '@/lib/atom/quick-start-schema';
import type { AtomSourcePreset } from '@/lib/atom/source-catalog';

export const ATOM_WORKSPACE_MODES = [
  'chat',
  'mcq',
  'flashcards',
  'ppt',
  'nucleux-original',
  'guided-deep-dive',
] as const;

export type AtomWorkspaceMode = (typeof ATOM_WORKSPACE_MODES)[number];

export type AtomRoomId = 'atom' | 'dashboard' | 'library' | 'classroom' | 'mcqs' | 'community' | 'arena';

export type AtomRoomProfile = {
  roomId: AtomRoomId;
  personaName: string;
  personaStyle: string;
  defaultMode: AtomWorkspaceMode;
  sourcePreset: AtomSourcePreset;
  depthDefault: number;
  safetyNotes: string;
  enabledModes: AtomWorkspaceMode[];
  defaultTopic: string;
  defaultLevel: QuickStartLevel;
  defaultTimeMinutes: number;
  defaultGoal: string;
};

export const ATOM_ROOM_PROFILES: Record<AtomRoomId, AtomRoomProfile> = {
  atom: {
    roomId: 'atom',
    personaName: 'ATOM Core',
    personaStyle: 'Balanced clinical tutor and execution copilot.',
    defaultMode: 'chat',
    sourcePreset: 'clinical-deep-dive',
    depthDefault: 3,
    safetyNotes: 'Keep outputs evidence-linked and avoid unsafe treatment directives.',
    enabledModes: [...ATOM_WORKSPACE_MODES],
    defaultTopic: 'General Surgery high-yield revision',
    defaultLevel: 'resident',
    defaultTimeMinutes: 25,
    defaultGoal: 'Build exam-ready recall with concise, practical output',
  },
  dashboard: {
    roomId: 'dashboard',
    personaName: 'Study Coach',
    personaStyle: 'Progress-first coach with concise daily prioritization.',
    defaultMode: 'chat',
    sourcePreset: 'rapid-revision',
    depthDefault: 2,
    safetyNotes: 'Prefer actionable routines over exhaustive content dumps.',
    enabledModes: ['chat', 'mcq', 'flashcards'],
    defaultTopic: 'Daily weak-area sprint',
    defaultLevel: 'resident',
    defaultTimeMinutes: 20,
    defaultGoal: 'Close weak areas quickly with measurable checkpoints',
  },
  library: {
    roomId: 'library',
    personaName: 'Research Assistant',
    personaStyle: 'Citation-first long-form explainer for textbook-backed answers.',
    defaultMode: 'nucleux-original',
    sourcePreset: 'clinical-deep-dive',
    depthDefault: 4,
    safetyNotes: 'Cite references; clearly mark uncertain or conflicting evidence.',
    enabledModes: ['chat', 'nucleux-original', 'ppt', 'flashcards'],
    defaultTopic: 'Evidence-backed deep dive',
    defaultLevel: 'pg',
    defaultTimeMinutes: 35,
    defaultGoal: 'Produce a source-backed synthesis with clear teaching takeaways',
  },
  classroom: {
    roomId: 'classroom',
    personaName: 'Lecture Companion',
    personaStyle: 'Live teaching companion that simplifies and structures notes.',
    defaultMode: 'ppt',
    sourcePreset: 'rapid-revision',
    depthDefault: 2,
    safetyNotes: 'Avoid overloading; prioritize clarity and lecture alignment.',
    enabledModes: ['chat', 'ppt', 'flashcards'],
    defaultTopic: 'Lecture follow-up topic',
    defaultLevel: 'intern',
    defaultTimeMinutes: 30,
    defaultGoal: 'Convert lecture content into high-yield, revisable structure',
  },
  mcqs: {
    roomId: 'mcqs',
    personaName: 'Question Tutor',
    personaStyle: 'Error-analysis tutor focused on reasoning and elimination.',
    defaultMode: 'mcq',
    sourcePreset: 'exam-focus',
    depthDefault: 3,
    safetyNotes: 'Highlight reasoning errors and avoid unsupported shortcuts.',
    enabledModes: ['chat', 'mcq', 'flashcards'],
    defaultTopic: 'MCQ error correction',
    defaultLevel: 'resident',
    defaultTimeMinutes: 25,
    defaultGoal: 'Improve answer accuracy by fixing reasoning gaps',
  },
  community: {
    roomId: 'community',
    personaName: 'Discussion Moderator',
    personaStyle: 'Consensus-focused and citation-grounded thread moderator.',
    defaultMode: 'chat',
    sourcePreset: 'clinical-deep-dive',
    depthDefault: 2,
    safetyNotes: 'Keep discourse respectful and evidence-grounded.',
    enabledModes: ['chat', 'flashcards'],
    defaultTopic: 'Thread synthesis and fact check',
    defaultLevel: 'resident',
    defaultTimeMinutes: 20,
    defaultGoal: 'Summarize consensus and flag evidence gaps in discussion',
  },
  arena: {
    roomId: 'arena',
    personaName: 'Competitive Coach',
    personaStyle: 'Performance optimizer for high-pressure exam scenarios.',
    defaultMode: 'mcq',
    sourcePreset: 'exam-focus',
    depthDefault: 3,
    safetyNotes: 'Promote healthy pace; avoid unsafe speed-over-accuracy advice.',
    enabledModes: ['chat', 'mcq', 'flashcards', 'guided-deep-dive'],
    defaultTopic: 'Rank-up strategy session',
    defaultLevel: 'resident',
    defaultTimeMinutes: 30,
    defaultGoal: 'Maximize score gains with focused high-yield practice',
  },
};

export function resolveAtomRoomProfile(roomId?: string | null): AtomRoomProfile {
  if (!roomId) return ATOM_ROOM_PROFILES.atom;
  return ATOM_ROOM_PROFILES[roomId as AtomRoomId] ?? ATOM_ROOM_PROFILES.atom;
}

export type RoomContextState = {
  topic: string;
  level: QuickStartLevel;
  timeAvailable: string;
  goal: string;
  mode: AtomWorkspaceMode;
};

export type RoomContextOverrideState = Partial<Record<keyof RoomContextState, boolean>>;

export function applyRoomDefaults(
  current: RoomContextState,
  room: AtomRoomProfile,
  overrides: RoomContextOverrideState,
): RoomContextState {
  const next: RoomContextState = {
    topic: overrides.topic ? current.topic : room.defaultTopic,
    level: overrides.level ? current.level : room.defaultLevel,
    timeAvailable: overrides.timeAvailable ? current.timeAvailable : String(room.defaultTimeMinutes),
    goal: overrides.goal ? current.goal : room.defaultGoal,
    mode: room.enabledModes.includes(current.mode)
      ? current.mode
      : room.enabledModes.includes(room.defaultMode)
        ? room.defaultMode
        : room.enabledModes[0] ?? current.mode,
  };

  return next;
}
