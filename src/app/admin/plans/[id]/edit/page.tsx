"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import PlanForm from "../../plan-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditPlanPage() {
  const { id } = useParams() as { id: string };
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      if (!id) return;
      try {
        const data = await api.admin.listPlans();
        const found = data.find((p: any) => p.id === id);
        if (!found) {
          toast.error("Paket tidak ditemukan.");
          return;
        }
        setPlan(found);
      } catch (err: any) {
        toast.error(err.message || "Gagal mengambil data paket.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl p-8">
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center p-8 text-slate-500 dark:text-slate-400">
        Data paket subscription tidak ditemukan atau telah dihapus.
      </div>
    );
  }

  return <PlanForm editingId={id} initialData={plan} />;
}
