"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  CreditCard,
  Check,
  Zap,
  Globe,
  Key,
  Mail,
  Calendar,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  X,
  AlertTriangle,
} from "lucide-react";
import { SubscriptionSkeleton } from "./skeleton";
import { formatDate } from "@/lib/utils";

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

interface BillingOverview {
  user: any;
  subscription?: any;
  latest_payment?: any;
  recent_invoices?: any[];
}

const PREMIUM_FEATURES = [
  {
    key: "tracking",
    label: "Open & click tracking",
    check: (plan: Plan) =>
      plan.features?.includes("open_tracking") ||
      plan.features?.includes("click_tracking"),
  },
  {
    key: "custom_smtp",
    label: "Custom SMTP Port",
    check: (plan: Plan) => plan.features?.includes("custom_smtp"),
  },
  {
    key: "dedicated_ip",
    label: "Dedicated IP (1 IP)",
    check: (plan: Plan) => plan.slug.toLowerCase() === "pro",
  },
];

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const handledPaymentStatus = useRef(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [domainsCount, setDomainsCount] = useState(0);
  const [apiKeysCount, setApiKeysCount] = useState(0);
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearly, setYearly] = useState(true);

  // Checkout modal states
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [, setCurrentTime] = useState(0);
  const [] = useState<any | null>(null);
  const [] = useState(false);
  const [isFreeDowngradeOpen, setIsFreeDowngradeOpen] = useState(false);

  const loadBillingData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
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

        const [plansList, domainsList, keysList, billingOverview, invoiceList] =
          await Promise.all([
            api.plans.list(),
            api.domains.list(),
            api.apiKeys.list(),
            api.billing.current(),
            api.billing.invoices({ page: 1, per_page: 5 }),
          ]);

        const sortedPlans = (plansList || []).sort(
          (a: any, b: any) => a.sort_order - b.sort_order,
        );
        setPlans(sortedPlans);
        setDomainsCount(domainsList?.length || 0);
        setApiKeysCount(keysList?.length || 0);
        setOverview(billingOverview || null);
        setInvoices(
          invoiceList?.invoices || billingOverview?.recent_invoices || [],
        );
      } catch (err: any) {
        toast.error("Gagal memuat data billing", { description: err.message });
      } finally {
        setLoading(false);
      }
    },
    [refreshUser],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBillingData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadBillingData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment || handledPaymentStatus.current) return;

    if (payment === "success") {
      const timer = window.setTimeout(() => {
        loadBillingData(true);
      }, 0);
      return () => window.clearTimeout(timer);
    } else if (payment === "unfinish") {
      toast.info("Pembayaran belum selesai", {
        description: "Kamu bisa melanjutkan pembayaran dari halaman Midtrans.",
      });
    } else if (payment === "error") {
      toast.error("Pembayaran gagal", {
        description:
          "Silakan coba checkout ulang atau gunakan metode pembayaran lain.",
      });
    }
  }, [loadBillingData, refreshUser]);

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
          loadBillingData(true); // Silent reload
        }
      } catch {
        // Fail silently during background polling
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [invoices, loadBillingData, refreshUser]);

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

  if (loading) {
    return <SubscriptionSkeleton />;
  }

  // Get active plan config
  const activePlanSlug = overview?.user?.plan_slug || user?.plan_slug || "free";
  const activePlan = plans.find((p) => p.slug === activePlanSlug) || {
    name: overview?.user?.plan_name || user?.plan_name || "Free",
    slug: "free",
    monthly_email_limit: 1000,
    daily_email_limit: 100,
    max_domains: 1,
    max_api_keys: 1,
    max_webhooks: 1,
    price_monthly_idr: 0,
  };

  const sub = overview?.subscription || user?.subscription;
  const emailsSentThisMonth = sub?.emails_sent_this_month || 0;
  const emailsSentToday = sub?.emails_sent_today || 0;

  // Format currency helper
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const isOverage = emailsSentThisMonth > activePlan.monthly_email_limit;
  const overageEmails = Math.max(emailsSentThisMonth - activePlan.monthly_email_limit, 0);
  const overageRate = activePlan.overage_per_1k_idr || 0;
  const overageCost = Math.ceil(overageEmails / 1000) * overageRate;
  
  const isSelectedActivePlan = selectedPlan?.slug === activePlan.slug;
  const showOverageInCheckout = Boolean(
    isSelectedActivePlan &&
    emailsSentThisMonth > activePlan.monthly_email_limit &&
    (activePlan.overage_per_1k_idr || 0) > 0
  );
  const checkoutOverageEmails = showOverageInCheckout ? emailsSentThisMonth - activePlan.monthly_email_limit : 0;
  const checkoutOverageRate = activePlan.overage_per_1k_idr || 0;
  const checkoutOverageCost = Math.ceil(checkoutOverageEmails / 1000) * checkoutOverageRate;

  const billingCycleLabel =
    sub?.payment_method === "free"
      ? "Gratis selamanya"
      : sub?.billing_cycle === "yearly"
        ? "Tahunan"
        : "Bulanan";
  const subscriptionStartDate = sub?.started_at
    ? formatDate(sub.started_at)
    : "-";
  const subscriptionEndDate = sub?.expires_at
    ? formatDate(sub.expires_at)
    : "Selamanya";
  const nextBillingDate = sub?.expires_at
    ? formatDate(sub.expires_at)
    : "Tidak ada";
  const quotaResetDate = sub?.month_reset_at
    ? formatDate(sub.month_reset_at)
    : "-";

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Subscription
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola langganan Anda dan pantau pemakaian kuota bulanan.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-4 py-2 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Siklus Reset:
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {sub?.month_reset_at
              ? formatDate(sub.month_reset_at)
              : "30 hari lagi"}
          </span>
        </div>
      </div>

      {/* Usage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Email Bulanan */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm p-5 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Bulanan
              </span>
              <Mail className="h-4 w-4 text-orange-500" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {emailsSentThisMonth.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">
                dari {activePlan.monthly_email_limit.toLocaleString()} limit
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isOverage ? "bg-red-500" : "bg-linear-to-r from-orange-500 to-amber-500"}`}
                style={{
                  width: `${Math.min((emailsSentThisMonth / activePlan.monthly_email_limit) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {isOverage ? (
                <span className="text-[9px] font-bold text-red-500 truncate" title={overageRate > 0 ? `Overage: +${overageEmails.toLocaleString()} email (Biaya: ${formatIDR(overageCost)})` : "Kuota habis! Upgrade sekarang"}>
                  {overageRate > 0 
                    ? `Overage: +${overageEmails.toLocaleString()} email (${formatIDR(overageCost)})`
                    : "Kuota habis! Upgrade paket"}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Sisa: {(activePlan.monthly_email_limit - emailsSentThisMonth).toLocaleString()}
                </span>
              )}
              <span className={`text-[10px] font-bold ${isOverage ? "text-red-500" : "text-slate-400"}`}>
                {((emailsSentThisMonth / activePlan.monthly_email_limit) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        {/* Email Harian */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm p-5 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Hari Ini
              </span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {emailsSentToday.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">
                dari {activePlan.daily_email_limit.toLocaleString()} limit
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-yellow-500 rounded-full"
                style={{
                  width: `${Math.min((emailsSentToday / activePlan.daily_email_limit) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block text-right font-bold">
              {Math.min(
                (emailsSentToday / activePlan.daily_email_limit) * 100,
                100,
              ).toFixed(1)}
              % terpakai
            </span>
          </div>
        </Card>

        {/* Domain Terverifikasi */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm p-5 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Domain Pengirim
              </span>
              <Globe className="h-4 w-4 text-blue-500" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {domainsCount}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">
                dari {activePlan.max_domains} slot terdaftar
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{
                  width: `${Math.min((domainsCount / activePlan.max_domains) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block text-right font-bold">
              {domainsCount} / {activePlan.max_domains} Slot
            </span>
          </div>
        </Card>

        {/* API Keys */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm p-5 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                API Keys
              </span>
              <Key className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {apiKeysCount}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">
                dari {activePlan.max_api_keys} kunci aktif
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{
                  width: `${Math.min((apiKeysCount / activePlan.max_api_keys) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block text-right font-bold">
              {apiKeysCount} / {activePlan.max_api_keys} Slot
            </span>
          </div>
        </Card>
      </div>

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plans Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Pilih Paket RealSend
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Upgrade untuk membuka limit pengiriman harian, tracking
                statistik open/click, dan webhooks.
              </p>
            </div>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 self-start sm:self-center">
              <span
                className={`text-xs font-semibold ${yearly ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}
              >
                Bulanan
              </span>
              <button
                type="button"
                onClick={() => setYearly(!yearly)}
                className={`relative w-8 h-4.5 rounded-full border-0 cursor-pointer shrink-0 transition-colors duration-300 ${yearly ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700"}`}
              >
                <div
                  className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all duration-300 ${yearly ? "left-4" : "left-0.5"}`}
                />
              </button>
              <span
                className={`text-xs font-semibold flex items-center gap-1.5 ${yearly ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
              >
                Tahunan
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-green-500/10 border border-green-500/20 text-[#4ADE80]">
                  -20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan: Plan) => {
              const isCurrent = plan.slug === activePlanSlug;
              const isPopular =
                plan.slug === "starter" || plan.slug === "growth";
              const isFreePlan =
                plan.price_monthly_idr === 0 && plan.price_yearly_idr === 0;
              const isDowngrade =
                plan.sort_order < (activePlan.sort_order || 0);

              const monthlyPrice = plan.price_monthly_idr;
              const yearlyPrice = plan.price_yearly_idr;
              const displayPrice = yearly
                ? Math.round(yearlyPrice / 12)
                : monthlyPrice;

              return (
                <Card
                  key={plan.id}
                  className={`border rounded-xl shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/5 dark:bg-slate-950"
                      : "border-slate-150 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                  }`}
                >
                  <CardHeader className="p-5 border-b border-slate-50 dark:border-slate-900">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1 min-h-[32px]">
                          {plan.description}
                        </CardDescription>
                      </div>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <Check className="h-3 w-3" /> Aktif
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {displayPrice === 0
                            ? "Gratis"
                            : formatIDR(displayPrice)}
                        </span>
                        {displayPrice > 0 && (
                          <span className="text-xs text-slate-400 font-bold">
                            / bulan
                          </span>
                        )}
                      </div>
                      {yearly && displayPrice > 0 ? (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                          Ditagih {formatIDR(yearlyPrice)} / tahun
                        </p>
                      ) : (
                        <p className="text-[10px] text-transparent select-none mt-1 font-semibold pointer-events-none">
                          &nbsp;
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-3 text-xs text-slate-600 dark:text-slate-400 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-450">
                        Limit Bulanan:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.monthly_email_limit.toLocaleString()} email
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-450">
                        Limit Harian:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.daily_email_limit.toLocaleString()} email
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-450">
                        Kapasitas Domain:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.max_domains} domain
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-450">
                        Kapasitas API Key:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.max_api_keys === -1
                          ? "Unlimited"
                          : `${plan.max_api_keys} keys`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-450">
                        Kapasitas Webhook:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.max_webhooks} webhook
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-450">
                        Log Retention:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.log_retention_days} hari
                      </span>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-900 my-1" />

                    {PREMIUM_FEATURES.map((feat) => {
                      const included = feat.check(plan);
                      return (
                        <div
                          key={feat.key}
                          className="flex justify-between items-center"
                          style={{
                            opacity: included ? 1 : 0.45,
                            textDecoration: included ? "none" : "line-through",
                          }}
                        >
                          <span className="text-slate-400">{feat.label}:</span>
                          {included ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 font-bold" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-red-500 font-bold" />
                          )}
                        </div>
                      );
                    })}
                  </CardContent>

                  <CardFooter className="p-5 border-t border-slate-50 dark:border-slate-900 bg-slate-50/20">
                    {isCurrent && isFreePlan ? (
                      <Button
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed font-bold"
                      >
                        Paket Free Aktif
                      </Button>
                    ) : isCurrent ? (
                      <Button
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed font-bold"
                      >
                        Paket Aktif Saat Ini
                      </Button>
                    ) : isFreePlan ? (
                      <Button
                        onClick={() => {
                          setIsFreeDowngradeOpen(true);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold cursor-pointer transition-all"
                      >
                        Downgrade ke Free
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setIsCheckoutOpen(true);
                        }}
                        className={`w-full font-bold cursor-pointer transition-all ${
                          isPopular
                            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                            : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                        }`}
                      >
                        {isDowngrade
                          ? `Downgrade ke ${plan.name}`
                          : `Upgrade ke ${plan.name}`}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active billing status & Invoices */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Detail Pembayaran
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Informasi penagihan dan riwayat transaksi.
            </p>
          </div>

          <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-linear-to-tr from-slate-900 to-slate-800 text-white p-5 border-none">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                    Metode Pembayaran
                  </span>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 mt-1">
                    <CreditCard className="h-5 w-5" />
                    {sub?.payment_method === "free"
                      ? "Free Tier"
                      : "Midtrans Sandbox"}
                  </CardTitle>
                </div>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded font-bold uppercase">
                  {sub?.status || "active"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400">Harga Paket</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right whitespace-nowrap">
                  {activePlan.price_monthly_idr === 0
                    ? "Rp 0"
                    : formatIDR(activePlan.price_monthly_idr)}{" "}
                  / bln
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400">Siklus Langganan</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right whitespace-nowrap">
                  {billingCycleLabel}
                </span>
              </div>
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <span className="block text-slate-400">Periode Aktif</span>
                <div className="grid grid-cols-1 gap-2 rounded-lg bg-slate-50/80 p-3 text-xs sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center dark:bg-slate-900/40">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mulai
                    </span>
                    <span className="block truncate font-bold text-slate-800 dark:text-slate-200">
                      {subscriptionStartDate}
                    </span>
                  </div>
                  <span className="hidden text-slate-300 sm:block">-</span>
                  <div className="min-w-0 sm:text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Berakhir
                    </span>
                    <span className="block truncate font-bold text-slate-800 dark:text-slate-200">
                      {subscriptionEndDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400">Reset Kuota Bulanan</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right whitespace-nowrap">
                  {quotaResetDate}
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400">Jatuh Tempo</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right whitespace-nowrap">
                  {nextBillingDate}
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <span className="text-slate-400">Status Siklus</span>
                <span className="font-bold text-emerald-600 flex items-center justify-end gap-1 text-right">
                  <CheckCircle2 className="h-4 w-4" /> Berjalan Normal
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                className="h-10 border-slate-200 rounded-lg"
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
      {/* Free Downgrade Dialog */}
      <Dialog open={isFreeDowngradeOpen} onOpenChange={setIsFreeDowngradeOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Downgrade ke Paket Free
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin berpindah ke paket Free? Downgrade ke
              paket Free tidak dikenakan biaya.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Paket Free Anda akan aktif secara otomatis setelah masa aktif
              paket berbayar saat ini berakhir pada{" "}
              <span className="font-bold">
                {sub?.expires_at ? formatDate(sub.expires_at) : "-"}.
              </span>
            </p>
            <p>
              Setelah downgrade aktif, kuota pengiriman email bulanan Anda akan
              dibatasi kembali menjadi 1.000 email/bulan dan 100 email/hari.
            </p>
          </div>
          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFreeDowngradeOpen(false)}
              className="h-10 border-slate-200 rounded-lg text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                setIsFreeDowngradeOpen(false);
                toast.success("Downgrade otomatis dikonfirmasi", {
                  description:
                    "Akun Anda akan diturunkan ke paket Free setelah masa aktif paket berbayar saat ini habis.",
                });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 px-5 rounded-lg shadow-sm text-xs cursor-pointer"
            >
              Konfirmasi Downgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
