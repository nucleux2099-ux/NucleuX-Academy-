"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, ChevronRight, ChevronLeft, Quote, Atom } from "lucide-react";
import { topicData } from "@/components/reader/data";
import { renderContentBlock } from "@/components/reader/ContentRenderer";
import { ReaderSidebar } from "@/components/reader/ReaderSidebar";
import { FloatingControls } from "@/components/reader/FloatingControls";

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState(topicData.sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(topicData.readTime);
  const [fontSize, setFontSize] = useState(16);
  const [focusMode, setFocusMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(topicData.isBookmarked);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [noteText, setNoteText] = useState("");
  
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
      setReadingTime(Math.max(1, Math.round(topicData.readTime * (1 - progress / 100))));
      
      for (let i = topicData.sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(topicData.sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(topicData.sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  
  const navigateSection = (direction: "prev" | "next") => {
    const idx = topicData.sections.findIndex(s => s.id === activeSection);
    const newIdx = direction === "prev" ? idx - 1 : idx + 1;
    if (newIdx >= 0 && newIdx < topicData.sections.length) scrollToSection(topicData.sections[newIdx].id);
  };

  return (
    <div className={`min-h-screen ${focusMode ? 'bg-[#0a1628]' : ''}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#2D3E50]">
        <div className="h-full bg-gradient-to-r from-[#7BA69E] to-[#5BB3B3] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>
      
      <FloatingControls
        showSidebar={showSidebar} focusMode={focusMode} highlightMode={highlightMode} fontSize={fontSize}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onDecreaseFontSize={() => setFontSize(Math.max(12, fontSize - 2))}
        onIncreaseFontSize={() => setFontSize(Math.min(24, fontSize + 2))}
        onToggleFocusMode={() => setFocusMode(!focusMode)}
        onToggleHighlightMode={() => setHighlightMode(!highlightMode)}
      />
      
      {/* ATOM Button */}
      <Link href={`/chat?topic=${params.id}`}
        className="fixed bottom-24 lg:bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#0E7490] rounded-full shadow-lg shadow-[#5BB3B3]/30 transition-all hover:scale-105">
        <Atom className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Ask ATOM</span>
      </Link>

      <div className="flex max-w-7xl mx-auto">
        {showSidebar && !focusMode && (
          <ReaderSidebar
            activeSection={activeSection} scrollProgress={scrollProgress} readingTime={readingTime}
            isBookmarked={isBookmarked} isCompleted={isCompleted} showNotes={showNotes}
            onScrollToSection={scrollToSection}
            onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
            onToggleNotes={() => setShowNotes(!showNotes)}
            onToggleCompleted={() => setIsCompleted(!isCompleted)}
          />
        )}

        <main className={`flex-1 min-w-0 ${focusMode ? 'max-w-3xl mx-auto' : ''}`}>
          <div className="p-6" ref={contentRef}>
            {!focusMode && (
              <button onClick={() => router.back()} className="flex items-center gap-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />Back to Library
              </button>
            )}

            {/* Header */}
            <div className={`mb-8 ${focusMode ? 'text-center' : ''}`}>
              <div className="flex items-center gap-2 mb-3 flex-wrap justify-center lg:justify-start">
                <Badge className="bg-[#7BA69E]/20 text-[#7BA69E] border-none">{topicData.category}</Badge>
                <Badge variant="outline" className="border-[rgba(91,179,179,0.2)] text-[#6B7280]">{topicData.readTime} min read</Badge>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-[#C9A86C] fill-[#C9A86C]" />
                  <span className="text-[#E8E0D5] font-medium">{topicData.rating}</span>
                  <span className="text-[#6B7280]">({topicData.totalRatings})</span>
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E8E0D5] mb-3" style={{ fontSize: `${fontSize + 14}px` }}>{topicData.title}</h1>
              <p className="text-lg text-[#A0B0BC]" style={{ fontSize: `${fontSize + 2}px` }}>{topicData.subtitle}</p>
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <Card className="mb-6 bg-[#364A5E] border-[#8B5CF6]/30 border-l-4 border-l-[#8B5CF6]">
                <CardContent className="p-4">
                  <textarea placeholder="Add your notes here..." value={noteText} onChange={(e) => setNoteText(e.target.value)}
                    className="w-full h-24 p-3 bg-[#2D3E50] border border-[rgba(91,179,179,0.15)] rounded-lg resize-none text-sm text-[#E8E0D5] placeholder-[#6B7280] focus:border-[#8B5CF6] focus:outline-none" />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#5BB3B3] text-white">Save Note</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Sections */}
            <div className="space-y-8" style={{ fontSize: `${fontSize}px` }}>
              {topicData.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-[#E8E0D5] mb-6 pb-3 border-b border-[rgba(91,179,179,0.1)]" style={{ fontSize: `${fontSize + 8}px` }}>
                    {section.title}
                  </h2>
                  <div className="prose prose-invert max-w-none leading-relaxed">
                    {renderContentBlock(section.content)}
                  </div>
                </section>
              ))}
            </div>

            {/* Citations */}
            <Card className="mt-12 bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
                  <Quote className="w-5 h-5 text-[#5BB3B3]" />References
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topicData.citations.map((cite) => (
                  <div key={cite.id} className="flex items-start gap-3 text-sm">
                    <span className="text-[#5BB3B3] font-medium">[{cite.id}]</span>
                    <div>
                      <span className="text-[#A0B0BC]">{cite.text}</span>
                      <span className="text-[#6B7280]"> — {cite.source}</span>
                      {cite.page && <span className="text-[#6B7280]">, p. {cite.page}</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(91,179,179,0.1)]">
              <Button variant="outline" onClick={() => navigateSection("prev")}
                disabled={activeSection === topicData.sections[0].id}
                className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5]">
                <ChevronLeft className="w-4 h-4 mr-2" />Previous
              </Button>
              <Button variant="outline" onClick={() => navigateSection("next")}
                disabled={activeSection === topicData.sections[topicData.sections.length - 1].id}
                className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5]">
                Next<ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
