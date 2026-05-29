"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
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
import Image from "next/image"
import { ChevronsUpDownIcon } from "lucide-react"

export interface TeamItem {
  name: string
  logo: React.ComponentType<{ className?: string }>
  plan: string
  url: string
  gradient: string
}

export function TeamSwitcher({
  teams,
}: {
  teams: TeamItem[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  // Detect active workspace console based on pathname
  const isAdminRoute = pathname.startsWith("/admin")
  const activeTeam = teams.find((t) => (isAdminRoute ? t.url.startsWith("/admin") : t.url.startsWith("/dashboard"))) || teams[0]

  const ActiveLogo = activeTeam.logo

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full text-left flex items-center gap-3 p-1.5 rounded-lg transition-all outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-900"
              />
            }
          >
            {activeTeam.url === "/dashboard" ? (
              <>
                {/* Expanded: show full Logo with Text (separated for custom sizing) */}
                <div className="flex items-center gap-2.5 flex-1 group-data-[collapsible=icon]:hidden min-w-0 px-0.5">
                  <Image
                    src="/images/logo-realsend.png"
                    alt="RealSend Logo"
                    width={43}
                    height={32}
                    priority
                    className="h-8 w-[43px] object-contain shrink-0"
                  />
                  <Image
                    src="/images/text-realsend.png"
                    alt="RealSend Text"
                    width={94}
                    height={24}
                    priority
                    className="h-6 w-[94px] object-contain dark:invert shrink-0"
                  />
                </div>
                {/* Collapsed: show only Icon */}
                <div className="hidden group-data-[collapsible=icon]:flex size-9 items-center justify-center rounded-lg bg-linear-to-tr from-orange-500 to-amber-500 shadow-md shrink-0">
                  <Image
                    src="/images/logo-realsend.png"
                    alt="RealSend Icon"
                    width={35}
                    height={26}
                    priority
                    className="h-[26px] w-[35px] object-contain"
                  />
                </div>
              </>
            ) : (
              <>
                <div className={`flex aspect-square size-8.5 items-center justify-center rounded-lg bg-linear-to-tr ${activeTeam.gradient} text-white shadow-sm shrink-0`}>
                  <ActiveLogo className="h-4.5 w-4.5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-black text-slate-800 dark:text-slate-100">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                    {activeTeam.plan}
                  </span>
                </div>
              </>
            )}
            {teams.length > 1 && (
              <ChevronsUpDownIcon className="ml-auto size-4 text-slate-400 group-data-[collapsible=icon]:hidden" />
            )}
          </DropdownMenuTrigger>

          {teams.length > 1 && (
            <DropdownMenuContent
              className="w-60 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1.5"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={8}
            >
              <DropdownMenuLabel className="px-2 py-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">
                Ganti Konsol Layanan
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-900 my-1" />
              <DropdownMenuGroup className="space-y-0.5">
                {teams.map((team) => {
                  const TeamLogo = team.logo
                  const isSelected = activeTeam.url === team.url
                  return (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => {
                        router.push(team.url)
                        if (isMobile) {
                          setOpenMobile(false)
                        }
                      }}
                      className={`gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "bg-slate-50 dark:bg-slate-900/60 font-bold"
                          : "focus:bg-slate-50 dark:focus:bg-slate-900"
                      }`}
                    >
                      {team.url === "/dashboard" ? (
                        <div className="flex size-7 items-center justify-center rounded-md bg-linear-to-tr from-orange-500 to-amber-500 shadow-sm shrink-0">
                          <Image
                            src="/images/logo-realsend.png"
                            alt="RealSend Logo"
                            width={24}
                            height={18}
                            className="h-[18px] w-[24px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className={`flex size-7 items-center justify-center rounded-md bg-linear-to-tr ${team.gradient} text-white shadow-sm shrink-0`}>
                          <TeamLogo className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-bold ${isSelected ? "text-orange-500" : "text-slate-700 dark:text-slate-300"}`}>
                          {team.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium tracking-wide">
                          {team.plan}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
