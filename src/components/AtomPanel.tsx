"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

// Room-specific panel configurations
interface PanelConfig {
  title: string;
  icon: string;
  color: string;
  lightColor: string;
  features: {
    id: string;
    label: string;
    icon: React.ReactNode;
    action?: () => void;
  }[];
  insights?: {
    type: 'recommendation' | 'alert' | 'progress';
    title: string;
    description: string;
    value?: number;
  }[];
}

const panelConfigs: Record<string, PanelConfig> = {
  dashboard: {
    title: "ATOM Study Coach",
    icon: "📊",
    color: "#7C3AED",
    lightColor: "#F5F3FF",
    features: [
      { id: "recommendations", label: "Daily Recommendations", icon: <Lightbulb className="w-4 h-4" /> },
      { id: "weak-areas", label: "Weak Area Alerts", icon: <AlertTriangle className="w-4 h-4" /> },
      { id: "plan", label: "Adjust Study Plan", icon: <Target className="w-4 h-4" /> },
    ],
    insights: [
      { type: 'recommendation', title: "Focus on Portal Hypertension", description: "Your accuracy dropped 15% in last 3 tests" },
      { type: 'progress', title: "Weekly Goal", description: "You've completed 72% of your study goal", value: 72 },
    ],
  },
  library: {
    title: "ATOM Research Assistant",
    icon: "📚",
    color: "#059669",
    lightColor: "#ECFDF5",
    features: [
      { id: "ask-chapter", label: "Ask About This Chapter", icon: <BookOpen className="w-4 h-4" /> },
      { id: "related", label: "Find Related Topics", icon: <Brain className="w-4 h-4" /> },
      { id: "cross-ref", label: "Cross-Reference Sources", icon: <Zap className="w-4 h-4" /> },
    ],
    insights: [
      { type: 'recommendation', title: "Related Reading", description: "Based on your current topic, consider reviewing Hepatobiliary Anatomy" },
    ],
  },
  classroom: {
    title: "ATOM Lecture Companion",
    icon: "🎓",
    color: "#0EA5E9",
    lightColor: "#F0F9FF",
    features: [
      { id: "auto-detect", label: "Auto-detect Topics", icon: <Brain className="w-4 h-4" /> },
      { id: "interrupt", label: "Interrupt Mode", icon: <MessageSquare className="w-4 h-4" /> },
      { id: "mindmap", label: "Generate Mind Map", icon: <Zap className="w-4 h-4" /> },
      { id: "notes", label: "Smart Note-Taking", icon: <BookOpen className="w-4 h-4" /> },
    ],
  },
  mcqs: {
    title: "ATOM Tutor",
    icon: "❓",
    color: "#0EA5E9",
    lightColor: "#F0F9FF",
    features: [
      { id: "explain", label: "Why Was I Wrong?", icon: <Lightbulb className="w-4 h-4" /> },
      { id: "concept", label: "Concept Clarification", icon: <Brain className="w-4 h-4" /> },
      { id: "similar", label: "Similar Questions", icon: <Target className="w-4 h-4" /> },
    ],
    insights: [
      { type: 'alert', title: "Weak Topic Detected", description: "You've missed 3 questions on Thyroid Carcinoma Staging" },
    ],
  },
  community: {
    title: "ATOM Moderator",
    icon: "👥",
    color: "#B45309",
    lightColor: "#FFFBEB",
    features: [
      { id: "add-ref", label: "Add Textbook Reference", icon: <BookOpen className="w-4 h-4" /> },
      { id: "fact-check", label: "Fact-Check Statement", icon: <Target className="w-4 h-4" /> },
      { id: "summarize", label: "Summarize Thread", icon: <Zap className="w-4 h-4" /> },
    ],
  },
  arena: {
    title: "ATOM Competitive Coach",
    icon: "🏆",
    color: "#CA8A04",
    lightColor: "#FEFCE8",
    features: [
      { id: "insights", label: "Performance Insights", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "strategy", label: "How to Beat #3", icon: <Target className="w-4 h-4" /> },
      { id: "weak-target", label: "Target Weak Areas", icon: <AlertTriangle className="w-4 h-4" /> },
    ],
    insights: [
      { type: 'recommendation', title: "Quick Win Opportunity", description: "Improve Pathology MCQs to jump 15 ranks" },
      { type: 'progress', title: "To Next Rank", description: "45 more correct answers to reach #100", value: 68 },
    ],
  },
};

interface AtomPanelProps {
  room: keyof typeof panelConfigs;
  collapsed?: boolean;
  onClose?: () => void;
  className?: string;
}

export function AtomPanel({ room, collapsed: initialCollapsed = false, onClose, className = "" }: AtomPanelProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const router = useRouter();
  
  const config = panelConfigs[room];
  
  if (!config) return null;

  const handleAskATOM = () => {
    router.push('/chat');
  };

  const handleFeatureClick = (featureId: string) => {
    // In a real app, this would trigger specific actions
    // For now, we'll route to the chat with context
    router.push(`/chat?action=${featureId}&room=${room}`);
  };

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
              <span className="text-[10px] text-[#64748B] font-normal">Powered by ATOM</span>
            </div>
          </CardTitle>
          <div className="flex items-center gap-1">
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
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
                onClick={() => handleFeatureClick(feature.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all hover:shadow-md border border-transparent"
                style={{
                  backgroundColor: 'white',
                }}
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
                <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
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

// Inline ATOM suggestion component for use within content
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
  color = "#7C3AED"
}: AtomSuggestionProps) {
  const router = useRouter();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push('/chat');
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

export function AtomBookAction({ bookTitle, color = "#059669" }: AtomBookActionProps) {
  const router = useRouter();
  
  const handleAsk = () => {
    router.push(`/chat?context=${encodeURIComponent(bookTitle)}`);
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
