import React from "react";
import type { Metadata } from "next";
import DocsHeader from "../../docs/DocsHeader";
import Footer from "@/components/landing/Footer";
import { Sparkles, Heart, Zap, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami - RealSend",
  description: "Pelajari sejarah, misi, dan nilai-nilai inti yang diusung RealSend sebagai platform infrastruktur email developer Indonesia.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 flex flex-col">
      <DocsHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-8 pt-28 pb-16 space-y-16">
        {/* HERO SECTION */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 border border-orange-200/30 text-[10px] font-bold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Misi RealSend</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Infrastruktur Email Developer-First Indonesia
          </h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            RealSend lahir untuk memecahkan masalah kompleksitas pengiriman email transaksional dengan memberikan performa latensi rendah, tingkat keterkiriman (*deliverability*) tinggi, dan integrasi super mudah bagi bisnis modern di Indonesia.
          </p>
        </section>

        {/* VALUES SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl space-y-3">
            <Zap className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Kecepatan Maksimal</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Infrastruktur server lokal di Indonesia menjamin latensi pengiriman email transaksional yang super singkat.
            </p>
          </div>
          <div className="p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl space-y-3">
            <Heart className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Fokus Developer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              API RESTful dan dokumentasi interaktif yang dirancang agar developer dapat mengintegrasikan platform kurang dari 5 menit.
            </p>
          </div>
          <div className="p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl space-y-3">
            <Mail className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Deliverability Tinggi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Manajemen reputasi IP server, filter anti-spam cerdas, dan dukungan konfigurasi DNS otomatis (SPF/DKIM).
            </p>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="p-8 border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/10 rounded-3xl space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Sejarah Singkat</h2>
          <p className="text-xs text-slate-655 dark:text-slate-455 leading-relaxed">
            Didirikan oleh sekelompok developer Indonesia yang menyadari betapa mahalnya biaya infrastruktur email global dan seringnya email transaksional dari server luar masuk ke folder spam pengguna lokal. RealSend didesain khusus sebagai solusi lokal dengan standar kelas dunia yang ramah kantong.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
