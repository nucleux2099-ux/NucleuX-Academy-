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
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileButton } from "@/components/ProfilePopup";

// ATOM Matte Theme - Room colors
const roomColors: Record<string, string> = {
  '/dashboard': '#5BB3B3', // Teal
  '/library': '#7BA69E',   // Sage
  '/classroom': '#6BA8C9', // Sky teal
  '/exam-centre': '#6366F1', // Indigo for Exam Centre
  '/competencies': '#E879F9', // Purple/Pink for CBME
  '/community': '#C9A86C', // Gold
  '/arena': '#D4AF37',     // Bright gold
  '/chat': '#5BB3B3',      // Teal (ATOM)
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "My Desk", description: "Dashboard & Graph" },
  { href: "/library", icon: BookOpen, label: "Library", description: "Browse & Pathways" },
  { href: "/classroom", icon: GraduationCap, label: "Classroom", description: "Video Lectures" },
  { href: "/exam-centre", icon: ClipboardCheck, label: "Exam Centre", description: "PYQs, MCQs, Cases" },
  { href: "/competencies", icon: Target, label: "CBME", description: "Competencies" },
  { href: "/community", icon: Users, label: "Common Room", description: "Discussions" },
  { href: "/arena", icon: Trophy, label: "Arena", description: "Compete" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true, description: "AI Companion" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar - ATOM Matte Theme */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#253545] border-r border-[rgba(232,224,213,0.06)] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[rgba(232,224,213,0.06)]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            {/* ATOM-style logo container */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center shadow-matte transition-transform group-hover:scale-110">
              <span className="text-[#1E2D3D] font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E8E0D5]">NucleuX</h1>
              <p className="text-xs text-[#A0B0BC]">Academy</p>
            </div>
          </Link>
        </div>

        {/* Navigation - Campus Rooms */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const isHighlight = "highlight" in item && item.highlight;
            const roomColor = roomColors[item.href] || '#5BB3B3';
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 room-transition relative",
                  isActive
                    ? "text-[#E8E0D5]"
                    : isHighlight
                    ? "text-[#5BB3B3]"
                    : "text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(232,224,213,0.03)]"
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
                    isActive ? "" : isHighlight ? "text-[#5BB3B3]" : ""
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
                      backgroundColor: isActive ? roomColor : '#5BB3B3',
                      color: '#1E2D3D'
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
        <div className="p-4 border-t border-[rgba(232,224,213,0.06)]">
          <ProfileButton />
        </div>
      </aside>
    </>
  );
}
