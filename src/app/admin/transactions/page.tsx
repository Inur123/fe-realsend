"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  RotateCcw,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { formatPaymentChannel } from "@/lib/payment-channel";
import { useRouter } from "next/navigation";
import { TransactionListSkeleton } from "./skeleton";

interface Transaction {
  id: string;
  user_id: string;
  subscription_id: string | null;
  plan_id: string | null;
  billing_cycle: string;
  amount_idr: number;
  payment_method: string;
  external_id: string;
  status: "paid" | "pending" | "failed" | "expired" | "refunded";
  invoice_number: string;
  invoice_url: string;
  paid_at: string | null;
  created_at: string;
  user_email: string;
  user_name: string;
  plan_name: string;
}

interface Stats {
  total_volume_idr: number;
  total_count: number;
  paid_count: number;
  pending_count: number;
  failed_count: number;
}

const formatShortInvoice = (invoiceNumber?: string | null) => {
  if (!invoiceNumber) return "RealSend Draft";
  if (invoiceNumber.length <= 18) return invoiceNumber;
  return `${invoiceNumber.slice(0, 17)}...`;
};

export default function TransactionsListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_volume_idr: 0,
    total_count: 0,
    paid_count: 0,
    pending_count: 0,
    failed_count: 0,
  });

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.admin.getTransactions({
        page,
        per_page: perPage,
        search: search.trim(),
        status: selectedStatus === "all" ? "" : selectedStatus,
      });
      setTransactions(res.transactions);
      setStats(res.stats);
      setTotalCount(res.total);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data transaksi.");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedStatus]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / perPage) || 1;

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

  if (loading && transactions.length === 0) {
    return <TransactionListSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-orange-500" />
          <span>Kelola Transaksi</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Daftar seluruh transaksi pembayaran paket langganan RealSend, volume
          penjualan, invoice, dan status bayar.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Volume
            </CardTitle>
            <span className="text-xs font-extrabold text-emerald-500 dark:text-emerald-400">
              Rp
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              Rp {stats.total_volume_idr.toLocaleString("id-ID")}
            </div>
            <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Pendapatan berhasil</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Transaksi
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.total_count}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Keseluruhan pembayaran
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pembayaran Berhasil
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.paid_count}
            </div>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">
              Status Paid
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Menunggu Pembayaran
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.pending_count}
            </div>
            <p className="text-[10px] text-amber-500 font-medium mt-1">
              Status Pending
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pembayaran Gagal
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.failed_count}
            </div>
            <p className="text-[10px] text-rose-400 mt-1">
              Expired, Failed, Refunded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Actions & Search */}
      <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
        {/* Search Input */}
        <div className="space-y-1.5 flex-2 min-w-[280px]">
          <Label
            htmlFor="search-tx"
            className="text-xs font-bold text-slate-500 tracking-wide"
          >
            Cari Transaksi
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search-tx"
              type="text"
              placeholder="Cari transaksi berdasarkan invoice, email, nama..."
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

        {/* Status Filter */}
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <Label
            htmlFor="status-filter"
            className="text-xs font-bold text-slate-500 tracking-wide"
          >
            Status
          </Label>
          <div>
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                if (val) {
                  setSelectedStatus(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger
                id="status-filter"
                className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200"
              >
                <SelectValue placeholder="Status: Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="paid">Paid (Berhasil)</SelectItem>
                <SelectItem value="pending">Pending (Menunggu)</SelectItem>
                <SelectItem value="failed">Failed (Gagal)</SelectItem>
                <SelectItem value="expired">Expired (Kedaluwarsa)</SelectItem>
                <SelectItem value="refunded">
                  Refunded (Dikembalikan)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Filter Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={search === "" && selectedStatus === "all"}
            className="h-10 px-4 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-rose-650 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer text-sm font-semibold w-fit"
            title="Reset semua filter"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Transactions Table Card */}
      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
              Data Transaksi RealSend
            </CardTitle>
            <CardDescription>
              Menampilkan {transactions.length} dari {totalCount} transaksi{" "}
              {selectedStatus !== "all" && `(difilter)`}.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/30">
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">
                      No.
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Nomor Invoice
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Pengguna
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Paket
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Total IDR
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Channel
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                      Tanggal
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4 text-right pr-6">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, idx) => (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900"
                    >
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">
                        {(page - 1) * perPage + idx + 1}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-slate-800 dark:text-slate-200">
                        <span
                          className="block max-w-[170px] truncate"
                          title={tx.invoice_number || "RealSend Draft"}
                        >
                          {formatShortInvoice(tx.invoice_number)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-slate-700 dark:text-slate-350">
                          {tx.user_name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {tx.user_email}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-slate-650 dark:text-slate-300">
                        {tx.plan_name || "Custom Plan"}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-slate-900 dark:text-white">
                        Rp {tx.amount_idr.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-xs text-slate-650 dark:text-slate-350 capitalize">
                        {formatPaymentChannel(tx.payment_method)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                            tx.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : tx.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {tx.status === "paid" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {tx.status === "pending" && (
                            <Clock className="h-3 w-3 animate-pulse" />
                          )}
                          {tx.status !== "paid" && tx.status !== "pending" && (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-400">
                        {formatDate(tx.created_at)}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/transactions/${tx.id}`)
                          }
                          className="h-8 w-8 border-slate-200 text-slate-600 hover:text-orange-500 hover:border-orange-200 shadow-xs"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400 text-sm">
              Tidak ada data transaksi ditemukan.
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
                      <span
                        key={`dots-${index}`}
                        className="px-2 py-1 text-slate-400 text-sm select-none"
                      >
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
                      className={
                        isCurrent
                          ? "bg-orange-500! hover:bg-orange-600! text-white! border-orange-500! font-bold h-8 w-8 p-0"
                          : "h-8 w-8 p-0"
                      }
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
    </div>
  );
}
