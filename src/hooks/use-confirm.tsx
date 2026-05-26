"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2Icon, AlertTriangleIcon } from "lucide-react"

export function useConfirm() {
  const [state, setState] = useState<{
    resolve: ((value: boolean) => void) | null
    title: string
    description: string
    variant?: "destructive" | "default"
    actionLabel?: string
  }>({
    resolve: null,
    title: "",
    description: "",
  })

  const confirm = (
    title: string,
    description: string,
    variant: "destructive" | "default" = "destructive",
    actionLabel: string = "Hapus"
  ) => {
    return new Promise<boolean>((resolve) => {
      setState({
        resolve,
        title,
        description,
        variant,
        actionLabel,
      })
    })
  }

  const handleClose = () => {
    setState((prev) => ({ ...prev, resolve: null }))
  }

  const handleCancel = () => {
    if (state.resolve) state.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    if (state.resolve) state.resolve(true)
    handleClose()
  }

  const ConfirmDialogComponent = () => (
    <AlertDialog open={state.resolve !== null} onOpenChange={(open) => { if (!open) handleCancel() }}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className={state.variant === "destructive" ? "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive" : "bg-[#F47920]/10 text-[#F47920]"}>
            {state.variant === "destructive" ? <Trash2Icon className="h-5 w-5" /> : <AlertTriangleIcon className="h-5 w-5" />}
          </AlertDialogMedia>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {state.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" onClick={handleCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            variant={state.variant === "destructive" ? "destructive" : "default"} 
            className={state.variant !== "destructive" ? "bg-[#F47920] hover:bg-[#D4661A] text-white" : ""}
            onClick={handleConfirm}
          >
            {state.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return [ConfirmDialogComponent, confirm] as const
}
