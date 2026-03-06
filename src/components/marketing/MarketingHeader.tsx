'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Atom, Menu, X } from 'lucide-react';

export function MarketingHeader({
  subtitle = 'Learn atomically and grow exponentially',
  active,
  primaryCta = { href: '/campus', label: 'Take the tour' },
  secondaryCta = { href: '/login', label: 'Enter' },
  showRooms = true,
}: {
  subtitle?: string;
  active?: 'home' | 'campus' | 'rooms' | 'atom' | 'pricing' | 'faq' | 'contact' | 'about';
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  showRooms?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (isActive?: boolean) =>
    isActive
      ? 'text-sm text-[#E8E0D5]'
      : 'text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors';

  const mobileLinkClass = (isActive?: boolean) =>
    isActive
      ? 'block py-2 text-[#E8E0D5] font-medium'
      : 'block py-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors';

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[rgba(91,179,179,0.18)] border border-[rgba(91,179,179,0.35)] flex items-center justify-center flex-shrink-0">
            <Atom className="w-5 h-5 text-[#5BB3B3]" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-bold text-[#E8E0D5] truncate">NucleuX Academy</div>
            <div className="text-xs text-[#A0B0BC] truncate">{subtitle}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/campus" className={linkClass(active === 'campus')}>
              Take the tour
            </Link>
            {showRooms ? (
              <Link href="/rooms" className={linkClass(active === 'rooms')}>
                Rooms
              </Link>
            ) : null}
            <Link href="/atom" className={linkClass(active === 'atom')}>
              ATOM
            </Link>
            <Link href="/pricing" className={linkClass(active === 'pricing')}>
              Early access
            </Link>
            <Link href="/about" className={linkClass(active === 'about')}>
              About
            </Link>
            <Link href="/faq" className={linkClass(active === 'faq')}>
              FAQ
            </Link>
            <Link href="/contact" className={linkClass(active === 'contact')}>
              Contact
            </Link>

            <Link
              href={primaryCta.href}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white text-sm font-medium"
            >
              {primaryCta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white text-sm font-medium"
            >
              Tour <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-[#E8E0D5]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur px-6 py-4 space-y-1">
          <Link href="/campus" className={mobileLinkClass(active === 'campus')} onClick={() => setMobileOpen(false)}>
            Campus Tour
          </Link>
          {showRooms && (
            <Link href="/rooms" className={mobileLinkClass(active === 'rooms')} onClick={() => setMobileOpen(false)}>
              Rooms
            </Link>
          )}
          <Link href="/atom" className={mobileLinkClass(active === 'atom')} onClick={() => setMobileOpen(false)}>
            ATOM
          </Link>
          <Link href="/pricing" className={mobileLinkClass(active === 'pricing')} onClick={() => setMobileOpen(false)}>
            Early access
          </Link>
          <Link href="/about" className={mobileLinkClass(active === 'about')} onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link href="/faq" className={mobileLinkClass(active === 'faq')} onClick={() => setMobileOpen(false)}>
            FAQ
          </Link>
          <Link href="/contact" className={mobileLinkClass(active === 'contact')} onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
          <div className="pt-3 border-t border-white/5">
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-[#E8E0D5] text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
