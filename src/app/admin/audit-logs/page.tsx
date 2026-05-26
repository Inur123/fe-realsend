"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EyeIcon, ShieldAlert, Search, RotateCcw, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

interface AuditLog {
  id: string;
  actor_id: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string;
  ip_address: string;
  user_agent?: string;
  location?: string;
  created_at: string;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const perPage = 15;

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.admin.auditLogs({
        page,
        per_page: perPage,
      });
      setLogs(res.logs || []);
      setTotalLogs(res.total || 0);
      setTotalPages(Math.ceil(res.total / perPage) || 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat log audit.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  const handleClearFilters = () => {
    setSearch("");
    setTargetTypeFilter("all");
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !search.trim() ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor_email.toLowerCase().includes(search.toLowerCase());

    const matchTarget =
      targetTypeFilter === "all" ||
      log.target_type.toLowerCase() === targetTypeFilter.toLowerCase();

    return matchSearch && matchTarget;
  });

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Log Audit Sistem</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Rekaman aktivitas administratif lengkap mengenai perubahan paket subscription, status pengguna, role, dan konfigurasi platform.
          </p>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
          <div className="space-y-1.5 flex-2 min-w-[280px]">
            <Label htmlFor="search-log" className="text-xs font-bold text-slate-500 tracking-wide">Cari Aktivitas</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search-log"
                type="text"
                placeholder="Cari berdasarkan aksi atau email aktor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 h-10 w-full"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <Label htmlFor="target-filter" className="text-xs font-bold text-slate-500 tracking-wide">Tipe Target</Label>
            <div>
              <Select value={targetTypeFilter} onValueChange={(val) => setTargetTypeFilter(val || "all")}>
                <SelectTrigger id="target-filter" className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200 rounded-lg">
                  <SelectValue placeholder="Semua Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="plan">Plan</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={search === "" && targetTypeFilter === "all"}
              className="h-10 px-4 flex items-center justify-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-rose-650 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer text-sm font-semibold w-fit"
              title="Reset semua filter"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {loading && logs.length === 0 ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Tidak Ada Log Cocok</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
            Coba bersihkan filter pencarian atau ubah kategori tipe target yang Anda pilih.
          </p>
        </Card>
      ) : (
        <Card className={`border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 transition-opacity duration-200 ${loading ? "opacity-60 pointer-events-none" : ""}`}>
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                Daftar Riwayat Aktivitas Admin
              </CardTitle>
              <CardDescription>
                Menampilkan {filteredLogs.length} dari {totalLogs} total kejadian terekam.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="py-4 pl-6 font-semibold text-slate-500 dark:text-slate-400 w-16">No.</TableHead>
                    <TableHead className="py-4 font-semibold text-slate-500 dark:text-slate-400">Aksi / Event</TableHead>
                    <TableHead className="py-4 font-semibold text-slate-500 dark:text-slate-400">Aktor (Admin Email)</TableHead>
                    <TableHead className="py-4 font-semibold text-slate-500 dark:text-slate-400">Tipe Target</TableHead>
                    <TableHead className="py-4 font-semibold text-slate-500 dark:text-slate-400">Waktu Kejadian</TableHead>
                    <TableHead className="py-4 pr-6 text-right font-semibold text-slate-500 dark:text-slate-400">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, idx) => (
                    <TableRow
                      key={log.id}
                      className="border-b border-slate-100 text-sm hover:bg-slate-50/40 dark:border-slate-900 dark:hover:bg-slate-900/10"
                    >
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">
                        {idx + 1 + (page - 1) * perPage}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4 text-orange-500" />
                          <span>{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-slate-650 dark:text-slate-350 font-medium">
                        {log.actor_email || "System/Internal"}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="rounded-full border border-slate-250 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {log.target_type}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-400">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/audit-logs/${log.id}`)}
                          className="h-8 cursor-pointer border-slate-200 text-xs font-semibold text-slate-650 hover:border-orange-200 hover:text-orange-500"
                        >
                          <EyeIcon className="mr-1 h-3.5 w-3.5" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

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
      )}
    </div>
  );
}
