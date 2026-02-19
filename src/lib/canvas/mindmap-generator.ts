/**
 * Mind Map Generator for Excalidraw
 * 
 * Generates Excalidraw scene elements programmatically from a structured
 * mind map definition. ATOM uses this to draw teaching diagrams.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface MindMapNode {
  id: string;
  label: string;
  /** Optional detail text shown smaller below label */
  detail?: string;
  children?: MindMapNode[];
  /** Category for color coding */
  category?: 'core' | 'clinical' | 'basic' | 'highyield' | 'mechanism' | 'diagnosis' | 'management';
  /** Shape override */
  shape?: 'rectangle' | 'ellipse' | 'diamond';
  /** Whether this node should be blank (quiz mode) */
  blank?: boolean;
}

export interface MindMapDefinition {
  title: string;
  root: MindMapNode;
  /** Layout direction */
  layout?: 'radial' | 'tree-right' | 'tree-down';
}

// =============================================================================
// COLOR SCHEMES
// =============================================================================

const CATEGORY_COLORS: Record<string, { bg: string; stroke: string; text: string }> = {
  core:       { bg: '#1a3a4a', stroke: '#5EEAD4', text: '#E8E0D5' },
  clinical:   { bg: '#1a2a4a', stroke: '#6BA8C9', text: '#E8E0D5' },
  basic:      { bg: '#1a3a2a', stroke: '#4ade80', text: '#E8E0D5' },
  highyield:  { bg: '#3a1a1a', stroke: '#f87171', text: '#E8E0D5' },
  mechanism:  { bg: '#2a1a3a', stroke: '#c084fc', text: '#E8E0D5' },
  diagnosis:  { bg: '#1a2a3a', stroke: '#60a5fa', text: '#E8E0D5' },
  management: { bg: '#2a2a1a', stroke: '#fbbf24', text: '#E8E0D5' },
  default:    { bg: '#253545', stroke: '#5BB3B3', text: '#E8E0D5' },
};

const BLANK_STYLE = { bg: '#1a1a2a', stroke: '#4a4a6a', text: '#4a4a6a' };

// =============================================================================
// ELEMENT FACTORIES
// =============================================================================

let elementCounter = 0;

function makeId(): string {
  return `mm_${Date.now()}_${elementCounter++}`;
}

function makeRectangle(
  x: number, y: number, w: number, h: number,
  opts: { bg: string; stroke: string; rounded?: boolean; groupId?: string }
): ExcalidrawElement {
  return {
    id: makeId(),
    type: 'rectangle',
    x, y,
    width: w,
    height: h,
    strokeColor: opts.stroke,
    backgroundColor: opts.bg,
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    roundness: opts.rounded !== false ? { type: 3, value: 12 } : null,
    groupIds: opts.groupId ? [opts.groupId] : [],
    isDeleted: false,
    boundElements: [],
    locked: false,
    angle: 0,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
  };
}

function makeEllipse(
  x: number, y: number, w: number, h: number,
  opts: { bg: string; stroke: string; groupId?: string }
): ExcalidrawElement {
  return {
    id: makeId(),
    type: 'ellipse',
    x, y,
    width: w,
    height: h,
    strokeColor: opts.stroke,
    backgroundColor: opts.bg,
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    groupIds: opts.groupId ? [opts.groupId] : [],
    isDeleted: false,
    boundElements: [],
    locked: false,
    angle: 0,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
  };
}

function makeDiamond(
  x: number, y: number, w: number, h: number,
  opts: { bg: string; stroke: string; groupId?: string }
): ExcalidrawElement {
  return {
    id: makeId(),
    type: 'diamond',
    x, y,
    width: w,
    height: h,
    strokeColor: opts.stroke,
    backgroundColor: opts.bg,
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    groupIds: opts.groupId ? [opts.groupId] : [],
    isDeleted: false,
    boundElements: [],
    locked: false,
    angle: 0,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
  };
}

function makeText(
  x: number, y: number, text: string,
  opts: { color: string; fontSize?: number; groupId?: string; bold?: boolean; align?: string }
): ExcalidrawElement {
  return {
    id: makeId(),
    type: 'text',
    x, y,
    width: text.length * (opts.fontSize || 16) * 0.6,
    height: (opts.fontSize || 16) * 1.4,
    text,
    fontSize: opts.fontSize || 16,
    fontFamily: 1,
    textAlign: opts.align || 'center',
    verticalAlign: 'middle',
    strokeColor: opts.color,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    roughness: 0,
    opacity: 100,
    groupIds: opts.groupId ? [opts.groupId] : [],
    isDeleted: false,
    boundElements: [],
    locked: false,
    angle: 0,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
  };
}

function makeArrow(
  startX: number, startY: number, endX: number, endY: number,
  opts: { stroke: string; groupId?: string }
): ExcalidrawElement {
  return {
    id: makeId(),
    type: 'arrow',
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    points: [[0, 0], [endX - startX, endY - startY]],
    strokeColor: opts.stroke,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 80,
    roundness: { type: 2 },
    groupIds: opts.groupId ? [opts.groupId] : [],
    isDeleted: false,
    boundElements: [],
    locked: false,
    angle: 0,
    startArrowhead: null,
    endArrowhead: 'arrow',
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
  };
}

// =============================================================================
// LAYOUT ENGINE
// =============================================================================

interface PositionedNode {
  node: MindMapNode;
  x: number;
  y: number;
  width: number;
  height: number;
  children: PositionedNode[];
}

type ExcalidrawElement = Record<string, unknown>;

const NODE_PADDING = 20;
const NODE_MIN_WIDTH = 140;
const NODE_MAX_WIDTH = 220;
const NODE_HEIGHT = 50;
const DETAIL_HEIGHT = 20;
const LEVEL_GAP_X = 200;
const LEVEL_GAP_Y = 80;
const SIBLING_GAP = 20;

function measureNode(node: MindMapNode): { width: number; height: number } {
  const textWidth = node.label.length * 10 + NODE_PADDING * 2;
  const width = Math.max(NODE_MIN_WIDTH, Math.min(NODE_MAX_WIDTH, textWidth));
  const height = node.detail ? NODE_HEIGHT + DETAIL_HEIGHT : NODE_HEIGHT;
  return { width, height };
}

/** Compute subtree height for tree-right layout */
function subtreeHeight(node: MindMapNode): number {
  if (!node.children || node.children.length === 0) {
    return measureNode(node).height;
  }
  let total = 0;
  for (const child of node.children) {
    total += subtreeHeight(child);
  }
  total += (node.children.length - 1) * SIBLING_GAP;
  return Math.max(measureNode(node).height, total);
}

function layoutTreeRight(node: MindMapNode, x: number, y: number, depth: number): PositionedNode {
  const { width, height } = measureNode(node);
  const children: PositionedNode[] = [];

  if (node.children && node.children.length > 0) {
    const totalChildHeight = node.children.reduce((sum, c) => sum + subtreeHeight(c), 0)
      + (node.children.length - 1) * SIBLING_GAP;
    
    let childY = y + height / 2 - totalChildHeight / 2;
    const childX = x + width + LEVEL_GAP_X;

    for (const child of node.children) {
      const childH = subtreeHeight(child);
      const positioned = layoutTreeRight(child, childX, childY + childH / 2 - measureNode(child).height / 2, depth + 1);
      children.push(positioned);
      childY += childH + SIBLING_GAP;
    }
  }

  return { node, x, y, width, height, children };
}

function layoutRadial(node: MindMapNode, centerX: number, centerY: number): PositionedNode {
  const { width, height } = measureNode(node);
  const x = centerX - width / 2;
  const y = centerY - height / 2;
  const children: PositionedNode[] = [];

  if (node.children && node.children.length > 0) {
    const count = node.children.length;
    const radius = 250 + count * 20;
    const startAngle = -Math.PI / 2;
    const angleStep = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * angleStep;
      const cx = centerX + radius * Math.cos(angle);
      const cy = centerY + radius * Math.sin(angle);
      const child = node.children[i];
      const { width: cw, height: ch } = measureNode(child);
      
      const positioned: PositionedNode = {
        node: child,
        x: cx - cw / 2,
        y: cy - ch / 2,
        width: cw,
        height: ch,
        children: [],
      };

      // Layout grandchildren as tree-right from each radial child
      if (child.children && child.children.length > 0) {
        const gcX = cx + cw / 2 + 60;
        let gcY = cy - (child.children.length * (NODE_HEIGHT + SIBLING_GAP)) / 2;
        for (const gc of child.children) {
          const { width: gcw, height: gch } = measureNode(gc);
          positioned.children.push({
            node: gc,
            x: gcX + (Math.cos(angle) > 0 ? 0 : -gcw - 60),
            y: gcY,
            width: gcw,
            height: gch,
            children: [],
          });
          gcY += gch + SIBLING_GAP;
        }
      }

      children.push(positioned);
    }
  }

  return { node, x, y, width, height, children };
}

// =============================================================================
// SCENE GENERATOR
// =============================================================================

function generateNodeElements(
  positioned: PositionedNode,
  parentCenter?: { x: number; y: number },
  depth: number = 0
): ExcalidrawElement[] {
  const elements: ExcalidrawElement[] = [];
  const { node, x, y, width, height } = positioned;
  const colors = node.blank
    ? BLANK_STYLE
    : CATEGORY_COLORS[node.category || 'default'] || CATEGORY_COLORS.default;
  
  const groupId = makeId();

  // Draw arrow from parent to this node
  if (parentCenter) {
    const nodeCenterX = x + width / 2;
    const nodeCenterY = y + height / 2;
    
    // Calculate arrow start/end points at node edges
    const dx = nodeCenterX - parentCenter.x;
    const dy = nodeCenterY - parentCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      const startX = parentCenter.x + (dx / dist) * 30;
      const startY = parentCenter.y + (dy / dist) * 30;
      const endX = nodeCenterX - (dx / dist) * (width / 2);
      const endY = nodeCenterY - (dy / dist) * (height / 2);
      
      elements.push(makeArrow(startX, startY, endX, endY, {
        stroke: colors.stroke + '88',
      }));
    }
  }

  // Draw node shape
  const shape = node.shape || (depth === 0 ? 'ellipse' : 'rectangle');
  const nodeWidth = depth === 0 ? width * 1.3 : width;
  const nodeHeight = depth === 0 ? height * 1.3 : height;
  const nodeX = depth === 0 ? x - (nodeWidth - width) / 2 : x;
  const nodeY = depth === 0 ? y - (nodeHeight - height) / 2 : y;

  if (shape === 'ellipse') {
    elements.push(makeEllipse(nodeX, nodeY, nodeWidth, nodeHeight, {
      bg: colors.bg, stroke: colors.stroke, groupId,
    }));
  } else if (shape === 'diamond') {
    elements.push(makeDiamond(nodeX, nodeY, nodeWidth, nodeHeight, {
      bg: colors.bg, stroke: colors.stroke, groupId,
    }));
  } else {
    elements.push(makeRectangle(nodeX, nodeY, nodeWidth, nodeHeight, {
      bg: colors.bg, stroke: colors.stroke, groupId, rounded: true,
    }));
  }

  // Draw label text
  const labelText = node.blank ? '???' : node.label;
  const fontSize = depth === 0 ? 20 : depth === 1 ? 16 : 14;
  const textEl = makeText(
    nodeX + nodeWidth / 2 - (labelText.length * fontSize * 0.3),
    nodeY + (node.detail ? nodeHeight * 0.25 : nodeHeight * 0.35),
    labelText,
    { color: colors.text, fontSize, groupId, bold: depth === 0 }
  );
  elements.push(textEl);

  // Draw detail text
  if (node.detail && !node.blank) {
    elements.push(makeText(
      nodeX + nodeWidth / 2 - (node.detail.length * 11 * 0.3),
      nodeY + nodeHeight * 0.6,
      node.detail,
      { color: colors.text + 'AA', fontSize: 11, groupId }
    ));
  }

  // Recurse children
  const thisCenter = { x: x + width / 2, y: y + height / 2 };
  for (const child of positioned.children) {
    elements.push(...generateNodeElements(child, thisCenter, depth + 1));
  }

  return elements;
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Generate Excalidraw scene elements from a mind map definition.
 * Returns array of Excalidraw elements ready for `updateScene()`.
 */
export function generateMindMapScene(
  definition: MindMapDefinition,
  canvasWidth: number = 1200,
  canvasHeight: number = 800
): ExcalidrawElement[] {
  elementCounter = 0;
  const layout = definition.layout || 'tree-right';

  let positioned: PositionedNode;
  
  if (layout === 'radial') {
    positioned = layoutRadial(definition.root, canvasWidth / 2, canvasHeight / 2);
  } else {
    // tree-right: start from left
    positioned = layoutTreeRight(definition.root, 60, canvasHeight / 2 - 25, 0);
  }

  return generateNodeElements(positioned);
}

/**
 * Generate elements for progressive reveal — returns arrays of elements
 * that should be added in sequence (for animation).
 */
export function generateProgressiveReveal(
  definition: MindMapDefinition,
  canvasWidth: number = 1200,
  canvasHeight: number = 800
): ExcalidrawElement[][] {
  elementCounter = 0;
  const layout = definition.layout || 'tree-right';

  let positioned: PositionedNode;
  if (layout === 'radial') {
    positioned = layoutRadial(definition.root, canvasWidth / 2, canvasHeight / 2);
  } else {
    positioned = layoutTreeRight(definition.root, 60, canvasHeight / 2 - 25, 0);
  }

  const stages: ExcalidrawElement[][] = [];
  
  // Stage 0: Root node only
  const rootElements = generateNodeElements({ ...positioned, children: [] });
  stages.push(rootElements);

  // Stage 1+: Each child branch
  const rootCenter = {
    x: positioned.x + positioned.width / 2,
    y: positioned.y + positioned.height / 2,
  };
  
  for (const child of positioned.children) {
    const childElements = generateNodeElements(child, rootCenter, 1);
    stages.push(childElements);
  }

  return stages;
}

// =============================================================================
// EXAMPLE MIND MAPS (for testing)
// =============================================================================

export const EXAMPLE_MINDMAPS: Record<string, MindMapDefinition> = {
  'portal-hypertension': {
    title: 'Portal Hypertension',
    layout: 'tree-right',
    root: {
      id: 'root',
      label: 'Portal Hypertension',
      detail: 'PV pressure > 10 mmHg',
      category: 'core',
      shape: 'ellipse',
      children: [
        {
          id: 'causes',
          label: 'Causes',
          category: 'basic',
          children: [
            { id: 'pre-hepatic', label: 'Pre-hepatic', detail: 'Portal vein thrombosis', category: 'basic' },
            { id: 'hepatic', label: 'Hepatic', detail: 'Cirrhosis (#1 cause)', category: 'highyield' },
            { id: 'post-hepatic', label: 'Post-hepatic', detail: 'Budd-Chiari syndrome', category: 'basic' },
          ],
        },
        {
          id: 'portosystemic',
          label: 'Portosystemic\nAnastomoses',
          category: 'highyield',
          children: [
            { id: 'esophageal', label: 'Esophageal', detail: 'L. gastric → Azygos', category: 'highyield' },
            { id: 'rectal', label: 'Rectal', detail: 'Sup. → Mid/Inf. rectal', category: 'clinical' },
            { id: 'umbilical', label: 'Periumbilical', detail: 'Paraumbilical → Epigastric', category: 'clinical' },
            { id: 'retroperitoneal', label: 'Retroperitoneal', detail: 'Colic → Renal/Lumbar', category: 'basic' },
          ],
        },
        {
          id: 'clinical',
          label: 'Clinical Features',
          category: 'clinical',
          children: [
            { id: 'varices', label: 'Esophageal Varices', detail: 'Hematemesis, melena', category: 'highyield' },
            { id: 'ascites', label: 'Ascites', detail: 'SAAG > 1.1', category: 'highyield' },
            { id: 'splenomegaly', label: 'Splenomegaly', detail: 'Congestive', category: 'clinical' },
            { id: 'caput', label: 'Caput Medusae', detail: 'Periumbilical veins', category: 'clinical' },
          ],
        },
        {
          id: 'management',
          label: 'Management',
          category: 'management',
          children: [
            { id: 'medical', label: 'Medical', detail: 'Beta-blockers, Octreotide', category: 'management' },
            { id: 'endoscopic', label: 'Endoscopic', detail: 'Band ligation, Sclerotherapy', category: 'management' },
            { id: 'tips', label: 'TIPS', detail: 'Portosystemic shunt', category: 'management' },
            { id: 'surgical', label: 'Surgical', detail: 'Splenorenal shunt', category: 'management' },
          ],
        },
      ],
    },
  },
};
