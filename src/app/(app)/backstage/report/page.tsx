"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Printer, Copy } from "lucide-react";
import { ApiStateBoundary } from "@/components/api-state-boundary";
import { useBackstageReport } from "@/lib/api/hooks";

type ReportBlock = { type: "h1" | "h2" | "h3" | "p" | "list"; content: string | string[] };

function parseMarkdownToBlocks(markdown: string): ReportBlock[] {
  const lines = markdown.split("\n");
  const blocks: ReportBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: "list", content: listBuffer });
      listBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
      continue;
    }

    flushList();
    if (line.startsWith("### ")) blocks.push({ type: "h3", content: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ type: "h2", content: line.slice(3) });
    else if (line.startsWith("# ")) blocks.push({ type: "h1", content: line.slice(2) });
    else blocks.push({ type: "p", content: line });
  }

  flushList();
  return blocks;
}

export default function BackstageReportPage() {
  const { data, isLoading, error } = useBackstageReport();

  const download = () => {
    if (!data?.reportMarkdown) return;
    const blob = new Blob([data.reportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backstage-report-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyReport = async () => {
    if (!data?.reportMarkdown) return;
    await navigator.clipboard.writeText(data.reportMarkdown);
  };

  const printReport = () => {
    window.print();
  };

  const blocks = useMemo(() => parseMarkdownToBlocks(data?.reportMarkdown || ""), [data?.reportMarkdown]);

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Generating your weekly report..."
      errorText="Unable to load report right now."
      className="bg-[#2D3E50]"
    >
      <div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-4 md:px-6 md:py-8 print:max-w-none print:bg-white print:px-0 print:py-0">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="min-w-0">
            <Link href="/backstage" className="mb-3 inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="h-4 w-4" /> Back to Backstage
            </Link>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-[#E8E0D5] md:text-3xl">
              <FileText className="h-6 w-6 text-cyan-400" /> Weekly Report
            </h1>
            <p className="mt-1 text-sm text-[#A0B0BC]">Auto-generated summary of your learning performance.</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button onClick={copyReport} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">
              <Copy className="h-4 w-4" /> Copy
            </button>
            <button onClick={printReport} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">
              <Download className="h-4 w-4" /> Download .md
            </button>
          </div>
        </div>

        <article className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#253545] p-4 sm:p-5 print:rounded-none print:border-0 print:bg-white print:p-0">
          {blocks.length ? (
            <div className="space-y-3 text-[#C8D2DA] print:text-black">
              {blocks.map((block, idx) => {
                if (block.type === "h1") return <h2 key={idx} className="mt-2 border-b border-cyan-500/20 pb-2 text-xl font-bold text-[#E8E0D5] print:border-gray-300 print:text-black">{block.content as string}</h2>;
                if (block.type === "h2") return <h3 key={idx} className="mt-4 rounded-lg bg-[#1B2838] px-3 py-2 text-lg font-semibold text-cyan-200 print:bg-transparent print:px-0 print:py-0 print:text-black">{block.content as string}</h3>;
                if (block.type === "h3") return <h4 key={idx} className="mt-2 text-sm font-semibold uppercase tracking-wide text-cyan-300 print:text-black">{block.content as string}</h4>;
                if (block.type === "list")
                  return (
                    <ul key={idx} className="list-inside list-disc space-y-1 rounded-lg border border-white/5 bg-[#1B2838]/60 p-3 text-sm print:border-gray-300 print:bg-transparent print:p-2">
                      {(block.content as string[]).map((item, li) => (
                        <li key={li}>{item}</li>
                      ))}
                    </ul>
                  );
                return <p key={idx} className="text-sm leading-relaxed text-[#C8D2DA] print:text-black">{block.content as string}</p>;
              })}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#C8D2DA] print:text-black">{data?.reportMarkdown || "No report generated yet."}</pre>
          )}
        </article>
      </div>
    </ApiStateBoundary>
  );
}
