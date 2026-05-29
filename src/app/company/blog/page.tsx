import React from "react";
import type { Metadata } from "next";
import DocsHeader from "../../docs/DocsHeader";
import Footer from "@/components/landing/Footer";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Update Teknologi - RealSend",
  description: "Dapatkan tips, panduan konfigurasi SPF/DKIM, pembaruan produk, dan wawasan industri tentang deliverability email.",
};

export default function BlogPage() {
  const posts = [
    {
      title: "Cara Setup SPF, DKIM, dan DMARC Agar Email Tidak Masuk Folder Spam",
      excerpt: "Panduan lengkap langkah demi langkah melakukan konfigurasi rekaman DNS domain Anda untuk verifikasi pengirim otentik.",
      date: "20 Mei 2026",
      category: "Panduan",
      slug: "cara-setup-spf-dkim-dmarc",
    },
    {
      title: "SMTP Relay vs Web API: Mana yang Terbaik untuk Aplikasi Modern Anda?",
      excerpt: "Analisis perbandingan kinerja, latensi, dan fleksibilitas pemrograman antara integrasi SMTP standar dan RESTful HTTP API.",
      date: "14 Mei 2026",
      category: "Teknologi",
      slug: "smtp-relay-vs-web-api",
    },
    {
      title: "Pentingnya IP Warming Sebelum Mengirim Email Volume Besar",
      excerpt: "Bagaimana cara melakukan pemanasan reputasi alamat IP server Anda selama 60 hari untuk menjamin reputasi ISP yang sehat.",
      date: "02 Mei 2026",
      category: "Deliverability",
      slug: "pentingnya-ip-warming-email",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 flex flex-col">
      <DocsHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-8 pt-28 pb-16 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Blog & Update Teknis
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Artikel terbaru tentang pengiriman email, kepatuhan DNS, dan praktik terbaik bagi para developer.
          </p>
        </div>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                <h3 className="font-bold text-slate-850 dark:text-white text-sm line-clamp-2 hover:text-orange-500 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
