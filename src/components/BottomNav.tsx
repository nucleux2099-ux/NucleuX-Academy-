"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Library, MessageSquare, HelpCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/chat", icon: MessageSquare, label: "ATOM", highlight: true },
  { href: "/mcqs", icon: HelpCircle, label: "Quiz" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-lg border-t border-[#1E293B] z-50 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isHighlight = "highlight" in item && item.highlight;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-purple-400"
                  : isHighlight
                  ? "text-purple-300"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {isHighlight && !isActive ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md" />
                  <item.icon className="w-6 h-6 relative" />
                </div>
              ) : (
                <item.icon className="w-6 h-6" />
              )}
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-purple-500 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
