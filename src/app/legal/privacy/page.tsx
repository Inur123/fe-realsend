import React from "react";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - RealSend Legal",
  description: "Kebijakan perlindungan data pribadi dan data pengiriman email Anda di RealSend.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Lock className="h-7 w-7 text-orange-500" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Kebijakan Privasi
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Terakhir diperbarui: 29 Mei 2026</p>
        </div>
      </div>

      <div className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed space-y-6">
        <p>
          RealSend berkomitmen penuh untuk melindungi privasi data pribadi Anda dan data penerima email Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, memproses, dan melindungi data di platform kami.
        </p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">1. Data yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan data profil pengguna (nama, email, alamat penagihan) serta metadata pengiriman email transaksional Anda (alamat penerima, log status pengiriman, IP asal, waktu pengiriman). Kami TIDAK menyimpan isi konten tubuh email (*email body*) Anda secara permanen kecuali untuk kebutuhan antrean pengiriman jangka pendek.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">2. Keamanan Data</h2>
          <p>
            Semua lalu lintas data antara aplikasi Anda dan API RealSend dilindungi menggunakan enkripsi standar industri HTTPS/TLS. Server kami ditempatkan pada infrastruktur cloud Indonesia dengan standar keamanan fisik dan jaringan yang ketat.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">3. Kerahasiaan Penerima Email</h2>
          <p>
            RealSend tidak akan pernah menjual, menyewakan, atau mendistribusikan daftar alamat email penerima Anda kepada pihak ketiga mana pun. Data tersebut murni merupakan milik Anda dan hanya digunakan untuk memproses pengiriman email Anda.
          </p>
        </section>
      </div>
    </div>
  );
}
