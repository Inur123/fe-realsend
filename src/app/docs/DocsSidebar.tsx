"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./sidebarItems";

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] overflow-y-auto pr-4 border-r border-slate-100 dark:border-slate-800">
      <div className="space-y-8">
        {sidebarItems.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {cat.category}
            </h4>
            <ul className="space-y-1">
              {cat.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border-0 ${
                        isActive
                          ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-bold"
                          : "bg-transparent text-slate-650 dark:text-slate-400 hover:bg-slate-900/5 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
