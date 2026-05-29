import type { Metadata } from "next";
import DocsHeader from "./DocsHeader";
import DocsSidebar from "./DocsSidebar";

export const metadata: Metadata = {
  title: "RealSend Documentation",
  description: "Dokumentasi API, Panduan Integrasi SMTP, dan SDK resmi RealSend.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200">
      <DocsHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-10 py-8 lg:py-10">
          <DocsSidebar />
          <main className="flex-1 max-w-3xl min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
