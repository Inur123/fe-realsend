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
          <CircleCheckIcon className="size-4 shrink-0 text-emerald-600" />
        ),
        info: (
          <InfoIcon className="size-4 shrink-0 text-blue-600" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 shrink-0 text-amber-600" />
        ),
        error: (
          <OctagonXIcon className="size-4 shrink-0 text-rose-600" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin shrink-0 text-slate-600" />
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
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-[0_12px_38px_rgba(15,23,42,0.12)] rounded-xl border p-4 flex gap-3 items-start",
          title: "font-semibold text-sm text-slate-900! group-[.toast-error-variant]:text-rose-950! group-[.toast-success-variant]:text-emerald-950! group-[.toast-warning-variant]:text-amber-955! group-[.toast-info-variant]:text-blue-955!",
          description: "text-xs text-slate-500! group-[.toast-error-variant]:text-rose-800/90! group-[.toast-success-variant]:text-emerald-800/90! group-[.toast-warning-variant]:text-amber-800/90! group-[.toast-info-variant]:text-blue-800/90! font-medium leading-relaxed mt-0.5",
          success: "group-[.toaster]:bg-emerald-50/95! group-[.toaster]:border-emerald-200! group-[.toaster]:text-emerald-900! toast-success-variant",
          error: "group-[.toaster]:bg-rose-50/95! group-[.toaster]:border-rose-200! group-[.toaster]:text-rose-900! toast-error-variant",
          info: "group-[.toaster]:bg-blue-50/95! group-[.toaster]:border-blue-200! group-[.toaster]:text-blue-900! toast-info-variant",
          warning: "group-[.toaster]:bg-amber-50/95! group-[.toaster]:border-amber-200! group-[.toaster]:text-amber-900! toast-warning-variant",
          closeButton: "group-[.toast]:bg-transparent group-[.toast]:text-slate-400 hover:group-[.toast]:text-slate-700 hover:group-[.toast]:bg-black/5 group-[.toast]:border-none group-[.toast]:shadow-none dark:hover:group-[.toast]:bg-white/10 group-[.toast]:right-2 group-[.toast]:top-2 group-[.toast]:left-auto",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
