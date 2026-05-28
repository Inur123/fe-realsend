'use client';

import { motion } from 'framer-motion';
import { UserPlus, Settings, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: UserPlus,
    accent: '#F47920',
    title: 'Daftar & Verifikasi Domain',
    desc: 'Buat akun gratis, tambahkan domain, dan setup DNS otomatis (SPF, DKIM, DMARC) dalam hitungan menit.',
  },
  {
    num: '02',
    icon: Settings,
    accent: '#A78BFA',
    title: 'Integrasikan API Key',
    desc: 'Generate API key dari dashboard dan integrasikan dengan library favorit kamu hanya dengan beberapa baris kode.',
  },
  {
    num: '03',
    icon: Rocket,
    accent: '#4ADE80',
    title: 'Kirim & Monitor',
    desc: 'Mulai kirim email transaksional dan pantau status deliverability secara real-time dari dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-8 md:py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/1 to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#F47920] mb-3">Cara Kerja</span>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight text-slate-800 mb-2">
            Mulai dalam <span className="bg-gradient-to-r from-[#F47920] to-[#FF9A4A] bg-clip-text text-transparent">3 Langkah Mudah</span>
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Dari integrasi hingga pengiriman email pertama kurang dari 5 menit.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] flex flex-col relative overflow-hidden p-6 h-full"
            >
              {/* Giant background step number */}
              <span 
                className="absolute -top-2 right-3 text-8xl font-black opacity-6 select-none leading-none"
                style={{ color: step.accent }}
              >
                {step.num}
              </span>

              <div>
                {/* Icon & Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${step.accent}12`,
                      border: `1px solid ${step.accent}30`,
                    }}
                  >
                    <step.icon size={16} color={step.accent} />
                  </div>
                  <span 
                    className="text-[0.65rem] font-extrabold uppercase tracking-wider"
                    style={{ color: step.accent }}
                  >
                    Langkah {step.num}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-base font-extrabold text-slate-800 mb-2 mt-0">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-[0.85rem] leading-relaxed m-0">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
