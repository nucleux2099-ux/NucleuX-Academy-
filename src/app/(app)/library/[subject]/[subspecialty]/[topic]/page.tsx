/**
 * NucleuX Academy - Topic Page
 * 
 * Server Component that dynamically loads topic content.
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
  subspecialtyExists 
} from "@/lib/content/loader";
import { TOPIC_REGISTRY } from "@/lib/data/topics";
import TopicClient from "./TopicClient";
import type { LibraryTopic } from "@/lib/types/library";

// Loading fallback for Suspense
function TopicLoading() {
  return (
    <div className="ui-shell ui-page space-y-6 animate-pulse">
      <div className="h-4 bg-[#364A5E] rounded w-2/3" />
      <div className="h-12 bg-[#364A5E] rounded w-1/2" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-10 w-24 bg-[#364A5E] rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-[#364A5E] rounded-xl" />
    </div>
  );
}

interface PageProps {
  params: Promise<{
    subject: string;
    subspecialty: string;
    topic: string;
  }>;
}

/**
 * Load topics with fallback strategy:
 * 1. Try loading from content/ directory
 * 2. Fall back to legacy TypeScript files (via TOPIC_REGISTRY)
 * 3. Return empty array if neither exists
 */
function getTopics(subjectSlug: string, subspecialtySlug: string): LibraryTopic[] {
  // First, try dynamic content loading
  if (subspecialtyExists(subjectSlug, subspecialtySlug)) {
    const topics = loadTopicsForSubspecialty(subjectSlug, subspecialtySlug);
    if (topics.length > 0) {
      return topics;
    }
  }
  
  // Fallback to legacy TypeScript files via TOPIC_REGISTRY
  if (TOPIC_REGISTRY[subspecialtySlug]) {
    return TOPIC_REGISTRY[subspecialtySlug];
  }
  
  // No content available
  return [];
}

/**
 * Find a topic by slug from the topics array
 */
function findTopicBySlug(topics: LibraryTopic[], slug: string): LibraryTopic | undefined {
  return topics.find(t => t.slug === slug);
}

export default async function TopicPage({ params }: PageProps) {
  const { subject: subjectSlug, subspecialty: subspecialtySlug, topic: topicSlug } = await params;
  
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
  const allTopics = getTopics(subjectSlug, subspecialtySlug);
  const topic = findTopicBySlug(allTopics, topicSlug);
  
  if (!topic) {
    notFound();
  }
  
  // Prepare subject data for client
  const subjectData = {
    id: subject.id,
    name: subject.name,
    slug: subject.slug,
    icon: subject.icon,
    color: subject.color,
  };
  
  // Prepare subspecialty data for client
  const subspecialtyData = {
    id: subspecialty.id,
    name: subspecialty.name,
    slug: subspecialty.slug,
  };
  
  return (
    <Suspense fallback={<TopicLoading />}>
      <TopicClient 
        subject={subjectData}
        subspecialty={subspecialtyData}
        topic={topic}
        allTopics={allTopics}
      />
    </Suspense>
  );
}

// Generate static params for known topics (optional optimization)
export async function generateStaticParams() {
  const params: { subject: string; subspecialty: string; topic: string }[] = [];
  
  for (const subject of SUBJECTS) {
    const subspecialties = getSubspecialtiesBySubject(subject.id);
    for (const subspecialty of subspecialties) {
      const topics = getTopics(subject.slug, subspecialty.slug);
      for (const topic of topics) {
        params.push({
          subject: subject.slug,
          subspecialty: subspecialty.slug,
          topic: topic.slug,
        });
      }
    }
  }
  
  return params;
}

// Metadata generation
export async function generateMetadata({ params }: PageProps) {
  const { subject: subjectSlug, subspecialty: subspecialtySlug, topic: topicSlug } = await params;
  
  const subject = SUBJECTS.find(s => s.slug === subjectSlug);
  const subspecialties = subject ? getSubspecialtiesBySubject(subject.id) : [];
  const subspecialty = subspecialties.find(s => s.slug === subspecialtySlug);
  
  if (!subject || !subspecialty) {
    return { title: 'Not Found | NucleuX Academy' };
  }
  
  const topics = getTopics(subjectSlug, subspecialtySlug);
  const topic = findTopicBySlug(topics, topicSlug);
  
  if (!topic) {
    return { title: 'Topic Not Found | NucleuX Academy' };
  }
  
  return {
    title: `${topic.name} | ${subspecialty.name} | NucleuX Academy`,
    description: topic.description || `Learn ${topic.name} with NucleuX Academy`,
  };
}
