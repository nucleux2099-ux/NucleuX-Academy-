"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Copy, FileCode2 } from "lucide-react";
import type { Message } from "./data";

export type CodeBlock = {
  id: string;
  language: string;
  code: string;
};

export function extractCodeBlocks(messages: Message[]): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```([\w-]+)?\n([\s\S]*?)```/g;

  messages.forEach((message) => {
    if (message.role !== "assistant") return;

    let match: RegExpExecArray | null;
    let index = 0;
    while ((match = regex.exec(message.content)) !== null) {
      blocks.push({
        id: `${message.id}-${index}`,
        language: match[1] || "text",
        code: match[2].trim(),
      });
      index += 1;
    }
  });

  return blocks;
}

interface CanvasPanelProps {
  messages: Message[];
  selectedCodeBlockId: string | null;
  onSelectCodeBlock: (id: string) => void;
}

export function CanvasPanel({ messages, selectedCodeBlockId, onSelectCodeBlock }: CanvasPanelProps) {
  const codeBlocks = useMemo(() => extractCodeBlocks(messages), [messages]);

  const selectedBlock = codeBlocks.find((b) => b.id === selectedCodeBlockId) || codeBlocks[0];

  const handleCopy = async () => {
    if (!selectedBlock?.code) return;
    await navigator.clipboard.writeText(selectedBlock.code);
  };

  if (codeBlocks.length === 0) {
    return (
      <div className="flex-1 p-4 text-center text-[#94A3B8]">
        <Code2 className="w-8 h-8 mx-auto mb-2 text-[#5BB3B3]/70" />
        <p className="text-sm">No code blocks yet.</p>
        <p className="text-xs mt-1 text-[#64748B]">When ATOM returns fenced code, it will appear in canvas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[#1E3A5F] flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-[#5EEAD4]" /> Code Canvas
        </h3>
        <Badge className="bg-[#5EEAD4]/20 text-[#5EEAD4] border-[#5EEAD4]/30 text-[10px]">{codeBlocks.length}</Badge>
      </div>

      <div className="p-3 space-y-2 border-b border-[#1E3A5F] max-h-40 overflow-y-auto">
        {codeBlocks.map((block, i) => (
          <button
            key={block.id}
            onClick={() => onSelectCodeBlock(block.id)}
            className={`w-full text-left px-2.5 py-2 rounded-lg border text-xs transition ${
              (selectedBlock?.id || codeBlocks[0]?.id) === block.id
                ? "border-[#5BB3B3] bg-[#5BB3B3]/10 text-white"
                : "border-[#1E3A5F] text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]/50"
            }`}
          >
            <div className="font-medium">Snippet {i + 1}</div>
            <div className="text-[10px] opacity-80 uppercase">{block.language}</div>
          </button>
        ))}
      </div>

      <div className="flex-1 p-3 overflow-auto">
        <Card className="h-full border-[#1E3A5F] bg-[#101C2B]">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="px-3 py-2 border-b border-[#1E3A5F] flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-[#5EEAD4]">{selectedBlock?.language || "text"}</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-[#94A3B8] hover:text-white" onClick={handleCopy}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            <pre className="flex-1 overflow-auto p-3 text-xs text-[#D1D5DB] font-mono leading-relaxed">
              <code>{selectedBlock?.code}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
