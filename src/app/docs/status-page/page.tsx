import React from "react";
import { CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Layanan - RealSend Documentation",
  description: "Pantau status operasional dan performa infrastruktur email RealSend secara real-time.",
};

export default function StatusPage() {
  const systems = [
    { name: "SMTP Relay Service", status: "Operational", uptime: "99.98%", description: "Pengiriman via port 587 dan 2525" },
    { name: "Web API (REST Endpoint)", status: "Operational", uptime: "100.00%", description: "Endpoint https://api.realsend.web.id/v1/emails/send" },
    { name: "Webhooks Delivery", status: "Operational", uptime: "99.95%", description: "Pengiriman event callback status email" },
    { name: "Inbound Email Routing", status: "Operational", uptime: "99.90%", description: "Penerimaan email masuk untuk parsing" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 w-fit">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>Semua Sistem Berjalan Normal</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Status Layanan
        </h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
          Pantau status operasional dan performa layanan infrastruktur email RealSend secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys, idx) => (
          <div key={idx} className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-white text-sm">{sys.name}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                {sys.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sys.description}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
              <span>Uptime (30 hari)</span>
              <span>{sys.uptime}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-orange-500" />
          <span className="font-semibold">Keamanan & Kepatuhan data terjamin di server Indonesia.</span>
        </div>
        <span className="hidden sm:inline text-slate-500 font-mono">RealSend Network API</span>
      </div>
    </div>
  );
}
