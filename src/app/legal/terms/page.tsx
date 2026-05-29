import React from "react";
import { Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat Layanan - RealSend Legal",
  description: "Syarat dan ketentuan resmi penggunaan layanan infrastruktur email RealSend.",
};

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Scale className="h-7 w-7 text-orange-500" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Syarat Layanan
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Terakhir diperbarui: 29 Mei 2026</p>
        </div>
      </div>

      <div className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed space-y-6">
        <p>
          Selamat datang di RealSend. Dengan mengakses atau menggunakan platform pengiriman email kami, Anda menyetujui untuk terikat oleh Syarat Layanan berikut. Harap baca dokumen ini dengan saksama sebelum mulai menggunakan layanan kami.
        </p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">1. Akun Pengguna</h2>
          <p>
            Untuk menggunakan RealSend, Anda harus mendaftar dan memelihara akun yang aman. Anda bertanggung jawab penuh atas kerahasiaan kredensial akun Anda (kunci API, password, dan token autentikasi) serta segala aktivitas yang terjadi di bawah akun Anda.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">2. Penggunaan Layanan yang Diizinkan</h2>
          <p>
            RealSend menyediakan infrastruktur pengiriman email transaksional dan marketing resmi. Anda setuju untuk tidak menggunakan RealSend untuk mengirimkan email yang melanggar hukum, penipuan (phishing), perjudian, pornografi, atau menyebarkan materi berbahaya lainnya.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">3. Kebijakan Batasan Volume & Tarif</h2>
          <p>
            Kami berhak membatasi volume email harian atau bulanan Anda berdasarkan paket langganan Anda atau reputasi pengiriman domain Anda. Pembatasan ini diterapkan secara otomatis demi menjaga kesehatan reputasi IP server bersama.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">4. Penghentian Layanan</h2>
          <p>
            RealSend berhak untuk menangguhkan atau menghentikan akses Anda ke platform secara sepihak dan tanpa pemberitahuan sebelumnya jika Anda terbukti melanggar Syarat Layanan atau terdeteksi mengirimkan email spam dengan tingkat pentalan (*bounce rate*) di atas 5%.
          </p>
        </section>
      </div>
    </div>
  );
}
