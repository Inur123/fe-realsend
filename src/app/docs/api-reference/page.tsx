import React from "react";
import { KeyRound } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference - RealSend Documentation",
  description: "REST API endpoints, request payloads, and authentication headers for RealSend.",
};

export default function ApiReferencePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          API Reference
        </h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
          Kirim email transaksional dengan mengirimkan request HTTP POST JSON langsung ke endpoint REST API RealSend.
        </p>
      </div>

      {/* SECTION: AUTENTIKASI */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-orange-500" />
          <span>Kunci API (Autentikasi)</span>
        </h2>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
          Semua request HTTP REST API ke RealSend harus diautentikasi menggunakan API Key dalam header request. Buat Kunci API di menu <span className="font-bold">API Keys</span> di dashboard Anda.
        </p>
        <div className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-lg border border-slate-800 overflow-x-auto">
          <pre>Authorization: Bearer rs_live_your_api_key</pre>
        </div>
      </section>

      {/* SECTION: POST SEND EMAIL */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Kirim Email
        </h2>
        
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-lg text-[10px] tracking-wide uppercase">POST</span>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">https://api.realsend.web.id/v1/emails/send</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
          <div className="flex border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400">
            Payload Request Body (JSON)
          </div>
          <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-300">
            <pre>{`{
  "from": "sender@domainanda.com",  // Wajib (Email pengirim terdaftar)
  "to": "recipient@example.com",     // Wajib (Email tujuan)
  "subject": "Halo Dunia",          // Wajib
  "body": "<h1>Isi Email</h1>",     // Wajib
  "content_type": "text/html",       // Opsional ("text/html" atau "text/plain", default: "text/html")
  "tags": ["otp", "transaksional"]   // Opsional (Max 5 tags)
}`}</pre>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
          <div className="flex border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400">
            Response Contoh Sukses (200 OK)
          </div>
          <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-300">
            <pre>{`{
  "success": true,
  "message": "Email has been queued successfully",
  "id": "msg_01h2x8m3z9y1w7x4p8v2q9k1b"
}`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
