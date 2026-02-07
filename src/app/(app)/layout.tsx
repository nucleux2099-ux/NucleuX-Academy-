import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 sm:p-6 pb-24 lg:pb-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
