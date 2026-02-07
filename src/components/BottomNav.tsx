"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Library, Atom, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/chat", icon: Atom, label: "ATOM", highlight: true },
  { href: "/arena", icon: Trophy, label: "Arena" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] z-50 pb-safe shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isHighlight = "highlight" in item && item.highlight;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative",
                isActive
                  ? "text-[#7C3AED]"
                  : isHighlight
                  ? "text-[#7C3AED]"
                  : "text-[#94A3B8] hover:text-[#64748B]"
              )}
            >
              {isHighlight && !isActive ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-[#7C3AED]/20 rounded-full blur-md scale-150" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-full flex items-center justify-center shadow-lg shadow-[#7C3AED]/30 -mt-4">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              ) : (
                <item.icon className="w-6 h-6" />
              )}
              <span className={cn(
                "text-xs font-medium",
                isHighlight && !isActive ? "mt-1" : ""
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-[#7C3AED] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
