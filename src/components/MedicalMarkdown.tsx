"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface MedicalMarkdownProps {
  content: string;
  className?: string;
}

export function MedicalMarkdown({ content, className }: MedicalMarkdownProps) {
  return (
    <div className={cn("medical-markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-[#E5E7EB] mt-6 mb-4 pb-2 border-b border-[rgba(6,182,212,0.2)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-[#E5E7EB] mt-5 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#06B6D4] rounded-full" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-[#06B6D4] mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-[#7C3AED] mt-3 mb-2">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-[#D1D5DB] leading-relaxed mb-4">
              {children}
            </p>
          ),

          // Strong/Bold - Highlight important terms
          strong: ({ children }) => (
            <strong className="font-semibold text-[#E5E7EB] bg-[rgba(6,182,212,0.1)] px-1 rounded">
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="text-[#06B6D4] not-italic font-medium">
              {children}
            </em>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4 ml-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 ml-1 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children, ordered }) => (
            <li className="text-[#D1D5DB] flex items-start gap-2">
              {!ordered && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-2.5 shrink-0" />
              )}
              <span className="flex-1">{children}</span>
            </li>
          ),

          // Code blocks
          code: ({ inline, className, children }) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 bg-[rgba(124,58,237,0.2)] text-[#A78BFA] rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={cn(
                "block p-4 bg-[#0D1B2A] border border-[rgba(6,182,212,0.1)] rounded-lg text-sm font-mono text-[#D1D5DB] overflow-x-auto mb-4",
                className
              )}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4">{children}</pre>
          ),

          // Blockquotes - Clinical Notes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#F59E0B] bg-[rgba(245,158,11,0.1)] pl-4 py-3 pr-4 my-4 rounded-r-lg">
              <div className="flex items-start gap-2">
                <span className="text-[#F59E0B] text-lg">💡</span>
                <div className="text-[#FCD34D]">{children}</div>
              </div>
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[rgba(6,182,212,0.15)]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[rgba(6,182,212,0.05)] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#06B6D4] border-b border-[rgba(6,182,212,0.2)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-[#D1D5DB]">
              {children}
            </td>
          ),

          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#06B6D4] hover:text-[#22D3EE] underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-t border-[rgba(6,182,212,0.2)]" />
          ),

          // Images
          img: ({ src, alt }) => (
            <figure className="my-4">
              <img 
                src={src} 
                alt={alt || ''} 
                className="rounded-lg border border-[rgba(255,255,255,0.1)] max-w-full"
              />
              {alt && (
                <figcaption className="text-center text-sm text-[#9CA3AF] mt-2 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Special callout boxes for medical content
export function ClinicalPearl({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-lg my-4">
      <span className="text-2xl">💎</span>
      <div className="text-[#6EE7B7] flex-1">{children}</div>
    </div>
  );
}

export function HighYield({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-lg my-4">
      <span className="text-2xl">🎯</span>
      <div className="text-[#FCA5A5] flex-1">
        <span className="font-semibold text-[#EF4444]">HIGH YIELD: </span>
        {children}
      </div>
    </div>
  );
}

export function Mnemonic({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] rounded-lg my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🧠</span>
        <h4 className="font-semibold text-[#A78BFA]">{title}</h4>
      </div>
      <div className="text-[#C4B5FD] font-mono text-sm">{children}</div>
    </div>
  );
}

export function ExamTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] rounded-lg my-4">
      <span className="text-2xl">📝</span>
      <div className="text-[#67E8F9] flex-1">
        <span className="font-semibold text-[#06B6D4]">EXAM TIP: </span>
        {children}
      </div>
    </div>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-lg my-4">
      <span className="text-2xl">⚠️</span>
      <div className="text-[#FCD34D] flex-1">{children}</div>
    </div>
  );
}
