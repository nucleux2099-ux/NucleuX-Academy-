"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { ZoomIn } from 'lucide-react';
import { ImageViewer } from './ImageViewer';

let mermaidInitialized = false;

function initMermaid() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: 'transparent',
      primaryColor: '#1a3a4a',
      primaryTextColor: '#E8E0D5',
      primaryBorderColor: '#5BB3B3',
      lineColor: '#5BB3B3',
      secondaryColor: '#2D3E50',
      tertiaryColor: '#0D1B2A',
      textColor: '#E8E0D5',
      mainBkg: '#1a3a4a',
      nodeBorder: '#5BB3B3',
      clusterBkg: 'rgba(91,179,179,0.1)',
      clusterBorder: '#5BB3B3',
      titleColor: '#E8E0D5',
      edgeLabelBackground: '#0D1B2A',
      nodeTextColor: '#E8E0D5',
    },
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: 14,
  });
  mermaidInitialized = true;
}

let renderCounter = 0;

export function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initMermaid();
    const id = `mermaid-${Date.now()}-${++renderCounter}`;
    let cancelled = false;

    (async () => {
      try {
        const { svg } = await mermaid.render(id, chart.trim());
        if (cancelled) return;
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
        // Create data URL for zoom viewer
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        setSvgDataUrl(url);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to render diagram');
          // Clean up any error elements mermaid may have inserted
          const errEl = document.getElementById('d' + id);
          errEl?.remove();
        }
      }
    })();

    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-lg my-4 text-[#FCA5A5] text-sm font-mono">
        <p className="font-semibold mb-1">Diagram Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <figure className="my-4">
        <div
          className="relative group cursor-zoom-in overflow-hidden rounded-lg border border-[rgba(91,179,179,0.15)] bg-[#0D1B2A] p-4 flex justify-center"
          onClick={() => svgDataUrl && setIsOpen(true)}
        >
          <div ref={containerRef} className="mermaid-container [&_svg]:max-w-full" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
      </figure>
      {svgDataUrl && (
        <ImageViewer
          src={svgDataUrl}
          alt="Mermaid Diagram"
          caption="Mermaid Diagram"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
