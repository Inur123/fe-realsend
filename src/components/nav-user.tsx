"use client"

import * as React from "react"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import {
  ChevronsUpDownIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  LogOutIcon,
  UserIcon,
  ShieldCheckIcon,
  MailIcon,
  HomeIcon,
} from "lucide-react"

export function NavUser({
  user,
  logout,
}: {
  user: {
    name?: string
    full_name?: string
    email: string
    avatar?: string
    role: string
  }
  logout: () => void
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const isInAdmin = pathname?.startsWith("/admin") || false
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const displayName = user.full_name || user.name || "User"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const isAdmin = user.role === "admin" || user.role === "super_admin"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors outline-none cursor-pointer data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-900"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={displayName} />
              ) : null}
              <AvatarFallback className="rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 font-extrabold text-xs">
                {initials || <UserIcon className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-bold text-slate-800 dark:text-slate-200">
                {displayName}
              </span>
              <span className="truncate text-[11px] text-slate-400 font-medium">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-slate-400 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-800">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 font-extrabold text-xs">
                    {initials || <UserIcon className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-slate-800 dark:text-slate-200">
                    {displayName}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-900" />
            
            <DropdownMenuGroup className="space-y-0.5">
              {isAdmin && (
                <DropdownMenuItem
                  className="focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg py-2 cursor-pointer font-bold text-orange-600 focus:text-orange-700 dark:text-orange-400"
                  render={<Link href={isInAdmin ? "/dashboard" : "/admin"} />}
                  onClick={handleLinkClick}
                >
                  {isInAdmin ? (
                    <>
                      <MailIcon className="mr-2 h-4 w-4 text-orange-500" />
                      RealSend SMTP
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="mr-2 h-4 w-4 text-orange-500" />
                      Admin Console
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg py-2 cursor-pointer text-slate-700 dark:text-slate-300"
                render={<Link href="/" />}
                onClick={handleLinkClick}
              >
                <HomeIcon className="mr-2 h-4 w-4 text-slate-400" />
                Homepage
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg py-2 cursor-pointer text-slate-700 dark:text-slate-300"
                render={<Link href="/dashboard/settings" />}
                onClick={handleLinkClick}
              >
                <BadgeCheckIcon className="mr-2 h-4 w-4 text-slate-400" />
                Pengaturan Akun
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg py-2 cursor-pointer text-slate-700 dark:text-slate-300"
                render={<Link href="/dashboard/subscription" />}
                onClick={handleLinkClick}
              >
                <CreditCardIcon className="mr-2 h-4 w-4 text-slate-400" />
                Tagihan & Quota
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-900" />
            
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 rounded-lg py-2 cursor-pointer font-medium"
              onClick={logout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Keluar Layanan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
