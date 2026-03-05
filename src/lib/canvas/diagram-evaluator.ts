/**
 * Diagram Evaluator
 *
 * Compares student's Excalidraw drawing against expected diagram shapes
 * using vector comparison (shape positions, types, connections).
 * Supplements vision-based evaluation with deterministic checking.
 */

type ExcalidrawElement = Record<string, unknown>;

// =============================================================================
// TYPES
// =============================================================================

export interface ExpectedStructure {
  id: string;
  label: string;
  type: 'circle' | 'rectangle' | 'arrow' | 'line' | 'text' | 'any';
  x?: number;
  y?: number;
  /** Connected from */
  connectedFrom?: string;
  /** Connected to */
  connectedTo?: string;
  /** Whether this is required */
  required?: boolean;
}

export interface EvaluationResult {
  score: number;                    // 0-100
  structureScore: number;           // shapes present
  positionScore: number;            // relative positions correct
  connectionScore: number;          // arrows/connections correct
  found: string[];                  // correctly identified structures
  missing: string[];                // structures not found
  extra: string[];                  // unexpected structures
  feedback: string;                 // human-readable feedback
  hints: string[];                  // next hints if score is low
}

// =============================================================================
// SHAPE EXTRACTION
// =============================================================================

interface ExtractedShape {
  type: string;
  cx: number;
  cy: number;
  width: number;
  height: number;
  text?: string;
  points?: number[][];
}

function extractShapes(elements: ExcalidrawElement[]): ExtractedShape[] {
  const shapes: ExtractedShape[] = [];
  const textElements: ExcalidrawElement[] = [];
  const shapeElements: ExcalidrawElement[] = [];

  // Separate text from shapes
  for (const el of elements) {
    if (el.isDeleted) continue;
    if (el.type === 'text') textElements.push(el);
    else shapeElements.push(el);
  }

  for (const el of shapeElements) {
    const x = (el.x as number) || 0;
    const y = (el.y as number) || 0;
    const w = (el.width as number) || 0;
    const h = (el.height as number) || 0;
    const cx = x + w / 2;
    const cy = y + h / 2;

    // Find nearest text label
    let nearestText: string | undefined;
    let minDist = 100; // max distance to associate text
    for (const txt of textElements) {
      const tx = (txt.x as number) || 0;
      const ty = (txt.y as number) || 0;
      const dist = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearestText = txt.text as string;
      }
    }

    shapes.push({
      type: el.type as string,
      cx, cy, width: w, height: h,
      text: nearestText,
      points: el.points as number[][] | undefined,
    });
  }

  return shapes;
}

// =============================================================================
// MATCHING
// =============================================================================

const TYPE_MAP: Record<string, string[]> = {
  circle: ['ellipse'],
  rectangle: ['rectangle'],
  arrow: ['arrow'],
  line: ['line'],
  text: ['text'],
  any: ['ellipse', 'rectangle', 'diamond', 'arrow', 'line'],
};

function normalizeLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchesExpected(shape: ExtractedShape, expected: ExpectedStructure): boolean {
  // Type check
  const allowedTypes = TYPE_MAP[expected.type] || [expected.type];
  if (!allowedTypes.includes(shape.type) && expected.type !== 'any') return false;

  // Label check (fuzzy)
  if (shape.text) {
    const norm = normalizeLabel(shape.text);
    const expNorm = normalizeLabel(expected.label);
    if (norm.includes(expNorm) || expNorm.includes(norm)) return true;
  }

  // Position check (if label didn't match but position is close)
  if (expected.x !== undefined && expected.y !== undefined) {
    const dist = Math.sqrt((shape.cx - expected.x) ** 2 + (shape.cy - expected.y) ** 2);
    if (dist < 80) return true;
  }

  return false;
}

// =============================================================================
// EVALUATE
// =============================================================================

export function evaluateDiagram(
  studentElements: ExcalidrawElement[],
  expected: ExpectedStructure[]
): EvaluationResult {
  const studentShapes = extractShapes(studentElements);
  const found: string[] = [];
  const missing: string[] = [];
  const matchedStudentIndices = new Set<number>();

  // Match expected structures against student shapes
  for (const exp of expected) {
    let matched = false;
    for (let i = 0; i < studentShapes.length; i++) {
      if (matchedStudentIndices.has(i)) continue;
      if (matchesExpected(studentShapes[i], exp)) {
        found.push(exp.label);
        matchedStudentIndices.add(i);
        matched = true;
        break;
      }
    }
    if (!matched) {
      missing.push(exp.label);
    }
  }

  // Extra shapes (student drew but not expected)
  const extra: string[] = [];
  for (let i = 0; i < studentShapes.length; i++) {
    if (!matchedStudentIndices.has(i) && studentShapes[i].type !== 'text') {
      extra.push(studentShapes[i].text || `unknown ${studentShapes[i].type}`);
    }
  }

  // Score calculation
  const requiredCount = expected.filter(e => e.required !== false).length || expected.length;
  const requiredFound = expected.filter(e => e.required !== false && found.includes(e.label)).length;

  const structureScore = expected.length > 0 ? Math.round((found.length / expected.length) * 100) : 0;
  const connectionScore = 100; // TODO: evaluate arrow connections
  const positionScore = 100;   // TODO: evaluate relative positions
  const score = Math.round(
    structureScore * 0.5 +
    positionScore * 0.25 +
    connectionScore * 0.25
  );

  // Feedback generation
  let feedback = '';
  if (score >= 90) {
    feedback = `Excellent! You correctly identified ${found.length}/${expected.length} structures.`;
  } else if (score >= 70) {
    feedback = `Good attempt! You got ${found.length}/${expected.length} structures. Missing: ${missing.join(', ')}.`;
  } else if (score >= 40) {
    feedback = `Partial attempt. You found ${found.length}/${expected.length} structures. Key structures missing: ${missing.slice(0, 3).join(', ')}.`;
  } else {
    feedback = `Keep trying! Only ${found.length}/${expected.length} structures identified. Start with: ${missing[0] || 'the main structure'}.`;
  }

  // Hints for missing structures
  const hints: string[] = missing.slice(0, 3).map(m => `Try drawing the ${m}.`);

  return {
    score,
    structureScore,
    positionScore,
    connectionScore,
    found,
    missing,
    extra,
    feedback,
    hints,
  };
}
