"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Lock, AlertOctagon, HeartHandshake } from "lucide-react";

export default function LegalSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { path: "/legal/terms", label: "Syarat Layanan", icon: FileText },
    { path: "/legal/privacy", label: "Kebijakan Privasi", icon: Lock },
    { path: "/legal/anti-spam", label: "Anti-Spam Policy", icon: AlertOctagon },
    { path: "/legal/sla", label: "SLA (Service Level)", icon: HeartHandshake },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Dokumen Hukum
        </h3>
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                      : "bg-transparent text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
