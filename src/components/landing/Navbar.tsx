'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/93 backdrop-blur-lg border-b border-slate-900/8' : 'bg-transparent backdrop-blur-none border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative flex items-center justify-between h-18">

        {/* Logo — gunakan gambar logo dan text realsend terpisah */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer shrink-0"
        >
          <Image
            src="/images/logo-realsend.png"
            alt="RealSend Logo Icon"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
            priority
            style={{ width: 'auto' }}
          />
          <Image
            src="/images/text-realsend.png"
            alt="RealSend Logo Text"
            width={110}
            height={30}
            className="h-7 w-auto object-contain"
            priority
            style={{ width: 'auto' }}
          />
        </button>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1"
        >
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleScroll(l.href)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-transparent border-0 cursor-pointer transition-all duration-200 hover:text-slate-900 hover:bg-slate-900/5"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-900/15 bg-transparent cursor-pointer transition-all duration-200 hover:text-slate-900 hover:border-slate-900/30"
          >
            Masuk
          </button>
          <button 
            onClick={() => router.push('/register')} 
            className="inline-flex items-center justify-center gap-2 rounded-lg font-bold text-white bg-linear-to-br from-[#F47920] to-[#D4661A] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 px-5 py-2 text-sm border-0 cursor-pointer"
          >
            <Zap size={15} />
            Mulai Gratis
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="flex md:hidden items-center justify-center p-2 bg-transparent border-0 cursor-pointer text-slate-600 overflow-hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="flex">
            {open ? <X size={22} /> : <Menu size={22} />}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="overflow-hidden border-t border-slate-900/8 bg-white/98 backdrop-blur-lg">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => { setOpen(false); handleScroll(l.href); }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-slate-600 text-left bg-transparent border-0 cursor-pointer hover:bg-slate-900/5 hover:text-slate-900 transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-900/8">
              <button 
                onClick={() => { setOpen(false); router.push('/login'); }} 
                className="px-4 py-3 text-center text-sm border border-slate-900/15 rounded-lg text-slate-600 bg-transparent cursor-pointer hover:text-slate-900 hover:border-slate-900/30 transition-all duration-200"
              >
                Masuk
              </button>
              <button 
                onClick={() => { setOpen(false); router.push('/register'); }} 
                className="inline-flex items-center justify-center gap-2 rounded-lg font-bold text-white bg-linear-to-br from-[#F47920] to-[#D4661A] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 px-4 py-3 text-sm border-0 cursor-pointer"
              >
                <Zap size={15} /> Mulai Gratis
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
