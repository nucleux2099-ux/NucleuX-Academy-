'use client';

import { useState, useRef, useCallback, useEffect, type ComponentType } from 'react';
import { cn } from '@/lib/utils';
import {
  Send,
  Camera,
  MessageSquare,
  X,
  Loader2,
  GraduationCap,
  PenTool,
  RotateCcw,
  BookOpen,
  Brain,
  Users,
  Eye,
} from 'lucide-react';
import {
  generateMindMapScene,
  generateProgressiveReveal,
  type MindMapDefinition,
} from '@/lib/canvas/mindmap-generator';
import {
  generateDiagramScene,
  generateDiagramSteps,
  parseDiagramFromResponse,
  type DiagramDefinition,
} from '@/lib/canvas/diagram-generator';
import { evaluateDiagram } from '@/lib/canvas/diagram-evaluator';
import { getDiagramTemplate } from '@/lib/canvas/diagram-templates';

// =============================================================================
// TYPES
// =============================================================================

interface ChatMessage {
  id: string;
  role: 'user' | 'atom';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

type CanvasMode = 'teach' | 'quiz' | 'build' | 'viva' | 'diagram';

type ExcalidrawElement = Record<string, unknown>;
interface ExcalidrawAPI {
  resetScene: () => void;
  updateScene: (scene: { elements: ExcalidrawElement[] }) => void;
  scrollToContent: (elements?: ExcalidrawElement[] | undefined, options?: { fitToContent?: boolean; padding?: number }) => void;
  getSceneElements: () => ExcalidrawElement[];
  getAppState: () => Record<string, unknown>;
  getFiles: () => Record<string, unknown>;
}
type ExportToBlobFn = (payload: Record<string, unknown>) => Promise<Blob>;

const MODE_INFO: Record<CanvasMode, { label: string; icon: ComponentType<{ className?: string }>; desc: string; color: string }> = {
  teach: {
    label: 'Teach Mode',
    icon: BookOpen,
    desc: 'ATOM draws complete mind maps and explains branch by branch',
    color: 'teal',
  },
  quiz: {
    label: 'Quiz Mode',
    icon: Brain,
    desc: 'ATOM draws partial maps with blanks — you fill them in',
    color: 'amber',
  },
  build: {
    label: 'Build Together',
    icon: Users,
    desc: 'ATOM draws the backbone, you add branches, ATOM corrects',
    color: 'purple',
  },
  viva: {
    label: 'Viva Mode',
    icon: GraduationCap,
    desc: 'Blank canvas + viva prompt — you draw everything, ATOM grades',
    color: 'red',
  },
  diagram: {
    label: 'Diagram Mode',
    icon: PenTool,
    desc: 'AI draws anatomical diagrams step-by-step with shapes, arrows & labels',
    color: 'teal',
  },
};

// =============================================================================
// SYSTEM PROMPTS PER MODE
// =============================================================================

const MODE_SYSTEM_PROMPTS: Record<CanvasMode, string> = {
  teach: `You are ATOM, a medical professor teaching via visual mind maps on a digital whiteboard.

When the student asks you to teach a topic:
1. Generate a comprehensive mind map as JSON
2. Walk through each branch in your text response
3. Highlight high-yield points, clinical pearls, and exam favorites
4. Use progressive reveal — explain the structure, then dive into each branch

CRITICAL: When teaching, you MUST include a mind map JSON block in your response using this exact format:
\`\`\`mindmap
{
  "title": "Topic Name",
  "layout": "tree-right",
  "root": {
    "id": "root",
    "label": "Central Concept",
    "detail": "Brief detail",
    "category": "core",
    "shape": "ellipse",
    "children": [
      {
        "id": "branch1",
        "label": "Branch Name",
        "category": "clinical",
        "children": [
          { "id": "leaf1", "label": "Leaf", "detail": "detail text", "category": "highyield" }
        ]
      }
    ]
  }
}
\`\`\`

Categories for color coding: "core" (teal), "clinical" (blue), "basic" (green), "highyield" (red), "mechanism" (purple), "diagnosis" (blue), "management" (yellow).
Shapes: "ellipse" for root, "rectangle" for branches, "diamond" for decision nodes.

After the mind map JSON, write your teaching explanation walking through each branch. Be thorough but concise. Use clinical correlations.`,

  quiz: `You are ATOM, a medical examiner testing students via visual mind maps.

Generate a mind map JSON with some nodes set to "blank": true — these are the nodes the student must identify.
Keep the backbone visible but hide key details.

Include the mindmap JSON block (same format as teach mode) with blank: true on nodes you want the student to fill in.

After the JSON, ask the student to identify the blank nodes. Give hints if needed.
Grade their answers when they respond.`,

  build: `You are ATOM, collaborating with a student to build a mind map together.

Start by drawing just the central node and first-level branches (the backbone).
Include the mindmap JSON block with just the backbone.
Then ask the student what should come next — what sub-branches they'd add.
When they suggest additions, generate an updated mind map incorporating their input (correct or corrected).
Guide them toward completeness.`,

  viva: `You are ATOM, conducting a viva voce examination.

Give the student a topic prompt and ask them to draw a diagram on the canvas.
Do NOT generate a mind map initially — the canvas should stay blank.
Wait for the student to submit their drawing, then analyze it with vision and grade:
- Score out of 10
- What's correct
- What's missing
- What's incorrect
- Model answer as a mind map JSON

When giving the model answer at the end, include the mindmap JSON block.`,

  diagram: `You are ATOM, a medical professor teaching via anatomical diagrams on a whiteboard.

When the student asks you to teach a topic, draw it using shape primitives — NOT mind maps.
Generate a diagram JSON block using this exact format:

\`\`\`diagram
{
  "title": "Topic Name",
  "steps": [
    {
      "explanation": "Step explanation text",
      "draw": [
        { "type": "circle", "id": "shape-id", "label": "Label", "x": 400, "y": 200, "radius": 50, "color": "core" },
        { "type": "rectangle", "id": "shape-id", "label": "Label", "x": 300, "y": 300, "width": 120, "height": 60, "color": "organ" },
        { "type": "arrow", "from": "source-id", "to": "target-id", "label": "Connection", "color": "vessel" },
        { "type": "text", "label": "Annotation", "x": 400, "y": 100, "color": "label", "fontSize": 12 }
      ],
      "question": "Optional question for the student",
      "hints": ["Hint 1", "Hint 2"]
    }
  ]
}
\`\`\`

Shape types: circle, rectangle, diamond, arrow, line, text
Color categories: core (teal), clinical (blue), basic (green), highyield (red), mechanism (purple), vessel (pink), organ (sky blue), flow (yellow), label (gray)

RULES:
- Use coordinates between 50-800 for x, 50-600 for y
- Every shape with a connection must have an "id"
- Arrows use "from" and "to" referencing shape ids
- Break teaching into 2-5 steps, each revealing new structures
- Each step should have an explanation
- Ask the student to draw something after key steps
- Provide hints for student tasks
- Focus on anatomical/spatial relationships
- Labels should be medically accurate

After the diagram JSON, write a brief teaching explanation for the current step.`,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ExcalidrawCanvas() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPI | null>(null);
  const [ExcalidrawComp, setExcalidrawComp] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [exportToBlob, setExportToBlob] = useState<ExportToBlobFn | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [mode, setMode] = useState<CanvasMode | null>(null);
  const [revealStage, setRevealStage] = useState(0);
  const [revealStages, setRevealStages] = useState<ExcalidrawElement[][] | null>(null);
  const [diagramSteps, setDiagramSteps] = useState<{ elements: ExcalidrawElement[]; explanation: string; question?: string; hints?: string[] }[] | null>(null);
  const [diagramStepIndex, setDiagramStepIndex] = useState(0);
  const [currentHints, setCurrentHints] = useState<string[]>([]);
  const [hintIndex, setHintIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic import of Excalidraw
  useEffect(() => {
    import('@excalidraw/excalidraw').then((mod) => {
      setExcalidrawComp(() => mod.Excalidraw);
      setExportToBlob(() => mod.exportToBlob);
    });
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ==========================================================================
  // MIND MAP RENDERING
  // ==========================================================================

  const renderMindMap = useCallback((definition: MindMapDefinition, progressive: boolean = false) => {
    if (!excalidrawAPI) return;

    if (progressive) {
      const stages = generateProgressiveReveal(definition);
      setRevealStages(stages);
      setRevealStage(0);
      // Render first stage
      excalidrawAPI.updateScene({
        elements: stages[0],
      });
      excalidrawAPI.scrollToContent(stages[0], { fitToContent: true, padding: 50 });
    } else {
      const elements = generateMindMapScene(definition);
      excalidrawAPI.updateScene({ elements });
      excalidrawAPI.scrollToContent(elements, { fitToContent: true, padding: 50 });
      setRevealStages(null);
      setRevealStage(0);
    }
  }, [excalidrawAPI]);

  const revealNextStage = useCallback(() => {
    if (!revealStages || !excalidrawAPI) return;
    const nextStage = revealStage + 1;
    if (nextStage >= revealStages.length) return;

    // Add next stage elements to existing
    const currentElements = excalidrawAPI.getSceneElements();
    const newElements = [...currentElements, ...revealStages[nextStage]];
    excalidrawAPI.updateScene({ elements: newElements });
    excalidrawAPI.scrollToContent(newElements, { fitToContent: true, padding: 50 });
    setRevealStage(nextStage);
  }, [revealStages, revealStage, excalidrawAPI]);

  // ==========================================================================
  // DIAGRAM RENDERING
  // ==========================================================================

  const renderDiagram = useCallback((definition: DiagramDefinition, stepByStep: boolean = true) => {
    if (!excalidrawAPI) return;

    if (stepByStep) {
      const steps = generateDiagramSteps(definition);
      setDiagramSteps(steps);
      setDiagramStepIndex(0);
      setCurrentHints(steps[0]?.hints || []);
      setHintIndex(0);
      // Render first step
      excalidrawAPI.updateScene({ elements: steps[0]?.elements || [] });
      excalidrawAPI.scrollToContent(steps[0]?.elements, { fitToContent: true, padding: 50 });
      // Show explanation as chat message
      if (steps[0]?.explanation) {
        const msg = {
          id: crypto.randomUUID(),
          role: 'atom' as const,
          content: steps[0].explanation + (steps[0].question ? '\n\n🎯 ' + steps[0].question : ''),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, msg]);
      }
    } else {
      const elements = generateDiagramScene(definition);
      excalidrawAPI.updateScene({ elements });
      excalidrawAPI.scrollToContent(elements, { fitToContent: true, padding: 50 });
      setDiagramSteps(null);
      setDiagramStepIndex(0);
    }
  }, [excalidrawAPI]);

  const revealNextDiagramStep = useCallback(() => {
    if (!diagramSteps || !excalidrawAPI) return;
    const nextIdx = diagramStepIndex + 1;
    if (nextIdx >= diagramSteps.length) return;

    const currentElements = excalidrawAPI.getSceneElements();
    const newElements = [...currentElements, ...diagramSteps[nextIdx].elements];
    excalidrawAPI.updateScene({ elements: newElements });
    excalidrawAPI.scrollToContent(newElements, { fitToContent: true, padding: 50 });
    setDiagramStepIndex(nextIdx);
    setCurrentHints(diagramSteps[nextIdx]?.hints || []);
    setHintIndex(0);

    // Show step explanation
    const step = diagramSteps[nextIdx];
    if (step.explanation) {
      const msg = {
        id: crypto.randomUUID(),
        role: 'atom' as const,
        content: step.explanation + (step.question ? '\n\n🎯 ' + step.question : ''),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);
    }
  }, [diagramSteps, diagramStepIndex, excalidrawAPI]);

  const showNextHint = useCallback(() => {
    if (!currentHints.length) return;
    const nextHint = hintIndex;
    if (nextHint >= currentHints.length) return;
    setHintIndex(nextHint + 1);
    const msg = {
      id: crypto.randomUUID(),
      role: 'atom' as const,
      content: '💡 Hint: ' + currentHints[nextHint],
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
  }, [currentHints, hintIndex]);

  // ==========================================================================
  // PARSE MIND MAP FROM AI RESPONSE
  // ==========================================================================

  const parseMindMapFromResponse = useCallback((text: string): MindMapDefinition | null => {
    const match = text.match(/```mindmap\s*\n([\s\S]*?)\n```/);
    if (!match) return null;
    try {
      return JSON.parse(match[1]) as MindMapDefinition;
    } catch {
      console.error('Failed to parse mind map JSON');
      return null;
    }
  }, []);

  // ==========================================================================
  // SEND MESSAGE / TEACH
  // ==========================================================================

  const handleSendMessage = useCallback(async (overrideInput?: string) => {
    const text = overrideInput || input.trim();
    if (!text || loading) return;
    if (!overrideInput) setInput('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    try {
      // Check for pre-built diagram template (diagram mode only)
      if (mode === 'diagram') {
        const template = getDiagramTemplate(text);
        if (template) {
          renderDiagram(template, true);
          setLoading(false);
          return;
        }
      }

      const systemPrompt = mode ? MODE_SYSTEM_PROMPTS[mode] : MODE_SYSTEM_PROMPTS.teach;
      
      const apiMessages = messages
        .filter(m => !m.imageUrl)
        .slice(-10)
        .map(m => ({ role: m.role === 'atom' ? 'assistant' : 'user', content: m.content }))
        .concat([{ role: 'user', content: text }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          systemOverride: systemPrompt,
          context: 'full',
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      const atomMsgId = crypto.randomUUID();

      setMessages(prev => [...prev, {
        id: atomMsgId,
        role: 'atom',
        content: '',
        timestamp: new Date(),
      }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text || parsed.content) {
                  fullContent += parsed.text || parsed.content;
                  setMessages(prev => prev.map(m =>
                    m.id === atomMsgId ? { ...m, content: fullContent } : m
                  ));
                }
              } catch {
                // Skip parse errors
              }
            }
          }
        }
      }

      // Check for diagram or mind map in response and render it
      if (fullContent) {
        const diagram = parseDiagramFromResponse(fullContent);
        if (diagram) {
          renderDiagram(diagram, mode === 'diagram');
          const cleanContent = fullContent.replace(/```diagram\s*\n[\s\S]*?\n```/g, '').trim();
          setMessages(prev => prev.map(m =>
            m.id === atomMsgId ? { ...m, content: cleanContent || fullContent } : m
          ));
        } else {
          const mindmap = parseMindMapFromResponse(fullContent);
          if (mindmap) {
            const useProgressive = mode === 'teach';
            renderMindMap(mindmap, useProgressive);
            const cleanContent = fullContent.replace(/```mindmap\s*\n[\s\S]*?\n```/g, '').trim();
            setMessages(prev => prev.map(m =>
              m.id === atomMsgId ? { ...m, content: cleanContent || fullContent } : m
            ));
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'atom',
        content: "Sorry, I had trouble processing that. Try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, mode, parseMindMapFromResponse, renderMindMap, renderDiagram]);

  // ==========================================================================
  // SUBMIT DRAWING (VISION)
  // ==========================================================================

  const handleSubmitDrawing = useCallback(async () => {
    if (!excalidrawAPI || !exportToBlob || capturing) return;
    setCapturing(true);

    try {
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || elements.length === 0) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'atom',
          content: "The canvas is empty. Draw something first, then submit for review.",
          timestamp: new Date(),
        }]);
        setCapturing(false);
        return;
      }

      const blob = await exportToBlob({
        elements,
        appState: { ...excalidrawAPI.getAppState(), exportWithDarkMode: false, exportBackground: true },
        files: excalidrawAPI.getFiles(),
      });

      const reader = new FileReader();
      const base64Image = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: '📸 Submitted drawing for review',
        imageUrl: base64Image,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);

      // Vector-based evaluation for diagram mode
      let vectorFeedback = '';
      if (mode === 'diagram' && diagramSteps) {
        const studentElements = excalidrawAPI.getSceneElements() as Record<string, unknown>[];
        // Collect all expected shapes from diagram steps as structures
        const expectedStructures = diagramSteps.flatMap(step =>
          step.elements
            .filter(el => (el.type as string) !== 'arrow' && (el.type as string) !== 'line' && (el.type as string) !== 'text')
            .map(el => ({
              id: (el.id as string) || '',
              label: (el.text as string) || 'structure',
              type: 'any' as const,
              x: ((el.x as number) || 0) + ((el.width as number) || 0) / 2,
              y: ((el.y as number) || 0) + ((el.height as number) || 0) / 2,
            }))
        );
        if (expectedStructures.length > 0) {
          const evalResult = evaluateDiagram(studentElements, expectedStructures);
          vectorFeedback = '\n\n[Vector analysis: ' + evalResult.feedback + ' Score: ' + evalResult.score + '/100]';
        }
      }

      const modeContext = mode === 'viva'
        ? 'VIVA EXAM: Grade this drawing strictly. Score /10. List what\'s correct, missing, and incorrect. Then provide a model answer as a mindmap JSON block.'
        : mode === 'build'
        ? 'The student added to the mind map. Analyze their additions — what\'s correct? What needs correction? Generate an updated complete mindmap JSON.'
        : mode === 'diagram'
        ? 'Analyze this medical diagram drawing. Compare against the expected anatomy.' + vectorFeedback + ' Give specific feedback on what\'s correct, missing, and how to improve. If providing a corrected version, use a diagram JSON block.'
        : 'Analyze this medical drawing. What\'s correct? What\'s missing? Suggest improvements.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: modeContext },
              { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64Image.split(',')[1] } },
            ],
          }],
          systemOverride: mode ? MODE_SYSTEM_PROMPTS[mode] : undefined,
          context: 'full',
        }),
      });

      const reader2 = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      const atomMsgId = crypto.randomUUID();

      setMessages(prev => [...prev, {
        id: atomMsgId, role: 'atom', content: '', timestamp: new Date(),
      }]);

      if (reader2) {
        while (true) {
          const { done, value } = await reader2.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text || parsed.content) {
                  fullContent += parsed.text || parsed.content;
                  setMessages(prev => prev.map(m =>
                    m.id === atomMsgId ? { ...m, content: fullContent } : m
                  ));
                }
              } catch { /* skip */ }
            }
          }
        }
      }

      // Check for model answer mind map
      if (fullContent) {
        const mindmap = parseMindMapFromResponse(fullContent);
        if (mindmap) {
          renderMindMap(mindmap, false);
          const cleanContent = fullContent.replace(/```mindmap\s*\n[\s\S]*?\n```/g, '').trim();
          setMessages(prev => prev.map(m =>
            m.id === atomMsgId ? { ...m, content: cleanContent || fullContent } : m
          ));
        }
      }
    } catch (error) {
      console.error('Vision error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: 'atom',
        content: "Couldn't analyze the drawing. Try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      setCapturing(false);
    }
  }, [excalidrawAPI, exportToBlob, capturing, mode, diagramSteps, parseMindMapFromResponse, renderMindMap]);

  // ==========================================================================
  // MODE SELECTOR
  // ==========================================================================

  if (!mode) {
    return (
      <div className="min-h-screen bg-[#0F1A24] p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <PenTool className="w-8 h-8 text-teal-400" />
              <h1 className="text-3xl font-bold text-[#E8E0D5]">ATOM Canvas</h1>
            </div>
            <p className="text-[#A0B0BC] text-lg">
              ATOM&apos;s whiteboard. Visual teaching through mind maps and diagrams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(MODE_INFO) as [CanvasMode, typeof MODE_INFO[CanvasMode]][]).map(([key, info]) => {
              const Icon = info.icon;
              const colorMap: Record<string, string> = {
                teal: 'border-teal-500/30 hover:border-teal-500/60',
                amber: 'border-amber-500/30 hover:border-amber-500/60',
                purple: 'border-purple-500/30 hover:border-purple-500/60',
                red: 'border-red-500/30 hover:border-red-500/60',
              };
              const bgMap: Record<string, string> = {
                teal: 'bg-teal-500/10',
                amber: 'bg-amber-500/10',
                purple: 'bg-purple-500/10',
                red: 'bg-red-500/10',
              };
              const iconColorMap: Record<string, string> = {
                teal: 'text-teal-400',
                amber: 'text-amber-400',
                purple: 'text-purple-400',
                red: 'text-red-400',
              };

              return (
                <button
                  key={key}
                  onClick={() => {
                    setMode(key);
                    const welcomeMsg: ChatMessage = {
                      id: crypto.randomUUID(),
                      role: 'atom',
                      content: key === 'teach'
                        ? "Ready to teach! Tell me a topic and I'll draw a complete mind map on the canvas while explaining it. Try: \"Teach me portal hypertension\" or \"Explain the cardiac cycle\""
                        : key === 'quiz'
                        ? "Quiz mode active! Name a topic and I'll draw a partial mind map with blanks for you to fill in. Can you complete the picture?"
                        : key === 'build'
                        ? "Let's build together! Name a topic and I'll draw the backbone — then you tell me what branches to add. We'll create a complete map collaboratively."
                        : key === 'viva'
                        ? "Viva mode! I'll give you a topic prompt. You draw the diagram on the canvas, then submit it. I'll grade your work and show the model answer. Ready? Name a subject area."
                        : "Diagram mode! I'll teach by drawing anatomical diagrams step-by-step — real shapes, arrows, and labels on the canvas. Try: \"Draw the nephron\" or \"Show me portal hypertension anatomy\"",
                      timestamp: new Date(),
                    };
                    setMessages([welcomeMsg]);
                  }}
                  className={cn(
                    'p-6 rounded-xl bg-[#1B2838] border transition-all text-left space-y-3',
                    colorMap[info.color]
                  )}
                >
                  <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', bgMap[info.color])}>
                    <Icon className={cn('w-6 h-6', iconColorMap[info.color])} />
                  </div>
                  <h3 className="text-[#E8E0D5] font-semibold text-lg">{info.label}</h3>
                  <p className="text-[#A0B0BC] text-sm leading-relaxed">{info.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-[#A0B0BC]/60 text-xs">
              Powered by Excalidraw + Claude Vision. ATOM draws to teach — spiderwebbing meets AI.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // CANVAS + CHAT LAYOUT
  // ==========================================================================

  const modeInfo = MODE_INFO[mode];
  const ModeIcon = modeInfo.icon;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#0F1A24]">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1B2838] border-b border-[#2D3E50]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setMode(null); setMessages([]); setRevealStages(null); }}
              className="text-sm text-[#A0B0BC] hover:text-teal-400 transition-colors"
            >
              ← Modes
            </button>
            <div className="flex items-center gap-2">
              <ModeIcon className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-[#E8E0D5] font-medium">{modeInfo.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Progressive reveal button */}
            {revealStages && revealStage < revealStages.length - 1 && (
              <button
                onClick={revealNextStage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-400 text-sm hover:bg-teal-500/30 transition-all border border-teal-500/30"
              >
                <Eye className="w-4 h-4" />
                Reveal Next ({revealStage + 1}/{revealStages.length - 1})
              </button>
            )}
            {/* Diagram step-by-step controls */}
            {diagramSteps && diagramStepIndex < diagramSteps.length - 1 && (
              <button
                onClick={revealNextDiagramStep}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-400 text-sm hover:bg-teal-500/30 transition-all border border-teal-500/30"
              >
                <Eye className="w-4 h-4" />
                Next Step ({diagramStepIndex + 1}/{diagramSteps.length})
              </button>
            )}
            {currentHints.length > 0 && hintIndex < currentHints.length && (
              <button
                onClick={showNextHint}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition-all border border-amber-500/30"
              >
                💡 Hint ({hintIndex}/{currentHints.length})
              </button>
            )}
            <button
              onClick={() => { excalidrawAPI?.resetScene(); setRevealStages(null); setRevealStage(0); setDiagramSteps(null); setDiagramStepIndex(0); setCurrentHints([]); setHintIndex(0); }}
              className="p-2 rounded-lg text-[#A0B0BC] hover:bg-[#2D3E50] hover:text-[#E8E0D5] transition-all"
              title="Clear canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {(mode === 'viva' || mode === 'build' || mode === 'diagram') && (
              <button
                onClick={handleSubmitDrawing}
                disabled={capturing || loading}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  capturing || loading
                    ? 'bg-[#2D3E50] text-[#A0B0BC] cursor-not-allowed'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                )}
              >
                {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {capturing ? 'Capturing...' : 'Submit Drawing'}
              </button>
            )}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="lg:hidden p-2 rounded-lg text-[#A0B0BC] hover:bg-[#2D3E50] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Excalidraw */}
        <div className="flex-1 min-h-0">
          {ExcalidrawComp ? (
            <ExcalidrawComp
              ref={(api: unknown) => setExcalidrawAPI(api as ExcalidrawAPI)}
              theme="dark"
              initialData={{
                appState: {
                  viewBackgroundColor: '#0F1A24',
                  currentItemStrokeColor: '#5EEAD4',
                  currentItemFontFamily: 1,
                },
              }}
              UIOptions={{
                canvasActions: {
                  saveToActiveFile: false,
                  loadScene: false,
                  export: false,
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      <div
        className={cn(
          'bg-[#1B2838] border-l border-[#2D3E50] flex flex-col transition-all',
          chatOpen ? 'w-full lg:w-[400px] h-1/2 lg:h-full' : 'hidden'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3E50]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[#E8E0D5] font-medium text-sm">ATOM</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2D3E50] text-[#A0B0BC]">
              {modeInfo.label}
            </span>
          </div>
          <button onClick={() => setChatOpen(false)} className="lg:hidden p-1 rounded text-[#A0B0BC] hover:text-[#E8E0D5]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex flex-col gap-1', msg.role === 'user' ? 'items-end' : 'items-start')}>
              {msg.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={msg.imageUrl} alt="Drawing" className="w-48 rounded-lg border border-[#2D3E50]" />
              )}
              <div className={cn(
                'max-w-[90%] rounded-xl px-3 py-2 text-sm',
                msg.role === 'user'
                  ? 'bg-teal-500/20 text-teal-100 border border-teal-500/20'
                  : 'bg-[#0F1A24] text-[#E8E0D5] border border-[#2D3E50]'
              )}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content || <Loader2 className="w-4 h-4 animate-spin text-teal-400" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts for teach mode */}
        {mode === 'teach' && messages.length <= 1 && (
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {['Portal hypertension', 'Cardiac cycle', 'Brachial plexus', 'Nephrotic syndrome'].map(topic => (
              <button
                key={topic}
                onClick={() => handleSendMessage(`Teach me ${topic.toLowerCase()}`)}
                className="px-3 py-1.5 rounded-full text-xs bg-[#2D3E50] text-[#A0B0BC] hover:bg-teal-500/20 hover:text-teal-400 transition-all border border-[#2D3E50] hover:border-teal-500/30"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
        {mode === 'diagram' && messages.length <= 1 && (
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {['Nephron structure', 'Cardiac cycle', 'Portal hypertension anatomy', "Calot's triangle", 'Action potential'].map(topic => (
              <button
                key={topic}
                onClick={() => handleSendMessage(`Draw ${topic.toLowerCase()}`)}
                className="px-3 py-1.5 rounded-full text-xs bg-[#2D3E50] text-[#A0B0BC] hover:bg-teal-500/20 hover:text-teal-400 transition-all border border-[#2D3E50] hover:border-teal-500/30"
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-[#2D3E50]">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={
                mode === 'teach' ? 'Ask ATOM to teach a topic...'
                : mode === 'quiz' ? 'Name a topic to be quizzed on...'
                : mode === 'build' ? 'Suggest a branch to add...'
                : 'Name a topic for your viva...'
              }
              className="flex-1 px-3 py-2 rounded-lg bg-[#0F1A24] border border-[#2D3E50] text-[#E8E0D5] text-sm placeholder:text-[#A0B0BC]/50 focus:outline-none focus:border-teal-500/50"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg bg-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile chat toggle */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="lg:hidden fixed bottom-20 right-4 p-3 rounded-full bg-teal-500 text-white shadow-lg z-50"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
