'use client';

import { BookOpen, FileText, PanelRightClose, Sparkles } from 'lucide-react';
import { ExportMenu } from './ExportMenu';
import type { AtomEventType } from '@/lib/atom/types';

type ArtifactItem = {
    id: string;
    title: string;
    kind: string;
    content?: string;
    createdAt: string;
};

type TimelineItem = {
    id: string;
    type: AtomEventType | 'mode.launch' | 'gdd.session' | 'gdd.advance';
    ts: string;
    label: string;
    detail?: string;
};

type Props = {
    artifacts: ArtifactItem[];
    timeline: TimelineItem[]; // Used for citations now
    onClose: () => void;
    fullChatMarkdown: string;
};

function formatTime(ts: string): string {
    try {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
}

export function OutputsPanel({ artifacts, timeline, onClose, fullChatMarkdown }: Props) {
    // Filter timeline for source citations (retrieval events)
    const citations = timeline.filter(t => t.label.toLowerCase().includes('source') || t.label.toLowerCase().includes('retrieval'));

    return (
        <div className="flex flex-col h-full bg-background/95">
            {/* Header */}
            <div className="h-14 px-4 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Outputs & Citations</span>
                </div>
                <div className="flex items-center gap-2">
                    <ExportMenu chatMarkdown={fullChatMarkdown} label="Export Chat" />
                    <span className="w-px h-4 bg-border mx-1" />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <PanelRightClose className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">

                {/* Artifacts Section */}
                <div>
                    <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" /> Generated Artifacts
                    </h3>

                    {artifacts.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-4 text-center">
                            <p className="text-[11px] text-muted-foreground">No artifacts generated yet.<br />Request summaries or flashcards in chat.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {artifacts.map((artifact) => (
                                <div key={artifact.id} className="group rounded-xl border border-border bg-card/60 p-3 hover:border-primary/50 hover:shadow-teal-subtle transition-all card-hover">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/10 text-primary mb-1.5 border border-primary/20">
                                                {artifact.kind.toUpperCase()}
                                            </span>
                                            <h4 className="text-[12px] font-medium text-foreground">{artifact.title}</h4>
                                        </div>
                                    </div>
                                    {artifact.content && (
                                        <div className="mt-3 pt-3 border-t border-border flex justify-end">
                                            <ExportMenu chatMarkdown={artifact.content} label="Export" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Citations Section */}
                <div>
                    <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" /> Source Citations
                    </h3>

                    {citations.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground px-2">Sources will appear here when ATOM references them.</p>
                    ) : (
                        <div className="relative border-l border-border ml-2 space-y-4 pb-2">
                            {citations.map((cite) => (
                                <div key={cite.id} className="relative pl-4">
                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full border border-primary bg-background shadow-[0_0_8px_rgba(91,179,179,0.5)]" />
                                    <div className="rounded-lg border border-border bg-card/40 p-2.5 transition-colors hover:bg-card/80">
                                        <p className="text-[11px] font-medium text-foreground mb-1">{cite.label}</p>
                                        {cite.detail && <p className="text-[10px] text-muted-foreground line-clamp-2">{cite.detail}</p>}
                                        <span className="text-[9px] text-muted-foreground/70 mt-2 block">{formatTime(cite.ts)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
