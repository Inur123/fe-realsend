'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Fitur', href: '#features' },
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Harga', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

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

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.3s, border-color 0.3s',
        background: scrolled ? 'rgba(255, 255, 255, 0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid transparent',
      }}
    >
      <div className="rs-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>

        {/* Logo — gunakan gambar asli logo-text-realsend */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Image
            src="/images/logo-text-realsend.png"
            alt="RealSend Logo"
            width={140}
            height={45}
            style={{ height: '2.8rem', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </button>

        {/* Desktop nav */}
        <nav
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            alignItems: 'center',
            gap: '0.25rem'
          }}
          className="hidden md:flex"
        >
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleScroll(l.href)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; (e.target as HTMLElement).style.background = 'rgba(15, 23, 42, 0.05)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{ alignItems: 'center', gap: '0.75rem' }} className="hidden md:flex">
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.625rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              border: '1.5px solid rgba(15, 23, 42, 0.15)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; (e.target as HTMLElement).style.borderColor = 'rgba(15, 23, 42, 0.3)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; (e.target as HTMLElement).style.borderColor = 'rgba(15, 23, 42, 0.15)'; }}
          >
            Masuk
          </button>
          <button onClick={() => router.push('/register')} className="rs-btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
            <Zap size={15} />
            Mulai Gratis
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="flex md:hidden items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ 
            padding: '0.5rem', 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-secondary)',
            overflow: 'hidden'
          }}
        >
          <motion.div
            key={open ? 'open' : 'closed'}
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ display: 'flex' }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="rs-wrap" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => { setOpen(false); handleScroll(l.href); }}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '0.5rem', 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: 'var(--text-secondary)', 
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {l.label}
                </button>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
                <button 
                  onClick={() => { setOpen(false); router.push('/login'); }} 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    textAlign: 'center', 
                    fontSize: '0.875rem', 
                    border: '1.5px solid rgba(15, 23, 42, 0.15)', 
                    borderRadius: '0.625rem', 
                    color: 'var(--text-secondary)', 
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  Masuk
                </button>
                <button 
                  onClick={() => { setOpen(false); router.push('/register'); }} 
                  className="rs-btn-primary" 
                  style={{ fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                >
                  <Zap size={15} /> Mulai Gratis
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
