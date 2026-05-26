/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  FileText,
  Search,
  Loader2,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  MousePointer,
  Clock,
  ExternalLink,
  Mail,
  Info,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [domainId, setDomainId] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch domains on mount
  useEffect(() => {
    let active = true;
    const fetchDomains = async () => {
      try {
        const domList = await api.domains.list();
        if (active) {
          setDomains(domList || []);
        }
      } catch {
        // ignore or handle silently
      }
    };
    const timer = setTimeout(() => {
      fetchDomains();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const fetchDomainsAndLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Fetch logs
      const params: any = {
        page,
        per_page: perPage,
      };
      if (searchQuery) params.search = searchQuery;
      if (status !== "all") params.status = status;
      if (domainId !== "all") params.domain_id = domainId;

      const res = await api.logs.list(params);
      setLogs(res.logs || []);
      setTotalLogs(res.total || 0);
    } catch (err: any) {
      toast.error("Gagal memuat log email", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, [page, status, domainId, searchQuery, perPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDomainsAndLogs();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDomainsAndLogs]);

  // Debounce search input to avoid API spamming
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleClearFilters = () => {
    setSearch("");
    setSearchQuery("");
    setStatus("all");
    setDomainId("all");
    setPage(1);
  };

  const totalPages = Math.ceil(totalLogs / perPage);

  const getStatusBadge = (logStatus: string) => {
    const badges: Record<string, { class: string; icon: any }> = {
      queued: { class: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200", icon: Clock },
      processing: { class: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200", icon: Loader2 },
      sent: { class: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-200", icon: Send },
      delivered: { class: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200", icon: CheckCircle2 },
      bounced: { class: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200", icon: AlertTriangle },
      failed: { class: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200", icon: XCircle },
      opened: { class: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200", icon: Eye },
      clicked: { class: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200", icon: MousePointer },
    };

    const b = badges[logStatus] || { class: "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200", icon: Info };
    const Icon = b.icon;

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${b.class}`}>
        <Icon className="h-3 w-3" />
        {logStatus}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Email Logs</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Lacak detail pengiriman, status bounce, metadata, dan pelacakan open/click email transaksional Anda.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
        {/* Search Input */}
        <div className="space-y-1.5 flex-2 min-w-[280px]">
          <Label htmlFor="search-log" className="text-xs font-bold text-slate-500 tracking-wide">Cari Email</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search-log"
              type="text"
              placeholder="Cari berdasarkan penerima atau subjek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 h-10 w-full"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <Label htmlFor="status-filter" className="text-xs font-bold text-slate-500 tracking-wide">Status</Label>
          <div>
            <Select value={status} onValueChange={(val) => {
              if (val) {
                setStatus(val);
                setPage(1);
              }
            }}>
              <SelectTrigger id="status-filter" className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200 rounded-lg">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="clicked">Clicked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Domain Filter */}
        <div className="space-y-1.5 flex-1 min-w-[180px]">
          <Label htmlFor="domain-filter" className="text-xs font-bold text-slate-500 tracking-wide">Domain Pengirim</Label>
          <div>
            <Select value={domainId} onValueChange={(val) => {
              if (val) {
                setDomainId(val);
                setPage(1);
              }
            }}>
              <SelectTrigger id="domain-filter" className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200 rounded-lg">
                <SelectValue placeholder="Semua Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Domain</SelectItem>
                {domains.map((dom) => (
                  <SelectItem key={dom.id} value={dom.id}>
                    {dom.domain_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={search === "" && status === "all" && domainId === "all"}
            className="h-10 px-4 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-rose-650 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer text-sm font-semibold w-fit"
            title="Reset semua filter"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </form>

      {/* Logs Table Card */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : logs.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Log Email Kosong</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
            Tidak ada catatan pengiriman email yang cocok dengan kriteria filter Anda saat ini.
          </p>
        </Card>
      ) : (
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                Log Pengiriman Email
              </CardTitle>
              <CardDescription>
                Menampilkan {((page - 1) * perPage) + 1} - {Math.min(page * perPage, totalLogs)} dari {totalLogs} log email.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4">Penerima</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Subjek</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Pengirim</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Waktu Pengiriman</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4 text-right pr-6">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log.id}
                      onClick={() => {
                        setSelectedLog(log);
                        setIsDetailOpen(true);
                      }}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900 cursor-pointer"
                    >
                      <TableCell className="pl-6 py-4 font-bold text-slate-800 dark:text-slate-200">{log.to_address}</TableCell>
                      <TableCell className="py-4 max-w-[200px] truncate text-slate-600 dark:text-slate-400">
                        {log.subject || "(tanpa subjek)"}
                      </TableCell>
                      <TableCell className="py-4">{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="py-4 font-mono text-xs text-slate-500">{log.from_address}</TableCell>
                      <TableCell className="py-4 text-slate-500">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className="h-8"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
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

      {/* Log Details Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-[550px] overflow-y-auto">
          {selectedLog && (
            <div className="space-y-6 py-4">
              <SheetHeader className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <SheetTitle className="text-lg font-bold text-slate-900">Detail Log Pengiriman</SheetTitle>
                    <SheetDescription className="text-xs text-slate-400 mt-1">ID: {selectedLog.id}</SheetDescription>
                  </div>
                  {getStatusBadge(selectedLog.status)}
                </div>
              </SheetHeader>

              {/* Recipient info card */}
              <div className="space-y-3 bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
                <div className="flex gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Subject</span>
                    <span className="font-bold text-slate-800 truncate">{selectedLog.subject || "(tanpa subjek)"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Penerima (To)</span>
                    <span className="font-mono text-slate-800 break-all">{selectedLog.to_address}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Pengirim (From)</span>
                    <span className="font-mono text-slate-800 break-all">{selectedLog.from_address}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline Status</h4>
                <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-3 before:w-0.5 before:bg-slate-100">
                  {/* Queued */}
                  <div className="flex gap-4 relative">
                    <div className="h-6.5 w-6.5 rounded-full bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center shrink-0 z-10">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Email Diterima Sistem (Queued)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDateTime(selectedLog.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Sent */}
                  {selectedLog.sent_at && (
                    <div className="flex gap-4 relative">
                      <div className="h-6.5 w-6.5 rounded-full bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center shrink-0 z-10">
                        <Send className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Dikirim via Relay SMTP (Sent)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDateTime(selectedLog.sent_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivered */}
                  {selectedLog.delivered_at && (
                    <div className="flex gap-4 relative">
                      <div className="h-6.5 w-6.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center shrink-0 z-10">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Diterima server tujuan (Delivered)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDateTime(selectedLog.delivered_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Opened */}
                  {selectedLog.opened_at && (
                    <div className="flex gap-4 relative">
                      <div className="h-6.5 w-6.5 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shrink-0 z-10">
                        <Eye className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Dibuka oleh penerima (Opened)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDateTime(selectedLog.opened_at)} (Terbuka {selectedLog.opened_count}x)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Clicked */}
                  {selectedLog.clicked_at && (
                    <div className="flex gap-4 relative">
                      <div className="h-6.5 w-6.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-500 flex items-center justify-center shrink-0 z-10">
                        <MousePointer className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Link dalam email diklik (Clicked)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDateTime(selectedLog.clicked_at)} (Diklik {selectedLog.clicked_count}x)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SMTP Response / Bounce info */}
              {(selectedLog.smtp_response || selectedLog.bounce_reason) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Respon Server (SMTP)</h4>
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    {selectedLog.smtp_response && (
                      <p className="text-emerald-400">{selectedLog.smtp_response}</p>
                    )}
                    {selectedLog.bounce_reason && (
                      <p className="text-red-400 mt-1">Bounce Reason: {selectedLog.bounce_reason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
