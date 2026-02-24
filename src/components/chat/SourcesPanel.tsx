"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, BookMarked, StickyNote, Upload, Check, Plus } from "lucide-react";
import type { Source } from "./data";

const sourceIcon = (type: Source["type"]) => {
  switch (type) {
    case "textbook": return <BookMarked className="w-4 h-4 text-[#5BB3B3]" />;
    case "notes": return <StickyNote className="w-4 h-4 text-[#5EEAD4]" />;
    case "upload": return <Upload className="w-4 h-4 text-[#22D3EE]" />;
  }
};

interface SourcesPanelProps {
  sources: Source[];
  onToggle: (id: string) => void;
}

export function SourcesPanel({ sources, onToggle }: SourcesPanelProps) {
  const enabledCount = sources.filter(s => s.enabled).length;
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1E3A5F]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#5BB3B3]" /> Sources
          <Badge className="bg-[#5BB3B3]/20 text-[#5EEAD4] border-[#5BB3B3]/30 text-[10px] ml-auto">
            {enabledCount}/{sources.length}
          </Badge>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sources.map((source) => (
          <button key={source.id} onClick={() => onToggle(source.id)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
              source.enabled ? "bg-[#5BB3B3]/10 border border-[#5BB3B3]/30" : "border border-transparent hover:bg-[#1E3A5F]/50"
            }`}>
            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
              source.enabled ? "border-[#5BB3B3] bg-[#5BB3B3]" : "border-[#475569]"
            }`}>{source.enabled && <Check className="w-3 h-3 text-white" />}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {sourceIcon(source.type)}
                <span className={`text-xs font-medium truncate ${source.enabled ? "text-white" : "text-[#94A3B8]"}`}>{source.title}</span>
              </div>
              <span className="text-[10px] text-[#64748B] capitalize">{source.type}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-[#1E3A5F]">
        <Button variant="outline" size="sm" className="w-full border-dashed border-[#1E3A5F] bg-transparent text-[#94A3B8] hover:text-[#5BB3B3] hover:border-[#5BB3B3] hover:bg-[#5BB3B3]/10">
          <Plus className="w-3 h-3 mr-2" /> Add Source
        </Button>
      </div>
    </div>
  );
}
