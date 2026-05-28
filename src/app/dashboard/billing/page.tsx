"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Printer,
  Copy,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Loader2,
  ArrowUpRight,
  ShieldAlert,
  Search,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatInvoiceDateTime } from "@/lib/utils";
import { BillingSkeleton } from "./skeleton";

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const handledPaymentStatus = useRef(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Renewal & Checkout states
  const [overview, setOverview] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [yearly, setYearly] = useState(true);

  const perPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(Date.now());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Check query params for midtrans callback status
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const orderId = params.get("order_id") || params.get("orderId");

      if (payment === "success" && orderId && !handledPaymentStatus.current) {
        handledPaymentStatus.current = true;
        toast.info("Mengecek pembayaran Midtrans", {
          description: "Kami sedang menyinkronkan status transaksi terbaru.",
        });
        try {
          const syncedPayment = await api.billing.sync(orderId);
          if (syncedPayment?.status === "paid") {
            toast.success("Pembayaran berhasil", {
              description: "Paket kamu sudah aktif.",
            });
            await refreshUser();
          } else if (syncedPayment?.status === "pending") {
            toast.info("Pembayaran masih pending", {
              description:
                "Selesaikan pembayaran di Midtrans, lalu kembali ke halaman ini.",
            });
          }
        } catch (err: any) {
          toast.warning("Belum bisa sinkron otomatis", {
            description:
              err?.message ||
              "Webhook Midtrans atau simulator lokal masih bisa memproses pembayaran ini.",
          });
        }
      }

      const [plansList, invoicesData, billingOverview] = await Promise.all([
        api.plans.list(),
        api.billing.invoices({ page: 1, per_page: 100 }), // Load up to 100 invoices for local filtering
        api.billing.current(),
      ]);
      setPlans(plansList || []);
      setInvoices(invoicesData.invoices || []);
      setOverview(billingOverview || null);
    } catch (err: any) {
      toast.error("Gagal memuat data billing", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  // Real-time polling when there is a pending invoice
  useEffect(() => {
    const pendingInvoice = invoices.find((inv: any) => inv.status === "pending");
    if (!pendingInvoice) return;

    const interval = setInterval(async () => {
      try {
        const syncedPayment = await api.billing.sync(pendingInvoice.external_id);
        if (syncedPayment?.status === "paid") {
          toast.success("Pembayaran berhasil disinkronkan", {
            description: "Paket Anda telah aktif secara real-time!",
          });
          await refreshUser();
          loadTransactions(); // Reload transactions lists
        }
      } catch {
        // Fail silently during background polling
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [invoices, loadTransactions, refreshUser]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error("Paket belum dipilih");
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        plan_id: selectedPlan.id,
        billing_cycle: yearly ? "yearly" : "monthly",
      };
      const result = await api.billing.checkout(payload);
      toast.success("Arahkan ke Midtrans Sandbox");
      window.location.href = result.redirect_url;
      await refreshUser();
    } catch (err: any) {
      toast.error("Gagal memulai pembayaran", { description: err.message });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPlan(null);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-[#4ADE80]">
            <CheckCircle className="h-3 w-3" /> Sukses
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-[#FBBF24]">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-[#F87171]">
            <AlertTriangle className="h-3 w-3" /> Gagal
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-500">
            {status}
          </span>
        );
    }
  };

  // Calculations based on loaded items
  const totalSpent = invoices
    .filter((inv: any) => inv.status === "paid")
    .reduce((sum: number, inv: any) => sum + (inv.amount_idr || 0), 0);

  const totalSuccess = invoices.filter(
    (inv: any) => inv.status === "paid",
  ).length;
  const totalPending = invoices.filter(
    (inv: any) => inv.status === "pending",
  ).length;

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      !search.trim() ||
      (inv.invoice_number &&
        inv.invoice_number.toLowerCase().includes(search.toLowerCase())) ||
      (inv.external_id &&
        inv.external_id.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / perPage) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (page - 1) * perPage,
    page * perPage,
  );

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

  // Renewal eligibility check (H-7)
  const sub = overview?.subscription || user?.subscription;
  const expiresAt = sub?.expires_at ? new Date(sub.expires_at) : null;
  const daysUntilExpiry =
    expiresAt && currentTime > 0
      ? Math.ceil((expiresAt.getTime() - currentTime) / (1000 * 60 * 60 * 24))
      : null;
  const canRenewActivePlan = Boolean(
    sub?.payment_method !== "free" &&
    sub?.status === "active" &&
    daysUntilExpiry !== null &&
    daysUntilExpiry <= 7,
  );

  const pendingInvoice = invoices.find((inv: any) => inv.status === "pending");
  const hasPendingInvoice = !!pendingInvoice;
  const showRenewalUi = canRenewActivePlan && !hasPendingInvoice;

  const activePlanSlug = overview?.user?.plan_slug || user?.plan_slug || "free";
  const activePlan = plans.find((p) => p.slug === activePlanSlug);

  const activeBillAmount = pendingInvoice
    ? pendingInvoice.amount_idr
    : showRenewalUi && activePlan
      ? sub.billing_cycle === "yearly"
        ? activePlan.price_yearly_idr
        : activePlan.price_monthly_idr
      : 0;

  const hasActiveBill = hasPendingInvoice || showRenewalUi;

  const emailsSentThisMonth = sub?.emails_sent_this_month || 0;
  const isSelectedActivePlan = selectedPlan?.slug === activePlanSlug;
  const activePlanLimit = activePlan?.monthly_email_limit || 0;
  const showOverageInCheckout = Boolean(
    isSelectedActivePlan &&
    emailsSentThisMonth > activePlanLimit &&
    (activePlan?.overage_per_1k_idr || 0) > 0
  );
  const checkoutOverageEmails = showOverageInCheckout ? emailsSentThisMonth - activePlanLimit : 0;
  const checkoutOverageRate = activePlan?.overage_per_1k_idr || 0;
  const checkoutOverageCost = Math.ceil(checkoutOverageEmails / 1000) * checkoutOverageRate;

  const invoicePlan = selectedInvoice ? plans.find((p) => p.id === selectedInvoice.plan_id) : null;
  const invoiceBasePrice = selectedInvoice
    ? (selectedInvoice.billing_cycle === "yearly"
        ? (invoicePlan?.price_yearly_idr || 0)
        : (invoicePlan?.price_monthly_idr || 0))
    : 0;
  const invoiceOverageAmount = selectedInvoice ? selectedInvoice.amount_idr - invoiceBasePrice : 0;
  const hasInvoiceOverage = invoiceOverageAmount > 0;

  if (loading && invoices.length === 0) {
    return <BillingSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Billing & Invoices
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Lihat semua transaksi pembayaran, unduh invoice, dan kelola tagihan
            Anda.
          </p>
        </div>
        <Link href="/dashboard/subscription">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer shadow-sm rounded-xl">
            Pilih Paket Langganan
          </Button>
        </Link>
      </div>

      {/* Renewal Warning Alert (Only visible in H-7 window) */}
      {showRenewalUi && activePlan && (
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                  Masa Aktif Paket Hampir Selesai
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                  Paket{" "}
                  <span className="font-bold uppercase">{activePlan.name}</span>{" "}
                  Anda akan berakhir dalam{" "}
                  <span className="font-bold">{daysUntilExpiry} hari</span> (
                  {formatDate(sub.expires_at)}). Segera lakukan perpanjangan
                  untuk mencegah downtime pengiriman SMTP.
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setSelectedPlan(activePlan);
                setYearly(sub.billing_cycle === "yearly");
                setIsCheckoutOpen(true);
              }}
              className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer shrink-0 rounded-lg text-xs shadow-sm"
            >
              Perpanjang Paket Sekarang
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-slate-100 bg-white dark:bg-slate-950 shadow-sm rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Total Pengeluaran
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">
                {formatIDR(totalSpent)}
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 bg-white dark:bg-slate-950 shadow-sm rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Transaksi Sukses
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">
                {totalSuccess} Pembayaran
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 bg-white dark:bg-slate-950 shadow-sm rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Menunggu Pembayaran
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">
                {totalPending} Transaksi
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={`border-slate-100 bg-white dark:bg-slate-950 shadow-sm rounded-xl transition-all ${hasActiveBill ? "ring-2 ring-amber-500/20 border-amber-200" : ""}`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Tagihan Aktif
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block truncate">
                {formatIDR(activeBillAmount)}
              </span>
              {pendingInvoice ? (
                <button
                  onClick={() => {
                    if (pendingInvoice.invoice_url) {
                      window.open(pendingInvoice.invoice_url, "_blank");
                    }
                  }}
                  className="text-[10px] text-orange-500 font-bold hover:text-orange-600 underline mt-1 block cursor-pointer"
                >
                  Bayar Sekarang (Invoice)
                </button>
              ) : showRenewalUi && activePlan ? (
                <button
                  onClick={() => {
                    setSelectedPlan(activePlan);
                    setYearly(sub.billing_cycle === "yearly");
                    setIsCheckoutOpen(true);
                  }}
                  className="text-[10px] text-orange-500 font-bold hover:text-orange-600 underline mt-1 block cursor-pointer"
                >
                  Bayar Sekarang
                </button>
              ) : null}
            </div>
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${hasActiveBill ? "bg-amber-50 text-amber-500 animate-pulse" : "bg-slate-50 text-slate-400"}`}
            >
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      {invoices.length > 0 && (
        <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
          <div className="space-y-1.5 flex-2 min-w-[280px]">
            <Label
              htmlFor="search-invoice"
              className="text-xs font-bold text-slate-500 tracking-wide"
            >
              Cari Invoice
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search-invoice"
                type="text"
                placeholder="Cari berdasarkan nomor invoice atau order ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 h-10 w-full rounded-lg"
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
            <Label
              htmlFor="status-filter"
              className="text-xs font-bold text-slate-500 tracking-wide"
            >
              Status
            </Label>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val || "all");
                  setPage(1);
                }}
              >
                <SelectTrigger
                  id="status-filter"
                  className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200 rounded-lg"
                >
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="paid">Sukses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Gagal</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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

      {/* Table */}
      <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm rounded-xl overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            {invoices.length === 0
              ? "Belum ada transaksi pembayaran."
              : "Tidak ada transaksi yang cocok dengan filter pencarian."}
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                <TableRow>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">
                    No.
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4">
                    Nomor Invoice
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4">
                    Paket
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4">
                    Siklus
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4">
                    Tanggal
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4 text-right">
                    Total
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 dark:text-slate-400 py-4 text-right pr-6">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((inv, idx) => {
                  const planName =
                    plans.find((p) => p.id === inv.plan_id)?.name || "Starter";
                  return (
                    <TableRow
                      key={inv.id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900"
                    >
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">
                        {idx + 1 + (page - 1) * perPage}
                      </TableCell>
                      <TableCell className="font-bold text-slate-800 dark:text-slate-200 py-4">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="max-w-[150px] truncate"
                            title={inv.invoice_number || inv.external_id}
                          >
                            {inv.invoice_number || inv.external_id}
                          </span>
                          <Button
                            variant="ghost"
                            className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                inv.invoice_number || inv.external_id,
                              );
                              toast.success(
                                "Nomor invoice disalin ke clipboard",
                              );
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </span>
                      </TableCell>
                      <TableCell className="font-bold py-4">
                        {planName}
                      </TableCell>
                      <TableCell className="capitalize text-slate-500 py-4">
                        {inv.billing_cycle === "yearly" ? "Tahunan" : "Bulanan"}
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(inv.status)}
                      </TableCell>
                      <TableCell className="text-slate-500 py-4">
                        {inv.created_at ? formatDate(inv.created_at) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800 dark:text-slate-200 py-4">
                        {formatIDR(inv.amount_idr)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <div className="flex justify-end gap-1.5 items-center">
                          {inv.status === "pending" && inv.invoice_url ? (
                            <Button
                              size="sm"
                              className="h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 rounded cursor-pointer"
                              onClick={() =>
                                window.open(inv.invoice_url, "_blank")
                              }
                            >
                              Bayar
                            </Button>
                          ) : inv.status === "paid" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs font-bold px-2 rounded flex items-center gap-1.5 border-slate-200 cursor-pointer text-slate-650 hover:text-orange-500"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsInvoiceOpen(true);
                              }}
                            >
                              <Printer className="h-3.5 w-3.5" /> Cetak
                            </Button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 cursor-pointer"
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
                            ? "bg-orange-500! hover:bg-orange-600! text-white! border-orange-500! font-bold h-8 w-8 p-0 cursor-pointer"
                            : "h-8 w-8 p-0 cursor-pointer"
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
                    className="h-8 cursor-pointer"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Invoice Modal */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-lg font-bold flex items-center justify-between pr-6">
              <span>Invoice Penagihan</span>
              {selectedInvoice && getStatusBadge(selectedInvoice.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6 pt-4 text-xs" id="printable-invoice">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    RealSend
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Authentic SMTP Delivery
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {selectedInvoice.invoice_number ||
                      selectedInvoice.external_id}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    Tanggal: {formatDate(selectedInvoice.created_at)}
                  </span>
                </div>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Ditagih Ke
                  </span>
                  <span className="block font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {user?.full_name}
                  </span>
                  <span className="block text-slate-500 mt-0.5">
                    {user?.email}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Metode Pembayaran
                  </span>
                  <span className="block font-bold text-slate-800 dark:text-slate-200 mt-1 uppercase">
                    {selectedInvoice.payment_method}
                  </span>
                  <span className="block text-slate-500 mt-0.5">
                    Order ID: {selectedInvoice.external_id}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Rincian Paket
                </span>
                <div className="rounded-lg border border-slate-100 overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto] bg-slate-50 dark:bg-slate-900/50 p-2.5 font-bold border-b border-slate-100 text-slate-500">
                    <span>Deskripsi</span>
                    <span className="text-right">Total</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] p-2.5 border-b border-slate-50 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {invoicePlan?.name || "Starter"} Plan
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Siklus:{" "}
                        {selectedInvoice.billing_cycle === "yearly"
                          ? "Tahunan"
                          : "Bulanan"}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 self-center">
                      {formatIDR(invoiceBasePrice > 0 ? invoiceBasePrice : selectedInvoice.amount_idr)}
                    </span>
                  </div>

                  {hasInvoiceOverage && (
                    <div className="grid grid-cols-[1fr_auto] p-2.5 border-b border-slate-50 dark:border-slate-800 text-red-500">
                      <div>
                        <span className="font-bold block">
                          Biaya Kelebihan (Overage)
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Biaya tambahan pemakaian email di siklus berjalan
                        </span>
                      </div>
                      <span className="font-bold self-center">
                        {formatIDR(invoiceOverageAmount)}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-[1fr_auto] p-2.5 bg-slate-50/50 dark:bg-slate-900/20 font-bold">
                    <span>Total Pembayaran</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      {formatIDR(selectedInvoice.amount_idr)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsInvoiceOpen(false)}
              className="h-10 border-slate-200 rounded-lg text-xs cursor-pointer"
            >
              Tutup
            </Button>
            <Button
              onClick={() => {
                const iframe = document.createElement("iframe");
                iframe.style.position = "fixed";
                iframe.style.right = "0";
                iframe.style.bottom = "0";
                iframe.style.width = "0";
                iframe.style.height = "0";
                iframe.style.border = "0";
                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentWindow?.document;
                if (iframeDoc) {
                  iframeDoc.open();
                  iframeDoc.write(`
                    <html>
                      <head>
                        <title>Invoice - ${selectedInvoice?.invoice_number || "RealSend"}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
                        <style>
                          @page {
                            size: auto;
                            margin: 0mm;
                          }
                          body {
                            font-family: 'Inter', sans-serif;
                            margin: 0;
                            padding: 25mm 20mm;
                            background: #fff;
                          }
                          @media print {
                            body {
                              padding: 25mm 20mm;
                              background: #fff;
                            }
                          }
                        </style>
                      </head>
                      <body class="bg-white text-slate-800 antialiased">
                        <div class="w-full mx-auto bg-white" style="max-width: 800px;">
                          
                          <!-- Header -->
                          <div class="flex justify-between items-center border-b border-slate-200 pb-8 mb-10">
                            <div class="flex items-center gap-2.5" style="display: flex; align-items: center; gap: 10px;">
                              <img src="${window.location.origin}/images/logo-realsend.png" alt="Logo" style="height: 28px; width: auto;" />
                              <img src="${window.location.origin}/images/text-realsend.png" alt="RealSend" style="height: 22px; width: auto; margin-top: 3px;" />
                            </div>
                            <div class="text-right">
                              <span class="text-3xl font-black text-slate-900 tracking-tight block">INVOICE</span>
                              <span class="text-xs text-slate-400 font-mono block mt-1">${selectedInvoice.invoice_number || selectedInvoice.external_id}</span>
                            </div>
                          </div>

                          <!-- Info grid -->
                          <div class="grid grid-cols-2 gap-12 mb-10 text-xs">
                            <div>
                              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">DITAGIH KEPADA:</span>
                              <span class="block font-bold text-slate-900 text-base leading-tight">${user?.full_name || "User"}</span>
                              <span class="block text-slate-500 mt-1 text-xs">${user?.email}</span>
                            </div>
                            <div class="text-right flex flex-col items-end">
                              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">RINCIAN PEMBAYARAN:</span>
                              <table class="text-xs text-right" style="border-collapse: collapse; min-width: 240px;">
                                <tbody>
                                  <tr>
                                    <td class="text-slate-500 pb-1.5 pr-4 text-right">Tanggal:</td>
                                    <td class="font-bold text-slate-900 pb-1.5 text-right">${formatInvoiceDateTime(selectedInvoice.created_at)}</td>
                                  </tr>
                                  <tr>
                                    <td class="text-slate-500 pb-1.5 pr-4 text-right">Metode:</td>
                                    <td class="font-bold text-slate-900 pb-1.5 text-right uppercase">${selectedInvoice.payment_method}</td>
                                  </tr>
                                  <tr>
                                    <td class="text-slate-500 pr-4 text-right">Order ID:</td>
                                    <td class="font-bold text-slate-900 text-right font-mono">${selectedInvoice.external_id}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <!-- Item table -->
                          <div class="border border-slate-200 rounded-xl overflow-hidden mb-10 text-xs">
                            <table class="w-full text-left">
                              <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                  <th class="p-4 pl-6">Deskripsi Paket</th>
                                  <th class="p-4 text-center">Siklus</th>
                                  <th class="p-4 text-right pr-6">Harga</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr class="border-b border-slate-100">
                                  <td class="p-4 pl-6">
                                    <span class="font-bold text-slate-900 text-sm block">${plans.find((p) => p.id === selectedInvoice.plan_id)?.name || "Starter"} Plan</span>
                                    <span class="text-slate-500 mt-1 block">Akses penuh layanan SMTP RealSend</span>
                                  </td>
                                  <td class="p-4 text-center capitalize text-slate-650 font-medium">
                                    ${selectedInvoice.billing_cycle === "yearly" ? "Tahunan" : "Bulanan"}
                                  </td>
                                  <td class="p-4 text-right font-bold text-slate-900 pr-6 text-sm">
                                    ${formatIDR(invoiceBasePrice > 0 ? invoiceBasePrice : selectedInvoice.amount_idr)}
                                  </td>
                                </tr>
                                ${hasInvoiceOverage ? `
                                <tr class="border-b border-slate-100">
                                  <td class="p-4 pl-6">
                                    <span class="font-bold text-red-500 text-sm block">Biaya Kelebihan (Overage)</span>
                                    <span class="text-slate-500 mt-1 block">Biaya tambahan pemakaian email di siklus berjalan</span>
                                  </td>
                                  <td class="p-4 text-center capitalize text-slate-650 font-medium">
                                    -
                                  </td>
                                  <td class="p-4 text-right font-bold text-red-500 pr-6 text-sm">
                                    ${formatIDR(invoiceOverageAmount)}
                                  </td>
                                </tr>
                                ` : ''}
                                <tr class="bg-slate-50/50 font-bold text-sm">
                                  <td colspan="2" class="p-4 pl-6 text-right text-slate-500 font-bold">Total Pembayaran</td>
                                  <td class="p-4 text-right text-orange-650 font-black pr-6 text-base">${formatIDR(selectedInvoice.amount_idr)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <!-- Footer -->
                          <div class="text-center pt-8 border-t border-slate-150 text-xs text-slate-400 mt-16">
                            <p class="font-bold text-slate-700 text-sm mb-1">Terima kasih atas pembayaran Anda!</p>
                            <p class="leading-relaxed">Email Anda dikirim secara otentik menggunakan gateway SMTP RealSend.</p>
                            <p class="mt-4 text-[10px] text-slate-400">Jika ada pertanyaan mengenai invoice ini, silakan hubungi tim support kami.</p>
                          </div>

                        </div>
                      </body>
                    </html>
                  `);
                  iframeDoc.close();

                  setTimeout(() => {
                    if (iframe.contentWindow) {
                      iframe.contentWindow.focus();
                      iframe.contentWindow.print();
                    }
                    document.body.removeChild(iframe);
                  }, 500);
                }
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors text-xs"
            >
              <Printer className="h-4 w-4" />
              Cetak Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={closeCheckout}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Checkout Midtrans
            </DialogTitle>
            <DialogDescription>
              Kamu akan diarahkan ke halaman pembayaran Midtrans Sandbox untuk
              menyelesaikan transaksi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Paket yang dipilih</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {yearly ? "Tahunan" : "Bulanan"}
                </span>
              </div>
              
              <div className="flex justify-between items-start gap-4 pb-2 border-b border-slate-100 dark:border-slate-200/40">
                <div>
                  <div className="text-sm font-bold text-slate-850 dark:text-slate-200">
                    Harga Paket ({selectedPlan?.name})
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedPlan?.description}
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">
                  {selectedPlan &&
                    formatIDR(
                      yearly
                        ? selectedPlan.price_yearly_idr
                        : selectedPlan.price_monthly_idr,
                    )}
                </div>
              </div>

              {showOverageInCheckout && (
                <div className="flex justify-between items-start gap-4 pb-2 border-b border-slate-100 dark:border-slate-200/40">
                  <div>
                    <div className="text-sm font-bold text-red-500">
                      Biaya Kelebihan (Overage)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      +{checkoutOverageEmails.toLocaleString()} email overage ({formatIDR(checkoutOverageRate)}/1k email)
                    </div>
                  </div>
                  <div className="text-sm font-bold text-red-500 whitespace-nowrap">
                    {formatIDR(checkoutOverageCost)}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-black text-slate-900 dark:text-white">Total Tagihan</span>
                <span className="text-lg font-black text-orange-500 whitespace-nowrap">
                  {selectedPlan &&
                    formatIDR(
                      (yearly
                        ? selectedPlan.price_yearly_idr
                        : selectedPlan.price_monthly_idr) + checkoutOverageCost,
                    )}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 text-xs text-blue-700 dark:text-blue-400 rounded-xl leading-relaxed">
              <ArrowUpRight className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Pembayaran diproses lewat halaman Midtrans. Setelah transaksi
                selesai, backend akan menerima notifikasi otomatis untuk
                mengaktifkan paket.
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeCheckout}
                className="h-10 border-slate-200 rounded-lg cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={checkoutLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 px-5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Membuka Midtrans...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Lanjut ke Midtrans
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
