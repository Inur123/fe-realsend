"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Globe,
  Plus,
  Clock,
  Search,
  RotateCcw,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { DomainsSkeleton } from "./skeleton";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function DomainsPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchDomains = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.domains.list();
      setDomains(list || []);
    } catch (err: any) {
      toast.error("Gagal mengambil daftar domain", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDomains();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDomains]);

  // Reset page to 1 when filter changes
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;

    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      toast.error("Format domain tidak valid", { description: "Gunakan format domain utama seperti example.com" });
      return;
    }

    try {
      const res = await api.domains.add(newDomain);
      toast.success("Domain berhasil ditambahkan", { description: `${newDomain} siap dikonfigurasi.` });
      setNewDomain("");
      setIsAddOpen(false);
      await fetchDomains();
      if (res && res.id) {
        router.push(`/dashboard/domains/${res.id}`);
      }
    } catch (err: any) {
      toast.error("Gagal menambahkan domain", { description: err.message });
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const filteredDomains = domains.filter((domain) => {
    const matchSearch =
      !search.trim() ||
      domain.domain_name.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && domain.status === "verified") ||
      (statusFilter === "pending" && domain.status !== "verified");

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredDomains.length / perPage) || 1;
  const paginatedDomains = filteredDomains.slice((page - 1) * perPage, page * perPage);

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

  if (loading) {
    return <DomainsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Domain Sending</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasikan SPF, DKIM, dan DMARC untuk otorisasi pengiriman email dari domain Anda.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer rounded-lg shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Tambah Domain Baru</DialogTitle>
              <DialogDescription>
                Masukkan domain utama organisasi atau bisnis Anda. Jangan gunakan http:// atau sub-path.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDomain} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="domain_name" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nama Domain
                </Label>
                <Input
                  id="domain_name"
                  placeholder="realsend.id"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                  required
                />
              </div>
              <DialogFooter className="pt-4 border-t border-slate-100">
                <Button type="submit" className="w-full h-11 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg cursor-pointer shadow-sm">
                  Hubungkan Domain
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {domains.length > 0 && (
        <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
          <div className="space-y-1.5 flex-2 min-w-[280px]">
            <Label htmlFor="search-domain" className="text-xs font-bold text-slate-500 tracking-wide">Cari Domain</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search-domain"
                type="text"
                placeholder="Cari domain..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 h-10 w-full"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <Label htmlFor="status-filter" className="text-xs font-bold text-slate-500 tracking-wide">Status</Label>
            <div>
              <Select value={statusFilter} onValueChange={(val) => {
                setStatusFilter(val || "all");
                setPage(1);
              }}>
                <SelectTrigger id="status-filter" className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200 rounded-lg">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending DNS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={search === "" && statusFilter === "all"}
              className="h-10 px-4 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-rose-650 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer text-sm font-semibold w-fit"
              title="Reset semua filter"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {domains.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-12 text-center">
          <Globe className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada Domain</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
            Hubungkan domain pengirim Anda terlebih dahulu sebelum menggunakan layanan SMTP kami.
          </p>
          <Button onClick={() => setIsAddOpen(true)} className="mt-6 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer rounded-lg shadow-sm">
            Tambah Domain Pertama
          </Button>
        </Card>
      ) : (
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                Daftar Domain Sending
              </CardTitle>
              <CardDescription>
                Menampilkan {filteredDomains.length} dari {domains.length} domain terdaftar.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDomains.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">No.</TableHead>
                      <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Nama Domain</TableHead>
                      <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Tanggal Ditambahkan</TableHead>
                      <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4 text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDomains.map((domain, idx) => (
                      <TableRow key={domain.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
                        <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">
                          {idx + 1 + (page - 1) * perPage}
                        </TableCell>
                        <TableCell className="py-4 font-bold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-slate-400" />
                            <span>{domain.domain_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {domain.status === "verified" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-250 uppercase tracking-wider">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-250 uppercase tracking-wider">
                              <Clock className="h-3 w-3 animate-pulse" />
                              Pending DNS
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-slate-400">
                          {formatDate(domain.created_at)}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              router.push(`/dashboard/domains/${domain.id}`);
                            }}
                            className="h-8 text-xs font-semibold border-slate-200 text-slate-650 hover:text-orange-500 hover:border-orange-200"
                          >
                            <Settings className="h-3.5 w-3.5 mr-1" />
                            Konfigurasi DNS
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-400 text-sm">
                Tidak ada domain ditemukan.
              </div>
            )}

            {totalPages > 1 && filteredDomains.length > 0 && (
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
