"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher, TeamItem } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Globe,
  Key,
  Webhook,
  FileText,
  Settings,
  CreditCard,
  Users,
  Package,
  ArrowLeft,
  Send,
  Shield,
  X,
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()

  const isAdminRoute = pathname.startsWith("/admin")

  // Generate workspaces switcher items based on user roles
  const teams: TeamItem[] = [
    {
      name: "RealSend SMTP",
      logo: Send,
      plan: "SMTP Server",
      url: "/dashboard",
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  const isUserAdmin = user?.role === "admin" || user?.role === "super_admin"

  if (isUserAdmin) {
    teams.push({
      name: "Admin Console",
      logo: Shield,
      plan: "Admin Panel",
      url: "/admin",
      gradient: "from-rose-500 to-red-600",
    })
  }

  // User Dashboard navigation sections
  const deliveryItems = [
    { title: "Dashboard Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Domain Sending", url: "/dashboard/domains", icon: Globe },
    { title: "Email Logs", url: "/dashboard/email-logs", icon: FileText },
  ]

  const developerItems = [
    { title: "API Keys", url: "/dashboard/api-keys", icon: Key },
    { title: "Webhooks", url: "/dashboard/webhooks", icon: Webhook },
  ]

  const accountItems = [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        { title: "Profil Pengguna", url: "/dashboard/settings/profile" },
        { title: "Keamanan & Password", url: "/dashboard/settings/security" },
      ],
    },
    { title: "Subscription Plan", url: "/dashboard/subscription", icon: CreditCard },
    { title: "Billing & Invoices", url: "/dashboard/billing", icon: FileText },
  ]

  // Admin Dashboard navigation sections
  const adminMainItems = [
    { title: "Admin Overview", url: "/admin", icon: LayoutDashboard },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Plan Management", url: "/admin/plans", icon: Package },
  ]

  const adminSystemItems = [
    { title: "Audit Logs", url: "/admin/audit-logs", icon: FileText },
  ]

  const adminNavigationItems = [
    { title: "Back to Dashboard", url: "/dashboard", icon: ArrowLeft },
  ]

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      {/* Header with Switcher */}
      <SidebarHeader className="border-b border-slate-100 dark:border-slate-900 px-3 py-4 flex flex-row items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <TeamSwitcher teams={teams} />
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer shrink-0"
            onClick={() => setOpenMobile(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </SidebarHeader>

      {/* Main Content Sections */}
      <SidebarContent className="py-2">
        {isAdminRoute ? (
          <>
            <NavMain label="Administrasi" items={adminMainItems} />
            <NavMain label="Monitoring Sistem" items={adminSystemItems} />
            <NavMain label="Navigasi" items={adminNavigationItems} />
          </>
        ) : (
          <>
            <NavMain label="Email Delivery" items={deliveryItems} />
            <NavMain label="Developer Tools" items={developerItems} />
            <NavMain label="Account & System" items={accountItems} />
          </>
        )}
      </SidebarContent>

      {/* Footer Profile Dropdown */}
      <SidebarFooter className="border-t border-slate-100 dark:border-slate-900 p-3">
        {user ? (
          <NavUser user={user} logout={logout} />
        ) : (
          <div className="flex h-12 w-full items-center justify-center">
            <span className="text-xs text-slate-400">Loading user...</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
