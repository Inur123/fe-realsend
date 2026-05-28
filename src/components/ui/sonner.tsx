"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      icons={{
        success: (
          <CircleCheckIcon className="size-4 shrink-0 text-[#F47920]" />
        ),
        info: (
          <InfoIcon className="size-4 shrink-0 text-[#F47920]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 shrink-0 text-[#F47920]" />
        ),
        error: (
          <OctagonXIcon className="size-4 shrink-0 text-[#F47920]" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin shrink-0 text-[#F47920]" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--bg-card)",
          "--normal-text": "var(--text-primary)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-[#F47920]/60 group-[.toaster]:shadow-[0_12px_38px_rgba(15,23,42,0.12)] rounded-xl border p-4 flex gap-3 items-start",
          title: "font-semibold text-sm text-[#F47920]!",
          description: "text-xs text-[#F47920]/80! font-medium leading-relaxed mt-0.5",
          success: "group-[.toaster]:bg-white! group-[.toaster]:border-[#F47920]/80! group-[.toaster]:text-[#F47920]! toast-success-variant",
          error: "group-[.toaster]:bg-white! group-[.toaster]:border-[#F47920]/80! group-[.toaster]:text-[#F47920]! toast-error-variant",
          info: "group-[.toaster]:bg-white! group-[.toaster]:border-[#F47920]/80! group-[.toaster]:text-[#F47920]! toast-info-variant",
          warning: "group-[.toaster]:bg-white! group-[.toaster]:border-[#F47920]/80! group-[.toaster]:text-[#F47920]! toast-warning-variant",
          closeButton: "group-[.toast]:bg-white! group-[.toast]:text-[#F47920]! group-[.toast]:border-[#F47920]! group-[.toast]:border! group-[.toast]:shadow-none hover:group-[.toast]:bg-[#F47920]/10 hover:group-[.toast]:text-[#F47920]! group-[.toast]:right-2 group-[.toast]:top-2 group-[.toast]:left-auto",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
