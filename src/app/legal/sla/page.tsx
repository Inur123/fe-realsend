import React from "react";
import { HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Level Agreement (SLA) - RealSend Legal",
  description: "Jaminan ketersediaan layanan uptime infrastruktur email bulanan RealSend.",
};

export default function SlaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <HeartHandshake className="h-7 w-7 text-orange-500" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Service Level Agreement (SLA)
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Terakhir diperbarui: 29 Mei 2026</p>
        </div>
      </div>

      <div className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed space-y-6">
        <p>
          RealSend berkomitmen menyediakan infrastruktur pengiriman email yang handal dengan jaminan ketersediaan sistem yang tinggi demi kenyamanan alur kerja aplikasi bisnis Anda.
        </p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">1. Jaminan Uptime Layanan</h2>
          <p>
            RealSend menjamin ketersediaan bulanan (*Monthly Uptime Percentage*) minimal **99.9%** untuk layanan pengiriman email via SMTP Relay maupun Web API.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">2. Kredit Layanan (Service Credit)</h2>
          <p>
            Jika Uptime Layanan berada di bawah persentase jaminan, Anda berhak mengajukan permohonan kredit gratis pada tagihan paket bulanan berikutnya berdasarkan tabel berikut:
          </p>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 font-bold text-slate-400">Monthly Uptime</th>
                  <th className="py-2 font-bold text-slate-400">Kredit Pengembalian</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">99.0% - 99.9%</td>
                  <td className="py-2">10% dari Tagihan Bulanan</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">95.0% - 99.0%</td>
                  <td className="py-2">25% dari Tagihan Bulanan</td>
                </tr>
                <tr>
                  <td className="py-2">&lt; 95.0%</td>
                  <td className="py-2">50% dari Tagihan Bulanan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">3. Pengecualian SLA</h2>
          <p>
            Jaminan Uptime tidak berlaku untuk gangguan yang disebabkan oleh: pemeliharaan rutin terencana (*scheduled maintenance*), kegagalan ISP di sisi pengguna, atau gangguan massal skala nasional (force majeure).
          </p>
        </section>
      </div>
    </div>
  );
}
