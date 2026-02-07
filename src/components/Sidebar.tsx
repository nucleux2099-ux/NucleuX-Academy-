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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "My Desk" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/classroom", icon: GraduationCap, label: "Classroom" },
  { href: "/mcqs", icon: ClipboardCheck, label: "Exam Center" },
  { href: "/community", icon: Users, label: "Common Room" },
  { href: "/arena", icon: Trophy, label: "Arena" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true, subtitle: "AI Companion" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar - Only visible on desktop (lg and up) */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E2E8F0] z-40 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-[#E2E8F0]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1E293B]">NucleuX</h1>
              <p className="text-xs text-[#64748B]">Academy</p>
            </div>
          </Link>
        </div>

        {/* Navigation - Campus Rooms */}
        <nav className="p-4 space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const isHighlight = "highlight" in item && item.highlight;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#7C3AED]/10 to-[#7C3AED]/5 text-[#7C3AED] border border-[#7C3AED]/20 shadow-sm"
                    : isHighlight
                    ? "bg-gradient-to-r from-[#F3E8FF] to-[#E9D5FF] text-[#7C3AED] border border-[#C4B5FD]/30 hover:shadow-md"
                    : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                )}
              >
                <item.icon size={20} className={isHighlight && !isActive ? "text-[#7C3AED]" : ""} />
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  {"subtitle" in item && (
                    <p className="text-[10px] text-[#94A3B8] -mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                {isHighlight && (
                  <span className="text-[10px] bg-[#7C3AED] text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ATOM Philosophy Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E2E8F0] bg-[#FAFBFC]">
          <div className="bg-gradient-to-br from-[#F3E8FF] via-white to-[#E0F2FE] rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <p className="text-sm font-semibold text-[#1E293B]">Atomic Learning</p>
            </div>
            <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
              Master medicine one concept at a time. Small steps, lasting knowledge.
            </p>
            <button className="w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] rounded-lg text-sm font-medium text-white transition-all shadow-md shadow-[#7C3AED]/20 hover:shadow-lg">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
