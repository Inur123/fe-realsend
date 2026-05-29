import type { Metadata } from "next";
import DocsHeader from "../docs/DocsHeader";
import Footer from "@/components/landing/Footer";
import LegalSidebar from "./LegalSidebar";

export const metadata: Metadata = {
  title: "Legal & Kebijakan - RealSend",
  description: "Syarat Layanan, Kebijakan Privasi, Anti-Spam Policy, dan Service Level Agreement RealSend.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 flex flex-col">
      <DocsHeader />

      <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 sm:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 py-6 lg:py-8">
          <LegalSidebar />
          <main className="flex-1 max-w-3xl min-w-0 bg-white dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/60 p-6 sm:p-8 md:p-10 rounded-3xl shadow-xs">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
