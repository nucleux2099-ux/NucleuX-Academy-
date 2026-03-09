import fs from 'node:fs/promises';
import path from 'node:path';

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

export function getAtomWorkspaceRoot(scopeKey: string) {
  const baseRoot = process.env.ATOM_USER_WORKSPACES_ROOT ?? path.join(process.cwd(), '.atom-userspaces');
  return path.join(baseRoot, scopeKey);
}

function defaultTemplate(kind: BootstrapKind, input: AtomWorkspaceBootstrapInput): string {
  if (kind === 'HEARTBEAT') {
    return `# HEARTBEAT.md\n\n- scope: ${input.scopeKey}\n- user: ${input.userId}\n- room: ${input.roomId ?? 'atom'}\n\nLast bootstrap: ${new Date().toISOString()}\n`;
  }

  return `# ${kind}.md\n\nScope: ${input.scopeKey}\nUser: ${input.userId}\nRoom: ${input.roomId ?? 'atom'}\n\n> TODO: enrich this bootstrap file with personalized runtime context.\n`;
}

async function ensureFile(filePath: string, content: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return false;
  } catch {
    await fs.writeFile(filePath, content, 'utf8');
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
