"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PlusIcon, 
  Edit3Icon, 
  Trash2Icon
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthly_email_limit: number;
  daily_email_limit: number;
  rate_per_minute: number;
  max_domains: number;
  max_api_keys: number;
  max_webhooks: number;
  log_retention_days: number;
  price_monthly_idr: number;
  price_yearly_idr: number;
  overage_per_1k_idr: number;
  is_public: boolean;
  is_active: boolean;
  sort_order: number;
  badge_text: string;
  badge_color: string;
  features: string[];
}

export default function PlanManagementPage() {
  const [ConfirmDialog, confirm] = useConfirm();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.admin.listPlans();
      setPlans(list);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat daftar paket.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPlans();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPlans]);

  const handleDelete = async (plan: Plan) => {
    const confirmed = await confirm(
      "Hapus Paket?",
      `Apakah Anda yakin ingin menghapus paket "${plan.name}"? Pengguna terdaftar paket ini mungkin terdampak.`,
      "destructive"
    );
    if (!confirmed) return;

    try {
      await api.admin.deletePlan(plan.id);
      toast.success(`Paket "${plan.name}" berhasil dihapus.`);
      loadPlans();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus paket.");
    }
  };

  const totalPages = Math.ceil(plans.length / perPage) || 1;
  const paginatedPlans = plans
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice((page - 1) * perPage, page * perPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Kelola Paket Subscription
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi kuota, limitasi pengiriman, fitur premium, harga langganan, dan layout plan bagi pengguna.
          </p>
        </div>
        <Link 
          href="/admin/plans/new"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 self-start sm:self-center cursor-pointer shadow-md whitespace-nowrap flex items-center justify-center rounded-lg px-4 py-2 text-sm"
        >
          <PlusIcon className="h-4 w-4 shrink-0" />
          <span>Buat Paket Baru</span>
        </Link>
      </div>

      {/* Plans List Table */}
      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
            Konfigurasi Paket Terdaftar
          </CardTitle>
          <CardDescription>
            Menampilkan daftar paket langganan aktif yang terintegrasi di sistem billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-6">
              {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/30">
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">No.</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Nama Paket</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Harga Bulanan</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Kuota Email</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Domain/API/Webhooks</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Status & Visibilitas</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4 text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPlans.map((plan, idx) => (
                    <TableRow key={plan.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">
                        {(page - 1) * perPage + idx + 1}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          {plan.name}
                          {plan.badge_text && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-orange-100 text-orange-700">
                              {plan.badge_text}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5 max-w-xs truncate">
                          {plan.description || "Tidak ada deskripsi"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-slate-700 dark:text-slate-350">
                        {plan.price_monthly_idr === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Gratis</span>
                        ) : (
                          `Rp ${plan.price_monthly_idr.toLocaleString("id-ID")}`
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-600 dark:text-slate-400">
                        <div>Bln: {plan.monthly_email_limit === -1 ? "Tak Terbatas" : plan.monthly_email_limit.toLocaleString("id-ID")}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Harian: {plan.daily_email_limit === -1 ? "Tak Terbatas" : plan.daily_email_limit.toLocaleString("id-ID")}</div>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-500">
                        <div>Domain: {plan.max_domains === -1 ? "Tak Terbatas" : plan.max_domains}</div>
                        <div>API Keys: {plan.max_api_keys === -1 ? "Tak Terbatas" : plan.max_api_keys}</div>
                        <div>Webhooks: {plan.max_webhooks === -1 ? "Tak Terbatas" : plan.max_webhooks}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit ${
                            plan.is_active 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" 
                              : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                          }`}>
                            {plan.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit ${
                            plan.is_public 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" 
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}>
                            {plan.is_public ? "Publik" : "Private"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/plans/${plan.id}/edit`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "icon-sm" }),
                              "text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer h-8 w-8"
                            )}
                            title="Ubah Paket"
                          >
                            <Edit3Icon className="h-4 w-4" />
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            onClick={() => handleDelete(plan)}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer h-8 w-8"
                            title="Hapus Paket"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400 text-sm">
              Belum ada paket subscription terdaftar. Silakan buat paket baru.
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
              <span className="text-xs text-slate-400 font-semibold">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8"
                >
                  Sebelumnya
                </Button>
                {getPageNumbers().map((p, index) => {
                  if (p === "...") {
                    return (
                      <span key={`dots-${index}`} className="px-2 py-1 text-slate-400 text-sm select-none">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === page;
                  return (
                    <Button
                      key={p}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(Number(p))}
                      className={isCurrent ? "bg-orange-500! hover:bg-orange-600! text-white! border-orange-500! font-bold h-8 w-8 p-0" : "h-8 w-8 p-0"}
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog />
    </div>
  );
}
