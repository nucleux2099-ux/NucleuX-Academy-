import Link from 'next/link';
import { Atom } from 'lucide-react';

export function SupportFooter() {
  return (
    <footer className="relative bg-slate-950/50 border-t border-white/5">
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5BB3B3]/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(91,179,179,0.18)] border border-[rgba(91,179,179,0.35)] flex items-center justify-center">
              <Atom className="w-4 h-4 text-[#5BB3B3]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E8E0D5]">NucleuX Academy</div>
              <div className="text-xs text-[#6B7A88]">© {new Date().getFullYear()} All rights reserved</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/campus" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Campus Tour
            </Link>
            <Link href="/atom" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              ATOM
            </Link>
            <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Early access
            </Link>
            <Link href="/faq" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Contact
            </Link>
            <Link href="/about" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              About
            </Link>
            <Link href="/terms" className="text-[#6B7A88] hover:text-[#E8E0D5] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-[#6B7A88] hover:text-[#E8E0D5] transition-colors">
              Privacy
            </Link>
          </div>

          {/* Support Info */}
          <div className="text-xs text-[#6B7A88]">
            <a className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors" href="mailto:Nucleux2099@gmail.com">
              Nucleux2099@gmail.com
            </a>
            {' · '}
            <a
              className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors"
              href="https://t.me/ATOM_2099_bot"
              target="_blank"
              rel="noreferrer"
            >
              @ATOM_2099_bot
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
