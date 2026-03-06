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
      <div className="min-h-screen app-shell">
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:pb-8 lg:pt-7">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <BottomNav />
        <AtomWidget />
      </div>
    </AnalyticsProvider>
  );
}
