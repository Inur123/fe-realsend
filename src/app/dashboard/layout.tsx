"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Loader2Icon, Sparkles } from "lucide-react";

const PLAN_FALLBACKS: Record<string, { daily_email_limit: number; name: string }> = {
  free: { daily_email_limit: 100, name: "Free" },
  starter: { daily_email_limit: 5000, name: "Starter" },
  growth: { daily_email_limit: 20000, name: "Growth" },
  pro: { daily_email_limit: 100000, name: "Pro" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [planLimits, setPlanLimits] = useState(PLAN_FALLBACKS);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    api.plans.list()
      .then((plans) => {
        const limits = plans.reduce((acc, plan) => {
          acc[plan.slug] = {
            daily_email_limit: plan.daily_email_limit,
            name: plan.name,
          };
          return acc;
        }, { ...PLAN_FALLBACKS } as typeof PLAN_FALLBACKS);
        setPlanLimits(limits);
      })
      .catch(() => {
        setPlanLimits(PLAN_FALLBACKS);
      });
  }, [isAuthenticated]);

  useEffect(() => {
    // Lock root and body scrolling to prevent elastic bounce on macOS/iOS
    document.documentElement.classList.add("overflow-hidden", "h-svh");
    document.body.classList.add("overflow-hidden", "h-svh");
    return () => {
      document.documentElement.classList.remove("overflow-hidden", "h-svh");
      document.body.classList.remove("overflow-hidden", "h-svh");
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2Icon className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sub = user?.subscription;
  const emailsSentToday = sub?.emails_sent_today || 0;
  const activePlanSlug = user?.plan_slug || "free";
  const dailyQuota = planLimits[activePlanSlug]?.daily_email_limit ?? PLAN_FALLBACKS.free.daily_email_limit;
  const quotaPercentage = dailyQuota === -1 ? 0 : Math.min((emailsSentToday / dailyQuota) * 100, 100);

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-full overflow-hidden">
        {/* Header — sticky: stays pinned while content scrolls */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 md:hidden" />
          </div>

          {/* Header Right Content: Quota & Plan Info */}
          <div className="flex items-center gap-6">
            {/* Daily Quota Indicator */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span>Quota Harian:</span>
                <span className="font-bold text-foreground">
                  {emailsSentToday.toLocaleString()} / {dailyQuota === -1 ? "Unlimited" : dailyQuota.toLocaleString()}
                </span>
              </div>
              <div className="w-36 h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${quotaPercentage}%` }}
                />
              </div>
            </div>

            {/* Plan Badge */}
            <div className="flex items-center gap-1.5 bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold shadow-sm select-none">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">
                {user?.plan_name || planLimits[activePlanSlug]?.name || "Free Plan"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto overscroll-y-none">
          <div className="w-full px-2 py-4 md:px-4 md:py-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
