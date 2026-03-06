"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Monitor,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Users,
  Trophy,
  Atom,
  Target,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileButton } from "@/components/ProfilePopup";

// ATOM Matte Theme - Room colors
const roomColors: Record<string, string> = {
  "/desk": "#5BB3B3",
  "/library": "#7BA69E",
  "/classroom": "#6F95B3",
  "/exam-centre": "#6B9AA5",
  "/cbme": "#A4AA7D",
  "/community": "#B99666",
  "/arena": "#C9A86C",
  "/chat": "#5BB3B3",
  "/backstage": "#C9A86C",
};

const navItems = [
  { href: "/backstage", icon: Fingerprint, label: "Backstage", description: "Cognitive OS" },
  { href: "/desk", icon: Monitor, label: "My Desk", description: "Personal Workspace" },
  { href: "/library", icon: BookOpen, label: "Library", description: "Browse & Pathways" },
  { href: "/classroom", icon: GraduationCap, label: "Classroom", description: "Video Lectures" },
  { href: "/exam-centre", icon: ClipboardCheck, label: "Training Centre", description: "PYQs, MCQs, Cases" },
  { href: "/cbme", icon: Target, label: "CBME", description: "Competencies" },
  { href: "/community", icon: Users, label: "Common Room", description: "Discussions" },
  { href: "/arena", icon: Trophy, label: "Arena", description: "Compete" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true, description: "AI Companion" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar - ATOM Matte Theme */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-[rgba(232,224,213,0.07)] bg-[linear-gradient(180deg,rgba(37,53,69,0.96)_0%,rgba(32,46,59,0.98)_100%)] backdrop-blur-xl lg:flex">
        {/* Logo */}
        <div className="border-b border-[rgba(232,224,213,0.07)] p-6">
          <Link href="/desk" className="flex items-center gap-3 group">
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
        <nav className="scrollbar-hide flex-1 space-y-1.5 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const isHighlight = "highlight" in item && item.highlight;
            const roomColor = roomColors[item.href] || "#5BB3B3";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "room-transition relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-[#E8E0D5] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                    : isHighlight
                      ? "text-[#5BB3B3]"
                      : "text-[#A0B0BC] hover:bg-[rgba(232,224,213,0.04)] hover:text-[#E8E0D5]"
                )}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${roomColor}1F, rgba(37,53,69,0.78))`,
                  boxShadow: `inset 0 0 0 1px ${roomColor}55, 0 10px 24px rgba(0,0,0,0.22)`,
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
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: isActive ? roomColor : "#5BB3B3",
                      color: "#1E2D3D"
                    }}
                  >
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ATOM Badge */}
        <div className="flex justify-center pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] shadow-[0_8px_20px_rgba(91,179,179,0.24)]">
            <span className="text-sm" title="ATOM">⚛️</span>
          </div>
        </div>

        {/* Profile Button at Bottom */}
        <div className="border-t border-[rgba(232,224,213,0.07)] p-4">
          <ProfileButton />
        </div>
      </aside>
    </>
  );
}
