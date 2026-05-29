import React from "react";
import { AlertOctagon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anti-Spam Policy - RealSend Legal",
  description: "Kebijakan dan aturan ketat pelarangan spam serta standar reputasi pengiriman email.",
};

export default function AntiSpamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <AlertOctagon className="h-7 w-7 text-orange-500" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Anti-Spam Policy
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Terakhir diperbarui: 29 Mei 2026</p>
        </div>
      </div>

      <div className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed space-y-6">
        <p>
          RealSend menerapkan kebijakan tanpa toleransi (*Zero Tolerance*) terhadap aktivitas pengiriman email massal tanpa izin atau spam. Kami berkomitmen menjaga integritas alamat IP kami untuk menjamin deliverability terbaik bagi semua pengguna.
        </p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">1. Definisi Spam</h2>
          <p>
            Spam didefinisikan sebagai email komersial atau massal yang dikirim ke penerima yang tidak secara tegas memberikan persetujuan (*Opt-In*) untuk menerima email tersebut dari Anda.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">2. Aturan Daftar Penerima</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Dilarang membeli, menyewa, atau menggunakan daftar email dari pihak ketiga.</li>
            <li>Dilarang melakukan *scraping* atau mengumpulkan alamat email dari web secara otomatis.</li>
            <li>Daftar email Anda harus bersih dan memiliki rekam jejak persetujuan pengguna yang sah.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">3. Pelacakan Otomatis & Penalti</h2>
          <p>
            Sistem kami memantau metrik pentalan (*bounce*), keluhan spam (*spam complaint*), dan deteksi perangkap spam (*spam trap*) secara real-time. Akun yang menghasilkan rasio keluhan spam di atas **0.1%** atau rasio mental di atas **5%** akan diblokir otomatis secara permanen tanpa opsi refund.
          </p>
        </section>
      </div>
    </div>
  );
}
