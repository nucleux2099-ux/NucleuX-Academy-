"use client";

import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/types/library";
import { VIEW_MODE_CONFIG } from "@/lib/types/library";

interface ViewModeCardProps {
  mode: ViewMode;
  isActive: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export function ViewModeCard({ 
  mode, 
  isActive, 
  onClick, 
  size = 'md',
  showDescription = false 
}: ViewModeCardProps) {
  const config = VIEW_MODE_CONFIG[mode];
  
  const sizeClasses = {
    sm: 'p-2 gap-1',
    md: 'p-3 gap-1.5',
    lg: 'p-4 gap-2',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center rounded-xl transition-all duration-200 text-center group relative overflow-hidden",
        sizeClasses[size],
        isActive
          ? "bg-gradient-to-br from-[rgba(91,179,179,0.2)] to-[rgba(139,92,246,0.1)] border-2 border-[#5BB3B3] shadow-lg shadow-[rgba(91,179,179,0.15)]"
          : "bg-[#2D3E50] border-2 border-transparent hover:bg-[rgba(91,179,179,0.05)] hover:border-[rgba(91,179,179,0.2)]"
      )}
    >
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(91,179,179,0.1)] to-transparent pointer-events-none" />
      )}
      
      {/* Icon with subtle animation */}
      <span className={cn(
        iconSizes[size],
        "transition-transform duration-200",
        isActive ? "scale-110" : "group-hover:scale-105"
      )}>
        {config.icon}
      </span>
      
      {/* Label */}
      <span className={cn(
        textSizes[size],
        "font-semibold tracking-wide transition-colors",
        isActive ? "text-[#5BB3B3]" : "text-[#A0B0BC] group-hover:text-[#E8E0D5]"
      )}>
        {config.label}
      </span>

      {/* Description (optional) */}
      {showDescription && (
        <span className={cn(
          "text-[10px] text-[#6B7280] mt-0.5 line-clamp-1",
          isActive && "text-[#A0B0BC]"
        )}>
          {config.description}
        </span>
      )}

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#5BB3B3] animate-pulse" />
      )}
    </button>
  );
}

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  variant?: 'grid' | 'horizontal' | 'compact';
  className?: string;
}

export function ViewModeSelector({
  currentMode,
  onModeChange,
  variant = 'grid',
  className
}: ViewModeSelectorProps) {
  const modes: ViewMode[] = ['explorer', 'examPrep', 'textbook', 'quiz', 'cases', 'roadmap'];

  const containerClasses = {
    grid: 'grid grid-cols-3 sm:grid-cols-6 gap-2',
    horizontal: 'flex gap-2 overflow-x-auto pb-2 scrollbar-hide',
    compact: 'flex gap-1.5 flex-wrap',
  };

  const cardSize = variant === 'compact' ? 'sm' : 'md';

  return (
    <div className={cn(containerClasses[variant], className)}>
      {modes.map((mode) => (
        <ViewModeCard
          key={mode}
          mode={mode}
          isActive={currentMode === mode}
          onClick={() => onModeChange(mode)}
          size={cardSize}
          showDescription={variant === 'grid'}
        />
      ))}
    </div>
  );
}
