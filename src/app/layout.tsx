import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { UserProvider } from "@/lib/contexts/UserContext";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NucleuX Academy - Learn Atomically. Grow Exponentially.",
  description: "A complete learning ecosystem with personalized AI agents, adaptive pathways, and proactive engagement.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NucleuX",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#7C3AED" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F172A] text-white`}
      >
        <AuthProvider>
          <UserProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <InstallPrompt />
            <ServiceWorkerRegistration />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
