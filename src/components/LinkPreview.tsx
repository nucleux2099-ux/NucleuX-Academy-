"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, TrendingUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  title?: string;
  excerpt?: string;
  readTime?: number;
  progress?: number;
  source?: string;
  type?: "topic" | "citation" | "external";
  className?: string;
}

export function LinkPreview({
  href,
  children,
  title,
  excerpt,
  readTime,
  progress,
  source,
  type = "topic",
  className,
}: LinkPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Show above if not enough space below
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isHovered]);

  const getTypeStyles = () => {
    switch (type) {
      case "citation":
        return {
          link: "text-[#5BB3B3] hover:text-[#22D3EE] border-b border-dashed border-[#5BB3B3]/50",
          preview: "border-l-[#5BB3B3]",
          icon: <BookOpen className="w-4 h-4 text-[#5BB3B3]" />,
        };
      case "external":
        return {
          link: "text-[#C9A86C] hover:text-[#FBBF24]",
          preview: "border-l-[#C9A86C]",
          icon: <ExternalLink className="w-4 h-4 text-[#C9A86C]" />,
        };
      default:
        return {
          link: "text-[#A78BFA] hover:text-[#C4B5FD] border-b border-dotted border-[#A78BFA]/50",
          preview: "border-l-[#5BB3B3]",
          icon: <BookOpen className="w-4 h-4 text-[#5BB3B3]" />,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <span className="relative inline-block">
      <Link
        ref={triggerRef}
        href={href}
        className={cn(
          "transition-colors",
          styles.link,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>

      {/* Preview Popup */}
      {isHovered && (title || excerpt) && (
        <div
          ref={previewRef}
          className={cn(
            "absolute z-50 w-72 p-4 rounded-lg shadow-xl",
            "bg-[#364A5E] border border-[rgba(91,179,179,0.2)] border-l-4",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            styles.preview,
            position === "top" ? "bottom-full mb-2" : "top-full mt-2",
            "left-1/2 -translate-x-1/2"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Arrow */}
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#364A5E] border-[rgba(91,179,179,0.2)]",
              position === "top" 
                ? "bottom-[-7px] border-r border-b" 
                : "top-[-7px] border-l border-t"
            )}
          />

          {/* Content */}
          <div className="relative">
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#3A4D5F] shrink-0">
                {styles.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#E8E0D5] text-sm line-clamp-2">
                  {title}
                </h4>
                {source && (
                  <p className="text-xs text-[#6B7280] mt-0.5">{source}</p>
                )}
              </div>
            </div>

            {excerpt && (
              <p className="text-xs text-[#A0B0BC] line-clamp-3 mb-3">
                {excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              {readTime && (
                <span className="flex items-center gap-1 text-[#6B7280]">
                  <Clock className="w-3 h-3" />
                  {readTime} min read
                </span>
              )}
              {progress !== undefined && (
                <span className="flex items-center gap-1 text-[#6B7280]">
                  <TrendingUp className="w-3 h-3" />
                  {progress}% complete
                </span>
              )}
            </div>

            {progress !== undefined && (
              <div className="mt-2 h-1 bg-[#1F2937] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5BB3B3] to-[#5BB3B3] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}

// Citation-specific preview component
interface CitationPreviewProps {
  children: React.ReactNode;
  source: string;
  chapter?: string;
  page?: string;
  quote?: string;
}

export function CitationPreview({
  children,
  source,
  chapter,
  page,
  quote,
}: CitationPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span className="relative inline">
      <sup
        className="text-[#5BB3B3] cursor-help hover:text-[#22D3EE] transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </sup>

      {isHovered && (
        <div
          className={cn(
            "absolute z-50 w-80 p-4 rounded-lg shadow-xl",
            "bg-[#364A5E] border border-[rgba(91,179,179,0.2)] border-l-4 border-l-[#5BB3B3]",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "bottom-full mb-2 left-0"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#3A4D5F] shrink-0">
              <BookOpen className="w-4 h-4 text-[#5BB3B3]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#E8E0D5] text-sm">
                {source}
              </h4>
              {(chapter || page) && (
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {chapter && `${chapter}`}
                  {chapter && page && " • "}
                  {page && `p. ${page}`}
                </p>
              )}
            </div>
          </div>

          {quote && (
            <blockquote className="mt-3 pl-3 border-l-2 border-[#5BB3B3]/30 text-xs text-[#A0B0BC] italic">
              "{quote}"
            </blockquote>
          )}
        </div>
      )}
    </span>
  );
}

export default LinkPreview;
