'use client';

import { useState } from 'react';
import { Brain, Copy, FileDown, RefreshCw, ThumbsUp, Wrench } from 'lucide-react';
import { MedicalMarkdown } from '@/components/MedicalMarkdown';

type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
};

type Props = {
    message: Message;
};

function formatTime(ts: string): string {
    try {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
}

export function MessageBubble({ message }: Props) {
    const [feedback, setFeedback] = useState<'helpful' | 'needs_fix' | null>(null);
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isSystem = message.role === 'system';

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleExportMd = () => {
        const blob = new Blob([message.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atom-response-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="group">
            {/* Message row */}
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2.5`}>
                {/* ATOM avatar */}
                {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Brain className="w-3.5 h-3.5 text-primary" />
                    </div>
                )}

                <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-matte ${isUser
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
                        : isSystem
                            ? 'bg-destructive/10 border border-destructive/20'
                            : 'border border-border bg-card/50'
                        }`}
                >
                    {isAssistant ? (
                        <MedicalMarkdown
                            content={message.content}
                            className="text-[13px] leading-relaxed [&_strong]:text-primary [&_em]:text-primary/80 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-muted-foreground [&_li]:text-muted-foreground"
                        />
                    ) : (
                        <p className={`text-[13px] whitespace-pre-wrap ${isSystem ? 'text-destructive' : 'text-foreground'}`}>
                            {message.content}
                        </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">{formatTime(message.timestamp)}</p>
                </div>
            </div>

            {/* Hover actions — assistant only */}
            {isAssistant && (
                <div className="flex items-center gap-1 mt-1 ml-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-medium"
                    >
                        <Copy className="w-3 h-3" />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleExportMd}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-medium"
                    >
                        <FileDown className="w-3 h-3" /> .md
                    </button>
                    <span className="w-px h-3 bg-border mx-0.5" />
                    <button
                        onClick={() => setFeedback(feedback === 'helpful' ? null : 'helpful')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] transition-all font-medium ${feedback === 'helpful'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                            : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10'
                            }`}
                    >
                        <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => setFeedback(feedback === 'needs_fix' ? null : 'needs_fix')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] transition-all font-medium ${feedback === 'needs_fix'
                            ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30'
                            : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10'
                            }`}
                    >
                        <Wrench className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
