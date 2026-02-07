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
    <header className="h-14 sm:h-16 border-b border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo on mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <img src="/logo.svg" alt="NucleuX" className="w-8 h-8" />
          <span className="font-bold text-gradient-purple hidden sm:inline">NucleuX</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-[#1E293B] border-[#334155] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20 h-9 sm:h-10 text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[#1E293B] transition-colors">
            <Bell className="w-5 h-5 text-[#94A3B8]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#7C3AED] rounded-full" />
          </button>

          {/* Settings - hide on mobile */}
          <button className="hidden sm:block p-2 rounded-lg hover:bg-[#1E293B] transition-colors">
            <Settings className="w-5 h-5 text-[#94A3B8]" />
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-3 p-1 rounded-lg hover:bg-[#1E293B] transition-colors">
                <Avatar className="w-8 h-8 border-2 border-[#7C3AED]">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-[#7C3AED] text-white text-sm">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Aditya</p>
                  <p className="text-xs text-[#94A3B8]">Medical Student</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#1E293B] border-[#334155]"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#334155]" />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#334155]" />
              <DropdownMenuItem className="text-red-400">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
