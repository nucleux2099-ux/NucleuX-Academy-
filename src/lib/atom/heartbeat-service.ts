import fs from 'node:fs/promises';
import path from 'node:path';
import { getAtomWorkspaceRoot } from '@/lib/atom/user-workspace';

export type HeartbeatConfig = {
  cadenceMinutes: number;
  activeHours?: { startHour: number; endHour: number; timezone?: string };
};

export type HeartbeatState = {
  scopeKey: string;
  lastRunAt?: string;
  lastActionAt?: string;
  lastStatus?: 'HEARTBEAT_OK' | 'ACTION';
  cadenceMinutes: number;
};

export type HeartbeatRunResult = {
  status: 'HEARTBEAT_OK' | 'ACTION';
  reason: 'outside_active_hours' | 'cadence_not_due' | 'no_action' | 'action_required';
  summary: string;
  readFiles: string[];
  shouldEmit: boolean;
};

function statePath(scopeKey: string) {
  return path.join(getAtomWorkspaceRoot(scopeKey), 'memory', 'heartbeat-state.json');
}

function heartbeatDocPath(scopeKey: string) {
  return path.join(getAtomWorkspaceRoot(scopeKey), 'HEARTBEAT.md');
}

function summaryPath(scopeKey: string) {
  return path.join(getAtomWorkspaceRoot(scopeKey), 'memory', 'summary.md');
}

export async function readHeartbeatScopedContext(scopeKey: string): Promise<{ heartbeat: string; summary?: string; files: string[] }> {
  const files: string[] = [];
  const heartbeatFile = heartbeatDocPath(scopeKey);
  const heartbeat = await fs.readFile(heartbeatFile, 'utf8').catch(() => '# HEARTBEAT.md\n');
  files.push('HEARTBEAT.md');

  const summaryFile = summaryPath(scopeKey);
  const summary = await fs.readFile(summaryFile, 'utf8').catch(() => undefined);
  if (summary) files.push('memory/summary.md');

  return { heartbeat, summary, files };
}

export function isWithinActiveHours(now: Date, activeHours?: HeartbeatConfig['activeHours']): boolean {
  if (!activeHours) return true;
  const hour = now.getHours();
  const { startHour, endHour } = activeHours;
  if (startHour === endHour) return true;
  if (startHour < endHour) return hour >= startHour && hour < endHour;
  return hour >= startHour || hour < endHour;
}

export function isCadenceDue(now: Date, lastRunAt?: string, cadenceMinutes = 180): boolean {
  if (!lastRunAt) return true;
  const last = new Date(lastRunAt).getTime();
  if (!Number.isFinite(last)) return true;
  return now.getTime() - last >= cadenceMinutes * 60_000;
}

export async function loadHeartbeatState(scopeKey: string, fallbackCadence = 180): Promise<HeartbeatState> {
  const file = statePath(scopeKey);
  const raw = await fs.readFile(file, 'utf8').catch(() => '');
  if (!raw) {
    return { scopeKey, cadenceMinutes: fallbackCadence };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<HeartbeatState>;
    return {
      scopeKey,
      lastRunAt: parsed.lastRunAt,
      lastActionAt: parsed.lastActionAt,
      lastStatus: parsed.lastStatus,
      cadenceMinutes: typeof parsed.cadenceMinutes === 'number' ? parsed.cadenceMinutes : fallbackCadence,
    };
  } catch {
    return { scopeKey, cadenceMinutes: fallbackCadence };
  }
}

export async function saveHeartbeatState(state: HeartbeatState): Promise<void> {
  const file = statePath(state.scopeKey);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

export async function runScopedHeartbeat(params: {
  scopeKey: string;
  config: HeartbeatConfig;
  now?: Date;
  evaluateAction?: (input: { heartbeat: string; summary?: string }) => Promise<{ action: boolean; summary: string }>;
}): Promise<HeartbeatRunResult> {
  const now = params.now ?? new Date();
  const state = await loadHeartbeatState(params.scopeKey, params.config.cadenceMinutes);

  if (!isWithinActiveHours(now, params.config.activeHours)) {
    return {
      status: 'HEARTBEAT_OK',
      reason: 'outside_active_hours',
      summary: 'Heartbeat skipped: outside active hours',
      readFiles: [],
      shouldEmit: false,
    };
  }

  if (!isCadenceDue(now, state.lastRunAt, params.config.cadenceMinutes)) {
    return {
      status: 'HEARTBEAT_OK',
      reason: 'cadence_not_due',
      summary: 'Heartbeat skipped: cadence not due',
      readFiles: [],
      shouldEmit: false,
    };
  }

  const scoped = await readHeartbeatScopedContext(params.scopeKey);
  const decision = params.evaluateAction
    ? await params.evaluateAction({ heartbeat: scoped.heartbeat, summary: scoped.summary })
    : { action: false, summary: 'No actionable heartbeat item found' };

  const result: HeartbeatRunResult = decision.action
    ? {
        status: 'ACTION',
        reason: 'action_required',
        summary: decision.summary,
        readFiles: scoped.files,
        shouldEmit: true,
      }
    : {
        status: 'HEARTBEAT_OK',
        reason: 'no_action',
        summary: 'HEARTBEAT_OK',
        readFiles: scoped.files,
        shouldEmit: false,
      };

  await saveHeartbeatState({
    ...state,
    cadenceMinutes: params.config.cadenceMinutes,
    lastRunAt: now.toISOString(),
    lastActionAt: result.status === 'ACTION' ? now.toISOString() : state.lastActionAt,
    lastStatus: result.status,
  });

  return result;
}
