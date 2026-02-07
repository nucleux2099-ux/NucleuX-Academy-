import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { BottomNav } from "@/components/BottomNav";
import { AtomWidget } from "@/components/AtomWidget";
import { AnalyticsProvider } from "@/lib/analytics";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-[#0D1B2A]">
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="p-4 sm:p-6 pb-24 lg:pb-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <BottomNav />
        <AtomWidget />
      </div>
    </AnalyticsProvider>
  );
}
