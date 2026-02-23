/**
 * NucleuX Academy - Subspecialty Page
 * 
 * Server Component that dynamically loads topics from content files.
 * Falls back to legacy TypeScript files if content doesn't exist.
 * 
 * @author Vishwakarma
 * @date 2026-02-09
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SUBJECTS } from "@/lib/data/subjects";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { 
  loadTopicsForSubspecialty, 
  subspecialtyExists,
  loadSubspecialtyIndex 
} from "@/lib/content/loader";
import SubspecialtyClient from "./SubspecialtyClient";
import type { LibraryTopic } from "@/lib/types/library";

// Registry for legacy TypeScript topic files
import { getTopicsForSubspecialty, hasLegacyTopics } from "@/lib/data/topics";

// Loading fallback for Suspense
function SubspecialtyLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-[#3A4D5F] rounded w-1/3" />
      <div className="h-48 bg-[#3A4D5F] rounded-xl" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-[#3A4D5F] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{
    subject: string;
    subspecialty: string;
  }>;
}

/**
 * Load topics with fallback strategy:
 * 1. Try loading from content/ directory (markdown files)
 * 2. Fall back to legacy TypeScript files (TOPIC_REGISTRY)
 * 3. Return empty array if neither exists
 */
function getTopics(subjectSlug: string, subspecialtySlug: string): LibraryTopic[] {
  // First, try dynamic content loading from markdown files
  if (subspecialtyExists(subjectSlug, subspecialtySlug)) {
    const topics = loadTopicsForSubspecialty(subjectSlug, subspecialtySlug);
    if (topics.length > 0) {
      return topics;
    }
  }
  
  // Fallback to legacy TypeScript topic registry
  if (hasLegacyTopics(subspecialtySlug)) {
    return getTopicsForSubspecialty(subspecialtySlug);
  }
  
  // No content available
  return [];
}

export default async function SubspecialtyPage({ params }: PageProps) {
  const { subject: subjectSlug, subspecialty: subspecialtySlug } = await params;
  
  // Get subject and subspecialty metadata
  const subject = SUBJECTS.find(s => s.slug === subjectSlug);
  if (!subject) {
    notFound();
  }
  
  const subspecialties = getSubspecialtiesBySubject(subject.id);
  const subspecialty = subspecialties.find(s => s.slug === subspecialtySlug);
  
  if (!subspecialty) {
    notFound();
  }
  
  // Load topics dynamically
  const topics = getTopics(subjectSlug, subspecialtySlug);
  
  // Get content index for additional metadata (optional)
  const _contentIndex = subspecialtyExists(subjectSlug, subspecialtySlug) 
    ? loadSubspecialtyIndex(subjectSlug, subspecialtySlug)
    : null;
  
  // Prepare subject data for client
  const subjectData = {
    id: subject.id,
    name: subject.name,
    slug: subject.slug,
    icon: subject.icon,
    color: subject.color,
  };
  
  return (
    <Suspense fallback={<SubspecialtyLoading />}>
      <SubspecialtyClient 
        subject={subjectData}
        subspecialty={subspecialty}
        topics={topics}
      />
    </Suspense>
  );
}

// Generate static params for known subspecialties (optional optimization)
export async function generateStaticParams() {
  const params: { subject: string; subspecialty: string }[] = [];
  
  for (const subject of SUBJECTS) {
    const subspecialties = getSubspecialtiesBySubject(subject.id);
    for (const subspecialty of subspecialties) {
      params.push({
        subject: subject.slug,
        subspecialty: subspecialty.slug,
      });
    }
  }
  
  return params;
}

// Metadata generation
export async function generateMetadata({ params }: PageProps) {
  const { subject: subjectSlug, subspecialty: subspecialtySlug } = await params;
  
  const subject = SUBJECTS.find(s => s.slug === subjectSlug);
  const subspecialties = subject ? getSubspecialtiesBySubject(subject.id) : [];
  const subspecialty = subspecialties.find(s => s.slug === subspecialtySlug);
  
  if (!subject || !subspecialty) {
    return { title: 'Not Found | NucleuX Academy' };
  }
  
  return {
    title: `${subspecialty.name} | ${subject.name} | NucleuX Academy`,
    description: subspecialty.description || `Learn ${subspecialty.name} with NucleuX Academy`,
  };
}
