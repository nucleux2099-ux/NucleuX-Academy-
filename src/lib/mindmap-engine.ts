/**
 * Mind Map Engine for ATOM Classroom
 * Generates Excalidraw elements programmatically.
 */

// Types
export interface MindMapNode {
  id: string;
  text: string;
  level: number;
  category?: 'high-yield' | 'clinical' | 'basic' | 'pathology' | 'pharmacology' | 'anatomy';
  children?: MindMapNode[];
  blank?: boolean;
  note?: string;
}

export interface MindMapConfig {
  mode: 'teach' | 'quiz' | 'build' | 'viva';
  animate?: boolean;
  colorScheme?: 'medical' | 'default';
}

// Colors
const COLORS: Record<string, { bg: string; stroke: string; text: string }> = {
  root:         { bg: '#1B2838', stroke: '#5EEAD4', text: '#E8E0D5' },
  'high-yield': { bg: '#7F1D1D', stroke: '#EF4444', text: '#FCA5A5' },
  clinical:     { bg: '#1E3A5F', stroke: '#3B82F6', text: '#93C5FD' },
  basic:        { bg: '#14532D', stroke: '#22C55E', text: '#86EFAC' },
  pathology:    { bg: '#581C87', stroke: '#A855F7', text: '#D8B4FE' },
  pharmacology: { bg: '#78350F', stroke: '#F59E0B', text: '#FDE68A' },
  anatomy:      { bg: '#164E63', stroke: '#06B6D4', text: '#67E8F9' },
  blank:        { bg: '#374151', stroke: '#9CA3AF', text: '#D1D5DB' },
  default:      { bg: '#1B2838', stroke: '#5EEAD4', text: '#E8E0D5' },
};

interface LayoutNode {
  node: MindMapNode;
  x: number; y: number; width: number; height: number;
  parentId?: string;
}

type ExcalidrawElement = Record<string, unknown>;

function measureText(text: string) {
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map(l => l.length));
  return { width: Math.max(140, Math.min(280, maxLen * 9 + 40)), height: Math.max(50, lines.length * 24 + 30) };
}

function layoutRadial(root: MindMapNode, cx: number, cy: number): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  const { width: rw, height: rh } = measureText(root.text);
  nodes.push({ node: root, x: cx - rw/2, y: cy - rh/2, width: rw, height: rh });

  if (!root.children?.length) return nodes;

  const angleStep = (2 * Math.PI) / root.children.length;
  const r1 = 250, r2 = 200;

  root.children.forEach((child, i) => {
    const a = angleStep * i - Math.PI / 2;
    const childCx = cx + Math.cos(a) * r1;
    const childCy = cy + Math.sin(a) * r1;
    const { width: cw, height: ch } = measureText(child.text);
    nodes.push({ node: child, x: childCx - cw/2, y: childCy - ch/2, width: cw, height: ch, parentId: root.id });

    if (child.children?.length) {
      const spread = Math.PI / 4;
      const step = child.children.length > 1 ? spread / (child.children.length - 1) : 0;
      const start = a - spread / 2;

      child.children.forEach((sub, j) => {
        const sa = child.children!.length === 1 ? a : start + step * j;
        const sx = childCx + Math.cos(sa) * r2;
        const sy = childCy + Math.sin(sa) * r2;
        const { width: sw, height: sh } = measureText(sub.text);
        nodes.push({ node: sub, x: sx - sw/2, y: sy - sh/2, width: sw, height: sh, parentId: child.id });

        if (sub.children?.length) {
          const ls = Math.PI / 5;
          const lt = sub.children.length > 1 ? ls / (sub.children.length - 1) : 0;
          const la = sa - ls / 2;
          sub.children.forEach((leaf, k) => {
            const leafA = sub.children!.length === 1 ? sa : la + lt * k;
            const lx = sx + Math.cos(leafA) * 160;
            const ly = sy + Math.sin(leafA) * 160;
            const { width: lw, height: lh } = measureText(leaf.text);
            nodes.push({ node: leaf, x: lx - lw/2, y: ly - lh/2, width: lw, height: lh, parentId: sub.id });
          });
        }
      });
    }
  });
  return nodes;
}

function getColors(node: MindMapNode) {
  if (node.level === 0) return COLORS.root;
  return (node.category && COLORS[node.category]) || COLORS.default;
}

function makeRect(ln: LayoutNode, colors: ReturnType<typeof getColors>, isBlank: boolean): ExcalidrawElement[] {
  const c = isBlank ? COLORS.blank : colors;
  const rectId = `rect-${ln.node.id}`;
  const textId = `text-${ln.node.id}`;
  const displayText = isBlank ? '???' : ln.node.text;
  const seed = Math.floor(Math.random() * 100000);

  return [
    {
      id: rectId, type: 'rectangle',
      x: ln.x, y: ln.y, width: ln.width, height: ln.height,
      strokeColor: c.stroke, backgroundColor: c.bg, fillStyle: 'solid',
      strokeWidth: ln.node.level === 0 ? 3 : 2, roughness: 0, opacity: 100,
      angle: 0, groupIds: [], frameId: null, index: null,
      roundness: { type: 3, value: ln.node.level === 0 ? 20 : 8 },
      seed, version: 1, versionNonce: seed + 1, isDeleted: false,
      boundElements: [{ id: textId, type: 'text' }],
      updated: Date.now(), link: null, locked: false,
    },
    {
      id: textId, type: 'text',
      x: ln.x + 10, y: ln.y + (ln.height - 20) / 2, width: ln.width - 20, height: 20,
      text: displayText, fontSize: ln.node.level === 0 ? 20 : ln.node.level === 1 ? 16 : 14,
      fontFamily: 1, textAlign: 'center', verticalAlign: 'middle',
      strokeColor: c.text, backgroundColor: 'transparent', fillStyle: 'solid',
      strokeWidth: 1, roughness: 0, opacity: 100, angle: 0,
      groupIds: [], frameId: null, index: null, roundness: null,
      seed: seed + 2, version: 1, versionNonce: seed + 3, isDeleted: false,
      boundElements: null, updated: Date.now(), link: null, locked: false,
      containerId: rectId, originalText: displayText, autoResize: true, lineHeight: 1.25,
    },
  ];
}

function makeArrow(from: LayoutNode, to: LayoutNode, color: string): ExcalidrawElement {
  const fx = from.x + from.width/2, fy = from.y + from.height/2;
  const tx = to.x + to.width/2, ty = to.y + to.height/2;
  const seed = Math.floor(Math.random() * 100000);
  return {
    id: `arrow-${from.node.id}-${to.node.id}`, type: 'arrow',
    x: fx, y: fy, width: tx - fx, height: ty - fy,
    strokeColor: color, backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 2, roughness: 0, opacity: 70, angle: 0,
    groupIds: [], frameId: null, index: null, roundness: { type: 2 },
    seed, version: 1, versionNonce: seed + 1, isDeleted: false,
    boundElements: null, updated: Date.now(), link: null, locked: false,
    points: [[0, 0], [tx - fx, ty - fy]],
    startBinding: { elementId: `rect-${from.node.id}`, focus: 0, gap: 4, fixedPoint: null },
    endBinding: { elementId: `rect-${to.node.id}`, focus: 0, gap: 4, fixedPoint: null },
    startArrowhead: null, endArrowhead: 'arrow', elbowed: false,
  };
}

export function generateMindMap(root: MindMapNode, config: MindMapConfig = { mode: 'teach' }, w = 1200, h = 800): ExcalidrawElement[] {
  const lns = layoutRadial(root, w/2, h/2);
  const map = new Map(lns.map(ln => [ln.node.id, ln]));
  const els: ExcalidrawElement[] = [];

  lns.forEach(ln => { if (ln.parentId) { const p = map.get(ln.parentId); if (p) els.push(makeArrow(p, ln, getColors(ln.node).stroke)); } });
  lns.forEach(ln => els.push(...makeRect(ln, getColors(ln.node), config.mode === 'quiz' && !!ln.node.blank)));
  return els;
}

export function generateProgressiveSteps(root: MindMapNode, config: MindMapConfig = { mode: 'teach' }, w = 1200, h = 800): ExcalidrawElement[][] {
  const lns = layoutRadial(root, w/2, h/2);
  const map = new Map(lns.map(ln => [ln.node.id, ln]));
  const steps: ExcalidrawElement[][] = [];

  // Step 0: root
  const rootLn = lns.find(ln => ln.node.level === 0)!;
  steps.push(makeRect(rootLn, getColors(rootLn.node), false));

  // Step 1+: each L1 branch
  lns.filter(ln => ln.node.level === 1).forEach(ln => {
    const p = map.get(ln.parentId!)!;
    steps.push([makeArrow(p, ln, getColors(ln.node).stroke), ...makeRect(ln, getColors(ln.node), config.mode === 'quiz' && !!ln.node.blank)]);
  });

  // L2 grouped by parent
  const l2 = lns.filter(ln => ln.node.level === 2);
  const groups = new Map<string, LayoutNode[]>();
  l2.forEach(ln => { const g = groups.get(ln.parentId!) || []; g.push(ln); groups.set(ln.parentId!, g); });
  groups.forEach(group => {
    const step: ExcalidrawElement[] = [];
    group.forEach(ln => { const p = map.get(ln.parentId!)!; step.push(makeArrow(p, ln, getColors(ln.node).stroke), ...makeRect(ln, getColors(ln.node), config.mode === 'quiz' && !!ln.node.blank)); });
    steps.push(step);
  });

  // L3
  const l3 = lns.filter(ln => ln.node.level === 3);
  if (l3.length) {
    const step: ExcalidrawElement[] = [];
    l3.forEach(ln => { const p = map.get(ln.parentId!)!; step.push(makeArrow(p, ln, getColors(ln.node).stroke), ...makeRect(ln, getColors(ln.node), config.mode === 'quiz' && !!ln.node.blank)); });
    steps.push(step);
  }

  return steps;
}

export function parseMindMapFromJSON(json: string): MindMapNode | null {
  try {
    const match = json.match(/```(?:json)?\s*([\s\S]*?)```/);
    const parsed: unknown = JSON.parse((match ? match[1] : json).trim());
    if (typeof parsed === 'object' && parsed !== null && 'id' in parsed && 'text' in parsed && 'level' in parsed) {
      return parsed as MindMapNode;
    }
    return null;
  } catch { return null; }
}

// Example maps
export const EXAMPLE_MAPS: Record<string, MindMapNode> = {
  'portal hypertension': {
    id: 'root', text: 'Portal\nHypertension', level: 0,
    children: [
      { id: 'causes', text: 'Causes', level: 1, category: 'basic', children: [
        { id: 'pre', text: 'Pre-hepatic\n(PV thrombosis)', level: 2, category: 'basic' },
        { id: 'hepatic', text: 'Hepatic\n(Cirrhosis)', level: 2, category: 'high-yield' },
        { id: 'post', text: 'Post-hepatic\n(Budd-Chiari)', level: 2, category: 'basic' },
      ]},
      { id: 'consequences', text: 'Consequences', level: 1, category: 'clinical', children: [
        { id: 'varices', text: 'Esophageal\nVarices', level: 2, category: 'high-yield' },
        { id: 'ascites', text: 'Ascites', level: 2, category: 'clinical' },
        { id: 'splenomegaly', text: 'Splenomegaly', level: 2, category: 'clinical' },
        { id: 'caput', text: 'Caput\nMedusae', level: 2, category: 'clinical' },
      ]},
      { id: 'anastomoses', text: 'Porto-systemic\nAnastomoses', level: 1, category: 'anatomy', children: [
        { id: 'ge', text: 'GE Junction\n(L.gastric ↔\nEsophageal)', level: 2, category: 'high-yield' },
        { id: 'umbilical', text: 'Umbilical\n(Paraumb ↔\nEpigastric)', level: 2, category: 'anatomy' },
        { id: 'rectal', text: 'Rectal\n(Sup ↔ Mid/Inf)', level: 2, category: 'anatomy' },
        { id: 'retro', text: 'Retroperitoneal\n(Colic ↔ Renal)', level: 2, category: 'anatomy' },
      ]},
      { id: 'management', text: 'Management', level: 1, category: 'pharmacology', children: [
        { id: 'medical', text: 'Beta-blockers\nOctreotide', level: 2, category: 'pharmacology' },
        { id: 'endo', text: 'EVL\nSclerotherapy', level: 2, category: 'clinical' },
        { id: 'tips', text: 'TIPS', level: 2, category: 'high-yield' },
        { id: 'surgical', text: 'Surgical\nShunts', level: 2, category: 'clinical' },
      ]},
    ],
  },
  'acute pancreatitis': {
    id: 'root', text: 'Acute\nPancreatitis', level: 0,
    children: [
      { id: 'etiology', text: 'Etiology\n(GET SMASHED)', level: 1, category: 'high-yield', children: [
        { id: 'gallstones', text: 'Gallstones\n(40%)', level: 2, category: 'high-yield' },
        { id: 'alcohol', text: 'Alcohol\n(30%)', level: 2, category: 'high-yield' },
        { id: 'drugs', text: 'Drugs\n(Azathioprine)', level: 2, category: 'pharmacology' },
      ]},
      { id: 'dx', text: 'Diagnosis', level: 1, category: 'clinical', children: [
        { id: 'amylase', text: 'Amylase >3x\nLipase >3x', level: 2, category: 'high-yield' },
        { id: 'ct', text: 'CT contrast\n(after 72h)', level: 2, category: 'clinical' },
      ]},
      { id: 'severity', text: 'Severity', level: 1, category: 'high-yield', children: [
        { id: 'ranson', text: "Ranson's", level: 2, category: 'high-yield' },
        { id: 'apache', text: 'APACHE II', level: 2, category: 'clinical' },
        { id: 'ctsi', text: 'CTSI\n(Balthazar)', level: 2, category: 'clinical' },
      ]},
      { id: 'comp', text: 'Complications', level: 1, category: 'pathology', children: [
        { id: 'necrosis', text: 'Pancreatic\nNecrosis', level: 2, category: 'pathology' },
        { id: 'pseudo', text: 'Pseudocyst\n(>4 weeks)', level: 2, category: 'clinical' },
        { id: 'infected', text: 'Infected\nNecrosis', level: 2, category: 'high-yield' },
      ]},
    ],
  },
};
