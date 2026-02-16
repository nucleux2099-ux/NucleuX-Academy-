'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Send,
  Camera,
  Eraser,
  MessageSquare,
  X,
  Loader2,
  Sparkles,
  GraduationCap,
  PenTool,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

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

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
}

// =============================================================================
// TEMPLATES
// =============================================================================

const TEMPLATES: Template[] = [
  {
    id: 'portal-venous',
    name: 'Portal Venous System',
    category: 'Anatomy',
    description: 'Draw the portal vein and its tributaries',
    prompt: 'Draw the portal venous system showing the portal vein, its formation from the superior mesenteric vein and splenic vein, and all major tributaries. I\'ll check your drawing for accuracy.',
  },
  {
    id: 'stomach-blood-supply',
    name: 'Blood Supply of Stomach',
    category: 'Anatomy',
    description: 'Arterial supply from celiac trunk branches',
    prompt: 'Draw the arterial blood supply of the stomach, showing the celiac trunk and its branches — left gastric, common hepatic, and splenic arteries, along with the gastroduodenal artery and their gastric branches. I\'ll evaluate your diagram.',
  },
  {
    id: 'couinaud-segments',
    name: 'Liver Segments (Couinaud)',
    category: 'Anatomy',
    description: 'Eight functional segments of the liver',
    prompt: 'Draw the Couinaud classification of liver segments (segments I-VIII), showing the hepatic veins and portal vein divisions. I\'ll check if your segmental anatomy is correct.',
  },
  {
    id: 'cardiac-cycle',
    name: 'Cardiac Cycle Pressure Diagram',
    category: 'Physiology',
    description: 'Wiggers diagram — pressure, volume, ECG',
    prompt: 'Draw a Wiggers diagram showing the cardiac cycle with aortic pressure, left ventricular pressure, left atrial pressure, ventricular volume, ECG, and heart sounds aligned in time. I\'ll verify the relationships.',
  },
  {
    id: 'brachial-plexus',
    name: 'Brachial Plexus',
    category: 'Anatomy',
    description: 'Roots, trunks, divisions, cords, branches',
    prompt: 'Draw the brachial plexus showing roots (C5-T1), trunks, divisions, cords, and terminal branches. I\'ll check your diagram for completeness and accuracy.',
  },
  {
    id: 'nephron',
    name: 'Nephron Structure',
    category: 'Physiology',
    description: 'Glomerulus to collecting duct with transport',
    prompt: 'Draw a nephron showing the glomerulus, Bowman\'s capsule, PCT, loop of Henle, DCT, and collecting duct. Label the key transport mechanisms at each segment. I\'ll evaluate your drawing.',
  },
  {
    id: 'drug-mechanism',
    name: 'Drug Mechanism Flowchart',
    category: 'Pharmacology',
    description: 'Pick a drug class and map its mechanism',
    prompt: 'Draw a flowchart showing the mechanism of action of a drug class of your choice. Show the receptor/enzyme target, signaling cascade, and clinical effect. I\'ll analyze your pharmacology diagram.',
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    category: 'Free Draw',
    description: 'Start from scratch — draw anything',
    prompt: 'I see you\'ve started with a blank canvas. Draw whatever you\'d like me to help with — anatomy, pathology diagrams, flowcharts, mechanisms. Submit your drawing when ready and I\'ll provide feedback.',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ExcalidrawCanvas() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);
  const [exportToBlob, setExportToBlob] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [examMode, setExamMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic import of Excalidraw (client-only)
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

  // Select template
  const handleTemplateSelect = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setShowTemplates(false);

    const welcomeMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'atom',
      content: template.id === 'blank'
        ? "Blank canvas ready! Draw anything medical — anatomy, mechanisms, flowcharts — and hit **Submit Drawing** when you want feedback. I'll analyze what you've drawn and help you learn."
        : `**${template.name}**\n\n${template.prompt}\n\nTake your time drawing. When you're ready, hit **Submit Drawing** and I'll analyze your work.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  }, []);

  // Capture canvas and send to vision API
  const handleSubmitDrawing = useCallback(async () => {
    if (!excalidrawAPI || !exportToBlob || capturing) return;

    setCapturing(true);
    try {
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || elements.length === 0) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'atom',
          content: "Your canvas is empty! Draw something first, then submit. Need ideas? Try one of the templates.",
          timestamp: new Date(),
        }]);
        setCapturing(false);
        return;
      }

      // Export canvas to image blob
      const blob = await exportToBlob({
        elements: excalidrawAPI.getSceneElements(),
        appState: {
          ...excalidrawAPI.getAppState(),
          exportWithDarkMode: false,
          exportBackground: true,
        },
        files: excalidrawAPI.getFiles(),
      });

      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const base64Image = await base64Promise;

      // Add user message with image preview
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: '📸 Submitted drawing for review',
        imageUrl: base64Image,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);

      // Send to Claude Vision API
      setLoading(true);
      const context = selectedTemplate
        ? `The student is working on: "${selectedTemplate.name}" — ${selectedTemplate.description}. ${examMode ? 'EXAM MODE: Grade strictly, give a score out of 10, and list what\'s missing.' : 'Teaching mode: Be encouraging but accurate. Point out errors gently and suggest improvements.'}`
        : 'The student drew something on the medical canvas. Analyze it and provide feedback.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `${context}\n\nAnalyze this medical drawing. Be specific about:\n1. What's correct\n2. What's missing or incorrect\n3. Labels that should be added\n4. A follow-up question to test understanding\n\nKeep your response concise but thorough.`,
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/png',
                    data: base64Image.split(',')[1],
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('Vision API failed');

      // Handle streaming response
      const reader2 = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      const atomMsgId = crypto.randomUUID();

      setMessages(prev => [...prev, {
        id: atomMsgId,
        role: 'atom',
        content: '',
        timestamp: new Date(),
      }]);

      if (reader2) {
        while (true) {
          const { done, value } = await reader2.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          // Parse SSE chunks
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
                // Sometimes the content comes directly
                fullContent += data;
                setMessages(prev => prev.map(m =>
                  m.id === atomMsgId ? { ...m, content: fullContent } : m
                ));
              }
            }
          }
        }
      }

      // If streaming didn't work, try json response
      if (!fullContent) {
        const text = await response.text();
        setMessages(prev => prev.map(m =>
          m.id === atomMsgId ? { ...m, content: text || 'I analyzed your drawing but had trouble formatting the response. Try submitting again.' } : m
        ));
      }
    } catch (error) {
      console.error('Vision analysis failed:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'atom',
        content: "I had trouble analyzing your drawing. Make sure you've drawn something on the canvas and try again. If the issue persists, the API might be temporarily unavailable.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      setCapturing(false);
    }
  }, [excalidrawAPI, exportToBlob, capturing, selectedTemplate, examMode]);

  // Send text message
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages
            .filter(m => !m.imageUrl)
            .slice(-10)
            .map(m => ({ role: m.role === 'atom' ? 'assistant' : 'user', content: m.content }))
            .concat([{ role: 'user', content: input.trim() }]),
        }),
      });

      const reader2 = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      const atomMsgId = crypto.randomUUID();

      setMessages(prev => [...prev, {
        id: atomMsgId,
        role: 'atom',
        content: '',
        timestamp: new Date(),
      }]);

      if (reader2) {
        while (true) {
          const { done, value } = await reader2.read();
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
                fullContent += data;
                setMessages(prev => prev.map(m =>
                  m.id === atomMsgId ? { ...m, content: fullContent } : m
                ));
              }
            }
          }
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'atom',
        content: "Sorry, I couldn't process that. Try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  // Clear canvas
  const handleClearCanvas = useCallback(() => {
    if (excalidrawAPI) {
      excalidrawAPI.resetScene();
    }
  }, [excalidrawAPI]);

  // ==========================================================================
  // TEMPLATE PICKER
  // ==========================================================================

  if (showTemplates) {
    return (
      <div className="min-h-screen bg-[#0F1A24] p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <PenTool className="w-8 h-8 text-teal-400" />
              <h1 className="text-3xl font-bold text-[#E8E0D5]">ATOM Canvas</h1>
            </div>
            <p className="text-[#A0B0BC] text-lg">
              Draw. Submit. Learn. ATOM analyzes your medical diagrams in real-time.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setExamMode(false)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                !examMode
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-[#1B2838] text-[#A0B0BC] hover:bg-[#2D3E50]'
              )}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Teaching Mode
            </button>
            <button
              onClick={() => setExamMode(true)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                examMode
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-[#1B2838] text-[#A0B0BC] hover:bg-[#2D3E50]'
              )}
            >
              <GraduationCap className="w-4 h-4 inline mr-2" />
              Exam Mode
            </button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group p-5 rounded-xl bg-[#1B2838] border border-[#2D3E50] hover:border-teal-500/40 hover:bg-[#1B2838]/80 transition-all text-left space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#2D3E50] text-[#A0B0BC]">
                    {template.category}
                  </span>
                  <PenTool className="w-4 h-4 text-[#A0B0BC] group-hover:text-teal-400 transition-colors" />
                </div>
                <h3 className="text-[#E8E0D5] font-semibold">{template.name}</h3>
                <p className="text-[#A0B0BC] text-sm">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // CANVAS + CHAT LAYOUT
  // ==========================================================================

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#0F1A24]">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1B2838] border-b border-[#2D3E50]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowTemplates(true); setMessages([]); setSelectedTemplate(null); }}
              className="text-sm text-[#A0B0BC] hover:text-teal-400 transition-colors"
            >
              ← Templates
            </button>
            {selectedTemplate && (
              <span className="text-sm text-[#E8E0D5] font-medium">
                {selectedTemplate.name}
              </span>
            )}
            {examMode && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Exam Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearCanvas}
              className="p-2 rounded-lg text-[#A0B0BC] hover:bg-[#2D3E50] hover:text-[#E8E0D5] transition-all"
              title="Clear canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
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
              {capturing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              {capturing ? 'Capturing...' : 'Submit Drawing'}
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="lg:hidden p-2 rounded-lg text-[#A0B0BC] hover:bg-[#2D3E50] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Excalidraw Canvas */}
        <div className="flex-1 min-h-0">
          {ExcalidrawComp ? (
            <ExcalidrawComp
              ref={(api: any) => setExcalidrawAPI(api)}
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
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
                <p className="text-[#A0B0BC]">Loading canvas...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      <div
        className={cn(
          'bg-[#1B2838] border-l border-[#2D3E50] flex flex-col transition-all',
          chatOpen
            ? 'w-full lg:w-[380px] h-1/2 lg:h-full'
            : 'hidden lg:flex lg:w-0 lg:overflow-hidden'
        )}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3E50]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[#E8E0D5] font-medium text-sm">ATOM</span>
            <span className="text-[#A0B0BC] text-xs">Teaching Assistant</span>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="lg:hidden p-1 rounded text-[#A0B0BC] hover:text-[#E8E0D5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col gap-1',
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Canvas snapshot"
                  className="w-48 rounded-lg border border-[#2D3E50]"
                />
              )}
              <div
                className={cn(
                  'max-w-[90%] rounded-xl px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'bg-teal-500/20 text-teal-100 border border-teal-500/20'
                    : 'bg-[#0F1A24] text-[#E8E0D5] border border-[#2D3E50]'
                )}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content || (
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[#2D3E50]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask ATOM about your drawing..."
              className="flex-1 px-3 py-2 rounded-lg bg-[#0F1A24] border border-[#2D3E50] text-[#E8E0D5] text-sm placeholder:text-[#A0B0BC]/50 focus:outline-none focus:border-teal-500/50"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg bg-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile chat toggle (when closed) */}
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
