import React from "react";
import { ShieldAlert, Server } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMTP Relay - RealSend Documentation",
  description: "Gunakan detail kredensial SMTP untuk mengirim email dari server Anda.",
};

export default function SmtpRelayPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          SMTP Relay
        </h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
          Gunakan protokol SMTP standar untuk mengirim email dari CMS WordPress, server Laravel, Django, NodeMailer, atau sistem aplikasi apa pun yang mendukung SMTP.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4 text-sm shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Server className="h-5 w-5 text-orange-500" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Kredensial & Server Detail</h2>
        </div>
        
        <table className="w-full text-left text-xs border-collapse">
          <tbody>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 font-bold text-slate-400 uppercase tracking-wider pr-4 w-1/3">Host / Server</td>
              <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">smtp.realsend.web.id</td>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 font-bold text-slate-400 uppercase tracking-wider pr-4">Port (TLS)</td>
              <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">587 (Rekomendasi) atau 2525</td>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 font-bold text-slate-400 uppercase tracking-wider pr-4">Username</td>
              <td className="py-3 text-slate-500 dark:text-slate-400">
                <span className="font-mono bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">rs_live_your_api_key</span>
              </td>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 font-bold text-slate-400 uppercase tracking-wider pr-4">Password</td>
              <td className="py-3 text-slate-500 dark:text-slate-400">
                <span className="italic font-semibold text-orange-650 dark:text-orange-400">Gunakan Kunci API yang sama dengan Username Anda</span>
              </td>
            </tr>
            <tr>
              <td className="py-3 font-bold text-slate-400 uppercase tracking-wider pr-4">Encryption</td>
              <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">STARTTLS / TLS</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-xs text-amber-800 dark:text-amber-400 rounded-xl leading-relaxed">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <span className="font-bold">PENTING:</span> Sebelum mengirim email lewat SMTP, Anda harus mendaftarkan domain pengirim Anda di menu <span className="font-bold text-slate-900 dark:text-white">Domain Sending</span> di dashboard Anda dan memverifikasi rekaman DNS (SPF/DKIM) terlebih dahulu untuk memastikan keterkiriman email yang tinggi.
        </div>
      </div>
    </div>
  );
}
