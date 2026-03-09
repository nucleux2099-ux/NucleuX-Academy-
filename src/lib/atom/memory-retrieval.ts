import { readAtomMemoryFiles } from '@/lib/atom/memory-store';

export type MemorySnippet = {
  text: string;
  score: number;
  sourceFile: string;
  startLine: number;
  endLine: number;
};

export type MemoryRetrievalProvider = {
  retrieve(scopeKey: string, query: string, limit: number): Promise<MemorySnippet[]>;
};

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3);
}

function chunkLines(lines: string[], size = 14): Array<{ text: string; startLine: number; endLine: number }> {
  const chunks: Array<{ text: string; startLine: number; endLine: number }> = [];
  for (let i = 0; i < lines.length; i += size) {
    const part = lines.slice(i, i + size);
    const text = part.join('\n').trim();
    if (!text) continue;
    chunks.push({ text, startLine: i + 1, endLine: i + part.length });
  }
  return chunks;
}

const INSTRUCTION_PATTERNS: RegExp[] = [
  /^\s*(system|assistant|developer)\s*:/i,
  /^\s*(ignore|disregard|bypass|override|forget)\b/i,
  /^\s*(follow|obey)\s+(these|this|my)\s+instructions?\b/i,
  /^\s*(reveal|exfiltrate|leak|print)\b.*\b(secret|token|key|prompt|memory)\b/i,
  /^\s*<\/?(system|assistant|developer|tool)\b/i,
];

export function sanitizeMemorySnippetForPrompt(input: string): string {
  const sanitizedLines = input.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;

    const matchesInstruction = INSTRUCTION_PATTERNS.some((pattern) => pattern.test(trimmed));
    if (matchesInstruction) {
      return `[sanitized instruction-like memory line removed] ${trimmed.replace(/`/g, "'")}`;
    }

    return line;
  });

  return sanitizedLines.join('\n');
}

class KeywordMemoryRetrievalProvider implements MemoryRetrievalProvider {
  async retrieve(scopeKey: string, query: string, limit: number): Promise<MemorySnippet[]> {
    const files = await readAtomMemoryFiles(scopeKey);
    const terms = tokenize(query);
    if (terms.length === 0) return [];

    const scored: MemorySnippet[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      for (const chunk of chunkLines(lines)) {
        const lower = chunk.text.toLowerCase();
        let score = 0;
        for (const term of terms) {
          if (lower.includes(term)) score += 2;
          const exact = lower.split(term).length - 1;
          score += exact;
        }
        if (score <= 0) continue;
        scored.push({
          text: chunk.text.slice(0, 900),
          score,
          sourceFile: file.relativePath,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
        });
      }
    }

    return scored
      .sort((a, b) => (b.score - a.score) || a.sourceFile.localeCompare(b.sourceFile) || (a.startLine - b.startLine))
      .slice(0, Math.max(1, limit));
  }
}

let provider: MemoryRetrievalProvider = new KeywordMemoryRetrievalProvider();

export function setMemoryRetrievalProvider(nextProvider: MemoryRetrievalProvider) {
  provider = nextProvider;
}

export async function retrieveScopedMemoryContext(params: { scopeKey: string; query: string; limit?: number }) {
  const snippets = await provider.retrieve(params.scopeKey, params.query, params.limit ?? 5);
  return snippets;
}

export function formatMemoryContextForPrompt(snippets: MemorySnippet[], maxChars = 6000): string {
  const deterministic = [...snippets].sort((a, b) => a.sourceFile.localeCompare(b.sourceFile) || a.startLine - b.startLine);
  const lines: string[] = ['## Retrieved scoped memory context'];
  let used = lines.join('\n').length;

  for (const snip of deterministic) {
    const cite = `[${snip.sourceFile}:${snip.startLine}-${snip.endLine}]`;
    const sanitized = sanitizeMemorySnippetForPrompt(snip.text);
    const block = `\n${cite}\n${sanitized}\n`;
    if (used + block.length > maxChars) break;
    lines.push(block);
    used += block.length;
  }

  return lines.join('\n').trim();
}
