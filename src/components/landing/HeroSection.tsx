'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Send, Zap } from 'lucide-react';

const codeLines = [
  { t: '// Kirim email dengan RealSend API', c: '#64748B' },
  { t: 'const realsend = new RealSend({',    c: '#334155', hi: [{ w: 'const', c: '#9333EA' }, { w: 'RealSend', c: '#2563EB' }] },
  { t: "  apiKey: 'rs_live_xXXXXXXXX',",     c: '#334155', hi: [{ w: "'rs_live_xXXXXXXXX'", c: '#D4661A' }] },
  { t: "  region: 'id-west-1'",               c: '#334155', hi: [{ w: "'id-west-1'", c: '#D4661A' }] },
  { t: '});',                                  c: '#334155' },
  { t: '',                                     c: '#334155' },
  { t: 'await realsend.emails.send({',        c: '#334155', hi: [{ w: 'await', c: '#9333EA' }, { w: 'realsend', c: '#0891B2' }] },
  { t: "  from: 'noreply@yourdomain.com',",   c: '#334155', hi: [{ w: "'noreply@yourdomain.com'", c: '#D4661A' }] },
  { t: "  to:   'user@example.com',",         c: '#334155', hi: [{ w: "'user@example.com'", c: '#D4661A' }] },
  { t: "  subject: 'Selamat Bergabung!',",    c: '#334155', hi: [{ w: "'Selamat Bergabung!'", c: '#D4661A' }] },
  { t: '  html: emailTemplate,',              c: '#334155' },
  { t: '});',                                  c: '#334155' },
  { t: '',                                     c: '#334155' },
  { t: '// Sukses: Terkirim dalam < 200ms',   c: '#16A34A' },
];

const stats = [
  { v: '850M+', l: 'Email Terkirim', s: 'Bulan ini' },
  { v: '99.9%', l: 'Uptime SLA',    s: 'Terjamin' },
  { v: '<0.3%', l: 'Bounce Rate',   s: 'Terbaik' },
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
      className="rs-grid-bg"
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '5.5rem', paddingBottom: '4rem', overflow: 'hidden' }}
    >
      {/* Glows */}
      <div className="rs-glow" style={{ width: 700, height: 700, background: 'rgba(27,43,91,0.06)', top: -200, left: -200 }} />
      <div className="rs-glow" style={{ width: 500, height: 500, background: 'rgba(244,121,32,0.07)', top: 50, right: -100 }} />

      <div className="rs-wrap" style={{ width: '100%' }}>
        <div className="rs-grid-2">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}
          >
            {/* Badge */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.875rem', borderRadius: 9999,
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              background: 'rgba(244,121,32,0.08)', border: '1px solid rgba(244,121,32,0.22)', color: '#D4661A',
            }}>
              <span className="rs-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#F47920', display: 'inline-block' }} />
              Layanan SMTP Indonesia #1
            </span>

            {/* Heading */}
            <h1 style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.08, color: 'var(--text-primary)', margin: 0 }}>
              Kirim Email{' '}
              <span className="rs-gradient-text">Lebih Cepat</span>,{' '}
              Lebih Andal.
            </h1>

            {/* Desc */}
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '30rem', margin: 0 }}>
              Infrastruktur SMTP profesional untuk developer dan bisnis Indonesia.
              Dedicated IP, deliverability tinggi, monitoring real-time — semua dalam satu platform.
            </p>

            {/* Highlights */}
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {['99.9% deliverability rate', 'Setup dalam 5 menit', 'Dedicated IP tersedia'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#4ADE80" style={{ flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push('/register')}
                id="hero-cta-primary"
                className="rs-btn-primary w-full sm:w-auto"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Zap size={18} /> Mulai Gratis Sekarang
              </button>
              <button
                onClick={() => handleScroll('how-it-works')}
                id="hero-cta-secondary"
                className="rs-btn-outline w-full sm:w-auto"
                style={{ cursor: 'pointer' }}
              >
                Lihat Cara Kerja <ArrowRight size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Gratis hingga 1.000 email/bulan · Tidak perlu kartu kredit
            </p>
          </motion.div>

          {/* ── RIGHT ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Code block */}
            <div className="rs-code">
              <div className="rs-code__bar">
                <span className="rs-code__dot" style={{ background: '#FF5F57' }} />
                <span className="rs-code__dot" style={{ background: '#FFBD2E' }} />
                <span className="rs-code__dot" style={{ background: '#28CA41' }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>send-email.ts</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--orange)' }}>
                  <Send size={11} /> Live
                </span>
              </div>
              <div className="rs-code__body">
                {codeLines.map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', minHeight: '1.2rem' }}>
                    <span style={{ color: '#3A4A6A', fontSize: '0.65rem', width: '1rem', textAlign: 'right', flexShrink: 0, paddingTop: '0.05rem', userSelect: 'none' }}>
                      {i + 1}
                    </span>
                    <span style={{ color: line.c, whiteSpace: 'pre' }}>{line.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.l}
                  className="rs-card"
                  style={{ padding: '1rem', textAlign: 'center' }}
                >
                  <div className="rs-gradient-text" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.2rem' }}>{s.v}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.l}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.s}</div>
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
          style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
            Dipercaya oleh developer &amp; bisnis
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', opacity: 0.55 }}>
            {['Tokopedia', 'Bukalapak', 'Gojek', 'Traveloka', 'Shopee ID'].map((b) => (
              <span key={b} style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
