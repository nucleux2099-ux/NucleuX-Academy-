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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/pathways", icon: Route, label: "Pathways" },
  { href: "/mcqs", icon: HelpCircle, label: "MCQs" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1E293B] border border-[#334155]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-[#0F172A] border-r border-[#1E293B] z-40 transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#1E293B]">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="NucleuX" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gradient-purple">NucleuX</h1>
              <p className="text-xs text-[#94A3B8]">Academy</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30 glow-purple"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
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
