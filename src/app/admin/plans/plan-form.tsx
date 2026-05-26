"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  SparklesIcon, 
  CheckIcon, 
  Loader2Icon,
  ArrowLeftIcon
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PlanFormProps {
  editingId?: string | null;
  initialData?: any;
}

// Helpers for formatted input numbers (Indonesian standard formatting with dot separators)
const formatNumberStr = (num: number | string) => {
  if (num === undefined || num === null || num === "") return "";
  const clean = String(num).replace(/\D/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("id-ID").format(Number(clean));
};

const parseNumberStr = (val: string | number) => {
  if (typeof val === "number") return val;
  return Number(val.replace(/\./g, "")) || 0;
};

const defaultFormState = {
  name: "",
  slug: "",
  description: "",
  monthly_email_limit: "50.000",
  daily_email_limit: "25.000",
  rate_per_minute: "100",
  max_domains: "5",
  max_api_keys: "10",
  max_webhooks: "5",
  log_retention_days: "30",
  price_monthly_idr: "150.000",
  price_yearly_idr: "1.500.000",
  overage_per_1k_idr: "1.500",
  is_public: true,
  is_active: true,
  sort_order: "1",
  badge_text: "",
  badge_color: "orange",
  features: {
    custom_smtp: false,
    open_tracking: false,
    click_tracking: false,
    webhooks: false,
  }
};

export default function PlanForm({ editingId, initialData }: PlanFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Setup form state
  const [form, setForm] = useState(() => {
    if (initialData) {
      const featsMap = {
        custom_smtp: initialData.features?.includes("custom_smtp") || false,
        open_tracking: initialData.features?.includes("open_tracking") || false,
        click_tracking: initialData.features?.includes("click_tracking") || false,
        webhooks: initialData.features?.includes("webhooks") || false,
      };
      return {
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        monthly_email_limit: formatNumberStr(initialData.monthly_email_limit ?? 0),
        daily_email_limit: formatNumberStr(initialData.daily_email_limit ?? 0),
        rate_per_minute: formatNumberStr(initialData.rate_per_minute ?? 0),
        max_domains: formatNumberStr(initialData.max_domains ?? 0),
        max_api_keys: formatNumberStr(initialData.max_api_keys ?? 0),
        max_webhooks: formatNumberStr(initialData.max_webhooks ?? 0),
        log_retention_days: formatNumberStr(initialData.log_retention_days ?? 30),
        price_monthly_idr: formatNumberStr(initialData.price_monthly_idr ?? 0),
        price_yearly_idr: formatNumberStr(initialData.price_yearly_idr ?? 0),
        overage_per_1k_idr: formatNumberStr(initialData.overage_per_1k_idr ?? 0),
        is_public: initialData.is_public ?? true,
        is_active: initialData.is_active ?? true,
        sort_order: formatNumberStr(initialData.sort_order ?? 1),
        badge_text: initialData.badge_text || "",
        badge_color: initialData.badge_color || "orange",
        features: featsMap,
      };
    }
    return defaultFormState;
  });

  const handleInputChange = (field: string, val: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleFeatureChange = (featureKey: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: checked,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Nama dan Slug paket harus diisi.");
      return;
    }

    setSubmitting(true);

    const selectedFeatures: string[] = [];
    Object.entries(form.features).forEach(([key, enabled]) => {
      if (enabled) selectedFeatures.push(key);
    });

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      monthly_email_limit: parseNumberStr(form.monthly_email_limit),
      daily_email_limit: parseNumberStr(form.daily_email_limit),
      rate_per_minute: parseNumberStr(form.rate_per_minute),
      max_domains: parseNumberStr(form.max_domains),
      max_api_keys: parseNumberStr(form.max_api_keys),
      max_webhooks: parseNumberStr(form.max_webhooks),
      log_retention_days: parseNumberStr(form.log_retention_days),
      price_monthly_idr: parseNumberStr(form.price_monthly_idr),
      price_yearly_idr: parseNumberStr(form.price_yearly_idr),
      overage_per_1k_idr: parseNumberStr(form.overage_per_1k_idr),
      is_public: form.is_public,
      is_active: form.is_active,
      sort_order: parseNumberStr(form.sort_order),
      badge_text: form.badge_text,
      badge_color: form.badge_color,
      features: selectedFeatures,
    };

    try {
      if (editingId) {
        await api.admin.updatePlan(editingId, payload);
        toast.success(`Paket ${form.name} berhasil diperbarui.`);
      } else {
        await api.admin.createPlan(payload);
        toast.success(`Paket ${form.name} berhasil dibuat.`);
      }
      router.push("/admin/plans");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan konfigurasi paket.");
    } finally {
      setSubmitting(false);
    }
  };

  const monthlyPriceNum = parseNumberStr(form.price_monthly_idr);
  const formattedMonthlyPrice = monthlyPriceNum === 0 ? "Rp 0" : `Rp ${monthlyPriceNum.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/plans"
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <SparklesIcon className="h-7 w-7 text-orange-500" />
            {editingId ? "Ubah Konfigurasi Paket" : "Buat Paket Langganan Baru"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Ubah parameter pricing dan limitasi server email. Live preview di sisi kanan memperbarui secara instan.
          </p>
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden p-0">
        <CardContent className="p-0 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-900">
          {/* COLUMN 1: FORM INPUTS */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-name" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Paket</Label>
                <Input 
                  id="plan-name"
                  value={form.name}
                  onChange={(e) => {
                    handleInputChange("name", e.target.value);
                    handleInputChange("slug", e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                  }}
                  placeholder="Contoh: Premium Pro"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-slug" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Slug (Otomatis)</Label>
                <Input 
                  id="plan-slug"
                  value={form.slug}
                  disabled
                  placeholder="premium-pro"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-500 cursor-not-allowed font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="plan-desc" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Deskripsi Pendek</Label>
                <Input 
                  id="plan-desc"
                  value={form.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Cocok untuk startup berskala menengah dengan traffic email stabil"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-monthly-price" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Harga Bulanan (Rp)</Label>
                <Input 
                  id="plan-monthly-price"
                  type="text"
                  value={form.price_monthly_idr}
                  onChange={(e) => handleInputChange("price_monthly_idr", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-yearly-price" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Harga Tahunan (Rp)</Label>
                <Input 
                  id="plan-yearly-price"
                  type="text"
                  value={form.price_yearly_idr}
                  onChange={(e) => handleInputChange("price_yearly_idr", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-monthly-limit" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Limit Email Bulanan (-1 Unlim)</Label>
                <Input 
                  id="plan-monthly-limit"
                  type="text"
                  value={form.monthly_email_limit}
                  onChange={(e) => handleInputChange("monthly_email_limit", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-daily-limit" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Limit Email Harian (-1 Unlim)</Label>
                <Input 
                  id="plan-daily-limit"
                  type="text"
                  value={form.daily_email_limit}
                  onChange={(e) => handleInputChange("daily_email_limit", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-domains" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Domain Maksimal</Label>
                <Input 
                  id="plan-domains"
                  type="text"
                  value={form.max_domains}
                  onChange={(e) => handleInputChange("max_domains", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-api-keys" className="text-xs font-bold text-slate-500 uppercase tracking-wide">API Keys Maksimal</Label>
                <Input 
                  id="plan-api-keys"
                  type="text"
                  value={form.max_api_keys}
                  onChange={(e) => handleInputChange("max_api_keys", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-webhooks" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Webhooks Maksimal</Label>
                <Input 
                  id="plan-webhooks"
                  type="text"
                  value={form.max_webhooks}
                  onChange={(e) => handleInputChange("max_webhooks", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-retention" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Retensi Log (Hari)</Label>
                <Input 
                  id="plan-retention"
                  type="text"
                  value={form.log_retention_days}
                  onChange={(e) => handleInputChange("log_retention_days", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              {/* Overrides Badge Settings */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-badge-text" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Teks Badge (Opsional)</Label>
                <Input 
                  id="plan-badge-text"
                  value={form.badge_text}
                  onChange={(e) => handleInputChange("badge_text", e.target.value)}
                  placeholder="Populer / Best Value"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="plan-order" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sort Urutan Tampil</Label>
                <Input 
                  id="plan-order"
                  type="text"
                  value={form.sort_order}
                  onChange={(e) => handleInputChange("sort_order", formatNumberStr(e.target.value))}
                  className="bg-white border-slate-200"
                />
              </div>

              {/* Switchers */}
              <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="plan-active" className="text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer">Aktif di Billing</Label>
                  <Switch id="plan-active" checked={form.is_active} onCheckedChange={(checked) => handleInputChange("is_active", checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="plan-public" className="text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer">Tampil Publik</Label>
                  <Switch id="plan-public" checked={form.is_public} onCheckedChange={(checked) => handleInputChange("is_public", checked)} />
                </div>
              </div>

              {/* Premium Features List */}
              <div className="col-span-2 border-t border-slate-100 dark:border-slate-900 pt-4 space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Akses Fitur Premium</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between border border-slate-100 dark:border-slate-900 rounded-lg p-2 bg-slate-50/50">
                    <Label htmlFor="feat-smtp" className="text-xs text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">Custom SMTP Relay</Label>
                    <Switch id="feat-smtp" checked={form.features.custom_smtp} onCheckedChange={(checked) => handleFeatureChange("custom_smtp", checked)} />
                  </div>
                  <div className="flex items-center justify-between border border-slate-100 dark:border-slate-900 rounded-lg p-2 bg-slate-50/50">
                    <Label htmlFor="feat-open" className="text-xs text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">Open Tracking</Label>
                    <Switch id="feat-open" checked={form.features.open_tracking} onCheckedChange={(checked) => handleFeatureChange("open_tracking", checked)} />
                  </div>
                  <div className="flex items-center justify-between border border-slate-100 dark:border-slate-900 rounded-lg p-2 bg-slate-50/50">
                    <Label htmlFor="feat-click" className="text-xs text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">Click Tracking</Label>
                    <Switch id="feat-click" checked={form.features.click_tracking} onCheckedChange={(checked) => handleFeatureChange("click_tracking", checked)} />
                  </div>
                  <div className="flex items-center justify-between border border-slate-100 dark:border-slate-900 rounded-lg p-2 bg-slate-50/50">
                    <Label htmlFor="feat-web" className="text-xs text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">Webhooks Relay</Label>
                    <Switch id="feat-web" checked={form.features.webhooks} onCheckedChange={(checked) => handleFeatureChange("webhooks", checked)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-900 pt-6">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/plans")}>
                Batal
              </Button>
              <Button 
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 cursor-pointer"
              >
                {submitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Simpan Perubahan" : "Buat Paket"}
              </Button>
            </div>
          </form>

          {/* COLUMN 2: LIVE CARD PREVIEW */}
          <div className="p-8 bg-slate-50 dark:bg-slate-900/20 flex flex-col justify-center items-center h-full min-h-[500px]">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 block self-start">
              Live Pricing Card Preview
            </span>

            {/* Responsive Pricing Card (Removed overflow-hidden so badge text overflows beautifully at the top) */}
            <div className="w-full max-w-sm rounded-2xl border border-orange-500/20 bg-white dark:bg-slate-950 p-6 shadow-xl relative backdrop-blur-md transition-all duration-300">
              {form.badge_text && (
                <span className="absolute -top-3.5 right-6 bg-linear-to-r from-orange-500 to-amber-500 text-[10px] font-extrabold text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                  {form.badge_text}
                </span>
              )}
              
              <span className="text-sm font-black text-orange-500 uppercase tracking-widest">
                {form.name || "Nama Plan"}
              </span>
              
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  {formattedMonthlyPrice}
                </span>
                {monthlyPriceNum > 0 && <span className="text-xs text-slate-400 font-semibold">/ bulan</span>}
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[32px] line-clamp-2 leading-relaxed">
                {form.description || "Deskripsi singkat mengenai target pengguna plan ini."}
              </p>

              <ul className="text-xs text-slate-600 dark:text-slate-350 mt-6 space-y-3 border-t border-slate-100 dark:border-slate-900 pt-5">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-white">
                    {parseNumberStr(form.monthly_email_limit) === -1 ? "Email Tak Terbatas" : `${form.monthly_email_limit} email/bln`}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Kuota Harian: <strong className="text-slate-800 dark:text-white">{parseNumberStr(form.daily_email_limit) === -1 ? "Tak Terbatas" : form.daily_email_limit}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Max sending domain: <strong className="text-slate-800 dark:text-white">{parseNumberStr(form.max_domains) === -1 ? "Tak Terbatas" : form.max_domains}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Log Retention: <strong className="text-slate-800 dark:text-white">{form.log_retention_days} hari</strong></span>
                </li>
                {/* premium feature indicators */}
                {Object.entries(form.features).map(([key, enabled]) => {
                  if (!enabled) return null;
                  let featureLabel = "";
                  if (key === "custom_smtp") featureLabel = "Custom SMTP Relay";
                  else if (key === "open_tracking") featureLabel = "Open Tracking analytics";
                  else if (key === "click_tracking") featureLabel = "Link Click Tracking analytics";
                  else if (key === "webhooks") featureLabel = "Webhooks Relay integration";

                  return (
                    <li key={key} className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-orange-600 dark:text-orange-400 font-medium">{featureLabel}</span>
                    </li>
                  );
                })}
              </ul>

              <Button 
                type="button" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-6 cursor-default"
              >
                Pilih Paket
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
