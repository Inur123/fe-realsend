'use client';

import { useState, SVGProps } from 'react';
import Image from 'next/image';
import { Mail, Send, Heart, Check } from 'lucide-react';

const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterXIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const footerLinks = {
  Produk: [
    { label: 'Fitur', href: '#features' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Developer: [
    { label: 'Dokumentasi', href: '#docs' },
    { label: 'API Reference', href: '#' },
    { label: 'SDK & Libraries', href: '#' },
    { label: 'Status Page', href: '#' },
  ],
};

const companyLinks = [
  { label: 'Tentang Kami', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Karir', href: '#' },
  { label: 'Kontak', href: '#' },
];

const legalLinks = [
  { label: 'Syarat Layanan', href: '#' },
  { label: 'Kebijakan Privasi', href: '#' },
  { label: 'Anti-Spam Policy', href: '#' },
  { label: 'SLA', href: '#' },
];

const socials = [
  { icon: GithubIcon, href: '#', label: 'GitHub' },
  { icon: TwitterXIcon, href: '#', label: 'Twitter/X' },
  { icon: Mail, href: 'mailto:hello@realsend.id', label: 'Email' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleScroll = (href: string) => {
    if (href.startsWith('#')) {
      const id = href.substring(1);
      if (!id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSocialClick = (href: string) => {
    if (href.startsWith('mailto:')) {
      window.location.assign(href);
    } else if (href && href !== '#') {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-linear-to-b from-slate-100 to-slate-300 relative overflow-hidden">
      


      {/* CSS Styles for premium link animations & form styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .footer-link {
          display: inline-block;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          transform: translateX(4px);
          color: #F47920 !important;
        }
        .newsletter-input:focus {
          border-color: rgba(244,121,32,0.5) !important;
          box-shadow: 0 0 15px rgba(244,121,32,0.1) !important;
          outline: none;
        }
        .footer-trust-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 1.15rem 1.25rem;
          transition: all 0.3s ease;
        }
        .footer-trust-card:hover {
          border-color: rgba(244,121,32,0.18);
          background: var(--bg-card);
        }
      `}} />

      {/* Subtle bottom glow */}
      <div className="absolute rounded-full blur-[100px] pointer-events-none w-[450px] h-[450px] bg-[#F47920]/3 bottom-[-200px] right-[5%]" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Row 1: Brand details and Newsletter Signup (top section) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-16 pb-12">
          
          <div className="max-w-md">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer shrink-0 mb-3"
            >
              <Image
                src="/images/logo-realsend.png"
                alt="RealSend Logo Icon"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
                style={{ width: 'auto' }}
              />
              <Image
                src="/images/text-realsend.png"
                alt="RealSend Logo Text"
                width={110}
                height={30}
                className="h-7 w-auto object-contain"
                style={{ width: 'auto' }}
              />
            </button>
            <p className="text-sm text-slate-605 leading-relaxed m-0">
              Infrastruktur SMTP berlatensi rendah yang dirancang khusus untuk keandalan dan kecepatan pengiriman email di Indonesia.
            </p>
          </div>

          {/* Newsletter subscription form */}
          <div className="w-full lg:w-auto max-w-sm">
            <h4 className="text-[0.75rem] font-bold text-slate-800 uppercase tracking-wide mb-2">
              Langganan Info & Tip
            </h4>
            <form onSubmit={handleSubscribe} className="relative w-full block">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email developer kamu..."
                className="newsletter-input w-full pl-3.5 pr-10 py-2.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-800 transition-all box-border"
                disabled={subscribed}
              />
              <button
                type="submit"
                disabled={subscribed}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md bg-[#F47920] border-0 text-white cursor-pointer flex items-center justify-center z-10 hover:bg-[#D4661A] transition-colors"
              >
                {subscribed ? (
                  <Check size={12} />
                ) : (
                  <Send size={12} />
                )}
              </button>
            </form>
            <p className="text-[0.6875rem] text-slate-500 mt-1.5 mb-0">
              Dapatkan update teknis & tips deliverability bulanan.
            </p>
          </div>

        </div>

        {/* Row 2: Grid of Links & Latency Card (balanced height columns) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-16 pb-16">
          
          {/* Column 1: Produk */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4 text-slate-800">
              Produk
            </h5>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.Produk.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => handleScroll(l.href)}
                    className="footer-link text-xs text-slate-600 bg-transparent border-0 cursor-pointer p-0 text-left font-inherit"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Developer */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4 text-slate-800">
              Developer
            </h5>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.Developer.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => handleScroll(l.href)}
                    className="footer-link text-xs text-slate-600 bg-transparent border-0 cursor-pointer p-0 text-left font-inherit"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Perusahaan */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4 text-slate-800">
              Perusahaan
            </h5>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => handleScroll(l.href)}
                    className="footer-link text-xs text-slate-600 bg-transparent border-0 cursor-pointer p-0 text-left font-inherit"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4 text-slate-800">
              Legal
            </h5>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => handleScroll(l.href)}
                    className="footer-link text-xs text-slate-600 bg-transparent border-0 cursor-pointer p-0 text-left font-inherit"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Row 3: Bottom Bar (Copyright, System status & Socials) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 pb-8">
          {/* Copyright - sits at bottom on mobile (order-2) and left on desktop (order-1) */}
          <p className="text-xs m-0 flex items-center justify-center gap-1 order-2 md:order-1 text-center text-slate-500">
            © 2025 RealSend. Dibuat dengan <Heart size={12} className="fill-[#EF4444] text-[#EF4444]" style={{ display: 'inline-block' }} /> oleh developer Indonesia.
          </p>

          {/* Details & Socials - sits at top on mobile (order-1) and right on desktop (order-2) */}
          <div className="flex gap-2.5 justify-center order-1 md:order-2">
            {socials.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSocialClick(s.href)}
                aria-label={s.label}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-900/10 hover:text-[#F47920] hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-200 text-slate-600 bg-slate-100 cursor-pointer p-0 outline-none"
              >
                <s.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
