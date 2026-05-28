"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Send, Zap } from "lucide-react";

const codeLines = [
  { t: "// Kirim email dengan RealSend API", c: "#64748B" },
  {
    t: "const realsend = new RealSend({",
    c: "#334155",
    hi: [
      { w: "const", c: "#9333EA" },
      { w: "RealSend", c: "#2563EB" },
    ],
  },
  {
    t: "  apiKey: 'rs_live_xXXXXXXXX',",
    c: "#334155",
    hi: [{ w: "'rs_live_xXXXXXXXX'", c: "#D4661A" }],
  },
  {
    t: "  region: 'id-west-1'",
    c: "#334155",
    hi: [{ w: "'id-west-1'", c: "#D4661A" }],
  },
  { t: "});", c: "#334155" },
  { t: "", c: "#334155" },
  {
    t: "await realsend.emails.send({",
    c: "#334155",
    hi: [
      { w: "await", c: "#9333EA" },
      { w: "realsend", c: "#0891B2" },
    ],
  },
  {
    t: "  from: 'noreply@yourdomain.com',",
    c: "#334155",
    hi: [{ w: "'noreply@yourdomain.com'", c: "#D4661A" }],
  },
  {
    t: "  to:   'user@example.com',",
    c: "#334155",
    hi: [{ w: "'user@example.com'", c: "#D4661A" }],
  },
  {
    t: "  subject: 'Selamat Bergabung!',",
    c: "#334155",
    hi: [{ w: "'Selamat Bergabung!'", c: "#D4661A" }],
  },
  { t: "  html: emailTemplate,", c: "#334155" },
  { t: "});", c: "#334155" },
  { t: "", c: "#334155" },
  { t: "// Sukses: Terkirim dalam < 200ms", c: "#16A34A" },
];

const stats = [
  { v: "850M+", l: "Email Terkirim", s: "Bulan ini" },
  { v: "99.9%", l: "Uptime SLA", s: "Terjamin" },
  { v: "<0.3%", l: "Bounce Rate", s: "Terbaik" },
];

export default function HeroSection() {
  const router = useRouter();
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-22 pb-16 overflow-hidden bg-[linear-gradient(rgba(100,130,200,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(100,130,200,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"
    >
      {/* Glows */}
      <div className="absolute rounded-full blur-[110px] pointer-events-none w-[700px] h-[700px] bg-slate-900/6 -top-[200px] -left-[200px]" />
      <div className="absolute rounded-full blur-[110px] pointer-events-none w-[500px] h-[500px] bg-[#F47920]/7 top-[50px] -right-[100px]" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 items-start"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[0.15em] uppercase bg-[#F47920]/8 border border-[#F47920]/22 text-[#D4661A]">
              <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-[#F47920] inline-block" />
              Layanan SMTP Indonesia #1
            </span>

            {/* Heading */}
            <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-black leading-[1.08] text-slate-850 m-0">
              Kirim Email{' '}
              <span className="bg-gradient-to-r from-[#F47920] to-[#FF9A4A] bg-clip-text text-transparent">Lebih Cepat</span>,{' '}
              Lebih Andal.
            </h1>

            {/* Desc */}
            <p className="text-[1.0625rem] text-slate-600 leading-relaxed max-w-120 m-0">
              Infrastruktur SMTP profesional untuk developer dan bisnis Indonesia.
              Dedicated IP, deliverability tinggi, monitoring real-time — semua dalam satu platform.
            </p>

            {/* Highlights */}
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {['99.9% deliverability rate', 'Setup dalam 5 menit', 'Dedicated IP tersedia'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} color="#4ADE80" className="shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push('/register')}
                id="hero-cta-primary"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-br from-[#F47920] to-[#D4661A] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 w-full sm:w-auto cursor-pointer border-0"
              >
                <Zap size={18} /> Mulai Gratis Sekarang
              </button>
              <button
                onClick={() => handleScroll('how-it-works')}
                id="hero-cta-secondary"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium text-slate-600 bg-transparent border border-slate-200 hover:text-[#1B2B5B] hover:border-orange-500/40 hover:bg-orange-500/5 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
              >
                Lihat Cara Kerja <ArrowRight size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 m-0">
              Gratis hingga 1.000 email/bulan · Tidak perlu kartu kredit
            </p>
          </motion.div>

          {/* ── RIGHT ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Code block */}
            <div className="bg-white border border-slate-200 rounded-2xl font-mono text-[0.72rem] leading-relaxed overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.02)]">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#28CA41]" />
                <span className="ml-3 text-[0.7rem] text-slate-500">send-email.ts</span>
                <span className="ml-auto flex items-center gap-1 text-[0.7rem] text-[#F47920]">
                  <Send size={11} /> Live
                </span>
              </div>
              <div className="p-5 overflow-x-auto">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex gap-3 min-h-5">
                    <span className="text-[#3A4A6A] text-[0.65rem] w-4 text-right shrink-0 pt-0.5 select-none">
                      {i + 1}
                    </span>
                    <span style={{ color: line.c }} className="white-space-pre">{line.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.l}
                  className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-4 text-center"
                >
                  <div className="bg-gradient-to-r from-[#F47920] to-[#FF9A4A] bg-clip-text text-transparent text-[1.3rem] font-extrabold mb-1">{s.v}</div>
                  <div className="text-[0.7rem] font-bold text-slate-800">{s.l}</div>
                  <div className="text-[0.65rem] text-slate-500">{s.s}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <p className="text-[0.68rem] text-slate-500 uppercase tracking-[0.2em] font-bold">
            Dipercaya oleh developer &amp; bisnis
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-55">
            {['Tokopedia', 'Bukalapak', 'Gojek', 'Traveloka', 'Shopee ID'].map((b) => (
              <span key={b} className="text-[0.8rem] font-extrabold text-slate-600 tracking-wider">{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
