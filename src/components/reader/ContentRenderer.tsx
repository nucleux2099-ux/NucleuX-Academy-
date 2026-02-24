'use client';

import React from 'react';

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-[#E8E0D5] font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function renderContentBlock(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const result: React.ReactNode[] = [];
  let tableRows: React.ReactNode[] = [];
  let inTable = false;

  lines.forEach((line, i) => {
    if (line.startsWith("|") && !line.includes("---")) {
      if (!inTable) { inTable = true; tableRows = []; }
      const cells = line.split("|").filter(c => c.trim());
      const isHeader = tableRows.length === 0;
      tableRows.push(
        <tr key={i} className={isHeader ? "bg-[#3A4D5F]" : "border-t border-[rgba(91,179,179,0.1)] hover:bg-[#3A4D5F]/50"}>
          {cells.map((cell, ci) => {
            const Tag = isHeader ? "th" : "td";
            return <Tag key={ci} className={`px-4 py-2.5 text-left ${isHeader ? 'font-semibold text-[#E8E0D5] text-sm' : 'text-[#A0B0BC]'}`}>{renderInline(cell.trim())}</Tag>;
          })}
        </tr>
      );
    } else if (line.includes("---") && inTable) {
      // skip separator
    } else {
      if (inTable && tableRows.length > 0) {
        result.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6">
            <table className="min-w-full border border-[rgba(91,179,179,0.15)] rounded-lg overflow-hidden">
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        );
        tableRows = []; inTable = false;
      }
      // Render the line
      if (line.startsWith("## ")) {
        result.push(<h2 key={i} className="text-xl font-bold text-[#E8E0D5] mt-8 mb-4 pb-2 border-b border-[rgba(91,179,179,0.1)]">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        result.push(<h3 key={i} className="text-lg font-semibold text-[#E8E0D5] mt-6 mb-3">{line.slice(4)}</h3>);
      } else if (line.startsWith("> ")) {
        const isAttribution = line.includes("—");
        result.push(
          <blockquote key={i} className={`border-l-4 border-[#C9A86C]/50 pl-4 py-3 my-4 ${isAttribution ? 'bg-[#C9A86C]/5' : 'bg-[rgba(91,179,179,0.05)]'} rounded-r-lg italic`}>
            <span className="text-[#A0B0BC]">{line.slice(2)}</span>
          </blockquote>
        );
      } else if (line.trim() === "---") {
        result.push(<hr key={i} className="my-8 border-[rgba(91,179,179,0.15)]" />);
      } else if (line.startsWith("• ") || line.startsWith("- ")) {
        result.push(
          <li key={i} className="flex items-start gap-2 my-1.5 text-[#A0B0BC]">
            <span className="text-[#5BB3B3] mt-1.5">•</span>
            <span>{renderInline(line.slice(2))}</span>
          </li>
        );
      } else if (/^\d+\. /.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        result.push(
          <li key={i} className="flex items-start gap-3 my-1.5 text-[#A0B0BC]">
            <span className="text-[#5BB3B3] font-semibold min-w-[20px]">{num}.</span>
            <span>{renderInline(line.replace(/^\d+\. /, ""))}</span>
          </li>
        );
      } else if (line.trim() === "") {
        result.push(<div key={i} className="h-4" />);
      } else {
        result.push(<p key={i} className="text-[#A0B0BC] my-3 leading-relaxed">{renderInline(line)}</p>);
      }
    }
  });

  if (tableRows.length > 0) {
    result.push(
      <div key="table-end" className="overflow-x-auto my-6">
        <table className="min-w-full border border-[rgba(91,179,179,0.15)] rounded-lg overflow-hidden">
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }

  return result;
}
