"use client";

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
    <header className="h-14 sm:h-16 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo on mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-[#1E293B] hidden sm:inline">NucleuX</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search topics, notes, MCQs..."
              className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20 h-9 sm:h-10 text-sm text-[#1E293B] placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]">
            <Bell className="w-5 h-5 text-[#64748B]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full ring-2 ring-white" />
          </button>

          {/* Settings - hide on mobile */}
          <button className="hidden sm:block p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]">
            <Settings className="w-5 h-5 text-[#64748B]" />
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]">
                <Avatar className="w-8 h-8 ring-2 ring-[#7C3AED]/20 shadow-sm">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white text-sm font-medium">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-[#1E293B]">Aditya</p>
                  <p className="text-xs text-[#64748B]">Medical Student</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white border-[#E2E8F0] shadow-xl"
            >
              <DropdownMenuLabel className="text-[#1E293B]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#E2E8F0]" />
              <DropdownMenuItem className="text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]">Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]">Billing</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#E2E8F0]" />
              <DropdownMenuItem className="text-[#DC2626] hover:bg-[#FEE2E2]">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
