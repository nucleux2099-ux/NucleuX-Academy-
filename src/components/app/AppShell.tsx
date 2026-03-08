"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AtomWidget } from "@/components/AtomWidget";
import { PageTransition } from "@/components/PageTransition";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAtomFocusMode = pathname === "/atom" || pathname.startsWith("/atom/");

  return (
    <div className="min-h-screen bg-[#2D3E50]">
      {!isAtomFocusMode && <Sidebar />}

      <div className={isAtomFocusMode ? "" : "lg:pl-64"}>
        {!isAtomFocusMode && <Header />}

        <main className={isAtomFocusMode ? "h-screen w-full" : "p-4 sm:p-6 pb-24 lg:pb-6"}>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {!isAtomFocusMode && <BottomNav />}
      {!isAtomFocusMode && <AtomWidget />}
    </div>
  );
}
