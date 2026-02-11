"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Atom, ClipboardCheck, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

// ATOM Matte Theme - Room colors
const roomColors: Record<string, string> = {
  '/dashboard': '#5BB3B3', // Teal
  '/library': '#7BA69E',   // Sage
  '/chat': '#5BB3B3',      // Teal (ATOM)
  '/exam-centre': '#6366F1', // Indigo for Exam Centre
  '/backstage': '#F59E0B', // Amber
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "My Desk" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/backstage", icon: Fingerprint, label: "Backstage" },
  { href: "/exam-centre", icon: ClipboardCheck, label: "Exam" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#253545]/95 backdrop-blur-lg border-t border-[rgba(232,224,213,0.08)] z-50 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isHighlight = "highlight" in item && item.highlight;
          const roomColor = roomColors[item.href] || '#5BB3B3';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative room-transition",
                isActive
                  ? "text-[#E8E0D5]"
                  : isHighlight
                  ? "text-[#5BB3B3]"
                  : "text-[#A0B0BC]"
              )}
            >
              {isHighlight && !isActive ? (
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-md scale-150 opacity-20"
                    style={{ backgroundColor: roomColor }}
                  />
                  <div 
                    className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-matte -mt-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${roomColor}, ${roomColor}dd)`,
                      boxShadow: `0 4px 12px ${roomColor}30`
                    }}
                  >
                    <item.icon className="w-5 h-5 text-[#1E2D3D]" />
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
