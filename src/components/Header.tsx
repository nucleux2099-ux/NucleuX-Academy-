"use client";

import Link from "next/link";
import { Bell, Search, Settings, LogOut, User, Award, Shield } from "lucide-react";
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
import { useAuth } from "@/lib/auth-context";

// Get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Get role display
function getRoleDisplay(role: string, plan: string): string {
  if (role === 'admin') return 'Admin';
  if (role === 'faculty') return 'Faculty';
  switch (plan) {
    case 'premium': return 'Premium Member';
    case 'pro': return 'Pro Member';
    default: return 'Medical Student';
  }
}

export function Header() {
  const { user, logout, isLoading } = useAuth();

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userRole = user.user_metadata?.role || 'user';
  const userPlan = user.user_metadata?.plan || 'free';
  const initials = getInitials(displayName);
  const roleDisplay = getRoleDisplay(userRole, userPlan);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[rgba(232,224,213,0.08)] bg-[rgba(34,49,63,0.82)] backdrop-blur-xl sm:h-16">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo on mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] shadow-matte">
            <span className="text-[#1E2D3D] font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-[#E8E0D5] hidden sm:inline">NucleuX</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
            <Input
              placeholder="Search topics, notes, MCQs..."
              className="h-9 rounded-xl border-[rgba(232,224,213,0.1)] bg-[rgba(54,74,94,0.7)] pl-10 text-sm text-[#E8E0D5] placeholder:text-[#A0B0BC] focus:border-[#5BB3B3] focus:ring-[#5BB3B3]/20 sm:h-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <Link href="/notifications" className="relative rounded-xl border border-transparent p-2 transition-all duration-200 hover:border-[rgba(232,224,213,0.1)] hover:bg-[rgba(232,224,213,0.05)]">
            <Bell className="w-5 h-5 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5BB3B3] rounded-full ring-2 ring-[#2D3E50]" />
          </Link>

          {/* Settings - hide on mobile */}
          <Link href="/settings" className="hidden rounded-xl border border-transparent p-2 transition-all duration-200 hover:border-[rgba(232,224,213,0.1)] hover:bg-[rgba(232,224,213,0.05)] sm:block">
            <Settings className="w-5 h-5 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors" />
          </Link>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-all duration-200 hover:border-[rgba(232,224,213,0.1)] hover:bg-[rgba(232,224,213,0.05)] sm:gap-3">
                <Avatar className="w-8 h-8 ring-2 ring-[#5BB3B3]/20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] text-[#1E2D3D] text-sm font-medium">
                    {isLoading ? "..." : initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-[#E8E0D5]">
                    {isLoading ? "Loading..." : displayName}
                  </p>
                  <p className="text-xs text-[#A0B0BC]">{roleDisplay}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-[rgba(232,224,213,0.1)] bg-[rgba(54,74,94,0.96)] shadow-matte-lg backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-[#E8E0D5]">
                <div>
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-[#A0B0BC] font-normal">{user.email}</p>
                  {userRole === 'admin' && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-[#C9A86C]">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[rgba(232,224,213,0.08)]" />
              <Link href="/profile">
                <DropdownMenuItem className="text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(232,224,213,0.05)] focus:bg-[rgba(232,224,213,0.05)] focus:text-[#E8E0D5] cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(232,224,213,0.05)] focus:bg-[rgba(232,224,213,0.05)] focus:text-[#E8E0D5] cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <Link href="/achievements">
                <DropdownMenuItem className="text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(232,224,213,0.05)] focus:bg-[rgba(232,224,213,0.05)] focus:text-[#E8E0D5] cursor-pointer">
                  <Award className="w-4 h-4 mr-2" />
                  Achievements
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-[rgba(232,224,213,0.08)]" />
              <DropdownMenuItem
                className="text-[#E57373] hover:bg-[rgba(229,115,115,0.1)] focus:bg-[rgba(229,115,115,0.1)] focus:text-[#E57373] cursor-pointer"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
