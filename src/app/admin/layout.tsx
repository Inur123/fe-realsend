"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
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
import { Loader2Icon, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role !== "admin" && user?.role !== "super_admin") {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Generate dynamic breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string; isCurrent?: boolean }[] = [];

    crumbs.push({ label: "Admin Console", href: "/admin" });

    if (segments.length <= 1) {
      crumbs[0].isCurrent = true;
      return crumbs;
    }

    const labelFor = (segment: string, index: number) => {
      if (segment === "users") return "User Management";
      if (segment === "plans") return "Plan Management";
      if (segment === "audit-logs") return "System Audit Logs";
      if (segment === "analytics") return "Analytics";
      if (segment === "detail") return "Detail";
      if (index > 1 && segments[index - 1] === "audit-logs") return "Detail";
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    };

    let href = "";
    segments.slice(1).forEach((segment, index) => {
      href += `/${segment}`;
      crumbs.push({
        label: labelFor(segment, index + 1),
        href: `/admin${href}`,
        isCurrent: index === segments.slice(1).length - 1,
      });
    });

    if (crumbs.length > 1) {
      crumbs[crumbs.length - 1].isCurrent = true;
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

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "super_admin")) {
    return null;
  }

  const crumbs = getBreadcrumbs();

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

          {/* Header Right Content */}
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold shadow-sm select-none">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">
              {user.role} console
            </span>
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
