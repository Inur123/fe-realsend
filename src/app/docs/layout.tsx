import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, Zap } from "lucide-react";

export const metadata = {
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto h-16 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo-realsend.png"
                alt="RealSend Logo Icon"
                width={28}
                height={28}
                className="h-7 w-auto object-contain"
                priority
              />
              <Image
                src="/images/text-realsend.png"
                alt="RealSend Logo Text"
                width={95}
                height={24}
                className="h-6 w-auto object-contain hidden sm:block"
                priority
              />
            </Link>
            
            <div className="h-4 w-px bg-slate-250 dark:bg-slate-800 hidden sm:block" />
            
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider hidden sm:flex">
              <BookOpen className="h-4 w-4 text-orange-500" />
              <span>Dokumentasi</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali</span>
            </Link>

            <Link
              href="/login"
              className="text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 px-3.5 py-1.5 rounded-lg transition-all"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="text-xs font-bold text-white bg-linear-to-br from-orange-500 to-amber-600 hover:brightness-110 px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-all"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Mulai Gratis</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        {children}
      </div>
    </div>
  );
}
