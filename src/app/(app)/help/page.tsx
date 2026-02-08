"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, Search, Book, MessageCircle, Mail, Phone,
  ChevronDown, ChevronUp, ExternalLink, Play, FileText,
  Lightbulb, Zap, Shield, CreditCard, Users, Brain
} from "lucide-react";
import Link from "next/link";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I start using NucleuX Academy?",
    answer: "After signing up, complete the onboarding quiz to help ATOM understand your current level. Then, either browse the Library for topics or let ATOM create a personalized study plan from your Dashboard. We recommend starting with the 'Today's Study Plan' widget!"
  },
  {
    id: "2",
    category: "Getting Started",
    question: "What is ATOM and how does it help me?",
    answer: "ATOM is your AI study companion. It tracks your progress, identifies weak areas, creates personalized study plans, answers questions with textbook references, generates flashcards and presentations, and provides instant feedback on MCQs. Think of ATOM as a senior who's always available to help!"
  },
  {
    id: "3",
    category: "Study Features",
    question: "How does spaced repetition work?",
    answer: "Spaced repetition schedules reviews at optimal intervals based on your performance. When you answer correctly, the next review is scheduled further out. When you struggle, reviews come sooner. This maximizes retention while minimizing study time."
  },
  {
    id: "4",
    category: "Study Features",
    question: "What is the Arena and how do I compete?",
    answer: "The Arena hosts timed MCQ competitions against other students. You earn coins and XP for participating, with bonus rewards for top performers. Check the Arena page for daily challenges and weekly tournaments. It's a fun way to test yourself under pressure!"
  },
  {
    id: "5",
    category: "Study Features",
    question: "How accurate are the MCQ explanations?",
    answer: "All MCQ explanations are referenced to standard textbooks (Harrison's, Bailey & Love, Robbins, etc.). ATOM cross-references multiple sources and provides page numbers. However, always verify critical information with your textbooks — ATOM can make mistakes!"
  },
  {
    id: "6",
    category: "Account",
    question: "Can I use NucleuX on multiple devices?",
    answer: "Yes! Your account syncs across all devices. Log in on your phone, tablet, or computer, and your progress, bookmarks, and notes will be there. We recommend the mobile app for on-the-go MCQ practice."
  },
  {
    id: "7",
    category: "Account",
    question: "How do I upgrade to Premium?",
    answer: "Go to Settings → Subscription to view plans. Premium includes unlimited ATOM interactions, advanced analytics, offline access, and ad-free experience. Students can get 50% off with a valid ID."
  },
  {
    id: "8",
    category: "Technical",
    question: "The app is running slow. What should I do?",
    answer: "Try: 1) Clear browser cache, 2) Disable browser extensions, 3) Check your internet connection, 4) Try a different browser. If issues persist, contact support with your browser version and a screenshot."
  },
];

const categories = [
  { id: "getting-started", label: "Getting Started", icon: Play },
  { id: "study-features", label: "Study Features", icon: Brain },
  { id: "account", label: "Account & Billing", icon: CreditCard },
  { id: "technical", label: "Technical Issues", icon: Zap },
];

const resources = [
  { title: "Video Tutorials", description: "Watch step-by-step guides", icon: Play, href: "#" },
  { title: "Documentation", description: "Detailed feature guides", icon: Book, href: "#" },
  { title: "Community Forum", description: "Get help from other users", icon: Users, href: "/community" },
  { title: "Release Notes", description: "See what's new", icon: FileText, href: "#" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>("1");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
                           faq.category.toLowerCase().replace(' ', '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-[#5BB3B3]" />
          Help Center
        </h1>
        <p className="text-[#A0B0BC] mt-2">Find answers or get in touch with support</p>
      </div>

      {/* Search */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] text-[#E8E0D5] placeholder:text-[#6B7280]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedCategory === cat.id
                ? 'bg-[rgba(91,179,179,0.15)] border-[#5BB3B3]'
                : 'bg-[#364A5E] border-[rgba(91,179,179,0.15)] hover:border-[rgba(91,179,179,0.3)]'
            }`}
          >
            <cat.icon className={`w-6 h-6 mb-2 ${selectedCategory === cat.id ? 'text-[#5BB3B3]' : 'text-[#A0B0BC]'}`} />
            <p className={`font-medium ${selectedCategory === cat.id ? 'text-[#E8E0D5]' : 'text-[#A0B0BC]'}`}>
              {cat.label}
            </p>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-[#E8E0D5] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#C9A86C]" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <p className="text-[#6B7280] text-center py-8">No results found. Try a different search term.</p>
          ) : (
            filteredFAQs.map((faq) => (
              <div 
                key={faq.id}
                className="border border-[rgba(91,179,179,0.1)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left bg-[#3A4D5F] hover:bg-[#1a3048] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] border-[rgba(91,179,179,0.2)] text-[#6B7280]">
                      {faq.category}
                    </Badge>
                    <span className="font-medium text-[#E8E0D5]">{faq.question}</span>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-[#6B7280] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6B7280] shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="p-4 border-t border-[rgba(91,179,179,0.1)] bg-[#364A5E]">
                    <p className="text-[#A0B0BC] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resources */}
      <div>
        <h2 className="text-xl font-semibold text-[#E8E0D5] mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <Link key={resource.title} href={resource.href}>
              <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] hover:border-[rgba(91,179,179,0.3)] transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(91,179,179,0.15)] flex items-center justify-center">
                    <resource.icon className="w-5 h-5 text-[#5BB3B3]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#E8E0D5]">{resource.title}</h3>
                    <p className="text-sm text-[#6B7280]">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#6B7280]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-[rgba(91,179,179,0.15)] to-[rgba(139,92,246,0.15)] border-[rgba(91,179,179,0.2)]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#E8E0D5]">Still need help?</h3>
              <p className="text-[#A0B0BC] mt-1">Our support team is here for you</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[rgba(91,179,179,0.3)] text-[#A0B0BC] hover:bg-[#3A4D5F]">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <Button className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
