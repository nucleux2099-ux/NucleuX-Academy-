import { AnalyticsProvider } from "@/lib/analytics";
import { AppShell } from "@/components/app/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <AppShell>{children}</AppShell>
    </AnalyticsProvider>
  );
}
