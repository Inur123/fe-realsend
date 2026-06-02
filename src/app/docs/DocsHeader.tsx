"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Menu, X, Zap, LayoutDashboard } from "lucide-react";
import { sidebarItems } from "./sidebarItems";
import { useAuth } from "@/context/AuthContext";

export default function DocsHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/93 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto h-14 sm:h-16 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo-realsend.png"
                alt="RealSend Logo Icon"
                width={38}
                height={28}
                className="h-7 w-[38px] object-contain"
                priority
              />
              <Image
                src="/images/text-realsend.png"
                alt="RealSend Logo Text"
                width={94}
                height={24}
                className="h-6 w-[94px] object-contain"
                priority
              />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="h-4 w-4 text-orange-500" />
              <span>Dokumentasi</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex lg:hidden items-center justify-center h-8 w-8 sm:h-9 sm:w-9 bg-transparent border-0 cursor-pointer text-slate-600"
              aria-label="Buka menu dokumentasi"
            >
              <Menu size={20} />
            </button>

            {isLoading ? (
              <button
                disabled
                className="hidden sm:inline-flex h-8 sm:h-9 items-center text-[11px] sm:text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-3.5 rounded-lg cursor-wait"
              >
                Memuat
              </button>
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex h-8 sm:h-9 items-center text-[11px] sm:text-xs font-bold text-white bg-linear-to-br from-[#F47920] to-[#D4661A] hover:brightness-110 px-3 sm:px-3.5 rounded-lg gap-1.5 shadow-xs transition-all border-0"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex h-8 sm:h-9 items-center text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 px-3 sm:px-3.5 rounded-lg transition-all"
                >
                  Masuk
                </Link>

                <Link
                  href="/register"
                  className="hidden sm:inline-flex h-8 sm:h-9 items-center text-[11px] sm:text-xs font-bold text-white bg-linear-to-br from-[#F47920] to-[#D4661A] hover:brightness-110 px-3 sm:px-3.5 rounded-lg gap-1 shadow-xs transition-all border-0"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Mulai Gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu dokumentasi"
          />
          <div className="absolute top-0 right-0 h-full w-[86%] max-w-xs bg-white dark:bg-slate-950 border-l border-slate-200/80 dark:border-slate-800/80 shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dokumentasi</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md text-slate-600 hover:text-slate-900"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {sidebarItems.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                    {cat.category}
                  </h4>
                  <ul className="space-y-1">
                    {cat.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          onClick={() => setMobileOpen(false)}
                          className="block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border-0 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-900/5 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
