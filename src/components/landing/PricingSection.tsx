'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, Building2, Sparkles, AlertCircle, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthly_email_limit: number;
  daily_email_limit: number;
  rate_per_minute: number;
  max_domains: number;
  max_api_keys: number;
  max_webhooks: number;
  log_retention_days: number;
  price_monthly_idr: number;
  price_yearly_idr: number;
  overage_per_1k_idr: number;
  is_public: boolean;
  is_active: boolean;
  sort_order: number;
  badge_text: string;
  badge_color: string;
  features: string[];
}

const getPlanIcon = (slug: string) => {
  switch (slug.toLowerCase()) {
    case 'free':
      return Zap;
    case 'starter':
      return Star;
    case 'growth':
      return Sparkles;
    case 'pro':
    default:
      return Building2;
  }
};

const getPlanBasicFeatures = (plan: Plan) => {
  return [
    `${plan.monthly_email_limit.toLocaleString('id-ID')} email/bulan`,
    `${plan.daily_email_limit.toLocaleString('id-ID')} email/hari`,
    `${plan.max_domains} domain terverifikasi`,
    `${plan.max_api_keys === -1 ? 'API key unlimited' : `${plan.max_api_keys} API key`}`,
    `${plan.max_webhooks} webhook`,
    `Log retention ${plan.log_retention_days} hari`,
  ];
};

const PREMIUM_FEATURES = [
  { key: 'tracking', label: 'Open & click tracking', check: (plan: Plan) => plan.features?.includes("open_tracking") || plan.features?.includes("click_tracking") },
  { key: 'custom_smtp', label: 'Custom SMTP Port', check: (plan: Plan) => plan.features?.includes("custom_smtp") },
  { key: 'dedicated_ip', label: 'Dedicated IP (1 IP)', check: (plan: Plan) => plan.slug.toLowerCase() === 'pro' },
];

const fmt = (n: number) => n === 0 ? 'Gratis' : `Rp ${(n/1000).toLocaleString('id-ID')}k`;

export default function PricingSection() {
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await api.plans.list();
        // Filter public & active plans, sort by sort_order
        const filtered = data
          .filter((p: Plan) => p.is_public && p.is_active)
          .sort((a: Plan, b: Plan) => a.sort_order - b.sort_order);
        setPlans(filtered);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Belum ada paket</h3>
            <p className="mt-1 text-sm text-slate-500">Tidak ada paket subscription publik yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {plans.map((plan, i) => {
              const icon = getPlanIcon(plan.slug);
              const IconComponent = icon;
              // Growth defaults to Paling Populer, Pro to Best Value if not configured in db
              const badge = plan.badge_text || (plan.slug === 'growth' ? 'Paling Populer' : plan.slug === 'pro' ? 'Best Value' : null);
              const featured = badge === 'Paling Populer' || badge === 'Popular' || plan.slug === 'growth';
              const basicFeatures = getPlanBasicFeatures(plan);
              
              // Calculate price based on toggle
              const monthlyPrice = plan.price_monthly_idr;
              const yearlyPrice = plan.price_yearly_idr;
              const displayPrice = yearly ? Math.round(yearlyPrice / 12) : monthlyPrice;

              return (
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
                    border: `1px solid ${featured ? 'rgba(244,121,32,0.42)' : 'var(--border)'}`,
                    background: featured
                      ? 'linear-gradient(155deg, #FFFFFF 0%, #FFF7ED 100%)'
                      : 'var(--bg-card)',
                    boxShadow: featured ? '0 12px 40px rgba(244,121,32,0.08)' : '0 4px 20px rgba(15, 23, 42, 0.02)',
                    overflow: 'visible',
                  }}
                >
                  {/* Badge */}
                  {badge && (
                    <div style={{ position: 'absolute', top: '-0.9rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '0.3rem 0.875rem', borderRadius: 9999,
                        ...(featured
                          ? { background: 'rgba(244,121,32,0.18)', border: '1px solid rgba(244,121,32,0.42)', color: '#F5913A' }
                          : { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.32)', color: '#4ADE80' }
                        ),
                      }}>
                        <Sparkles size={10} className="fill-current" />
                        {badge}
                      </span>
                    </div>
                  )}

                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                    {/* Plan name */}
                    <div>
                      <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', marginBottom: '0.875rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid',
                        background: featured ? 'rgba(244,121,32,0.18)' : 'rgba(15, 23, 42, 0.05)',
                        borderColor: featured ? 'rgba(244,121,32,0.35)' : 'rgba(15, 23, 42, 0.1)',
                      }}>
                        <IconComponent size={18} color={featured ? '#F47920' : 'var(--text-secondary)'} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{plan.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>{plan.description}</p>
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
                              {fmt(displayPrice)}
                            </span>
                            {displayPrice > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/bln</span>}
                          </div>
                          {yearly && displayPrice > 0 && (
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                              Ditagih {fmt(yearlyPrice)}/tahun
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <div style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#F47920', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F47920' }}>{plan.monthly_email_limit.toLocaleString('id-ID')} email/bulan</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
                      {basicFeatures.map((f) => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8375rem', color: 'var(--text-secondary)' }}>
                          <Check size={15} color="#4ADE80" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                          {f}
                        </li>
                      ))}
                      {PREMIUM_FEATURES.map((feat) => {
                        const included = feat.check(plan);
                        return (
                          <li 
                            key={feat.key} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: '0.625rem', 
                              fontSize: '0.8375rem', 
                              color: included ? 'var(--text-secondary)' : 'var(--text-muted)', 
                              opacity: included ? 1 : 0.45, 
                              textDecoration: included ? 'none' : 'line-through' 
                            }}
                          >
                            {included ? (
                              <Check size={15} color="#4ADE80" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                            ) : (
                              <X size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                            )}
                            {feat.label}
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    <button
                      id={`pricing-${plan.id}`}
                      onClick={() => router.push('/register')}
                      className={featured ? "" : "rs-btn-outline"}
                      style={{
                        display: 'block', width: '100%', textAlign: 'center', borderRadius: '0.75rem',
                        fontSize: '0.875rem', fontWeight: 700, marginTop: '0.5rem',
                        transition: 'all 0.25s',
                        cursor: 'pointer',
                        outline: 'none',
                        ...(featured
                          ? { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#F47920,#D4661A)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(244,121,32,0.3)' }
                          : { padding: '0.625rem 1.5rem', background: 'transparent' }
                        ),
                      }}
                    >
                      {plan.slug === 'free' ? 'Mulai Gratis' : 'Coba Sekarang'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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
