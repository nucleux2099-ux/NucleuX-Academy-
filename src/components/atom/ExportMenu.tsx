'use client';

import { useState, useRef } from 'react';
import { ChevronDown, Copy, FileDown, FileText } from 'lucide-react';

type Props = {
    /** Full chat as markdown string */
    chatMarkdown: string;
    /** Label shown on the button */
    label?: string;
};

export function ExportMenu({ chatMarkdown, label = 'Export' }: Props) {
    const [open, setOpen] = useState(false);
    const [copiedState, setCopiedState] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleCopyAll = () => {
        navigator.clipboard.writeText(chatMarkdown).catch(() => { });
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 1500);
        setOpen(false);
    };

    const handleDownloadMd = () => {
        const blob = new Blob([chatMarkdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atom-chat-${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
    };

    const handleExportPdf = async () => {
        setOpen(false);
        // Dynamic import to avoid bundle-time dependency
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const container = document.createElement('div');
            container.innerHTML = `
        <div style="font-family: system-ui, sans-serif; color: #1a1a2e; padding: 32px; max-width: 700px;">
          <div style="border-bottom: 2px solid #20A2B3; padding-bottom: 12px; margin-bottom: 24px;">
            <h1 style="font-size: 18px; color: #060B11; margin: 0;">⚛️ ATOM Studio — Chat Export</h1>
            <p style="font-size: 11px; color: #7B8599; margin: 4px 0 0;">Generated ${new Date().toLocaleString()}</p>
          </div>
          <div style="font-size: 13px; line-height: 1.8; white-space: pre-wrap;">${chatMarkdown.replace(/\n/g, '<br/>')}</div>
          <div style="border-top: 1px solid #E5E7EB; margin-top: 32px; padding-top: 12px;">
            <p style="font-size: 10px; color: #9CA3AF; text-align: center;">NucleuX Academy · ATOM AI · Exported ${new Date().toISOString().slice(0, 10)}</p>
          </div>
        </div>
      `;
            document.body.appendChild(container);
            await html2pdf().set({
                margin: 10,
                filename: `atom-chat-${new Date().toISOString().slice(0, 10)}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            }).from(container).save();
            document.body.removeChild(container);
        } catch {
            // Fallback: download as markdown if html2pdf isn't available
            handleDownloadMd();
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border transition-all font-medium"
            >
                <FileDown className="w-3 h-3" /> {label}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <>
                    {/* Click-away backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    <div className="absolute right-0 top-full mt-1.5 z-50 w-48 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-matte-lg py-1.5">
                        <button
                            onClick={handleCopyAll}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground hover:bg-muted transition-colors text-left"
                        >
                            <Copy className="w-3.5 h-3.5 text-primary" />
                            {copiedState ? 'Copied!' : 'Copy all'}
                        </button>
                        <button
                            onClick={handleDownloadMd}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground hover:bg-muted transition-colors text-left"
                        >
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            Download .md
                        </button>
                        <button
                            onClick={handleExportPdf}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground hover:bg-muted transition-colors text-left"
                        >
                            <FileDown className="w-3.5 h-3.5 text-purple-400" />
                            Export PDF
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
