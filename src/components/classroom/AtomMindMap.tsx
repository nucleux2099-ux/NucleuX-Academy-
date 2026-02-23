'use client';

import { useState, useRef, useCallback, useEffect, type ComponentType } from 'react';
import { cn } from '@/lib/utils';
import {
  Send,
  Loader2,
  Sparkles,
  GraduationCap,
  Brain,
  Play,
  SkipForward,
  RotateCcw,
  MessageSquare,
  X,
  Camera,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  generateMindMap,
  generateProgressiveSteps,
  parseMindMapFromJSON,
  EXAMPLE_MAPS,
  type MindMapNode,

} from '@/lib/mindmap-engine';

interface ChatMessage {
  id: string;
  role: 'user' | 'atom';
  content: string;
  mindMap?: MindMapNode;
  timestamp: Date;
}

type Mode = 'teach' | 'quiz' | 'build' | 'viva';

type ExcalidrawElement = Record<string, unknown>;
type ScenePayload = { elements: ExcalidrawElement[] };
interface ExcalidrawAPI {
  resetScene: () => void;
  updateScene: (scene: ScenePayload) => void;
  scrollToContent: (elements?: ExcalidrawElement[] | undefined, options?: { fitToContent?: boolean; animate?: boolean }) => void;
  getSceneElements: () => ExcalidrawElement[];
}

const MIND_MAP_SYSTEM_PROMPT = `You are ATOM, a medical teaching AI. When asked to teach a topic, respond with TWO parts:

1. A JSON mind map in a \`\`\`json code block with this exact structure:
{
  "id": "root",
  "text": "Topic Name",
  "level": 0,
  "children": [
    {
      "id": "unique-id",
      "text": "Branch Name",
      "level": 1,
      "category": "high-yield|clinical|basic|pathology|pharmacology|anatomy",
      "children": [
        { "id": "unique-id-2", "text": "Sub-branch", "level": 2, "category": "...", "children": [] }
      ]
    }
  ]
}

2. After the JSON block, a brief teaching narrative walking through the mind map branch by branch.

Rules:
- Root node (level 0): The main topic
- Level 1: 3-6 main branches (major categories)
- Level 2: 2-4 sub-branches per branch (specifics)
- Level 3: Optional leaves for details
- Use "high-yield" category for exam-critical concepts
- Keep text SHORT (2-4 words per node, use \\n for line breaks)
- For quiz mode, add "blank": true to nodes the student should fill in
- Be medically accurate, cite standard textbooks mentally`;

export default function AtomMindMap() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPI | null>(null);
  const [ExcalidrawComp, setExcalidrawComp] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('teach');
  const [currentMap, setCurrentMap] = useState<MindMapNode | null>(null);
  const [progressiveSteps, setProgressiveSteps] = useState<ExcalidrawElement[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then((mod) => {
      setExcalidrawComp(() => mod.Excalidraw);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'atom',
      content: `Welcome to **ATOM Classroom** 🧠\n\nI teach by drawing mind maps — visual spiderwebs of knowledge.\n\n**How to start:**\n- Type any medical topic: *"Portal hypertension"*\n- Or try: *"Acute pancreatitis"*, *"Shock"*, *"Thyroid"*\n\nI'll draw the mind map on the canvas and walk you through it.\n\n**Modes:**\n- 🎓 **Teach** — I draw everything\n- 🧩 **Quiz** — I draw with blanks\n- 🔨 **Build** — We build together\n- 📝 **Viva** — You draw, I grade`,
      timestamp: new Date(),
    }]);
  }, []);

  const drawMindMap = useCallback((mapData: MindMapNode, animate = true) => {
    if (!excalidrawAPI) return;
    setCurrentMap(mapData);

    if (animate && mode === 'teach') {
      const steps = generateProgressiveSteps(mapData, { mode });
      setProgressiveSteps(steps);
      setCurrentStep(0);
      setIsAnimating(true);
      excalidrawAPI.resetScene();
      excalidrawAPI.updateScene({ elements: steps[0] });
      excalidrawAPI.scrollToContent(undefined, { fitToContent: true, animate: true });
    } else {
      const elements = generateMindMap(mapData, { mode });
      excalidrawAPI.resetScene();
      excalidrawAPI.updateScene({ elements });
      excalidrawAPI.scrollToContent(undefined, { fitToContent: true, animate: true });
      setIsAnimating(false);
    }
  }, [excalidrawAPI, mode]);

  const nextStep = useCallback(() => {
    if (!excalidrawAPI || currentStep >= progressiveSteps.length - 1) {
      setIsAnimating(false);
      return;
    }
    const next = currentStep + 1;
    setCurrentStep(next);
    const currentElements = excalidrawAPI.getSceneElements();
    excalidrawAPI.updateScene({ elements: [...currentElements, ...progressiveSteps[next]] });
    excalidrawAPI.scrollToContent(undefined, { fitToContent: true, animate: true });
    if (next >= progressiveSteps.length - 1) setIsAnimating(false);
  }, [excalidrawAPI, currentStep, progressiveSteps]);

  const showAll = useCallback(() => {
    if (!currentMap || !excalidrawAPI) return;
    const elements = generateMindMap(currentMap, { mode });
    excalidrawAPI.resetScene();
    excalidrawAPI.updateScene({ elements });
    excalidrawAPI.scrollToContent(undefined, { fitToContent: true, animate: true });
    setIsAnimating(false);
    setCurrentStep(progressiveSteps.length - 1);
  }, [currentMap, excalidrawAPI, mode, progressiveSteps]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');

    // Check example maps
    const lower = userText.toLowerCase();
    for (const [key, map] of Object.entries(EXAMPLE_MAPS)) {
      if (lower.includes(key.replace('-', ' ')) || lower.includes(key.replace(/-/g, ' '))) {
        setMessages(prev => [...prev,
          { id: crypto.randomUUID(), role: 'user', content: userText, timestamp: new Date() },
          {
            id: crypto.randomUUID(),
            role: 'atom',
            content: `Drawing **${map.text.replace(/\n/g, ' ')}** mind map...\n\nColor guide:\n🔴 Red = High-yield  🔵 Blue = Clinical  🟢 Green = Basic science\n🟣 Purple = Pathology  🟡 Yellow = Pharmacology  🔵 Cyan = Anatomy\n\nHit **Next →** to reveal branches, or **Show All** for the complete map.`,
            mindMap: map,
            timestamp: new Date(),
          },
        ]);
        drawMindMap(map);
        return;
      }
    }

    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: userText, timestamp: new Date() }]);
    setLoading(true);

    try {
      const modeInstruction = mode === 'quiz'
        ? 'Generate the mind map with some nodes marked as "blank": true.'
        : mode === 'viva'
        ? 'The student will draw. Just provide the topic and what they should cover.'
        : 'Generate a complete teaching mind map.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: MIND_MAP_SYSTEM_PROMPT },
            { role: 'user', content: `${modeInstruction}\n\nTopic: ${userText}` },
          ],
        }),
      });

      if (!response.ok) throw new Error('API failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      const atomMsgId = crypto.randomUUID();

      setMessages(prev => [...prev, { id: atomMsgId, role: 'atom', content: '', timestamp: new Date() }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
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
                  setMessages(prev => prev.map(m => m.id === atomMsgId ? { ...m, content: fullContent } : m));
                }
              } catch {
                fullContent += data;
                setMessages(prev => prev.map(m => m.id === atomMsgId ? { ...m, content: fullContent } : m));
              }
            }
          }
        }
      }

      const mapData = parseMindMapFromJSON(fullContent);
      if (mapData) {
        setMessages(prev => prev.map(m => m.id === atomMsgId ? { ...m, mindMap: mapData } : m));
        drawMindMap(mapData);
      }
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'atom', content: "Couldn't generate mind map. Try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, mode, drawMindMap]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#0F1A24]">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1B2838] border-b border-[#2D3E50]">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-medium text-[#E8E0D5]">ATOM Mind Map</span>
            <div className="flex items-center gap-1 ml-4">
              {([
                { m: 'teach' as Mode, icon: Sparkles, label: 'Teach' },
                { m: 'quiz' as Mode, icon: GraduationCap, label: 'Quiz' },
                { m: 'build' as Mode, icon: Zap, label: 'Build' },
                { m: 'viva' as Mode, icon: Camera, label: 'Viva' },
              ]).map(({ m, icon: Icon, label }) => (
                <button key={m} onClick={() => setMode(m)} className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  mode === m ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-[#A0B0BC] hover:bg-[#2D3E50]'
                )}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAnimating && (
              <>
                <span className="text-xs text-[#A0B0BC]">Step {currentStep + 1}/{progressiveSteps.length}</span>
                <button onClick={nextStep} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 text-white text-xs font-medium hover:bg-teal-600">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={showAll} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2D3E50] text-[#A0B0BC] text-xs font-medium hover:bg-[#3D4E60]">
                  <SkipForward className="w-3.5 h-3.5" /> Show All
                </button>
              </>
            )}
            <button onClick={() => excalidrawAPI?.resetScene()} className="p-2 rounded-lg text-[#A0B0BC] hover:bg-[#2D3E50]" title="Clear">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className="lg:hidden p-2 rounded-lg text-[#A0B0BC] hover:bg-[#2D3E50]">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {ExcalidrawComp ? (
            <ExcalidrawComp
              ref={(api: unknown) => setExcalidrawAPI(api as ExcalidrawAPI)}
              theme="dark"
              initialData={{ appState: { viewBackgroundColor: '#0F1A24', currentItemStrokeColor: '#5EEAD4', currentItemFontFamily: 1 } }}
              UIOptions={{ canvasActions: { saveToActiveFile: false, loadScene: false, export: false } }}
            />
          ) : (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-teal-400" /></div>
          )}
        </div>
      </div>

      <div className={cn(
        'bg-[#1B2838] border-l border-[#2D3E50] flex flex-col transition-all',
        chatOpen ? 'w-full lg:w-[380px] h-1/2 lg:h-full' : 'hidden lg:flex lg:w-0 lg:overflow-hidden'
      )}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3E50]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[#E8E0D5] font-medium text-sm">ATOM</span>
            <span className="text-[#A0B0BC] text-xs">Mind Map Teacher</span>
          </div>
          <button onClick={() => setChatOpen(false)} className="lg:hidden p-1 rounded text-[#A0B0BC] hover:text-[#E8E0D5]"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex flex-col gap-1', msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn(
                'max-w-[90%] rounded-xl px-3 py-2 text-sm',
                msg.role === 'user' ? 'bg-teal-500/20 text-teal-100 border border-teal-500/20' : 'bg-[#0F1A24] text-[#E8E0D5] border border-[#2D3E50]'
              )}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content || <Loader2 className="w-4 h-4 animate-spin text-teal-400" />}
                </div>
              </div>
              {msg.mindMap && (
                <button onClick={() => drawMindMap(msg.mindMap!)} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 mt-1">
                  <Play className="w-3 h-3" /> Redraw on canvas
                </button>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-[#A0B0BC] mb-2">Quick start:</p>
            <div className="flex flex-wrap gap-1.5">
              {['Portal Hypertension', 'Acute Pancreatitis', 'Shock', 'Liver Segments', 'Thyroid'].map(topic => (
                <button key={topic} onClick={() => setInput(topic)} className="px-2.5 py-1 rounded-full text-xs bg-[#2D3E50] text-[#A0B0BC] hover:bg-teal-500/20 hover:text-teal-400 transition-all">
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 border-t border-[#2D3E50]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a topic to learn..."
              className="flex-1 px-3 py-2 rounded-lg bg-[#0F1A24] border border-[#2D3E50] text-[#E8E0D5] text-sm placeholder:text-[#A0B0BC]/50 focus:outline-none focus:border-teal-500/50"
              disabled={loading}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading} className="p-2 rounded-lg bg-teal-500 text-white disabled:opacity-50 hover:bg-teal-600 transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="lg:hidden fixed bottom-20 right-4 p-3 rounded-full bg-teal-500 text-white shadow-lg z-50">
          <MessageSquare className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
