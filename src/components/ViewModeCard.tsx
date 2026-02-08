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
          ? "bg-gradient-to-br from-[rgba(6,182,212,0.2)] to-[rgba(139,92,246,0.1)] border-2 border-[#06B6D4] shadow-lg shadow-[rgba(6,182,212,0.15)]"
          : "bg-[#0D1B2A] border-2 border-transparent hover:bg-[rgba(6,182,212,0.05)] hover:border-[rgba(6,182,212,0.2)]"
      )}
    >
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,182,212,0.1)] to-transparent pointer-events-none" />
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
        isActive ? "text-[#06B6D4]" : "text-[#9CA3AF] group-hover:text-[#E5E7EB]"
      )}>
        {config.label}
      </span>

      {/* Description (optional) */}
      {showDescription && (
        <span className={cn(
          "text-[10px] text-[#6B7280] mt-0.5 line-clamp-1",
          isActive && "text-[#9CA3AF]"
        )}>
          {config.description}
        </span>
      )}

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
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
