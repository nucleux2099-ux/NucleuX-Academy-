"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronUp,
  Crown
} from "lucide-react";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div 
      ref={popupRef}
      className="absolute bottom-full left-0 mb-2 w-64 bg-[#0F2233] border border-[rgba(6,182,212,0.15)] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
    >
      {/* User Info */}
      <div className="p-4 border-b border-[rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-[#06B6D4]/30">
            <AvatarImage src="/avatar.svg" />
            <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white font-medium">
              AC
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#E5E7EB] truncate">Aditya Chandra</p>
            <p className="text-xs text-[#9CA3AF]">aditya@nucleux.com</p>
          </div>
        </div>
        
        {/* Plan Badge */}
        <div className="mt-3 flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white border-0 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Free Plan
          </Badge>
          <span className="text-xs text-[#9CA3AF]">• 5 MCQs left today</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </Link>
        
        <Link
          href="/billing"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-sm">Billing</span>
          <Badge className="ml-auto bg-[#059669] text-white text-[10px] border-0">Upgrade</Badge>
        </Link>
        
        <Link
          href="/contact"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Contact Us</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-[rgba(6,182,212,0.1)]">
        <button
          onClick={() => {
            onClose();
            // Handle logout
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-all"
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)] transition-all group"
      >
        <Avatar className="w-8 h-8 ring-2 ring-[#06B6D4]/20 group-hover:ring-[#06B6D4]/40 transition-all">
          <AvatarImage src="/avatar.svg" />
          <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white text-xs font-medium">
            AC
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-[#E5E7EB]">Aditya</p>
          <p className="text-xs text-[#9CA3AF]">Free Plan</p>
        </div>
        <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <ProfilePopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
