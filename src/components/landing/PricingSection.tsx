'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, Building2, Sparkles } from 'lucide-react';

const plans = [
  {
    id: 'free', name: 'Free', icon: Zap,
    price: { m: 0, y: 0 }, emails: '1.000',
    desc: 'Untuk eksperimen dan project kecil',
    features: ['1.000 email/bulan','10 email/menit','1 domain terverifikasi','2 API key','Dashboard dasar','Log 7 hari','Support komunitas'],
    excluded: ['Dedicated IP','Webhook events','Email tracking','Priority support'],
    cta: 'Mulai Gratis', featured: false, badge: null as string|null,
  },
  {
    id: 'starter', name: 'Starter', icon: Star,
    price: { m: 79000, y: 65000 }, emails: '50.000',
    desc: 'Untuk startup dan aplikasi berkembang',
    features: ['50.000 email/bulan','100 email/menit','5 domain terverifikasi','10 API key','Dashboard lengkap','Log 30 hari','Webhook events','Email tracking','Support email'],
    excluded: ['Dedicated IP','Priority support'],
    cta: 'Coba 14 Hari Gratis', featured: true, badge: 'Paling Populer' as string|null,
  },
  {
    id: 'pro', name: 'Pro', icon: Building2,
    price: { m: 249000, y: 199000 }, emails: '200.000',
    desc: 'Untuk bisnis dengan kebutuhan tinggi',
    features: ['200.000 email/bulan','500 email/menit','20 domain terverifikasi','API key unlimited','Dashboard + analytics','Log 90 hari','Webhook events','Open & click tracking','Dedicated IP (1 IP)','IP warming otomatis','Priority support'],
    excluded: [] as string[],
    cta: 'Mulai Pro', featured: false, badge: 'Best Value' as string|null,
  },
];

const fmt = (n: number) => n === 0 ? 'Gratis' : `Rp ${(n/1000).toFixed(0)}k`;

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="rs-section">
      <div className="rs-glow" style={{ width: 700, height: 700, background: 'rgba(244,121,32,0.05)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div className="rs-wrap" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="rs-label">Harga Transparan</span>
          <h2 className="rs-heading">
            Pilih Paket <span className="rs-gradient-text">yang Tepat</span>
          </h2>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.875rem',
            padding: '0.625rem 1.25rem', borderRadius: 9999,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            marginTop: '1.5rem',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: yearly ? 'var(--text-muted)' : 'var(--text-primary)', transition: 'color 0.2s' }}>
              Bulanan
            </span>
            <button
              id="billing-toggle"
              onClick={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
              style={{
                position: 'relative', width: '2.75rem', height: '1.5rem',
                borderRadius: 9999, border: 'none', cursor: 'pointer',
                background: yearly ? 'var(--orange)' : 'rgba(15, 23, 42, 0.12)',
                transition: 'background 0.3s', flexShrink: 0,
              }}
            >
              <motion.div
                animate={{ x: yearly ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{ position: 'absolute', top: 3, width: '1.125rem', height: '1.125rem', borderRadius: '50%', background: 'white' }}
              />
            </button>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: yearly ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Tahunan
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 9999, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.28)', color: '#4ADE80' }}>
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '1.25rem',
                border: `1px solid ${plan.featured ? 'rgba(244,121,32,0.42)' : 'var(--border)'}`,
                background: plan.featured
                  ? 'linear-gradient(155deg, #FFFFFF 0%, #FFF7ED 100%)'
                  : 'var(--bg-card)',
                boxShadow: plan.featured ? '0 12px 40px rgba(244,121,32,0.08)' : '0 4px 20px rgba(15, 23, 42, 0.02)',
                overflow: 'visible',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-0.9rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '0.3rem 0.875rem', borderRadius: 9999,
                    ...(plan.featured
                      ? { background: 'rgba(244,121,32,0.18)', border: '1px solid rgba(244,121,32,0.42)', color: '#F5913A' }
                      : { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.32)', color: '#4ADE80' }
                    ),
                  }}>
                    <Sparkles size={10} className="fill-current" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                {/* Plan name */}
                <div>
                  <div style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', marginBottom: '0.875rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid',
                    background: plan.featured ? 'rgba(244,121,32,0.18)' : 'rgba(15, 23, 42, 0.05)',
                    borderColor: plan.featured ? 'rgba(244,121,32,0.35)' : 'rgba(15, 23, 42, 0.1)',
                  }}>
                    <plan.icon size={18} color={plan.featured ? '#F47920' : 'var(--text-secondary)'} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>{plan.desc}</p>
                </div>

                {/* Price */}
                <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={yearly ? 'y' : 'm'}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                        <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {fmt(yearly ? plan.price.y : plan.price.m)}
                        </span>
                        {plan.price.m > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/bln</span>}
                      </div>
                      {yearly && plan.price.m > 0 && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                          Ditagih {fmt(plan.price.y * 12)}/tahun
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <div style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#F47920', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F47920' }}>{plan.emails} email/bulan</span>
                  </div>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8375rem', color: 'var(--text-secondary)' }}>
                      <Check size={15} color="#4ADE80" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                      {f}
                    </li>
                  ))}
                  {plan.excluded.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8375rem', color: 'var(--text-muted)', opacity: 0.5, textDecoration: 'line-through' }}>
                      <span style={{ flexShrink: 0, marginTop: '0.05rem', width: 15, textAlign: 'center' }}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  id={`pricing-${plan.id}`}
                  className={plan.featured ? "" : "rs-btn-outline"}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center', borderRadius: '0.75rem',
                    fontSize: '0.875rem', fontWeight: 700, marginTop: '0.5rem',
                    transition: 'all 0.25s',
                    cursor: 'pointer',
                    outline: 'none',
                    ...(plan.featured
                      ? { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#F47920,#D4661A)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(244,121,32,0.3)' }
                      : { padding: '0.625rem 1.5rem', background: 'transparent' }
                    ),
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise row */}
        <div
          className="rs-card"
          style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
        >
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Butuh volume lebih besar?</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Paket Enterprise: IP pool custom, SLA 99.99%, dedicated support engineer.
            </p>
          </div>
          <button id="pricing-enterprise" className="rs-btn-outline" style={{ whiteSpace: 'nowrap', padding: '0.625rem 1.5rem', fontSize: '0.875rem', cursor: 'pointer', background: 'transparent' }}>
            Hubungi Sales →
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Melebihi kuota? Ditagih Rp 1.500 per 1.000 email tambahan — tidak langsung diblokir.
        </p>
      </div>
    </section>
  );
}
