"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { FullPageLoading } from "@/components/full-page-loading";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role !== "admin" && user?.role !== "super_admin") {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

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
    return <FullPageLoading />;
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "super_admin")) {
    return null;
  }

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-full overflow-hidden">
        {/* Header — sticky: stays pinned while content scrolls */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 md:hidden" />
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto overscroll-y-none">
          <div className="w-full px-2 py-4 md:px-4 md:py-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
