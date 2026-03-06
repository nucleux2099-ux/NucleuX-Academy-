"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Atom, ClipboardCheck, Fingerprint, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// ATOM Matte Theme - Room colors
const roomColors: Record<string, string> = {
  "/desk": "#5BB3B3",
  "/library": "#7BA69E",
  "/chat": "#5BB3B3",
  "/exam-centre": "#6B9AA5",
  "/backstage": "#C9A86C",
  "/cbme": "#A4AA7D",
};

const navItems = [
  { href: "/desk", icon: LayoutDashboard, label: "My Desk" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/backstage", icon: Fingerprint, label: "Backstage", highlight: false },
  { href: "/cbme", icon: Target, label: "CBME" },
  { href: "/exam-centre", icon: ClipboardCheck, label: "Exam" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(232,224,213,0.08)] bg-[rgba(34,48,62,0.9)] pb-safe backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isHighlight = "highlight" in item && item.highlight;
          const roomColor = roomColors[item.href] || "#5BB3B3";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "room-transition relative flex h-full w-full flex-col items-center justify-center gap-1 transition-all",
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
                    className="relative -mt-4 flex h-10 w-10 items-center justify-center rounded-full shadow-matte"
                    style={{ 
                      background: `linear-gradient(135deg, ${roomColor}, ${roomColor}dd)`,
                      boxShadow: `0 6px 14px ${roomColor}2f`
                    }}
                  >
                    <item.icon className="w-5 h-5 text-[#1E2D3D]" />
                  </div>
                </div>
              ) : (
                <item.icon 
                  className={cn("w-5 h-5", isActive && "scale-105")}
                  style={isActive ? { color: roomColor } : {}}
                />
              )}
              <span className={cn(
                "text-[11px] font-medium",
                isHighlight && !isActive ? "mt-1" : ""
              )}>
                {item.label}
              </span>
              {isActive && (
                <div 
                  className="absolute bottom-0 h-1 w-12 rounded-t-full"
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
