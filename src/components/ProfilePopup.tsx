"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronUp,
  Crown,
  Shield
} from "lucide-react";

// Get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Get plan display info
function getPlanInfo(plan: string, role: string) {
  if (role === 'admin') {
    return { label: 'Admin', color: 'bg-gradient-to-r from-[#E57373] to-[#DC2626]', icon: Shield };
  }
  switch (plan) {
    case 'premium':
      return { label: 'Premium', color: 'bg-gradient-to-r from-[#C9A86C] to-[#D97706]', icon: Crown };
    case 'pro':
      return { label: 'Pro', color: 'bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E]', icon: Crown };
    default:
      return { label: 'Free Plan', color: 'bg-gradient-to-r from-[#6B7280] to-[#4B5563]', icon: Crown };
  }
}

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const _router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userPlan = user.user_metadata?.plan || 'free';
  const userRole = user.user_metadata?.role || 'user';
  const initials = getInitials(displayName);
  const planInfo = getPlanInfo(userPlan, userRole);
  const PlanIcon = planInfo.icon;

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div 
      ref={popupRef}
      className="absolute bottom-full left-0 mb-2 w-64 bg-[#364A5E] border border-[rgba(91,179,179,0.15)] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
    >
      {/* User Info */}
      <div className="p-4 border-b border-[rgba(91,179,179,0.1)]">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-[#5BB3B3]/30">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#E8E0D5] truncate">{displayName}</p>
            <p className="text-xs text-[#A0B0BC]">{user.email}</p>
          </div>
        </div>
        
        {/* Plan Badge */}
        <div className="mt-3 flex items-center gap-2">
          <Badge className={`${planInfo.color} text-white border-0 flex items-center gap-1`}>
            <PlanIcon className="w-3 h-3" />
            {planInfo.label}
          </Badge>
          {userRole === 'admin' && (
            <span className="text-xs text-[#A0B0BC]">• Full access</span>
          )}
          {userPlan === 'free' && (
            <span className="text-xs text-[#A0B0BC]">• 5 MCQs left today</span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(91,179,179,0.1)] transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Profile & Settings</span>
        </Link>
        
        {userPlan === 'free' && (
          <Link
            href="/billing"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(91,179,179,0.1)] transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Upgrade Plan</span>
            <Badge className="ml-auto bg-[#7BA69E] text-white text-[10px] border-0">Pro</Badge>
          </Link>
        )}
        
        <Link
          href="/help"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(91,179,179,0.1)] transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Help & Support</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-[rgba(91,179,179,0.1)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#E57373] hover:bg-[rgba(239,68,68,0.1)] transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
}

export function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userPlan = user.user_metadata?.plan || 'free';
  const userRole = user.user_metadata?.role || 'user';
  const initials = getInitials(displayName);
  const planInfo = getPlanInfo(userPlan, userRole);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(91,179,179,0.1)] transition-all group"
      >
        <Avatar className="w-8 h-8 ring-2 ring-[#5BB3B3]/20 group-hover:ring-[#5BB3B3]/40 transition-all">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] text-white text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-[#E8E0D5]">{displayName}</p>
          <p className="text-xs text-[#A0B0BC]">{planInfo.label}</p>
        </div>
        <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <ProfilePopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
