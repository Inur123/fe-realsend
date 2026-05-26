"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, LucideIcon } from "lucide-react"

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  label?: string
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const isPathActive = (url: string) => {
    if (url === "/dashboard" || url === "/admin") {
      return pathname === url
    }
    return pathname.startsWith(url)
  }

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] px-3 mb-2">{label}</SidebarGroupLabel>}
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const isCurrentActive = isPathActive(item.url)
          const isChildActive = item.items?.some((sub) => isPathActive(sub.url))
          const defaultOpen = item.isActive || isChildActive
          const Icon = item.icon

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isCurrentActive}
                  tooltip={item.title}
                  render={
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isCurrentActive
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false)
                        }
                      }}
                    />
                  }
                >
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isCurrentActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                  )}
                  <span className={isCurrentActive ? "text-orange-600 dark:text-orange-400" : ""}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={defaultOpen}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    isActive={isCurrentActive || isChildActive}
                    tooltip={item.title}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all outline-none ${
                      isCurrentActive || isChildActive
                        ? "bg-orange-500/5 text-orange-600 dark:text-orange-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  />
                }
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isCurrentActive || isChildActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                  )}
                  <span className={isCurrentActive || isChildActive ? "text-orange-600 dark:text-orange-400" : ""}>{item.title}</span>
                </div>
                <ChevronRightIcon className="ml-auto h-4 w-4 transition-transform duration-200 group-data-open/collapsible:rotate-90 text-slate-400" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-5 border-l border-slate-100 dark:border-slate-800/80 pl-2 mt-1 space-y-0.5">
                  {item.items?.map((subItem) => {
                    const isSubActive = isPathActive(subItem.url)
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isSubActive}
                          render={
                            <Link
                              href={subItem.url}
                              className={`flex items-center px-3 py-1.5 rounded-md text-xs transition-all ${
                                isSubActive
                                  ? "text-orange-600 dark:text-orange-400 font-bold bg-orange-500/5"
                                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
                              }`}
                              onClick={() => {
                                if (isMobile) {
                                  setOpenMobile(false)
                                }
                              }}
                            />
                          }
                        >
                          <span className={isSubActive ? "text-orange-600 dark:text-orange-400" : ""}>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
