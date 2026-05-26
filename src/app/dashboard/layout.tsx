"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  const pathname = usePathname();
  const [planLimit, setPlanLimit] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    let active = true;

    const loadPlanLimits = async () => {
      try {
        const plans = await api.plans.list();
        if (!active) return;

        const activePlanSlug = user?.plan_slug || "free";
        const activePlan = plans?.find((plan) => plan.slug === activePlanSlug);
        const fallback = PLAN_FALLBACKS[activePlanSlug] || PLAN_FALLBACKS.free;
        setPlanLimit(activePlan?.daily_email_limit ?? fallback.daily_email_limit);
      } catch {
        if (!active) return;
        const activePlanSlug = user?.plan_slug || "free";
        const fallback = PLAN_FALLBACKS[activePlanSlug] || PLAN_FALLBACKS.free;
        setPlanLimit(fallback.daily_email_limit);
      }
    };

    if (isAuthenticated) {
      loadPlanLimits();
    }

    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.plan_slug]);

  // Generate dynamic breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string; isCurrent?: boolean }[] = [];

    const labelMap: Record<string, string> = {
      dashboard: "Dashboard",
      domains: "Domain Sending",
      "api-keys": "API Keys",
      webhooks: "Webhooks",
      logs: "Email Logs",
      settings: "Settings",
      profile: "Profil Pengguna",
      security: "Keamanan & Password",
      billing: "Subscription & Billing",
    };

    crumbs.push({ label: "Dashboard", href: "/dashboard" });

    if (segments.length > 1) {
      let currentHref = "";
      for (let i = 1; i < segments.length; i += 1) {
        currentHref += `/${segments[i]}`;
        const segment = segments[i];
        crumbs.push({
          label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          href: `/dashboard${currentHref}`,
          isCurrent: i === segments.length - 1,
        });
      }
      crumbs[0].isCurrent = false;
    } else {
      crumbs[0].isCurrent = true;
    }

    return crumbs;
  };

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

  const crumbs = getBreadcrumbs();
  const sub = user?.subscription;
  const emailsSentToday = sub?.emails_sent_today || 0;
  const activePlanSlug = user?.plan_slug || "free";
  const dailyQuota = planLimit || PLAN_FALLBACKS[activePlanSlug]?.daily_email_limit || PLAN_FALLBACKS.free.daily_email_limit;
  const quotaPercentage = Math.min((emailsSentToday / dailyQuota) * 100, 100);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header — sticky: stays pinned while content scrolls */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator
              orientation="vertical"
              className="mx-2 h-4 md:hidden"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.href}>
                    {idx > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isCurrent ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={crumb.href} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header Right Content: Quota & Plan Info */}
          <div className="flex items-center gap-6">
            {/* Daily Quota Indicator */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span>Quota Harian:</span>
                <span className="font-bold text-foreground">
                  {emailsSentToday.toLocaleString()} / {dailyQuota.toLocaleString()}
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
                {user?.plan_name || PLAN_FALLBACKS[activePlanSlug]?.name || "Free Plan"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="w-full px-2 py-4 md:px-4 md:py-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
