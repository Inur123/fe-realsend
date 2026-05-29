import React from "react";
import { Server, Code2, Sparkles } from "lucide-react";

export default function DocsIntroductionPage() {
  return (
    <div className="space-y-8">
      {/* SECTION: INTRODUCTION */}
      <section id="intro" className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 border border-orange-200/30 text-[10px] font-bold text-orange-600 dark:text-orange-400 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>RealSend SMTP & API v1.0</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Pengenalan
          </h1>
          <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-sm">
            RealSend adalah platform pengiriman email transaksional modern yang dirancang khusus untuk pengembang aplikasi dan bisnis mandiri yang membutuhkan sistem pengiriman email berkinerja tinggi, otentik, dan mudah diintegrasikan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl space-y-2">
            <Server className="h-5 w-5 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">SMTP Relay Handal</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Kirim email langsung dari platform Anda (WordPress, Laravel, Node.js) hanya dengan mengganti kredensial SMTP default Anda.
            </p>
          </div>
          <div className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl space-y-2">
            <Code2 className="h-5 w-5 text-orange-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">HTTP API Cepat</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gunakan RESTful API berlatensi rendah untuk mengirim email dalam format HTML atau teks biasa dengan lampiran dan metadata dinamis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
