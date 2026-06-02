"use client"

import { Loader2Icon } from "lucide-react"

export function FullPageLoading() {
  return (
    <main className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-white">
      <Loader2Icon className="h-8 w-8 animate-spin text-[#FF7A1A]" />
    </main>
  )
}
