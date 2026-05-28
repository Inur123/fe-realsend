'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, BarChart3, Globe, Key, Bell, RefreshCw, Mail, Server } from 'lucide-react';

const features = [
  { icon: Shield,    title: 'SPF, DKIM & DMARC',   desc: 'Konfigurasi DNS otomatis untuk memastikan email terautentikasi dan masuk ke inbox, bukan spam.', clr: '#F47920', bg: 'rgba(244,121,32,0.1)', br: 'rgba(244,121,32,0.2)' },
  { icon: Zap,       title: 'Latency < 200ms',      desc: 'Server di Indonesia dengan infrastruktur edge global. Email dikirim dalam hitungan milidetik.', clr: '#FACC15', bg: 'rgba(250,204,21,0.1)', br: 'rgba(250,204,21,0.2)' },
  { icon: BarChart3, title: 'Analytics Real-Time',  desc: 'Pantau delivered, bounced, opened, dan clicked secara real-time dari dashboard kamu.', clr: '#60A5FA', bg: 'rgba(96,165,250,0.1)', br: 'rgba(96,165,250,0.2)' },
  { icon: Globe,     title: 'Dedicated IP Pool',    desc: 'Dapatkan IP dedicated untuk reputasi pengiriman yang terpisah dari pengguna lain.', clr: '#4ADE80', bg: 'rgba(74,222,128,0.1)', br: 'rgba(74,222,128,0.2)' },
  { icon: Key,       title: 'Multi API Key',        desc: 'Buat API key per project atau tim. Atur izin dan batas quota per key dengan mudah.', clr: '#A78BFA', bg: 'rgba(167,139,250,0.1)', br: 'rgba(167,139,250,0.2)' },
  { icon: Bell,      title: 'Webhook Events',       desc: 'Terima notifikasi real-time saat email delivered, bounced, atau dibuka oleh penerima.', clr: '#F472B6', bg: 'rgba(244,114,182,0.1)', br: 'rgba(244,114,182,0.2)' },
  { icon: RefreshCw, title: 'Bounce Management',    desc: 'Sistem otomatis mendeteksi bounce, mengelola suppression list, dan menjaga reputasi IP.', clr: '#FB923C', bg: 'rgba(251,146,60,0.1)', br: 'rgba(251,146,60,0.2)' },
  { icon: Mail,      title: 'Email Tracking',       desc: 'Lacak open rate dan click rate per kampanye. Integrasi dengan Google Postmaster Tools.', clr: '#22D3EE', bg: 'rgba(34,211,238,0.1)', br: 'rgba(34,211,238,0.2)' },
  { icon: Server,    title: 'SMTP Auth Support',    desc: 'Gunakan kredensial SMTP standar. Kompatibel dengan semua email library dan framework.', clr: '#2DD4BF', bg: 'rgba(45,212,191,0.1)', br: 'rgba(45,212,191,0.2)' },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="features" className="py-8 md:py-10 relative">
      <div className="absolute rounded-full blur-[110px] pointer-events-none w-[600px] h-[600px] bg-slate-900/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#F47920] mb-3"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Fitur Lengkap
          </motion.span>
          <motion.h2
            className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight text-slate-805 mb-5"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Semua yang Kamu Butuhkan{' '}
            <span className="bg-gradient-to-r from-[#F47920] to-[#FF9A4A] bg-clip-text text-transparent">untuk Email Profesional</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto"
          >
            Dari deliverability hingga analytics, RealSend hadir dengan fitur enterprise
            yang bisa diakses oleh semua kalangan developer.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.06 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border mb-4"
                style={{ background: f.bg, borderColor: f.br }}
              >
                <f.icon size={18} color={f.clr} />
              </div>
              <h3 className="text-[0.9375rem] font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-[0.8375rem] text-slate-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
