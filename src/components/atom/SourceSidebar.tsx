'use client';

import { BookOpen, CheckCircle2, Lock, PanelLeftClose, Zap, MessageSquare } from 'lucide-react';
import type { AtomSourceCatalogItem } from '@/lib/atom/source-catalog';

const MODE_PILLS = [
    { value: 'concise', label: 'Concise', icon: Zap },
    { value: 'detailed', label: 'Detailed', icon: BookOpen },
    { value: 'narrative', label: 'Narrative', icon: MessageSquare },
] as const;

type Props = {
    sources: AtomSourceCatalogItem[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
    loading: boolean;
    responseStyle: string;
    onStyleChange: (style: string) => void;
    onClose: () => void;
};

export function SourceSidebar({
    sources, selectedIds, onToggle, onSelectAll, onClearAll,
    loading, responseStyle, onStyleChange, onClose,
}: Props) {
    const selectableCount = sources.filter(
        (s) => !s.availabilityStatus || s.availabilityStatus === 'indexed_ready',
    ).length;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 px-3.5 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Sources</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                        {selectedIds.length}/{selectableCount}
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
                    >
                        <PanelLeftClose className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Source List */}
                <div className="p-3">
                    {/* Select/Clear controls */}
                    <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">Textbooks</p>
                        <div className="flex gap-2">
                            <button
                                onClick={onSelectAll}
                                className="text-[10px] text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                                Select all
                            </button>
                            <span className="text-[10px] text-border">·</span>
                            <button
                                onClick={onClearAll}
                                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        </div>
                    ) : sources.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-6">No sources available</p>
                    ) : (
                        <div className="space-y-0.5">
                            {sources.map((source) => {
                                const selected = selectedIds.includes(source.id);
                                const disabled = !!source.availabilityStatus && source.availabilityStatus !== 'indexed_ready';
                                return (
                                    <button
                                        key={source.id}
                                        disabled={disabled}
                                        onClick={() => onToggle(source.id)}
                                        className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${selected
                                            ? 'bg-primary/10 border border-primary/20'
                                            : 'border border-transparent hover:bg-muted/50'
                                            } ${disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {/* Status dot */}
                                        <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${disabled
                                            ? 'bg-muted'
                                            : selected
                                                ? 'bg-primary shadow-[0_0_6px_rgba(91,179,179,0.5)]'
                                                : 'bg-muted-foreground/30 group-hover:bg-muted-foreground'
                                            }`} />
                                        <span className={`text-[12px] truncate flex-1 transition-colors ${selected ? 'text-foreground font-medium' : 'text-muted-foreground'
                                            }`}>
                                            {source.shortTitle}
                                        </span>
                                        {disabled ? (
                                            <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                                        ) : (
                                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 transition-all ${selected ? 'text-primary scale-100' : 'text-transparent group-hover:text-muted-foreground/50 scale-90'
                                                }`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mode Pills */}
                <div className="px-3 pb-4 pt-4 border-t border-border mt-1 relative z-10 shrink-0 bg-background/5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-2">Response Style</p>
                    <div className="flex gap-1">
                        {MODE_PILLS.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => onStyleChange(value)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-medium transition-all duration-150 ${responseStyle === value
                                    ? 'bg-primary/10 border border-primary/30 text-primary shadow-teal-subtle'
                                    : 'border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                    }`}
                            >
                                <Icon className="w-3 h-3" /> {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
