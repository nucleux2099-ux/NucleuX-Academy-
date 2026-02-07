"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, BellOff, Check, CheckCheck, Trophy, BookOpen, 
  MessageSquare, Zap, Brain, Target, Clock, Star,
  Filter, Trash2, Settings
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "achievement" | "study" | "community" | "arena" | "atom" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "🏆 New Achievement Unlocked!",
    message: "You've completed a 12-day study streak! Keep it up!",
    time: "2 minutes ago",
    read: false,
    actionUrl: "/achievements",
    actionLabel: "View Achievements"
  },
  {
    id: "2",
    type: "atom",
    title: "ATOM Study Recommendation",
    message: "Based on your MCQ performance, I suggest reviewing Portal Hypertension today.",
    time: "15 minutes ago",
    read: false,
    actionUrl: "/library",
    actionLabel: "Start Learning"
  },
  {
    id: "3",
    type: "arena",
    title: "🔥 Arena Challenge Starting!",
    message: "Speed Round: Cardiology starts in 30 minutes. 1,247 players registered.",
    time: "30 minutes ago",
    read: false,
    actionUrl: "/arena",
    actionLabel: "Join Now"
  },
  {
    id: "4",
    type: "community",
    title: "New reply to your discussion",
    message: "Dr. Priya replied to your post about 'Best approach for Portal Hypertension...'",
    time: "1 hour ago",
    read: true,
    actionUrl: "/community",
    actionLabel: "View Reply"
  },
  {
    id: "5",
    type: "study",
    title: "📚 Spaced Repetition Alert",
    message: "5 topics are due for review today to maintain optimal retention.",
    time: "2 hours ago",
    read: true,
    actionUrl: "/dashboard",
    actionLabel: "Review Now"
  },
  {
    id: "6",
    type: "achievement",
    title: "🎯 Target Reached!",
    message: "You've answered 500 MCQs this month! That's 94% accuracy.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "7",
    type: "system",
    title: "New Feature: Knowledge Graph",
    message: "Visualize how concepts connect with our new interactive Knowledge Graph.",
    time: "2 days ago",
    read: true,
    actionUrl: "/graph",
    actionLabel: "Try It"
  },
  {
    id: "8",
    type: "arena",
    title: "🥈 You placed #2 in Surgery Sprint!",
    message: "Amazing performance! You earned 500 coins and 150 XP.",
    time: "3 days ago",
    read: true,
  },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  achievement: { icon: Trophy, color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  study: { icon: BookOpen, color: "#059669", bg: "rgba(5,150,105,0.15)" },
  community: { icon: MessageSquare, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)" },
  arena: { icon: Zap, color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  atom: { icon: Brain, color: "#06B6D4", bg: "rgba(6,182,212,0.15)" },
  system: { icon: Bell, color: "#9CA3AF", bg: "rgba(156,163,175,0.15)" },
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setItems([]);
  };

  const filteredItems = filter === "all" 
    ? items 
    : filter === "unread" 
      ? items.filter(n => !n.read)
      : items.filter(n => n.type === filter);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#06B6D4]" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-[#EF4444] text-white border-none">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-[#9CA3AF] mt-1">Stay updated on your learning journey</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={markAllRead}
            className="border-[rgba(6,182,212,0.15)] text-[#9CA3AF] hover:bg-[#142538]"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
          <Link href="/settings">
            <Button variant="ghost" className="text-[#9CA3AF] hover:text-[#E5E7EB]">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: "Unread" },
          { id: "atom", label: "ATOM" },
          { id: "achievement", label: "Achievements" },
          { id: "arena", label: "Arena" },
          { id: "study", label: "Study" },
          { id: "community", label: "Community" },
        ].map((f) => (
          <Button
            key={f.id}
            variant={filter === f.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.id)}
            className={filter === f.id 
              ? "bg-[#06B6D4] text-[#0D1B2A]" 
              : "border-[rgba(6,182,212,0.15)] text-[#9CA3AF] hover:bg-[#142538]"
            }
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredItems.length === 0 ? (
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="py-12 text-center">
            <BellOff className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
            <p className="text-[#9CA3AF]">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            
            return (
              <Card 
                key={notification.id}
                className={`bg-[#0F2233] border-[rgba(6,182,212,0.15)] transition-all cursor-pointer hover:border-[rgba(6,182,212,0.3)] ${
                  !notification.read ? 'border-l-4' : ''
                }`}
                style={!notification.read ? { borderLeftColor: config.color } : {}}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: config.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${!notification.read ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-[#6B7280] shrink-0">{notification.time}</span>
                      </div>
                      <p className="text-sm text-[#6B7280] mt-1">{notification.message}</p>
                      
                      {notification.actionUrl && (
                        <Link href={notification.actionUrl}>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="mt-2 h-7 px-2 text-xs hover:bg-[#142538]"
                            style={{ color: config.color }}
                          >
                            {notification.actionLabel} →
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: config.color }} />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Clear All */}
      {items.length > 0 && (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={clearAll}
            className="text-[#6B7280] hover:text-[#EF4444]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all notifications
          </Button>
        </div>
      )}
    </div>
  );
}
