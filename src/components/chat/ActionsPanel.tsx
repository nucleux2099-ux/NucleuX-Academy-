"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Brain, Presentation, Headphones, Layers, Copy, Download,
} from "lucide-react";
import type { OutputCard } from "./data";

const outputIcon = (type: OutputCard["type"]) => {
  switch (type) {
    case "summary": return <FileText className="w-4 h-4 text-[#5BB3B3]" />;
    case "flashcards": return <Brain className="w-4 h-4 text-[#5EEAD4]" />;
    case "ppt": return <Presentation className="w-4 h-4 text-[#22D3EE]" />;
    case "audio": return <Headphones className="w-4 h-4 text-[#E879F9]" />;
  }
};

interface ActionsPanelProps {
  outputs: OutputCard[];
  isStreaming: boolean;
  hasEnabledSources: boolean;
  onAction: (type: string) => void;
}

export function ActionsPanel({ outputs, isStreaming, hasEnabledSources, onAction }: ActionsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1E3A5F]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5BB3B3]" /> Actions & Output
        </h2>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {[
          { key: "summary", icon: FileText, label: "Summary", color: "#5BB3B3" },
          { key: "flashcards", icon: Brain, label: "Flashcards", color: "#5EEAD4" },
          { key: "ppt", icon: Presentation, label: "Create PPT", color: "#22D3EE" },
          { key: "audio", icon: Headphones, label: "Audio Overview", color: "#E879F9" },
        ].map((action) => (
          <Button key={action.key} variant="outline" size="sm"
            onClick={() => onAction(action.key)} disabled={isStreaming || !hasEnabledSources}
            className="border-[#1E3A5F] bg-transparent hover:border-[#5BB3B3] hover:bg-[#5BB3B3]/10 text-[#94A3B8] hover:text-white justify-start h-10">
            <action.icon className="w-3.5 h-3.5 mr-1.5" style={{ color: action.color }} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {outputs.length === 0 ? (
          <div className="text-center py-8 text-[#64748B]">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Generated outputs will appear here</p>
          </div>
        ) : outputs.map((output) => (
          <Card key={output.id} className="border-[#1E3A5F] bg-[#162535]">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                {outputIcon(output.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{output.title}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-2">{output.preview}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-[#94A3B8] hover:text-[#5BB3B3] hover:bg-[#5BB3B3]/10">
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-[#94A3B8] hover:text-[#5BB3B3] hover:bg-[#5BB3B3]/10">
                      <Download className="w-3 h-3 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
