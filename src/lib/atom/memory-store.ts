import fs from 'node:fs/promises';
import path from 'node:path';
import { getAtomWorkspaceRoot } from '@/lib/atom/user-workspace';

const MAX_APPEND_BYTES = 8_000;
const MAX_FILE_BYTES = 250_000;

type MemoryAppendInput = {
  scopeKey: string;
  section?: string;
  content: string;
  timestamp?: Date;
};

export type MemoryFileRead = {
  path: string;
  relativePath: string;
  content: string;
};

function memoryRoot(scopeKey: string) {
  return path.join(getAtomWorkspaceRoot(scopeKey), 'memory');
}

function todayFileName(date = new Date()) {
  return `${date.toISOString().slice(0, 10)}.md`;
}

function clip(value: string, maxBytes: number) {
  const raw = Buffer.from(value, 'utf8');
  if (raw.byteLength <= maxBytes) return value;
  return raw.subarray(0, maxBytes).toString('utf8');
}

async function boundedAppend(filePath: string, line: string) {
  const clipped = clip(line, MAX_APPEND_BYTES);
  await fs.appendFile(filePath, clipped, { encoding: 'utf8' });

  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat || stat.size <= MAX_FILE_BYTES) return;

  const text = await fs.readFile(filePath, 'utf8');
  const cropped = text.slice(text.length - Math.floor(MAX_FILE_BYTES * 0.8));
  const marker = '\n\n---\n[auto-trimmed older memory to preserve bounded file size]\n';
  await fs.writeFile(filePath, `${marker}${cropped}`, 'utf8');
}

export async function ensureAtomMemoryStructure(scopeKey: string): Promise<{ memoryRoot: string; files: string[] }> {
  const root = memoryRoot(scopeKey);
  await fs.mkdir(root, { recursive: true });

  const now = new Date();
  const daily = path.join(root, todayFileName(now));
  const memoryIndex = path.join(getAtomWorkspaceRoot(scopeKey), 'MEMORY.md');

  const files = [daily, memoryIndex, path.join(root, 'preferences.md'), path.join(root, 'learning-profile.md'), path.join(root, 'topic-mastery.md')];

  for (const file of files) {
    try {
      await fs.access(file);
    } catch {
      const initial = file.endsWith('MEMORY.md')
        ? '# MEMORY.md\n\nScoped memory index.\n\n- Daily logs: ./memory/YYYY-MM-DD.md\n- Profiles: ./memory/preferences.md, ./memory/learning-profile.md, ./memory/topic-mastery.md\n'
        : `# ${path.basename(file)}\n\n`;
      await fs.writeFile(file, initial, { encoding: 'utf8', flag: 'wx' });
    }
  }

  return { memoryRoot: root, files };
}

export async function appendAtomMemory(input: MemoryAppendInput) {
  const structure = await ensureAtomMemoryStructure(input.scopeKey);
  const at = input.timestamp ?? new Date();
  const dailyPath = path.join(structure.memoryRoot, todayFileName(at));
  const section = input.section?.trim() || 'Session';
  const stamp = at.toISOString();
  const body = input.content.trim();
  if (!body) return;

  const block = `\n## ${section} @ ${stamp}\n${clip(body, MAX_APPEND_BYTES)}\n`;
  await boundedAppend(dailyPath, block);
}

export async function readAtomMemoryFiles(scopeKey: string): Promise<MemoryFileRead[]> {
  const structure = await ensureAtomMemoryStructure(scopeKey);
  const workspaceRoot = getAtomWorkspaceRoot(scopeKey);
  const entries = await fs.readdir(structure.memoryRoot, { withFileTypes: true });
  const memoryFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(structure.memoryRoot, entry.name));

  const all = [path.join(workspaceRoot, 'MEMORY.md'), ...memoryFiles].sort((a, b) => a.localeCompare(b));
  const out: MemoryFileRead[] = [];

  for (const file of all) {
    const content = await fs.readFile(file, 'utf8').catch(() => '');
    out.push({ path: file, relativePath: path.relative(workspaceRoot, file), content });
  }

  return out;
}
