import React from "react";
import type { Metadata } from "next";
import DocsHeader from "../../docs/DocsHeader";
import Footer from "@/components/landing/Footer";
import { Mail, MessageSquare, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Hubungi Kami - Layanan Pelanggan RealSend",
  description: "Ada pertanyaan mengenai integrasi SMTP, harga paket, atau penawaran khusus enterprise? Hubungi tim support RealSend di Indonesia.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 flex flex-col">
      <DocsHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-8 pt-28 pb-16 space-y-12">
        {/* HERO SECTION */}
        <section className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 border border-orange-200/30 text-[10px] font-bold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Kontak Kami</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Ada yang Bisa Kami Bantu?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Butuh bantuan integrasi API, kustomisasi paket enterprise, atau punya kendala teknis? Tim support kami di Indonesia siap merespons Anda dengan cepat.
          </p>
        </section>

        {/* DETAILS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl space-y-3">
            <Mail className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Dukungan Email</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hubungi tim support teknis kami untuk kendala integrasi atau deliverability.
            </p>
            <a href="mailto:support@realsend.web.id" className="inline-block text-xs font-bold text-orange-500 hover:underline">
              support@realsend.web.id
            </a>
          </div>

          <div className="p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl space-y-3">
            <MessageSquare className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Layanan Kemitraan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Diskusikan kolaborasi bisnis, lisensi white-label, atau penawaran produk khusus.
            </p>
            <a href="mailto:sales@realsend.web.id" className="inline-block text-xs font-bold text-orange-500 hover:underline">
              sales@realsend.web.id
            </a>
          </div>

          <div className="p-6 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl space-y-3">
            <MapPin className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Lokasi Kantor</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sopo Del Office Tower, Mega Kuningan, Jakarta Selatan, DKI Jakarta.
            </p>
            <span className="inline-block text-xs font-bold text-slate-400 select-all">
              Jakarta, Indonesia
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
