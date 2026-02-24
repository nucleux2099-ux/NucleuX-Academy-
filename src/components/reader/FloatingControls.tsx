'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus, Maximize2, Minimize2, Highlighter, PanelLeftClose, PanelLeft } from 'lucide-react';

interface FloatingControlsProps {
  showSidebar: boolean;
  focusMode: boolean;
  highlightMode: boolean;
  fontSize?: number;
  onToggleSidebar: () => void;
  onDecreaseFontSize: () => void;
  onIncreaseFontSize: () => void;
  onToggleFocusMode: () => void;
  onToggleHighlightMode: () => void;
}

export function FloatingControls({
  showSidebar, focusMode, highlightMode,
  onToggleSidebar, onDecreaseFontSize, onIncreaseFontSize,
  onToggleFocusMode, onToggleHighlightMode,
}: FloatingControlsProps) {
  const buttons = [
    { icon: showSidebar ? PanelLeftClose : PanelLeft, onClick: onToggleSidebar, active: false },
    { icon: Minus, onClick: onDecreaseFontSize, active: false },
    { icon: Plus, onClick: onIncreaseFontSize, active: false },
    { icon: focusMode ? Minimize2 : Maximize2, onClick: onToggleFocusMode, active: focusMode, activeColor: 'text-[#5BB3B3] border-[#5BB3B3]/50' },
    { icon: Highlighter, onClick: onToggleHighlightMode, active: highlightMode, activeColor: 'text-[#C9A86C] border-[#C9A86C]/50' },
  ];

  return (
    <div className={`fixed top-20 right-6 z-40 flex flex-col gap-2 transition-opacity ${focusMode ? 'opacity-30 hover:opacity-100' : ''}`}>
      {buttons.map((btn, i) => (
        <Button key={i} variant="outline" size="icon" onClick={btn.onClick}
          className={`bg-[#364A5E] border-[rgba(91,179,179,0.15)] w-10 h-10 ${
            btn.active ? btn.activeColor : 'text-[#A0B0BC] hover:text-[#E8E0D5]'
          }`}>
          <btn.icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}
