import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Parent, Root, RootContent, Strong, Text } from 'mdast';

type Node = RootContent;

const SKIP_PARENTS = new Set([
  'link',
  'linkReference',
  'definition',
  'inlineCode',
  'code',
  'html',
  'heading',
  // prevent double-processing newly inserted nodes
  'strong',
  'emphasis',
]);

function bionicizeText(value: string): Node[] {
  // Keep whitespace tokens so layout stays identical.
  const tokens = value.split(/(\s+)/);
  const out: Node[] = [];

  for (const token of tokens) {
    if (!token) continue;

    // Preserve whitespace as-is
    if (/^\s+$/.test(token)) {
      out.push({ type: 'text', value: token });
      continue;
    }

    // Separate leading punctuation, core word, trailing punctuation.
    const m = token.match(/^(\W*)([A-Za-z0-9]+)(.*)$/);
    if (!m) {
      out.push({ type: 'text', value: token });
      continue;
    }

    const [, lead, core, tail] = m;

    if (lead) out.push({ type: 'text', value: lead });

    const len = core.length;
    const boldLen = Math.min(len, Math.max(1, Math.ceil(len * 0.4)));
    const head = core.slice(0, boldLen);
    const rest = core.slice(boldLen);

    const strong: Strong = { type: 'strong', children: [{ type: 'text', value: head }] };
    out.push(strong);

    if (rest) out.push({ type: 'text', value: rest });
    if (tail) out.push({ type: 'text', value: tail });
  }

  return out;
}

/**
 * remark plugin: Bionic Reading (bold first ~40% of each word)
 * - Skips code/inlineCode/links/headings/html
 * - Preserves whitespace
 */
export const remarkBionic: Plugin<[], Root> = () => {
  return (tree) => {
    // visit typing is strict; we mutate in-place and rely on parent-type skips to avoid double-processing
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || typeof index !== 'number') return;
      if (SKIP_PARENTS.has(parent.type)) return;

      const nextNodes = bionicizeText(node.value);
      parent.children.splice(index, 1, ...nextNodes);
    });
  };
};
