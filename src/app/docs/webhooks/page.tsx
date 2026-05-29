import React from "react";
import { Webhook } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webhooks - RealSend Documentation",
  description: "Pelajari format payload webhook dan status pengiriman email real-time.",
};

export default function WebhooksPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center gap-2">
          <Webhook className="h-8 w-8 text-orange-500" />
          <span>Webhooks</span>
        </h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
          RealSend dapat mengirimkan event webhook HTTP POST secara real-time ke URL server Anda ketika status pengiriman email berubah.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event yang Didukung</h2>
        <p className="text-xs text-slate-655 dark:text-slate-400">
          Anda dapat memantau daur hidup pengiriman email Anda dengan mengaktifkan event berikut:
        </p>
        
        <div className="space-y-3">
          <div className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl">
            <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">email.sent</span>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Terjadi saat email berhasil dikirim keluar dari server RealSend.</p>
          </div>
          <div className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl">
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-450">email.delivered</span>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Terjadi saat server email penerima menerima pesan dan menaruhnya di inbox.</p>
          </div>
          <div className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl">
            <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-455">email.bounced</span>
            <p className="text-xs text-slate-500 dark:text-slate-455 mt-1">Terjadi saat email gagal terkirim (alamat email tidak ada, kotak masuk penuh, dll).</p>
          </div>
          <div className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">email.opened</span>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Terjadi saat penerima pertama kali membuka email Anda (memerlukan pelacakan terbuka).</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contoh Payload Webhook</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
          <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-300">
            <pre>{`{
  "event": "email.delivered",
  "created_at": "2026-05-29T09:34:19Z",
  "data": {
    "email_id": "msg_01h2x8m3z9y1w7x4p8v2q9k1b",
    "from": "sender@domainanda.com",
    "to": "recipient@example.com",
    "subject": "Halo dari RealSend!",
    "status": "delivered",
    "timestamp": 1779941659
  }
}`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
