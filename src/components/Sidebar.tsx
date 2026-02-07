"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Route,
  HelpCircle,
  User,
  Home,
  MessageSquare,
  Network,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/pathways", icon: Route, label: "Pathways" },
  { href: "/mcqs", icon: HelpCircle, label: "MCQs" },
  { href: "/chat", icon: MessageSquare, label: "ATOM", highlight: true },
  { href: "/notes", icon: FileText, label: "My Notes" },
  { href: "/graph", icon: Network, label: "Graph" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar - Only visible on desktop (lg and up) */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[#0F172A] border-r border-[#1E293B] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[#1E293B]">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.svg" 
              alt="NucleuX" 
              className="w-10 h-10 transition-transform group-hover:scale-110" 
            />
            <div>
              <h1 className="text-xl font-bold text-gradient-purple">NucleuX</h1>
              <p className="text-xs text-[#94A3B8]">Academy</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30 glow-purple"
                    : "highlight" in item && item.highlight
                    ? "text-purple-400 hover:text-purple-300 hover:bg-[#7C3AED]/10 border border-purple-500/20"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {"highlight" in item && item.highlight && (
                  <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1E293B]">
          <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 rounded-lg p-4 border border-[#7C3AED]/20">
            <p className="text-sm font-medium text-white mb-1">Pro Features</p>
            <p className="text-xs text-[#94A3B8] mb-3">
              Unlock personalized AI tutoring
            </p>
            <button className="w-full py-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg text-sm font-medium transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
