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
    <section
      id="stats"
      className="py-8 md:py-10 relative overflow-hidden bg-[linear-gradient(rgba(100,130,200,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(100,130,200,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"
    >
      <div className="absolute rounded-full blur-[110px] pointer-events-none w-[500px] h-[500px] bg-slate-900/3 top-[30%] -right-[10%]" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* ── Stats header ── */}
        <div className="text-center mb-10">
          <span className="block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#F47920] mb-3">Angka Nyata</span>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight text-slate-800 mb-5">Dipercaya Ribuan Developer</h2>
        </div>

        {/* ── Stats grid ── */}
        <div ref={ref} className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] text-center"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.09 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border mx-auto mb-3"
                style={{ background: s.bg, borderColor: s.br }}
              >
                <s.icon size={18} color={s.clr} />
              </div>
              <div className="text-3xl font-black mb-1" style={{ color: s.clr }}>
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[0.8125rem] font-bold text-slate-800 mb-1">{s.label}</div>
              <div className="text-[0.72rem] text-slate-500">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Testimonials header ── */}
        <div className="text-center mb-10">
          <span className="block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#F47920] mb-3">Testimoni</span>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight text-slate-800 mb-5">Apa Kata Mereka?</h2>
        </div>

        {/* ── Testimonials Auto-scroll Carousel ── */}
        <div 
          className="flex flex-col gap-6 overflow-hidden relative w-full py-2"
          style={{
            maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
          }}
        >
          
          {/* Row 1: scrolling left */}
          <Marquee speed={40} direction="left" pauseOnHover={true} gradient={false}>
            {testimonialsRow1.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] flex flex-col gap-4 w-[clamp(18rem,85vw,24rem)] shrink-0 whitespace-normal mr-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={13} fill="#F47920" color="#F47920" />
                  ))}
                </div>
                <p className="text-[0.8375rem] text-slate-600 leading-relaxed flex-1 m-0">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200 mt-2">
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0"
                    style={{ background: t.clr }}
                  >
                    {t.av}
                  </div>
                  <div>
                    <p className="text-[0.85rem] font-bold text-slate-800 m-0">{t.name}</p>
                    <p className="text-[0.7rem] text-slate-500 m-0">{t.role}</p>
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
                className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] flex flex-col gap-4 w-[clamp(18rem,85vw,24rem)] shrink-0 whitespace-normal mr-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={13} fill="#F47920" color="#F47920" />
                  ))}
                </div>
                <p className="text-[0.8375rem] text-slate-600 leading-relaxed flex-1 m-0">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200 mt-2">
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0"
                    style={{ background: t.clr }}
                  >
                    {t.av}
                  </div>
                  <div>
                    <p className="text-[0.85rem] font-bold text-slate-800 m-0">{t.name}</p>
                    <p className="text-[0.7rem] text-slate-500 m-0">{t.role}</p>
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
