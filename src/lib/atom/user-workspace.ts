import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { sanitizeScopeKeyForPath } from '@/lib/atom/user-scope';

type BootstrapKind = 'AGENTS' | 'SOUL' | 'TOOLS' | 'USER' | 'IDENTITY' | 'HEARTBEAT' | 'BOOTSTRAP';

const REQUIRED_FILES: Record<Exclude<BootstrapKind, 'BOOTSTRAP'>, string> = {
  AGENTS: 'AGENTS.md',
  SOUL: 'SOUL.md',
  TOOLS: 'TOOLS.md',
  USER: 'USER.md',
  IDENTITY: 'IDENTITY.md',
  HEARTBEAT: 'HEARTBEAT.md',
};

const OPTIONAL_FILES: Record<Extract<BootstrapKind, 'BOOTSTRAP'>, string> = {
  BOOTSTRAP: 'BOOTSTRAP.md',
};

export type AtomWorkspaceBootstrapInput = {
  scopeKey: string;
  userId: string;
  roomId?: string;
};

export type AtomWorkspaceBootstrapResult = {
  root: string;
  files: Array<{ kind: BootstrapKind; path: string; created: boolean }>;
};

function resolveBaseRoot() {
  return process.env.ATOM_USER_WORKSPACES_ROOT ?? path.join(os.homedir(), '.nucleux-atom-userspaces');
}

function safeWorkspaceRoot(scopeKey: string) {
  const baseRoot = resolveBaseRoot();
  const scopedDir = sanitizeScopeKeyForPath(scopeKey);
  const root = path.resolve(baseRoot, scopedDir);
  const baseResolved = path.resolve(baseRoot);
  if (!root.startsWith(`${baseResolved}${path.sep}`) && root !== baseResolved) {
    throw new Error('Unsafe workspace scope path');
  }
  return root;
}

export function getAtomWorkspaceRoot(scopeKey: string) {
  return safeWorkspaceRoot(scopeKey);
}

function defaultTemplate(kind: BootstrapKind, input: AtomWorkspaceBootstrapInput): string {
  const roomId = input.roomId ?? 'atom';
  const nowIso = new Date().toISOString();

  switch (kind) {
    case 'AGENTS':
      return `# AGENTS.md\n\n## Scope\n- scope_key: ${input.scopeKey}\n- user_id: ${input.userId}\n- room_id: ${roomId}\n\n## Working Rules\n- Keep this workspace user-isolated.\n- Do not read/write files outside this scope without explicit approval.\n- Store task notes and outputs under this directory.\n`;
    case 'SOUL':
      return `# SOUL.md\n\nI am ATOM for scope \`${input.scopeKey}\`.\n\n- Keep responses concise, factual, and supportive.\n- Use selected sources and cite uncertainty.\n`;
    case 'TOOLS':
      return `# TOOLS.md\n\nLocal notes for this scoped workspace.\n\n- Add source-specific shortcuts here.\n- Keep secrets out of committed files.\n`;
    case 'USER':
      return `# USER.md\n\n- user_id: ${input.userId}\n- scope_key: ${input.scopeKey}\n- room: ${roomId}\n`;
    case 'IDENTITY':
      return `# IDENTITY.md\n\n- assistant: ATOM\n- scope_key: ${input.scopeKey}\n- initialized_at: ${nowIso}\n`;
    case 'HEARTBEAT':
      return `# HEARTBEAT.md\n\n- scope_key: ${input.scopeKey}\n- user_id: ${input.userId}\n- room_id: ${roomId}\n- initialized_at: ${nowIso}\n\nStatus: ready\n`;
    case 'BOOTSTRAP':
      return `# BOOTSTRAP.md\n\nOptional bootstrap strategy file for scope \`${input.scopeKey}\`.\n\n- capture onboarding notes\n- capture source curation defaults\n`;
    default:
      return `# ${kind}.md\n`;
  }
}

async function ensureFile(filePath: string, content: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return false;
  } catch {
    await fs.writeFile(filePath, content, { encoding: 'utf8', flag: 'wx' });
    return true;
  }
}

export async function ensureAtomUserWorkspaceBootstrap(input: AtomWorkspaceBootstrapInput): Promise<AtomWorkspaceBootstrapResult> {
  const root = getAtomWorkspaceRoot(input.scopeKey);
  await fs.mkdir(root, { recursive: true });

  const files: AtomWorkspaceBootstrapResult['files'] = [];

  for (const [kind, filename] of Object.entries(REQUIRED_FILES) as Array<[Exclude<BootstrapKind, 'BOOTSTRAP'>, string]>) {
    const filePath = path.join(root, filename);
    const created = await ensureFile(filePath, defaultTemplate(kind, input));
    files.push({ kind, path: filePath, created });
  }

  for (const [kind, filename] of Object.entries(OPTIONAL_FILES) as Array<[Extract<BootstrapKind, 'BOOTSTRAP'>, string]>) {
    const filePath = path.join(root, filename);
    const shouldCreate = process.env.ATOM_ENABLE_BOOTSTRAP_FILE === 'true';
    if (!shouldCreate) {
      files.push({ kind, path: filePath, created: false });
      continue;
    }

    const created = await ensureFile(filePath, defaultTemplate(kind, input));
    files.push({ kind, path: filePath, created });
  }

  return { root, files };
}
