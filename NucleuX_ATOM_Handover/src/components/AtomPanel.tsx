"use client";

/**
 * NucleuX Academy - AtomPanel (v2 Migration)
 *
 * Room-specific sidebar panels that display contextual insights,
 * quick features, and a direct "Ask ATOM" button.
 *
 * v2 changes:
 * - Feature clicks dispatch messages through useATOMStream() instead
 *   of navigating to /chat with query params
 * - "Ask ATOM" opens the global ATOMWidgetV2 overlay rather than
 *   navigating away from the current page
 * - Panel reads streaming state from ATOMProvider for live feedback
 */

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Target,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Zap,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import { useATOM } from "@/lib/atom/provider";
import { useATOMStream } from "@/lib/atom/hooks/useATOMStream";
import type { ATOMRoom } from "@/lib/types/atom";

// =============================================================================
// PANEL CONFIGURATIONS
// =============================================================================

interface PanelFeature {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Prompt sent to ATOM when clicked */
  prompt: string;
  /** Which ATOM room to route this through */
  room: ATOMRoom;
}

interface PanelInsight {
  type: 'recommendation' | 'alert' | 'progress';
  title: string;
  description: string;
  value?: number;
}

interface PanelConfig {
  title: string;
  icon: string;
  color: string;
  lightColor: string;
  room: ATOMRoom;
  features: PanelFeature[];
  insights?: PanelInsight[];
}

const panelConfigs: Record<string, PanelConfig> = {
  dashboard: {
    title: "ATOM Study Coach",
    icon: "📊",
    color: "#5BB3B3",
    lightColor: "#F5F3FF",
    room: 'desk',
    features: [
      { id: "recommendations", label: "Daily Recommendations", icon: <Lightbulb className="w-4 h-4" />, prompt: "What should I focus on today? Give me my daily study recommendations.", room: 'desk' },
      { id: "weak-areas", label: "Weak Area Alerts", icon: <AlertTriangle className="w-4 h-4" />, prompt: "What are my weakest areas right now? Show me topics where my accuracy is lowest.", room: 'desk' },
      { id: "plan", label: "Adjust Study Plan", icon: <Target className="w-4 h-4" />, prompt: "Help me adjust my study plan based on my recent performance.", room: 'desk' },
    ],
    insights: [
      { type: 'recommendation', title: "Focus on Portal Hypertension", description: "Your accuracy dropped 15% in last 3 tests" },
      { type: 'progress', title: "Weekly Goal", description: "You've completed 72% of your study goal", value: 72 },
    ],
  },
  library: {
    title: "ATOM Research Assistant",
    icon: "📚",
    color: "#7BA69E",
    lightColor: "#ECFDF5",
    room: 'library',
    features: [
      { id: "ask-chapter", label: "Ask About This Chapter", icon: <BookOpen className="w-4 h-4" />, prompt: "Explain the key concepts in this chapter.", room: 'library' },
      { id: "related", label: "Find Related Topics", icon: <Brain className="w-4 h-4" />, prompt: "What topics are related to what I'm currently reading?", room: 'library' },
      { id: "cross-ref", label: "Cross-Reference Sources", icon: <Zap className="w-4 h-4" />, prompt: "Cross-reference this topic with other textbook sources.", room: 'library' },
    ],
    insights: [
      { type: 'recommendation', title: "Related Reading", description: "Based on your current topic, consider reviewing Hepatobiliary Anatomy" },
    ],
  },
  classroom: {
    title: "ATOM Lecture Companion",
    icon: "🎓",
    color: "#6BA8C9",
    lightColor: "#F0F9FF",
    room: 'classroom',
    features: [
      { id: "auto-detect", label: "Auto-detect Topics", icon: <Brain className="w-4 h-4" />, prompt: "What topics are being discussed in this lecture?", room: 'classroom' },
      { id: "interrupt", label: "Interrupt Mode", icon: <MessageSquare className="w-4 h-4" />, prompt: "I didn't understand the last concept. Can you explain it differently?", room: 'classroom' },
      { id: "mindmap", label: "Generate Mind Map", icon: <Zap className="w-4 h-4" />, prompt: "Generate a mind map of the key concepts from this lecture.", room: 'classroom' },
      { id: "notes", label: "Smart Note-Taking", icon: <BookOpen className="w-4 h-4" />, prompt: "Help me take structured notes on this lecture.", room: 'classroom' },
    ],
  },
  mcqs: {
    title: "ATOM Tutor",
    icon: "❓",
    color: "#6BA8C9",
    lightColor: "#F0F9FF",
    room: 'training',
    features: [
      { id: "explain", label: "Why Was I Wrong?", icon: <Lightbulb className="w-4 h-4" />, prompt: "Explain why my answer was wrong and help me understand the correct reasoning.", room: 'training' },
      { id: "concept", label: "Concept Clarification", icon: <Brain className="w-4 h-4" />, prompt: "Clarify the underlying concept behind this question.", room: 'training' },
      { id: "similar", label: "Similar Questions", icon: <Target className="w-4 h-4" />, prompt: "Show me similar questions to practice this concept.", room: 'training' },
    ],
    insights: [
      { type: 'alert', title: "Weak Topic Detected", description: "You've missed 3 questions on Thyroid Carcinoma Staging" },
    ],
  },
  community: {
    title: "ATOM Moderator",
    icon: "👥",
    color: "#C9A86C",
    lightColor: "#FFFBEB",
    room: 'community',
    features: [
      { id: "add-ref", label: "Add Textbook Reference", icon: <BookOpen className="w-4 h-4" />, prompt: "Find a relevant textbook reference for this discussion.", room: 'community' },
      { id: "fact-check", label: "Fact-Check Statement", icon: <Target className="w-4 h-4" />, prompt: "Fact-check the claims being made in this thread.", room: 'community' },
      { id: "summarize", label: "Summarize Thread", icon: <Zap className="w-4 h-4" />, prompt: "Summarize the key points from this discussion thread.", room: 'community' },
    ],
  },
  arena: {
    title: "ATOM Competitive Coach",
    icon: "🏆",
    color: "#C9A86C",
    lightColor: "#FEFCE8",
    room: 'arena',
    features: [
      { id: "insights", label: "Performance Insights", icon: <TrendingUp className="w-4 h-4" />, prompt: "Analyze my recent performance and show me trends.", room: 'arena' },
      { id: "strategy", label: "How to Beat #3", icon: <Target className="w-4 h-4" />, prompt: "What's my strategy to climb the leaderboard? Focus on my quick wins.", room: 'arena' },
      { id: "weak-target", label: "Target Weak Areas", icon: <AlertTriangle className="w-4 h-4" />, prompt: "Which weak areas should I target to improve my ranking fastest?", room: 'arena' },
    ],
    insights: [
      { type: 'recommendation', title: "Quick Win Opportunity", description: "Improve Pathology MCQs to jump 15 ranks" },
      { type: 'progress', title: "To Next Rank", description: "45 more correct answers to reach #100", value: 68 },
    ],
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

interface AtomPanelProps {
  room: keyof typeof panelConfigs;
  collapsed?: boolean;
  onClose?: () => void;
  className?: string;
}

export function AtomPanel({ room, collapsed: initialCollapsed = false, onClose, className = "" }: AtomPanelProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const { dispatch } = useATOM();
  const { send, isStreaming } = useATOMStream();

  const config = panelConfigs[room];
  if (!config) return null;

  const handleFeatureClick = useCallback(
    (feature: PanelFeature) => {
      // Send the feature's prompt through the v2 pipeline
      send(feature.prompt, { room: feature.room });
    },
    [send]
  );

  const handleAskATOM = useCallback(() => {
    // Dispatch a SET_ACTIVE_ROOM so the widget knows the context,
    // then the user can type in the widget overlay.
    dispatch({ type: 'SET_ROOM', room: config.room });
  }, [dispatch, config.room]);

  return (
    <Card
      className={`border shadow-lg overflow-hidden transition-all duration-300 ${className}`}
      style={{
        borderColor: `${config.color}30`,
        background: `linear-gradient(135deg, white 0%, ${config.lightColor} 100%)`,
      }}
    >
      <CardHeader
        className="pb-2 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: config.color }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <span className="text-base">{config.icon}</span>
            </div>
            <div>
              <span className="block">{config.title}</span>
              <span className="text-[10px] text-[#64748B] font-normal">Powered by ATOM v2</span>
            </div>
          </CardTitle>
          <div className="flex items-center gap-1">
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="h-6 w-6 text-[#94A3B8] hover:text-[#64748B]"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              style={{ color: config.color }}
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="pt-2 space-y-4">
          {/* Insights */}
          {config.insights && config.insights.length > 0 && (
            <div className="space-y-2">
              {config.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: insight.type === 'alert' ? '#FEF2F2' : 'white',
                    borderColor: insight.type === 'alert' ? '#FECACA' : '#E2E8F0',
                  }}
                >
                  <div className="flex items-start gap-2">
                    {insight.type === 'recommendation' && (
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: config.color }} />
                    )}
                    {insight.type === 'alert' && (
                      <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    )}
                    {insight.type === 'progress' && (
                      <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: config.color }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1E293B]">{insight.title}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{insight.description}</p>
                      {insight.value !== undefined && (
                        <Progress value={insight.value} className="h-1.5 mt-2" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="space-y-1.5">
            {config.features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                disabled={isStreaming}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all hover:shadow-md border border-transparent disabled:opacity-50"
                style={{ backgroundColor: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${config.color}40`;
                  e.currentTarget.style.backgroundColor = config.lightColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${config.color}15`, color: config.color }}
                >
                  {feature.icon}
                </div>
                <span className="text-sm text-[#1E293B] flex-1">{feature.label}</span>
                {isStreaming ? (
                  <Loader2 className="w-3 h-3 text-[#94A3B8] animate-spin" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
                )}
              </button>
            ))}
          </div>

          {/* Ask ATOM Button */}
          <Button
            onClick={handleAskATOM}
            className="w-full shadow-md"
            style={{
              backgroundColor: config.color,
              boxShadow: `0 4px 12px ${config.color}30`,
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ask ATOM
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

// =============================================================================
// INLINE COMPONENTS (unchanged API, v2 wired)
// =============================================================================

interface AtomSuggestionProps {
  type: 'tip' | 'action' | 'reference';
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  color?: string;
}

export function AtomSuggestion({
  type,
  children,
  actionLabel = "Learn more",
  onAction,
  color = "#5BB3B3",
}: AtomSuggestionProps) {
  const { dispatch } = useATOM();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      // Set room to library and let the widget handle it
      dispatch({ type: 'SET_ROOM', room: 'library' });
    }
  };

  const icons = {
    tip: <Lightbulb className="w-4 h-4" />,
    action: <Zap className="w-4 h-4" />,
    reference: <BookOpen className="w-4 h-4" />,
  };

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl border"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}20`,
      }}
    >
      <div
        className="p-1.5 rounded-lg shrink-0"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#1E293B]">{children}</p>
        {actionLabel && (
          <button
            onClick={handleAction}
            className="text-xs font-medium mt-1 flex items-center gap-1 transition-colors"
            style={{ color }}
          >
            {actionLabel}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <Badge
        className="shrink-0 text-[10px] px-1.5 py-0.5 border-0"
        style={{ backgroundColor: `${color}15`, color }}
      >
        ATOM
      </Badge>
    </div>
  );
}

// Book card action button
interface AtomBookActionProps {
  bookTitle: string;
  color?: string;
}

export function AtomBookAction({ bookTitle, color = "#7BA69E" }: AtomBookActionProps) {
  const { send } = useATOMStream();

  const handleAsk = () => {
    send(`Tell me about "${bookTitle}"`, { room: 'library' });
  };

  return (
    <button
      onClick={handleAsk}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all hover:shadow-sm"
      style={{
        backgroundColor: `${color}10`,
        color,
      }}
    >
      <Sparkles className="w-3 h-3" />
      Ask ATOM
    </button>
  );
}
