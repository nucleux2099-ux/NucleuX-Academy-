"use client";

import Link from "next/link";
import { Bell, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="h-14 sm:h-16 border-b border-[rgba(6,182,212,0.1)] bg-[#0D1B2A]/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo on mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center shadow-md shadow-[#06B6D4]/20">
            <span className="text-[#0D1B2A] font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-[#E5E7EB] hidden sm:inline">NucleuX</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search topics, notes, MCQs..."
              className="pl-10 bg-[#142538] border-[rgba(6,182,212,0.15)] focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 h-9 sm:h-10 text-sm text-[#E5E7EB] placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-[rgba(6,182,212,0.1)] transition-colors border border-transparent hover:border-[rgba(6,182,212,0.15)]">
            <Bell className="w-5 h-5 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#06B6D4] rounded-full ring-2 ring-[#0D1B2A]" />
          </Link>

          {/* Settings - hide on mobile */}
          <Link href="/settings" className="hidden sm:block p-2 rounded-xl hover:bg-[rgba(6,182,212,0.1)] transition-colors border border-transparent hover:border-[rgba(6,182,212,0.15)]">
            <Settings className="w-5 h-5 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors" />
          </Link>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl hover:bg-[rgba(6,182,212,0.1)] transition-colors border border-transparent hover:border-[rgba(6,182,212,0.15)]">
                <Avatar className="w-8 h-8 ring-2 ring-[#06B6D4]/20">
                  <AvatarImage src="/avatar.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white text-sm font-medium">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-[#E5E7EB]">Aditya</p>
                  <p className="text-xs text-[#9CA3AF]">Medical Student</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#0F2233] border-[rgba(6,182,212,0.15)] shadow-2xl"
            >
              <DropdownMenuLabel className="text-[#E5E7EB]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[rgba(6,182,212,0.1)]" />
              <Link href="/profile"><DropdownMenuItem className="text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] focus:bg-[rgba(6,182,212,0.1)] focus:text-[#E5E7EB]">Profile</DropdownMenuItem></Link>
              <Link href="/settings"><DropdownMenuItem className="text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] focus:bg-[rgba(6,182,212,0.1)] focus:text-[#E5E7EB]">Settings</DropdownMenuItem></Link>
              <Link href="/achievements"><DropdownMenuItem className="text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] focus:bg-[rgba(6,182,212,0.1)] focus:text-[#E5E7EB]">Achievements</DropdownMenuItem></Link>
              <DropdownMenuSeparator className="bg-[rgba(6,182,212,0.1)]" />
              <DropdownMenuItem className="text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] focus:bg-[rgba(239,68,68,0.1)] focus:text-[#EF4444]">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
