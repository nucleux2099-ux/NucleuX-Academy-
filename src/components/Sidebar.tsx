"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Users,
  Trophy,
  Atom,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileButton } from "@/components/ProfilePopup";

// Room colors for each navigation item
const roomColors: Record<string, string> = {
  '/dashboard': '#7C3AED', // Purple
  '/library': '#059669',   // Green
  '/classroom': '#0EA5E9', // Sky blue
  '/mcqs': '#0EA5E9',      // Sky blue
  '/community': '#B45309', // Amber
  '/arena': '#CA8A04',     // Gold
  '/chat': '#06B6D4',      // Cyan (ATOM)
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "My Desk", description: "Dashboard & Graph" },
  { href: "/library", icon: BookOpen, label: "Library", description: "Browse & Pathways" },
  { href: "/classroom", icon: GraduationCap, label: "Classroom", description: "Video Lectures" },
  { href: "/mcqs", icon: ClipboardCheck, label: "Exam Center", description: "Practice MCQs" },
  { href: "/community", icon: Users, label: "Common Room", description: "Discussions" },
  { href: "/arena", icon: Trophy, label: "Arena", description: "Compete" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true, description: "AI Companion" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar - Only visible on desktop (lg and up) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0D1B2A] border-r border-[rgba(6,182,212,0.1)] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[rgba(6,182,212,0.1)]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center shadow-lg shadow-[#06B6D4]/20 transition-transform group-hover:scale-110">
              <span className="text-[#0D1B2A] font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E5E7EB]">NucleuX</h1>
              <p className="text-xs text-[#9CA3AF]">Academy</p>
            </div>
          </Link>
        </div>

        {/* Navigation - Campus Rooms */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const isHighlight = "highlight" in item && item.highlight;
            const roomColor = roomColors[item.href] || '#06B6D4';
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 room-transition relative",
                  isActive
                    ? "text-[#E5E7EB]"
                    : isHighlight
                    ? "text-[#06B6D4]"
                    : "text-[#9CA3AF] hover:text-[#E5E7EB]"
                )}
                style={isActive ? {
                  backgroundColor: `${roomColor}15`,
                  borderLeft: `3px solid ${roomColor}`,
                  marginLeft: '-3px',
                  paddingLeft: 'calc(1rem + 3px)',
                } : {}}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isActive ? "" : isHighlight ? "text-[#06B6D4]" : ""
                  )}
                  style={isActive ? { color: roomColor } : {}}
                />
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                </div>
                {isHighlight && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ 
                      backgroundColor: isActive ? roomColor : '#06B6D4',
                      color: '#0D1B2A'
                    }}
                  >
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Button at Bottom */}
        <div className="p-4 border-t border-[rgba(6,182,212,0.1)]">
          <ProfileButton />
        </div>
      </aside>
    </>
  );
}
