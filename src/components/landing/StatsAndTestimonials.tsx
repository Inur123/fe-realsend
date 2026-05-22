'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { CountUp } from '@/components/ui/CountUp';
import { TrendingUp, Clock, ShieldCheck, Users, Star } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: 850,   suffix: 'M+',  label: 'Email Terkirim',    sub: 'per bulan',      clr: '#F47920', bg: 'rgba(244,121,32,0.1)', br: 'rgba(244,121,32,0.22)' },
  { icon: ShieldCheck, value: 99,   suffix: '.9%',  label: 'Deliverability',    sub: 'masuk ke inbox', clr: '#4ADE80', bg: 'rgba(74,222,128,0.1)', br: 'rgba(74,222,128,0.22)' },
  { icon: Clock,       value: 180,  suffix: 'ms',   label: 'Avg. Latency',      sub: 'rata-rata kirim', clr: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  br: 'rgba(96,165,250,0.22)' },
  { icon: Users,       value: 12000,suffix: '+',    label: 'Developer Aktif',   sub: 'pakai RealSend', clr: '#A78BFA', bg: 'rgba(167,139,250,0.1)', br: 'rgba(167,139,250,0.22)' },
];

const testimonialsRow1 = [
  { quote: 'RealSend mengubah cara kami mengelola email transaksional. Deliverability naik dari 87% ke 99.4% hanya dalam seminggu.', name: 'Budi Santoso',  role: 'CTO, TechStartup.id',          av: 'BS', clr: '#F47920' },
  { quote: 'Setup cepat, dokumentasi lengkap, dan support responsif. Kami pindah dari SendGrid dan tidak menyesal sama sekali.',   name: 'Rina Kusuma',  role: 'Backend Engineer, Fintech ID',  av: 'RK', clr: '#A78BFA' },
  { quote: 'Webhook events membuat flow notifikasi kami jauh lebih reliable. Highly recommended untuk developer Indonesia.',       name: 'Danu Prasetyo', role: 'Lead Developer, E-Commerce Co.', av: 'DP', clr: '#4ADE80' },
  { quote: 'Dengan dedicated IP pool dari RealSend, reputasi email kami aman dan tingkat bounce rate turun drastis di bawah 0.2%.', name: 'Hendra Wijaya', role: 'SaaS Founder, KirimYuk',         av: 'HW', clr: '#60A5FA' },
  { quote: 'Migrasi dari provider luar negeri sangat lancar. Latensi drop dari 320ms ke 45ms. Customer kami sangat senang.', name: 'Eko Prasetyo', role: 'DevOps Lead, WarungApps', av: 'EP', clr: '#3B82F6' },
  { quote: 'Fitur multi-API key memudahkan kami mengelola security per microservice. Sangat membantu untuk compliance audit.', name: 'Joko Susilo', role: 'Security Architect, FinBank', av: 'JS', clr: '#10B981' },
];

const testimonialsRow2 = [
  { quote: 'Integrasi SMTP sangat mudah, langsung kompatibel dengan library Laravel Mailer kami. Kecepatan pengirimannya luar biasa.', name: 'Siti Aminah', role: 'VP of Engineering, WarungKita',  av: 'SA', clr: '#2DD4BF' },
  { quote: 'Dashboard analytics-nya sangat informatif. Kami bisa memantau bounce rate dan open rate secara real-time dari satu tempat.', name: 'Aditya Putra', role: 'Founder, EduTech Indonesia',   av: 'AP', clr: '#F5913A' },
  { quote: 'Keamanan verifikasi SPF/DKIM otomatis mempermudah hidup tim DevOps kami. Layanan lokal dengan kualitas kelas dunia!', name: 'Ferry Salim', role: 'CTO, PaymentGate',            av: 'FS', clr: '#EC4899' },
  { quote: 'Layanan pelanggan sangat responsif dan membantu memecahkan isu deliverability domain kami dalam hitungan menit.', name: 'Diana Lestari', role: 'Product Manager, TravelGo',        av: 'DL', clr: '#10B981' },
  { quote: 'Tim support RealSend sangat sigap membantu saat kami terkena IP blacklist akibat salah konfigurasi. Luar biasa!', name: 'Maya Indah', role: 'VP of Product, EduLearn', av: 'MI', clr: '#8B5CF6' },
  { quote: 'Statistik real-time sangat presisi. Membantu tim marketing mengukur efektivitas email campaign secara langsung.', name: 'Rian Hidayat', role: 'Growth Lead, MarketKita', av: 'RH', clr: '#EF4444' },
];

export default function StatsAndTestimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="stats" className="rs-section rs-grid-bg" style={{ position: 'relative', overflow: 'hidden' }}>
      

      <div className="rs-glow" style={{ width: 500, height: 500, background: 'rgba(27,43,91,0.03)', top: '30%', right: '-10%' }} />

      <div className="rs-wrap" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Stats header ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="rs-label">Angka Nyata</span>
          <h2 className="rs-heading">Dipercaya Ribuan Developer</h2>
        </div>

        {/* ── Stats grid ── */}
        <div ref={ref} className="rs-grid-4" style={{ marginBottom: '4rem' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="rs-card"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.09 }}
              style={{ textAlign: 'center' }}
            >
              <div
                className="rs-icon-box"
                style={{ background: s.bg, borderColor: s.br, margin: '0 auto 0.75rem' }}
              >
                <s.icon size={18} color={s.clr} />
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: s.clr, marginBottom: '0.25rem' }}>
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Testimonials header ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="rs-label">Testimoni</span>
          <h2 className="rs-heading">Apa Kata Mereka?</h2>
        </div>

        {/* ── Testimonials Auto-scroll Carousel ── */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          overflow: 'hidden', 
          position: 'relative', 
          width: '100%', 
          padding: '0.5rem 0',
          maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
        }}>
          
          {/* Row 1: scrolling left */}
          <Marquee speed={40} direction="left" pauseOnHover={true} gradient={false}>
            {testimonialsRow1.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="rs-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: 'clamp(18rem, 85vw, 24rem)',
                  flexShrink: 0,
                  whiteSpace: 'normal',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.01)',
                  marginRight: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={13} fill="#F47920" color="#F47920" />
                  ))}
                </div>
                <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, margin: 0 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: t.clr, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                    {t.av}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>

          {/* Row 2: scrolling right */}
          <Marquee speed={40} direction="right" pauseOnHover={true} gradient={false}>
            {testimonialsRow2.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="rs-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: 'clamp(18rem, 85vw, 24rem)',
                  flexShrink: 0,
                  whiteSpace: 'normal',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.01)',
                  marginRight: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={13} fill="#F47920" color="#F47920" />
                  ))}
                </div>
                <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, margin: 0 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: t.clr, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                    {t.av}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
