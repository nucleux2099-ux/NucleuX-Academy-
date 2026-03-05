/**
 * Pre-built diagram templates for common medical topics.
 * These serve as reference diagrams and can be used by the LLM
 * via retrieval-augmented diagram generation.
 */

import type { DiagramDefinition } from './diagram-generator';

export const DIAGRAM_TEMPLATES: Record<string, DiagramDefinition> = {

  'nephron': {
    title: 'Nephron Structure',
    steps: [
      {
        explanation: 'Blood enters through the afferent arteriole into the glomerulus — a tuft of capillaries where filtration occurs.',
        draw: [
          { type: 'circle', id: 'glomerulus', label: 'Glomerulus', x: 400, y: 200, radius: 50, color: 'core' },
          { type: 'circle', id: 'bowman', label: "Bowman's Capsule", x: 400, y: 200, radius: 75, color: 'basic', dashed: true },
          { type: 'rectangle', id: 'afferent', label: 'Afferent arteriole', x: 200, y: 200, width: 120, height: 35, color: 'vessel' },
          { type: 'arrow', from: 'afferent', to: 'glomerulus', color: 'vessel' },
        ],
        question: 'Can you draw the efferent arteriole leaving the glomerulus?',
        hints: ['The efferent arteriole exits the glomerulus on the opposite side from the afferent.', 'It carries blood AWAY from the glomerulus.'],
      },
      {
        explanation: 'Blood exits through the efferent arteriole. Filtrate enters the proximal convoluted tubule (PCT) where most reabsorption occurs.',
        draw: [
          { type: 'rectangle', id: 'efferent', label: 'Efferent arteriole', x: 600, y: 200, width: 120, height: 35, color: 'vessel' },
          { type: 'arrow', from: 'glomerulus', to: 'efferent', color: 'vessel' },
          { type: 'rectangle', id: 'pct', label: 'PCT', x: 400, y: 350, width: 140, height: 40, color: 'clinical' },
          { type: 'arrow', from: 'bowman', to: 'pct', label: 'Filtrate', color: 'flow' },
        ],
        question: 'What is reabsorbed in the PCT? Draw the next segment.',
      },
      {
        explanation: 'The Loop of Henle descends into the medulla (thin descending — water permeable) and ascends (thick ascending — salt transport, water impermeable).',
        draw: [
          { type: 'rectangle', id: 'desc-limb', label: 'Descending limb', x: 300, y: 480, width: 110, height: 35, color: 'mechanism' },
          { type: 'rectangle', id: 'loop-tip', label: 'Loop tip', x: 400, y: 560, width: 80, height: 30, color: 'mechanism' },
          { type: 'rectangle', id: 'asc-limb', label: 'Ascending limb', x: 500, y: 480, width: 110, height: 35, color: 'mechanism' },
          { type: 'arrow', from: 'pct', to: 'desc-limb', color: 'flow' },
          { type: 'arrow', from: 'desc-limb', to: 'loop-tip', color: 'flow' },
          { type: 'arrow', from: 'loop-tip', to: 'asc-limb', color: 'flow' },
          { type: 'text', label: '💧 H₂O reabsorbed', x: 180, y: 475, color: 'label', fontSize: 11 },
          { type: 'text', label: '🧂 NaCl pumped out', x: 620, y: 475, color: 'label', fontSize: 11 },
        ],
      },
      {
        explanation: 'The distal convoluted tubule (DCT) fine-tunes electrolytes under aldosterone control, then drains into the collecting duct.',
        draw: [
          { type: 'rectangle', id: 'dct', label: 'DCT', x: 550, y: 350, width: 100, height: 40, color: 'clinical' },
          { type: 'rectangle', id: 'cd', label: 'Collecting Duct', x: 650, y: 480, width: 130, height: 40, color: 'highyield' },
          { type: 'arrow', from: 'asc-limb', to: 'dct', color: 'flow' },
          { type: 'arrow', from: 'dct', to: 'cd', color: 'flow' },
          { type: 'text', label: 'ADH acts here →', x: 730, y: 520, color: 'highyield', fontSize: 11 },
        ],
        question: 'Where does ADH act and what does it do?',
      },
    ],
  },

  'cardiac-cycle': {
    title: 'Cardiac Cycle',
    steps: [
      {
        explanation: 'The heart has four chambers. Deoxygenated blood enters the right atrium from the venae cavae.',
        draw: [
          { type: 'rectangle', id: 'ra', label: 'Right Atrium', x: 250, y: 200, width: 130, height: 80, color: 'clinical' },
          { type: 'rectangle', id: 'rv', label: 'Right Ventricle', x: 250, y: 380, width: 130, height: 100, color: 'clinical' },
          { type: 'rectangle', id: 'la', label: 'Left Atrium', x: 500, y: 200, width: 130, height: 80, color: 'highyield' },
          { type: 'rectangle', id: 'lv', label: 'Left Ventricle', x: 500, y: 380, width: 130, height: 100, color: 'highyield' },
          { type: 'rectangle', id: 'svc', label: 'SVC', x: 100, y: 120, width: 80, height: 30, color: 'vessel' },
          { type: 'rectangle', id: 'ivc', label: 'IVC', x: 100, y: 280, width: 80, height: 30, color: 'vessel' },
          { type: 'arrow', from: 'svc', to: 'ra', color: 'vessel' },
          { type: 'arrow', from: 'ivc', to: 'ra', color: 'vessel' },
        ],
        question: 'Draw the flow from RA → RV → Lungs.',
      },
      {
        explanation: 'Blood flows RA → RV through the tricuspid valve, then to the lungs via the pulmonary artery.',
        draw: [
          { type: 'arrow', from: 'ra', to: 'rv', label: 'Tricuspid valve', color: 'flow' },
          { type: 'circle', id: 'lungs', label: 'Lungs', x: 375, y: 80, radius: 55, color: 'organ' },
          { type: 'arrow', from: 'rv', to: 'lungs', label: 'Pulmonary artery', color: 'vessel' },
        ],
      },
      {
        explanation: 'Oxygenated blood returns via pulmonary veins to the left atrium, then LV → Aorta → Systemic circulation.',
        draw: [
          { type: 'arrow', from: 'lungs', to: 'la', label: 'Pulmonary veins', color: 'vessel' },
          { type: 'arrow', from: 'la', to: 'lv', label: 'Mitral valve', color: 'flow' },
          { type: 'rectangle', id: 'aorta', label: 'Aorta', x: 650, y: 300, width: 80, height: 35, color: 'highyield' },
          { type: 'arrow', from: 'lv', to: 'aorta', label: 'Aortic valve', color: 'flow' },
        ],
        question: 'Which valve separates LV from the aorta?',
      },
    ],
  },

  'portal-hypertension-anatomy': {
    title: 'Portal Hypertension — Anatomy',
    steps: [
      {
        explanation: 'The portal vein forms from the splenic vein and superior mesenteric vein behind the neck of the pancreas.',
        draw: [
          { type: 'rectangle', id: 'spleen', label: 'Spleen', x: 150, y: 300, width: 100, height: 50, color: 'organ' },
          { type: 'rectangle', id: 'smv-origin', label: 'Intestines', x: 150, y: 450, width: 100, height: 50, color: 'organ' },
          { type: 'rectangle', id: 'sv', label: 'Splenic vein', x: 350, y: 300, width: 110, height: 35, color: 'vessel' },
          { type: 'rectangle', id: 'smv', label: 'SMV', x: 350, y: 450, width: 80, height: 35, color: 'vessel' },
          { type: 'circle', id: 'portal', label: 'Portal vein', x: 500, y: 375, radius: 45, color: 'core' },
          { type: 'arrow', from: 'spleen', to: 'sv', color: 'vessel' },
          { type: 'arrow', from: 'smv-origin', to: 'smv', color: 'vessel' },
          { type: 'arrow', from: 'sv', to: 'portal', color: 'vessel' },
          { type: 'arrow', from: 'smv', to: 'portal', color: 'vessel' },
        ],
        question: 'Where do the splenic vein and SMV join?',
      },
      {
        explanation: 'Portal vein enters the liver. When pressure rises (>10 mmHg), blood finds alternative routes — portosystemic anastomoses.',
        draw: [
          { type: 'rectangle', id: 'liver', label: 'Liver', x: 650, y: 300, width: 140, height: 80, color: 'organ' },
          { type: 'arrow', from: 'portal', to: 'liver', color: 'flow' },
          { type: 'rectangle', id: 'ivc', label: 'IVC', x: 650, y: 180, width: 80, height: 35, color: 'vessel' },
          { type: 'arrow', from: 'liver', to: 'ivc', label: 'Hepatic veins', color: 'vessel' },
          { type: 'text', label: '⚠️ Pressure > 10 mmHg', x: 480, y: 260, color: 'highyield', fontSize: 13 },
        ],
      },
      {
        explanation: 'Key portosystemic anastomoses: (1) Esophageal — L. gastric ↔ Azygos, (2) Rectal — Sup. rectal ↔ Mid/Inf. rectal, (3) Periumbilical — Paraumbilical ↔ Epigastric, (4) Retroperitoneal.',
        draw: [
          { type: 'rectangle', id: 'esoph', label: 'Esophageal varices', x: 350, y: 120, width: 140, height: 35, color: 'highyield' },
          { type: 'rectangle', id: 'rectal', label: 'Rectal varices', x: 350, y: 570, width: 120, height: 35, color: 'clinical' },
          { type: 'rectangle', id: 'caput', label: 'Caput medusae', x: 150, y: 180, width: 120, height: 35, color: 'clinical' },
          { type: 'arrow', from: 'portal', to: 'esoph', label: 'L. gastric → Azygos', color: 'highyield', dashed: true },
          { type: 'arrow', from: 'portal', to: 'rectal', label: 'Sup. → Inf. rectal', color: 'clinical', dashed: true },
          { type: 'arrow', from: 'portal', to: 'caput', label: 'Paraumbilical', color: 'clinical', dashed: true },
        ],
        question: 'Which anastomosis causes hematemesis?',
        hints: ['Think about where the esophagus connects to the stomach.', 'Left gastric vein → Azygos system.'],
      },
    ],
  },

  'calot-triangle': {
    title: "Calot's Triangle (Hepatobiliary)",
    steps: [
      {
        explanation: "Calot's triangle is the critical safety zone in cholecystectomy. Its boundaries define where the cystic artery is found.",
        draw: [
          { type: 'rectangle', id: 'liver-edge', label: 'Liver (inferior edge)', x: 400, y: 100, width: 200, height: 40, color: 'organ' },
          { type: 'rectangle', id: 'chd', label: 'Common Hepatic Duct', x: 300, y: 350, width: 160, height: 35, color: 'clinical' },
          { type: 'rectangle', id: 'cd', label: 'Cystic Duct', x: 550, y: 250, width: 120, height: 35, color: 'clinical' },
          { type: 'line', from: 'liver-edge', to: 'chd', color: 'label', dashed: true },
          { type: 'line', from: 'liver-edge', to: 'cd', color: 'label', dashed: true },
          { type: 'line', from: 'chd', to: 'cd', color: 'label', dashed: true },
          { type: 'text', label: "CALOT'S △", x: 410, y: 230, color: 'highyield', fontSize: 16 },
        ],
        question: 'What structure runs INSIDE the triangle?',
        hints: ['It supplies blood to the gallbladder.', 'Cystic artery — usually a branch of the right hepatic artery.'],
      },
      {
        explanation: 'The cystic artery runs within the triangle, typically branching from the right hepatic artery.',
        draw: [
          { type: 'circle', id: 'cystic-art', label: 'Cystic artery', x: 450, y: 200, radius: 25, color: 'highyield' },
          { type: 'circle', id: 'gb', label: 'Gallbladder', x: 620, y: 150, radius: 40, color: 'organ' },
          { type: 'arrow', from: 'cystic-art', to: 'gb', color: 'vessel' },
          { type: 'text', label: '⚠️ Critical View of Safety', x: 350, y: 290, color: 'highyield', fontSize: 12 },
        ],
      },
    ],
  },

  'action-potential': {
    title: 'Action Potential Phases',
    steps: [
      {
        explanation: 'At rest, the neuron sits at -70mV (resting membrane potential). Na⁺/K⁺ ATPase maintains this.',
        draw: [
          { type: 'rectangle', id: 'baseline', label: 'Resting: -70mV', x: 100, y: 400, width: 130, height: 35, color: 'basic' },
          { type: 'text', label: 'Na⁺/K⁺ ATPase active', x: 80, y: 445, color: 'label', fontSize: 11 },
        ],
      },
      {
        explanation: 'Stimulus reaches threshold (-55mV). Voltage-gated Na⁺ channels open → rapid depolarization to +30mV.',
        draw: [
          { type: 'rectangle', id: 'threshold', label: 'Threshold: -55mV', x: 250, y: 350, width: 130, height: 30, color: 'mechanism' },
          { type: 'rectangle', id: 'peak', label: 'Peak: +30mV', x: 400, y: 120, width: 110, height: 35, color: 'highyield' },
          { type: 'arrow', from: 'baseline', to: 'threshold', label: 'Stimulus', color: 'flow' },
          { type: 'arrow', from: 'threshold', to: 'peak', label: 'Na⁺ influx', color: 'highyield' },
        ],
        question: 'What happens at the peak?',
      },
      {
        explanation: 'Na⁺ channels inactivate, K⁺ channels open → repolarization. Overshoots to hyperpolarization (-90mV) before returning.',
        draw: [
          { type: 'rectangle', id: 'repol', label: 'Repolarization', x: 550, y: 280, width: 120, height: 30, color: 'mechanism' },
          { type: 'rectangle', id: 'hyper', label: 'Hyperpolarization\n-90mV', x: 650, y: 440, width: 140, height: 40, color: 'clinical' },
          { type: 'arrow', from: 'peak', to: 'repol', label: 'K⁺ efflux', color: 'mechanism' },
          { type: 'arrow', from: 'repol', to: 'hyper', color: 'mechanism' },
          { type: 'arrow', from: 'hyper', to: [750, 400], label: 'Back to -70mV', color: 'basic', dashed: true },
        ],
      },
    ],
  },
};

export function getDiagramTemplate(topic: string): DiagramDefinition | null {
  // Direct match
  if (DIAGRAM_TEMPLATES[topic]) return DIAGRAM_TEMPLATES[topic];
  // Fuzzy match
  const normalized = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, template] of Object.entries(DIAGRAM_TEMPLATES)) {
    const normKey = key.replace(/[^a-z0-9]/g, '');
    if (normalized.includes(normKey) || normKey.includes(normalized)) return template;
  }
  return null;
}

export function listTemplateTopics(): string[] {
  return Object.keys(DIAGRAM_TEMPLATES);
}
