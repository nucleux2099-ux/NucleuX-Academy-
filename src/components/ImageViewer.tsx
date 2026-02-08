"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  src: string;
  alt?: string;
  caption?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ src, alt, caption, isOpen, onClose }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.25)); }}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-white/70 text-sm min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z + 0.25)); }}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <a
          href={src}
          download
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
        >
          <Download className="w-5 h-5" />
        </a>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div 
        className="max-w-[90vw] max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt || ""}
          className="transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />
      </div>

      {/* Caption */}
      {(caption || alt) && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg max-w-[80vw]">
          <p className="text-white text-center text-sm">{caption || alt}</p>
        </div>
      )}

      {/* Click hint */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        Press ESC or click outside to close
      </div>
    </div>
  );
}

// Medical Image component with layout options
interface MedicalImageProps {
  src: string;
  alt?: string;
  caption?: string;
  source?: string;
  layout?: "full" | "right" | "left" | "center";
  className?: string;
}

export function MedicalImage({ 
  src, 
  alt, 
  caption, 
  source,
  layout = "full",
  className 
}: MedicalImageProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const layoutClasses = {
    full: "w-full",
    right: "float-right ml-4 mb-4 w-1/2 max-w-[300px]",
    left: "float-left mr-4 mb-4 w-1/2 max-w-[300px]",
    center: "mx-auto max-w-[500px]",
  };

  return (
    <>
      <figure className={cn("my-4 clear-both", layoutClasses[layout], className)}>
        <div 
          className="relative group cursor-zoom-in overflow-hidden rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0D1B2A]"
          onClick={() => setIsViewerOpen(true)}
        >
          <img
            src={src}
            alt={alt || ""}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
          />
          {/* Zoom overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        {(caption || source) && (
          <figcaption className="mt-2 text-center">
            {caption && (
              <span className="text-sm text-[#D1D5DB] block">{caption}</span>
            )}
            {source && (
              <span className="text-xs text-[#9CA3AF] block mt-0.5">
                Source: {source}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      <ImageViewer
        src={src}
        alt={alt}
        caption={caption}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
}

// Diagram component for medical diagrams
interface DiagramProps {
  src: string;
  title: string;
  caption?: string;
  layout?: "full" | "right" | "center";
}

export function Diagram({ src, title, caption, layout = "full" }: DiagramProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const layoutClasses = {
    full: "w-full",
    right: "float-right ml-4 mb-4 w-1/2",
    center: "mx-auto max-w-[600px]",
  };

  return (
    <>
      <div className={cn("my-6", layoutClasses[layout])}>
        <div className="bg-[#142538] rounded-xl border border-[rgba(6,182,212,0.15)] overflow-hidden">
          {/* Title bar */}
          <div className="px-4 py-2 bg-[rgba(6,182,212,0.1)] border-b border-[rgba(6,182,212,0.15)] flex items-center justify-between">
            <span className="text-sm font-medium text-[#06B6D4]">📊 {title}</span>
            <button
              onClick={() => setIsViewerOpen(true)}
              className="text-xs text-[#9CA3AF] hover:text-[#06B6D4] transition-colors flex items-center gap-1"
            >
              <ZoomIn className="w-3 h-3" />
              Expand
            </button>
          </div>
          {/* Image */}
          <div 
            className="p-4 cursor-zoom-in"
            onClick={() => setIsViewerOpen(true)}
          >
            <img
              src={src}
              alt={title}
              className="w-full h-auto rounded"
            />
          </div>
          {/* Caption */}
          {caption && (
            <div className="px-4 pb-3">
              <p className="text-xs text-[#9CA3AF] text-center">{caption}</p>
            </div>
          )}
        </div>
      </div>

      <ImageViewer
        src={src}
        alt={title}
        caption={caption}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
}

// Comparison images side by side
interface ComparisonProps {
  images: Array<{
    src: string;
    label: string;
  }>;
  title?: string;
}

export function ImageComparison({ images, title }: ComparisonProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="my-6">
        {title && (
          <h4 className="text-sm font-medium text-[#E5E7EB] mb-3">{title}</h4>
        )}
        <div className={cn(
          "grid gap-4",
          images.length === 2 && "grid-cols-2",
          images.length === 3 && "grid-cols-3",
          images.length >= 4 && "grid-cols-2 sm:grid-cols-4"
        )}>
          {images.map((img, i) => (
            <div key={i} className="space-y-2">
              <div 
                className="relative group cursor-zoom-in overflow-hidden rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0D1B2A]"
                onClick={() => setSelectedImage(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-xs text-[#9CA3AF] text-center">{img.label}</p>
            </div>
          ))}
        </div>
      </div>

      <ImageViewer
        src={selectedImage || ""}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
