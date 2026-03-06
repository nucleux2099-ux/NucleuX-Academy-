"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Brain, Lightbulb, AlertTriangle, BookOpen } from "lucide-react";
import { MedicalMarkdown } from "./MedicalMarkdown";

interface AutoExamPrepProps {
  conceptContent: string;
  topicName: string;
  bionic?: boolean;
}

/**
 * Auto-generates an exam-prep view from textbook/concept markdown.
 * Extracts: key facts (bold text), tables, lists, and highlights them.
 */
export function AutoExamPrep({ conceptContent, topicName, bionic }: AutoExamPrepProps) {
  const extracted = useMemo(() => extractExamContent(conceptContent), [conceptContent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]">
          <Lightbulb className="w-3 h-3 mr-1" />
          Auto-Generated from Textbook
        </Badge>
        <span className="text-xs text-[#6B7280]">Review & verify with source material</span>
      </div>

      {/* Quick Summary - first paragraph */}
      {extracted.summary && (
        <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#F59E0B]" />
              Quick Summary
            </h3>
            <MedicalMarkdown content={extracted.summary} bionic={bionic} />
          </CardContent>
        </Card>
      )}

      {/* Key Facts (bold terms found in content) */}
      {extracted.keyFacts.length > 0 && (
        <Card className="bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.2)]">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#F59E0B] mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Facts & Definitions
            </h3>
            <ul className="space-y-2">
              {extracted.keyFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 text-[#E5E7EB]">
                  <span className="text-[#F59E0B] mt-1 shrink-0">★</span>
                  <MedicalMarkdown content={fact} bionic={bionic} className="[&_p]:mb-0" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tables (high-yield for exams) */}
      {extracted.tables.length > 0 && (
        <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#06B6D4]" />
              Important Tables
            </h3>
            {extracted.tables.map((table, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <MedicalMarkdown content={table} bionic={bionic} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mnemonics & Memory Aids (lines with mnemonic-like patterns) */}
      {extracted.mnemonics.length > 0 && (
        <Card className="bg-[#142538] border-[rgba(236,72,153,0.1)]">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#EC4899]" />
              Memory Aids & Mnemonics
            </h3>
            <ul className="space-y-2">
              {extracted.mnemonics.map((m, i) => (
                <li key={i} className="p-3 bg-[#0D1B2A] rounded-lg text-[#E5E7EB] border border-[rgba(236,72,153,0.2)]">
                  <MedicalMarkdown content={m} bionic={bionic} className="[&_p]:mb-0" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Important Lists */}
      {extracted.importantLists.length > 0 && (
        <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#A78BFA]" />
              High-Yield Lists
            </h3>
            {extracted.importantLists.map((list, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <MedicalMarkdown content={list} bionic={bionic} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Fallback if nothing extracted */}
      {extracted.keyFacts.length === 0 && extracted.tables.length === 0 && !extracted.summary && (
        <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
          <CardContent className="p-5 text-center">
            <Target className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">
              Exam prep content is being prepared
            </h3>
            <p className="text-[#9CA3AF]">
              Switch to the Textbook view to study the full content for {topicName}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function extractExamContent(markdown: string) {
  const lines = markdown.split('\n');
  
  const summary: string[] = [];
  const keyFacts: string[] = [];
  const tables: string[] = [];
  const mnemonics: string[] = [];
  const importantLists: string[] = [];

  // Extract first meaningful paragraph as summary
  let foundSummary = false;
  let inTable = false;
  let currentTable: string[] = [];
  let inList = false;
  let currentList: string[] = [];
  let currentListHeading = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and headings for summary extraction
    if (!foundSummary && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('|') && !trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.startsWith('>')) {
      // Collect first paragraph (consecutive non-empty lines)
      const paraLines: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].trim() && !lines[j].trim().startsWith('#')) {
        paraLines.push(lines[j].trim());
        j++;
      }
      if (paraLines.length > 0) {
        summary.push(paraLines.join(' '));
        foundSummary = true;
      }
    }

    // Extract tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        currentTable = [];
      }
      currentTable.push(line);
    } else if (inTable) {
      inTable = false;
      if (currentTable.length >= 3) { // header + separator + at least one row
        tables.push(currentTable.join('\n'));
      }
      currentTable = [];
    }

    // Extract bold text as key facts (lines containing **text**)
    const boldMatches = trimmed.match(/\*\*(.+?)\*\*/g);
    if (boldMatches && !trimmed.startsWith('#') && !trimmed.startsWith('|') && trimmed.length > 20) {
      // Only include lines that are substantive (not just a bold word)
      keyFacts.push(trimmed);
    }

    // Detect mnemonics (lines mentioning "mnemonic", acronym patterns, or ALL CAPS words used as memory aids)
    if (/mnemonic|remember|recall|memory aid/i.test(trimmed) || 
        (/^[A-Z]{3,}[:\s-]/.test(trimmed) && trimmed.length > 10)) {
      mnemonics.push(trimmed);
    }

    // Track lists under headings with important keywords
    if (trimmed.startsWith('#')) {
      // Flush previous list
      if (inList && currentList.length >= 3) {
        importantLists.push((currentListHeading ? currentListHeading + '\n' : '') + currentList.join('\n'));
      }
      inList = false;
      currentList = [];
      
      if (/classif|types|causes|features|signs|symptoms|diagnosis|treatment|management|complications|investigations|differential/i.test(trimmed)) {
        currentListHeading = trimmed;
        inList = true;
      }
    } else if (inList && (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed))) {
      currentList.push(line);
    }
  }

  // Flush remaining
  if (inTable && currentTable.length >= 3) {
    tables.push(currentTable.join('\n'));
  }
  if (inList && currentList.length >= 3) {
    importantLists.push((currentListHeading ? currentListHeading + '\n' : '') + currentList.join('\n'));
  }

  // Deduplicate key facts (limit to 15)
  const uniqueFacts = [...new Set(keyFacts)].slice(0, 15);

  return {
    summary: summary.length > 0 ? summary[0] : '',
    keyFacts: uniqueFacts,
    tables: tables.slice(0, 5),
    mnemonics: [...new Set(mnemonics)].slice(0, 8),
    importantLists: importantLists.slice(0, 5),
  };
}
