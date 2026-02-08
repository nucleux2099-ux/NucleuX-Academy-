"use client";

import { AtomLibrarian } from "@/components/AtomLibrarian";
import type { LibraryTopic } from "@/lib/types/library";

interface LibraryLayoutProps {
  children: React.ReactNode;
  currentTopic?: LibraryTopic;
  allTopics?: LibraryTopic[];
}

export function LibraryLayout({ children, currentTopic, allTopics }: LibraryLayoutProps) {
  return (
    <>
      {children}
      <AtomLibrarian 
        currentTopic={currentTopic}
        allTopics={allTopics}
        completedTopics={[]} // TODO: Get from user state
        userLevel="pg" // TODO: Get from user profile
      />
    </>
  );
}
