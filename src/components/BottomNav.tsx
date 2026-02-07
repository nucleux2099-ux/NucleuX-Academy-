"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  HelpCircle,
  User,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/mcqs", icon: HelpCircle, label: "MCQs" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-lg border-t border-[#1E293B] safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-all duration-200",
                isActive
                  ? "text-[#7C3AED] bg-[#7C3AED]/10"
                  : "text-[#94A3B8] hover:text-white"
              )}
            >
              <item.icon 
                size={22} 
                className={cn(
                  "transition-transform",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-[10px] mt-1 font-medium",
                isActive && "text-[#7C3AED]"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-[#7C3AED] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
