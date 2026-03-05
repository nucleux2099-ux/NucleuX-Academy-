/**
 * Diagram Generator for Excalidraw
 *
 * Converts LLM-generated shape primitives (circle, rectangle, arrow, line, text, curve)
 * into Excalidraw scene elements. Unlike mind-map-generator which handles tree structures,
 * this handles free-form anatomical / concept diagrams.
 */

// =============================================================================
// TYPES
// =============================================================================

export type DiagramShapeType = 'circle' | 'rectangle' | 'arrow' | 'line' | 'text' | 'diamond' | 'curve';

export interface DiagramShape {
  type: DiagramShapeType;
  id?: string;
  label?: string;
  x?: number;
  y?: number;
  radius?: number;
  width?: number;
  height?: number;
  from?: string | [number, number];
  to?: string | [number, number];
  color?: DiagramColorCategory;
  fontSize?: number;
  dashed?: boolean;
}

export interface DiagramStep {
  explanation: string;
  draw: DiagramShape[];
  question?: string;
  hints?: string[];
}

export interface DiagramDefinition {
  title: string;
  steps: DiagramStep[];
  canvasWidth?: number;
  canvasHeight?: number;
}

export type DiagramColorCategory =
  | 'core' | 'clinical' | 'basic' | 'highyield' | 'mechanism'
  | 'vessel' | 'organ' | 'flow' | 'label' | 'default';

// =============================================================================
// COLORS
// =============================================================================

const CATEGORY_COLORS: Record<string, { bg: string; stroke: string; text: string }> = {
  core:      { bg: '#1a3a4a', stroke: '#5EEAD4', text: '#E8E0D5' },
  clinical:  { bg: '#1a2a4a', stroke: '#6BA8C9', text: '#E8E0D5' },
  basic:     { bg: '#1a3a2a', stroke: '#4ade80', text: '#E8E0D5' },
  highyield: { bg: '#3a1a1a', stroke: '#f87171', text: '#E8E0D5' },
  mechanism: { bg: '#2a1a3a', stroke: '#c084fc', text: '#E8E0D5' },
  vessel:    { bg: '#2a1a2a', stroke: '#f472b6', text: '#E8E0D5' },
  organ:     { bg: '#1a2a2a', stroke: '#38bdf8', text: '#E8E0D5' },
  flow:      { bg: 'transparent', stroke: '#fbbf24', text: '#fbbf24' },
  label:     { bg: 'transparent', stroke: '#A0B0BC', text: '#A0B0BC' },
  default:   { bg: '#253545', stroke: '#5BB3B3', text: '#E8E0D5' },
};

// =============================================================================
// ELEMENT FACTORIES
// =============================================================================

type ExcalidrawElement = Record<string, unknown>;

let elemCounter = 0;
function uid(): string { return `dg_${Date.now()}_${elemCounter++}`; }
function seed(): number { return Math.floor(Math.random() * 100000); }

function makeCircle(x: number, y: number, r: number, opts: { bg: string; stroke: string; dashed?: boolean }): ExcalidrawElement {
  const d = r * 2;
  return {
    id: uid(), type: 'ellipse', x: x - r, y: y - r, width: d, height: d,
    strokeColor: opts.stroke, backgroundColor: opts.bg, fillStyle: 'solid',
    strokeWidth: 2, strokeStyle: opts.dashed ? 'dashed' : 'solid', roughness: 0, opacity: 100,
    isDeleted: false, boundElements: [], locked: false, angle: 0,
    seed: seed(), version: 1, versionNonce: seed(), groupIds: [],
  };
}

function makeRect(x: number, y: number, w: number, h: number, opts: { bg: string; stroke: string; dashed?: boolean }): ExcalidrawElement {
  return {
    id: uid(), type: 'rectangle', x, y, width: w, height: h,
    strokeColor: opts.stroke, backgroundColor: opts.bg, fillStyle: 'solid',
    strokeWidth: 2, strokeStyle: opts.dashed ? 'dashed' : 'solid', roughness: 0, opacity: 100,
    roundness: { type: 3, value: 8 },
    isDeleted: false, boundElements: [], locked: false, angle: 0,
    seed: seed(), version: 1, versionNonce: seed(), groupIds: [],
  };
}

function makeDiamond(x: number, y: number, w: number, h: number, opts: { bg: string; stroke: string }): ExcalidrawElement {
  return {
    id: uid(), type: 'diamond', x, y, width: w, height: h,
    strokeColor: opts.stroke, backgroundColor: opts.bg, fillStyle: 'solid',
    strokeWidth: 2, roughness: 0, opacity: 100,
    isDeleted: false, boundElements: [], locked: false, angle: 0,
    seed: seed(), version: 1, versionNonce: seed(), groupIds: [],
  };
}

function makeText(x: number, y: number, text: string, opts: { color: string; fontSize?: number }): ExcalidrawElement {
  const fs = opts.fontSize || 14;
  return {
    id: uid(), type: 'text', x, y,
    width: text.length * fs * 0.6, height: fs * 1.4,
    text, fontSize: fs, fontFamily: 1, textAlign: 'center', verticalAlign: 'middle',
    strokeColor: opts.color, backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 1, roughness: 0, opacity: 100,
    isDeleted: false, boundElements: [], locked: false, angle: 0,
    seed: seed(), version: 1, versionNonce: seed(), groupIds: [],
  };
}

function makeArrow(sx: number, sy: number, ex: number, ey: number, opts: { stroke: string; dashed?: boolean }): ExcalidrawElement {
  return {
    id: uid(), type: 'arrow', x: sx, y: sy,
    width: ex - sx, height: ey - sy,
    points: [[0, 0], [ex - sx, ey - sy]],
    strokeColor: opts.stroke, backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 2, strokeStyle: opts.dashed ? 'dashed' : 'solid',
    roughness: 0, opacity: 85, roundness: { type: 2 },
    startArrowhead: null, endArrowhead: 'arrow',
    isDeleted: false, boundElements: [], locked: false, angle: 0,
    seed: seed(), version: 1, versionNonce: seed(), groupIds: [],
  };
}

function makeLine(sx: number, sy: number, ex: number, ey: number, opts: { stroke: string; dashed?: boolean }): ExcalidrawElement {
  return {
    id: uid(), type: 'line', x: sx, y: sy,
    width: ex - sx, height: ey - sy,
    points: [[0, 0], [ex - sx, ey - sy]],
    strokeColor: opts.stroke, backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 2, strokeStyle: opts.dashed ? 'dashed' : 'solid',
    roughness: 0, opacity: 85,
    isDeleted: false, boundElements: [], locked: false, angle: 0,
    seed: seed(), version: 1, versionNonce: seed(), groupIds: [],
  };
}

// =============================================================================
// SHAPE REGISTRY
// =============================================================================

export interface ShapeRegistry {
  [id: string]: { cx: number; cy: number; radius?: number; width?: number; height?: number };
}

function resolvePoint(ref: string | [number, number], registry: ShapeRegistry): { x: number; y: number } | null {
  if (Array.isArray(ref)) return { x: ref[0], y: ref[1] };
  const entry = registry[ref];
  if (!entry) return null;
  return { x: entry.cx, y: entry.cy };
}

// =============================================================================
// STEP RENDERER
// =============================================================================

export function renderDiagramShapes(shapes: DiagramShape[], registry: ShapeRegistry): ExcalidrawElement[] {
  const elements: ExcalidrawElement[] = [];

  for (const shape of shapes) {
    const cat = shape.color || 'default';
    const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;

    switch (shape.type) {
      case 'circle': {
        const cx = shape.x ?? 400;
        const cy = shape.y ?? 300;
        const r = shape.radius ?? 40;
        elements.push(makeCircle(cx, cy, r, { bg: colors.bg, stroke: colors.stroke, dashed: shape.dashed }));
        if (shape.label) {
          elements.push(makeText(cx - (shape.label.length * 14 * 0.3), cy - 7, shape.label, { color: colors.text }));
        }
        if (shape.id) registry[shape.id] = { cx, cy, radius: r };
        break;
      }
      case 'rectangle': {
        const w = shape.width ?? 120;
        const h = shape.height ?? 60;
        const rx = (shape.x ?? 400) - w / 2;
        const ry = (shape.y ?? 300) - h / 2;
        elements.push(makeRect(rx, ry, w, h, { bg: colors.bg, stroke: colors.stroke, dashed: shape.dashed }));
        if (shape.label) {
          elements.push(makeText(rx + w / 2 - (shape.label.length * 14 * 0.3), ry + h / 2 - 7, shape.label, { color: colors.text }));
        }
        if (shape.id) registry[shape.id] = { cx: rx + w / 2, cy: ry + h / 2, width: w, height: h };
        break;
      }
      case 'diamond': {
        const dw = shape.width ?? 100;
        const dh = shape.height ?? 80;
        const dx = (shape.x ?? 400) - dw / 2;
        const dy = (shape.y ?? 300) - dh / 2;
        elements.push(makeDiamond(dx, dy, dw, dh, { bg: colors.bg, stroke: colors.stroke }));
        if (shape.label) {
          elements.push(makeText(dx + dw / 2 - (shape.label.length * 12 * 0.3), dy + dh / 2 - 6, shape.label, { color: colors.text, fontSize: 12 }));
        }
        if (shape.id) registry[shape.id] = { cx: dx + dw / 2, cy: dy + dh / 2, width: dw, height: dh };
        break;
      }
      case 'text': {
        if (shape.label) {
          elements.push(makeText(shape.x ?? 400, shape.y ?? 300, shape.label, { color: colors.text, fontSize: shape.fontSize ?? 16 }));
        }
        break;
      }
      case 'arrow': {
        if (shape.from && shape.to) {
          const start = resolvePoint(shape.from, registry);
          const end = resolvePoint(shape.to, registry);
          if (start && end) {
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              const fromE = typeof shape.from === 'string' ? registry[shape.from] : null;
              const toE = typeof shape.to === 'string' ? registry[shape.to] : null;
              const sOff = fromE?.radius ?? (fromE?.width ? Math.min(fromE.width, fromE.height ?? 60) / 2 : 20);
              const eOff = toE?.radius ?? (toE?.width ? Math.min(toE.width, toE.height ?? 60) / 2 : 20);
              const sx = start.x + (dx / dist) * sOff;
              const sy = start.y + (dy / dist) * sOff;
              const ex = end.x - (dx / dist) * eOff;
              const ey = end.y - (dy / dist) * eOff;
              elements.push(makeArrow(sx, sy, ex, ey, { stroke: colors.stroke, dashed: shape.dashed }));
              if (shape.label) {
                const mx = (sx + ex) / 2;
                const my = (sy + ey) / 2 - 14;
                elements.push(makeText(mx - (shape.label.length * 11 * 0.3), my, shape.label, { color: colors.text, fontSize: 11 }));
              }
            }
          }
        }
        break;
      }
      case 'line':
      case 'curve': {
        if (shape.from && shape.to) {
          const start = resolvePoint(shape.from, registry);
          const end = resolvePoint(shape.to, registry);
          if (start && end) {
            elements.push(makeLine(start.x, start.y, end.x, end.y, { stroke: colors.stroke, dashed: shape.dashed || shape.type === 'curve' }));
            if (shape.label) {
              const mx = (start.x + end.x) / 2;
              const my = (start.y + end.y) / 2 - 14;
              elements.push(makeText(mx - (shape.label.length * 11 * 0.3), my, shape.label, { color: colors.text, fontSize: 11 }));
            }
          }
        }
        break;
      }
    }
  }
  return elements;
}

// =============================================================================
// FULL DIAGRAM RENDERER
// =============================================================================

export function generateDiagramScene(definition: DiagramDefinition): ExcalidrawElement[] {
  elemCounter = 0;
  const registry: ShapeRegistry = {};
  const allElements: ExcalidrawElement[] = [];
  allElements.push(makeText(20, 20, definition.title, { color: '#5EEAD4', fontSize: 22 }));
  for (const step of definition.steps) {
    allElements.push(...renderDiagramShapes(step.draw, registry));
  }
  return allElements;
}

export function generateDiagramSteps(definition: DiagramDefinition): {
  elements: ExcalidrawElement[];
  explanation: string;
  question?: string;
  hints?: string[];
}[] {
  elemCounter = 0;
  const registry: ShapeRegistry = {};
  return definition.steps.map(step => ({
    elements: renderDiagramShapes(step.draw, registry),
    explanation: step.explanation,
    question: step.question,
    hints: step.hints,
  }));
}

// =============================================================================
// PARSER
// =============================================================================

export function parseDiagramFromResponse(text: string): DiagramDefinition | null {
  const match = text.match(/```diagram\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as DiagramDefinition;
  } catch {
    console.error('Failed to parse diagram JSON');
    return null;
  }
}
