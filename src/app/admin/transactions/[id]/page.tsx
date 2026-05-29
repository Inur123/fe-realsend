"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3Icon,
  ShieldAlertIcon,
  InfoIcon,
  CreditCard,
  User,
  Layers,
  FileText,
  Calendar,
  Printer,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, formatDateTime, formatInvoiceDateTime } from "@/lib/utils";
import { formatPaymentChannel } from "@/lib/payment-channel";
import { toast } from "sonner";
import { TransactionDetailSkeleton } from "./skeleton";

interface TransactionDetail {
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

interface BillingPlan {
  id: string;
  name: string;
  price_monthly_idr: number;
  price_yearly_idr: number;
}

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

// Identik dengan getStatusBadge di billing user
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

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDetail = async () => {
      if (!id) {
        setError("ID transaksi tidak valid.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [txData, plansData] = await Promise.all([
          api.admin.getTransaction(id),
          api.plans.list(),
        ]);
        if (!active) return;
        setTransaction(txData);
        setPlans(plansData || []);
      } catch (err: unknown) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Gagal memuat detail transaksi.";
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = window.setTimeout(() => {
      void loadDetail();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [id]);

  if (loading) return <TransactionDetailSkeleton />;

  if (error || !transaction) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/transactions")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 border-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>
        <div className="text-center p-8 text-slate-500">
          {error || "Transaksi tidak ditemukan."}
        </div>
      </div>
    );
  }

  // ── Overage calculation (sama persis dengan billing user) ───────────────
  const invoicePlan = plans.find((p) => p.id === transaction.plan_id);
  const invoiceBasePrice = transaction
    ? transaction.billing_cycle === "yearly"
      ? invoicePlan?.price_yearly_idr || 0
      : invoicePlan?.price_monthly_idr || 0
    : 0;
  const invoiceOverageAmount = transaction.amount_idr - invoiceBasePrice;
  const hasInvoiceOverage = invoiceBasePrice > 0 && invoiceOverageAmount > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-650 hover:bg-slate-50/50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 shrink-0 cursor-pointer shadow-sm bg-white dark:bg-slate-950"
            onClick={() => router.push("/admin/transactions")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-all">
              Detail Transaksi
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm break-all font-bold">
              {transaction.invoice_number || "Draft Invoice"}
            </p>
            <p className="text-slate-400 dark:text-slate-500 mt-0.5 text-[11px] sm:text-xs break-all">
              ID Transaksi: {transaction.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {getStatusBadge(transaction.status)}
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          {/* Status Callout */}
          {transaction.status === "paid" ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlertIcon className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  Pembayaran Sukses &amp; Terverifikasi
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                  Transaksi sebesar <strong>{formatIDR(transaction.amount_idr)}</strong> untuk paket{" "}
                  <strong>{transaction.plan_name || "Custom"}</strong> berhasil dibayarkan menggunakan{" "}
                  <strong>{formatPaymentChannel(transaction.payment_method)}</strong>{" "}
                  pada {transaction.paid_at ? formatDateTime(transaction.paid_at) : "-"}.
                </p>
              </div>
            </div>
          ) : transaction.status === "pending" ? (
            <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <Clock3Icon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                  Menunggu Pembayaran Pengguna
                </h4>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                  Invoice ini berstatus <strong>Pending</strong>. RealSend masih menunggu verifikasi dana masuk dari payment gateway untuk Nominal{" "}
                  <strong>{formatIDR(transaction.amount_idr)}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlertIcon className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400">
                  Transaksi Batal / Gagal
                </h4>
                <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5 leading-relaxed">
                  Invoice ini telah dibatalkan, kadaluwarsa, atau gagal diselesaikan oleh pelanggan.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Rincian Pembayaran &amp; Invoice
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 w-4 text-center">Rp</span>
                  Nominal Pembayaran
                </span>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <span className="text-sm font-black text-slate-850 dark:text-slate-200">
                    {formatIDR(transaction.amount_idr)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  Channel Pembayaran
                </span>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {formatPaymentChannel(transaction.payment_method)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Tanggal Dibuat
                </span>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateTime(transaction.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/30">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" />
                    <span>Identitas Pelanggan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nama Pelanggan</p>
                    <p className="mt-1 break-all font-bold text-sm text-slate-700 dark:text-slate-300">{transaction.user_name || "N/A"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alamat Email</p>
                    <p className="mt-1 break-all font-bold text-sm text-slate-700 dark:text-slate-300">{transaction.user_email}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">User ID</p>
                    <p className="mt-1 break-all font-mono text-xs text-slate-500 dark:text-slate-400">{transaction.user_id}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/30">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-orange-500" />
                    <span>Paket &amp; Gateway Payload</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Paket Langganan</p>
                    <p className="mt-1 font-bold text-sm text-slate-700 dark:text-slate-300">{transaction.plan_name || "Custom"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Siklus Tagihan</p>
                    <p className="mt-1 font-semibold text-xs text-slate-700 dark:text-slate-300 capitalize">
                      {transaction.billing_cycle === "yearly" ? "Tahunan" : "Bulanan"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Gateway External ID</p>
                    <p className="mt-1 break-all font-mono text-xs text-slate-550 dark:text-slate-400">{transaction.external_id || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice Action Button */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-slate-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Invoice Resmi Transaksi</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Lihat atau cetak invoice penagihan resmi untuk transaksi ini.</p>
                </div>
              </div>
              <Button
                onClick={() => setIsInvoiceOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 h-9 rounded-lg cursor-pointer"
              >
                Lihat Invoice
              </Button>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] text-slate-500 flex items-start gap-2.5">
              <InfoIcon className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>
                Seluruh rekam pembayaran divalidasi secara real-time via Payment Gateway API yang berstandar PCI-DSS Level 1 demi menjamin keamanan data transaksi.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Invoice Modal — 100% identik dengan billing user ─────────────────── */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-lg font-bold flex items-center justify-between pr-6">
              <span>Invoice Penagihan</span>
              {getStatusBadge(transaction.status)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4 text-xs" id="printable-invoice">
            {/* Header — identik */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">RealSend</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Authentic SMTP Delivery</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {transaction.invoice_number || transaction.external_id}
                </span>
                <span className="text-slate-400 text-[10px] block mt-0.5">
                  Tanggal: {formatDate(transaction.created_at)}
                </span>
              </div>
            </div>

            {/* Billing Info — identik */}
            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ditagih Ke</span>
                <span className="block font-bold text-slate-800 dark:text-slate-200 mt-1">{transaction.user_name}</span>
                <span className="block text-slate-500 mt-0.5">{transaction.user_email}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Metode Pembayaran</span>
                <span className="block font-bold text-slate-800 dark:text-slate-200 mt-1 uppercase">
                  {formatPaymentChannel(transaction.payment_method)}
                </span>
                <span className="block text-slate-500 mt-0.5">Order ID: {transaction.external_id}</span>
              </div>
            </div>

            {/* Items Table — identik termasuk overage row */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rincian Paket</span>
              <div className="rounded-lg border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[1fr_auto] bg-slate-50 dark:bg-slate-900/50 p-2.5 font-bold border-b border-slate-100 text-slate-500">
                  <span>Deskripsi</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Plan row */}
                <div className="grid grid-cols-[1fr_auto] p-2.5 border-b border-slate-50 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {invoicePlan?.name || transaction.plan_name || "Starter"} Plan
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Siklus:{" "}
                      {transaction.billing_cycle === "yearly" ? "Tahunan" : "Bulanan"}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 self-center">
                    {formatIDR(invoiceBasePrice > 0 ? invoiceBasePrice : transaction.amount_idr)}
                  </span>
                </div>

                {/* Overage row — identik dengan billing user */}
                {hasInvoiceOverage && (
                  <div className="grid grid-cols-[1fr_auto] p-2.5 border-b border-slate-50 dark:border-slate-800 text-red-500">
                    <div>
                      <span className="font-bold block">Biaya Kelebihan (Overage)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Biaya tambahan pemakaian email di siklus berjalan
                      </span>
                    </div>
                    <span className="font-bold self-center">{formatIDR(invoiceOverageAmount)}</span>
                  </div>
                )}

                {/* Total row */}
                <div className="grid grid-cols-[1fr_auto] p-2.5 bg-slate-50/50 dark:bg-slate-900/20 font-bold">
                  <span>Total Pembayaran</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {formatIDR(transaction.amount_idr)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer — identik */}
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
                        <title>Invoice - ${transaction?.invoice_number || "RealSend"}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
                        <style>
                          @page { size: auto; margin: 0mm; }
                          body { font-family: 'Inter', sans-serif; margin: 0; padding: 25mm 20mm; background: #fff; }
                          @media print { body { padding: 25mm 20mm; background: #fff; } }
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
                              <span class="text-xs text-slate-400 font-mono block mt-1">${transaction.invoice_number || transaction.external_id}</span>
                            </div>
                          </div>

                          <!-- Info grid -->
                          <div class="grid grid-cols-2 gap-12 mb-10 text-xs">
                            <div>
                              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">DITAGIH KEPADA:</span>
                              <span class="block font-bold text-slate-900 text-base leading-tight">${transaction.user_name || "User"}</span>
                              <span class="block text-slate-500 mt-1 text-xs">${transaction.user_email}</span>
                            </div>
                            <div class="text-right flex flex-col items-end">
                              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">RINCIAN PEMBAYARAN:</span>
                              <table class="text-xs text-right" style="border-collapse: collapse; min-width: 240px;">
                                <tbody>
                                  <tr>
                                    <td class="text-slate-500 pb-1.5 pr-4 text-right">Tanggal:</td>
                                    <td class="font-bold text-slate-900 pb-1.5 text-right">${formatInvoiceDateTime(transaction.created_at)}</td>
                                  </tr>
                                  <tr>
                                    <td class="text-slate-500 pb-1.5 pr-4 text-right">Metode:</td>
                                    <td class="font-bold text-slate-900 pb-1.5 text-right">${formatPaymentChannel(transaction.payment_method)}</td>
                                  </tr>
                                  <tr>
                                    <td class="text-slate-500 pr-4 text-right">Order ID:</td>
                                    <td class="font-bold text-slate-900 text-right font-mono">${transaction.external_id}</td>
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
                                    <span class="font-bold text-slate-900 text-sm block">${invoicePlan?.name || transaction.plan_name || "Starter"} Plan</span>
                                    <span class="text-slate-500 mt-1 block">Akses penuh layanan SMTP RealSend</span>
                                  </td>
                                  <td class="p-4 text-center capitalize text-slate-650 font-medium">
                                    ${transaction.billing_cycle === "yearly" ? "Tahunan" : "Bulanan"}
                                  </td>
                                  <td class="p-4 text-right font-bold text-slate-900 pr-6 text-sm">
                                    ${formatIDR(invoiceBasePrice > 0 ? invoiceBasePrice : transaction.amount_idr)}
                                  </td>
                                </tr>
                                ${hasInvoiceOverage ? `
                                <tr class="border-b border-slate-100">
                                  <td class="p-4 pl-6">
                                    <span class="font-bold text-red-500 text-sm block">Biaya Kelebihan (Overage)</span>
                                    <span class="text-slate-500 mt-1 block">Biaya tambahan pemakaian email di siklus berjalan</span>
                                  </td>
                                  <td class="p-4 text-center capitalize text-slate-650 font-medium">-</td>
                                  <td class="p-4 text-right font-bold text-red-500 pr-6 text-sm">
                                    ${formatIDR(invoiceOverageAmount)}
                                  </td>
                                </tr>
                                ` : ''}
                                <tr class="bg-slate-50/50 font-bold text-sm">
                                  <td colspan="2" class="p-4 pl-6 text-right text-slate-500 font-bold">Total Pembayaran</td>
                                  <td class="p-4 text-right text-orange-650 font-black pr-6 text-base">${formatIDR(transaction.amount_idr)}</td>
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
    </div>
  );
}
