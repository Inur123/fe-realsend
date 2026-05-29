import React from "react";
import type { Metadata } from "next";
import DocsHeader from "../../docs/DocsHeader";
import Footer from "@/components/landing/Footer";
import { Briefcase, MapPin, AlignLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Karir di RealSend - Bergabung dengan Tim Kami",
  description: "Temukan peluang karir, rasakan budaya kerja developer-first, dan bantu kami membangun infrastruktur pengiriman email terbaik di Indonesia.",
};

export default function CareersPage() {
  const jobs = [
    {
      title: "Email Infrastructure Engineer",
      department: "Engineering (SMTP & Delivery)",
      location: "Jakarta (Hybrid)",
      type: "Full-Time",
    },
    {
      title: "Senior Fullstack Developer (Next.js & Go)",
      department: "Product & Engineering",
      location: "Yogyakarta (Remote)",
      type: "Full-Time",
    },
    {
      title: "Technical Support Specialist",
      department: "Customer Success",
      location: "Jakarta (On-site)",
      type: "Full-Time",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 flex flex-col">
      <DocsHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-8 pt-28 pb-16 space-y-12">
        {/* HERO SECTION */}
        <section className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 border border-orange-200/30 text-[10px] font-bold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>We are hiring!</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Bangun Masa Depan Infrastruktur Email
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Kami selalu mencari developer, desainer, dan pemikir kreatif berbakat yang bersemangat untuk memecahkan tantangan teknologi berskala besar.
          </p>
        </section>

        {/* ACTIVE JOBS */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Briefcase className="h-5 w-5 text-orange-500" />
            <span>Lowongan Aktif</span>
          </h2>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-orange-500/20 hover:shadow-xs transition-all duration-250"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-350">
                    {job.type}
                  </span>
                  <button className="h-8 inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 px-3.5 rounded-lg border-0 cursor-pointer shadow-md shadow-orange-500/10 transition-colors">
                    Lamar Posisi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
