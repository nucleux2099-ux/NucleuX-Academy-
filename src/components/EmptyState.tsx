"use client";

import { LucideIcon, BookOpen, Route, HelpCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#7C3AED]" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-[#94A3B8] text-center max-w-md mb-6">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[#7C3AED] hover:bg-[#6D28D9]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function EmptyLibrary() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No materials yet"
      description="Your library is empty. Add study materials or explore our curated content to get started."
      action={{
        label: "Browse Materials",
        onClick: () => {},
      }}
    />
  );
}

export function EmptyPathway() {
  return (
    <EmptyState
      icon={Route}
      title="No active pathway"
      description="You haven't started a learning pathway yet. Choose one to begin your personalized learning journey."
      action={{
        label: "Explore Pathways",
        onClick: () => {},
      }}
    />
  );
}

export function EmptyMCQs() {
  return (
    <EmptyState
      icon={HelpCircle}
      title="No questions available"
      description="There are no MCQs for this topic yet. Check back later or explore other topics."
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or browse all materials instead."
    />
  );
}
