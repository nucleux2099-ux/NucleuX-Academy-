import Link from 'next/link';

export function SupportFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="text-sm text-[#A0B0BC]">© {new Date().getFullYear()} NucleuX Academy</div>

        <div className="flex flex-wrap gap-4 text-sm">
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
        </div>

        <div className="text-xs text-[#6B7280]">
          Support:{' '}
          <a className="text-[#A0B0BC] hover:text-[#E8E0D5]" href="mailto:Nucleux2099@gmail.com">
            Nucleux2099@gmail.com
          </a>
          {' • '}Customer support:{' '}
          <a
            className="text-[#A0B0BC] hover:text-[#E8E0D5]"
            href="https://t.me/ATOM_2099_bot"
            target="_blank"
            rel="noreferrer"
          >
            @ATOM_2099_bot
          </a>
        </div>
      </div>
    </footer>
  );
}
