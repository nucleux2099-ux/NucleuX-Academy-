"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Atom, ClipboardCheck, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Room colors for each navigation item
const roomColors: Record<string, string> = {
  '/dashboard': '#7C3AED', // Purple
  '/library': '#059669',   // Green
  '/chat': '#06B6D4',      // Cyan (ATOM)
  '/mcqs': '#0EA5E9',      // Sky blue
  '/arena': '#CA8A04',     // Gold
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "My Desk" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true },
  { href: "/mcqs", icon: ClipboardCheck, label: "Exam" },
  { href: "/arena", icon: Trophy, label: "Arena" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D1B2A]/95 backdrop-blur-lg border-t border-[rgba(6,182,212,0.1)] z-50 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isHighlight = "highlight" in item && item.highlight;
          const roomColor = roomColors[item.href] || '#06B6D4';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative room-transition",
                isActive
                  ? "text-[#E5E7EB]"
                  : isHighlight
                  ? "text-[#06B6D4]"
                  : "text-[#9CA3AF]"
              )}
            >
              {isHighlight && !isActive ? (
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-md scale-150 opacity-30"
                    style={{ backgroundColor: roomColor }}
                  />
                  <div 
                    className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg -mt-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${roomColor}, ${roomColor}dd)`,
                      boxShadow: `0 4px 15px ${roomColor}40`
                    }}
                  >
                    <item.icon className="w-5 h-5 text-[#0D1B2A]" />
                  </div>
                </div>
              ) : (
                <item.icon 
                  className="w-6 h-6"
                  style={isActive ? { color: roomColor } : {}}
                />
              )}
              <span className={cn(
                "text-xs font-medium",
                isHighlight && !isActive ? "mt-1" : ""
              )}>
                {item.label}
              </span>
              {isActive && (
                <div 
                  className="absolute bottom-0 w-12 h-1 rounded-t-full"
                  style={{ backgroundColor: roomColor }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
