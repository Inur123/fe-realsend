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
    <section id="how-it-works" className="rs-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(27,43,91,0.01), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div className="rs-wrap" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="rs-label">Cara Kerja</span>
          <h2 className="rs-heading" style={{ marginBottom: '0.5rem' }}>
            Mulai dalam <span className="rs-gradient-text">3 Langkah Mudah</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '32rem', margin: '0 auto', lineHeight: 1.6 }}>
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
              className="rs-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                padding: '1.5rem',
                height: '100%',
              }}
            >
              {/* Giant background step number */}
              <span style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '0.75rem',
                fontSize: '5rem',
                fontWeight: 900,
                color: step.accent,
                opacity: 0.06,
                userSelect: 'none',
                lineHeight: 1,
              }}>
                {step.num}
              </span>

              <div>
                {/* Icon & Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${step.accent}12`,
                    border: `1px solid ${step.accent}30`,
                  }}>
                    <step.icon size={16} color={step.accent} />
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: step.accent }}>
                    Langkah {step.num}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', marginTop: 0 }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
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
