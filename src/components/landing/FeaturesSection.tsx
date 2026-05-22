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
    <section id="features" className="rs-section">
      <div className="rs-glow" style={{ width: 600, height: 600, background: 'rgba(27,43,91,0.03)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div className="rs-wrap" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.span
            className="rs-label"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Fitur Lengkap
          </motion.span>
          <motion.h2
            className="rs-heading"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Semua yang Kamu Butuhkan{' '}
            <span className="rs-gradient-text">untuk Email Profesional</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '38rem', margin: '0 auto' }}
          >
            Dari deliverability hingga analytics, RealSend hadir dengan fitur enterprise
            yang bisa diakses oleh semua kalangan developer.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          className="rs-grid-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="rs-card"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.06 }}
            >
              <div
                className="rs-icon-box"
                style={{ background: f.bg, borderColor: f.br }}
              >
                <f.icon size={18} color={f.clr} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
