"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Star,
  Building2,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

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

const getPlanIcon = (slug: string) => {
  switch (slug.toLowerCase()) {
    case "free":
      return Zap;
    case "starter":
      return Star;
    case "growth":
      return Sparkles;
    case "pro":
    default:
      return Building2;
  }
};

const getPlanBasicFeatures = (plan: Plan) => {
  return [
    `${plan.monthly_email_limit.toLocaleString("id-ID")} email/bulan`,
    `${plan.daily_email_limit.toLocaleString("id-ID")} email/hari`,
    `${plan.max_domains} domain terverifikasi`,
    `${plan.max_api_keys === -1 ? "API key unlimited" : `${plan.max_api_keys} API key`}`,
    `${plan.max_webhooks} webhook`,
    `Log retention ${plan.log_retention_days} hari`,
  ];
};

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

const fmt = (n: number) => {
  if (n === 0) return "Gratis";
  return `Rp ${n.toLocaleString("id-ID")}`;
};

export default function PricingSection() {
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await api.plans.list();
        // Filter public & active plans, sort by sort_order
        const filtered = data
          .filter((p: Plan) => p.is_public && p.is_active)
          .sort((a: Plan, b: Plan) => a.sort_order - b.sort_order);
        setPlans(filtered);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-8 md:py-10 relative">
      <div className="absolute rounded-full blur-[110px] pointer-events-none w-[700px] h-[700px] bg-[#F47920]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#F47920] mb-3">
            Harga Transparan
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight text-slate-800 mb-5">
            Pilih Paket{" "}
            <span className="bg-linear-to-r from-[#F47920] to-[#FF9A4A] bg-clip-text text-transparent">
              yang Tepat
            </span>
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 bg-slate-100 mt-6">
            <span
              className={`text-sm font-semibold transition-colors duration-200 ${yearly ? "text-slate-400" : "text-slate-800"}`}
            >
              Bulanan
            </span>
            <button
              id="billing-toggle"
              onClick={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
              className={`relative w-11 h-6 rounded-full border-0 cursor-pointer shrink-0 transition-colors duration-300 ${yearly ? "bg-[#F47920]" : "bg-slate-900/12"}`}
            >
              <motion.div
                animate={{ x: yearly ? 18 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white"
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${yearly ? "text-slate-800" : "text-slate-400"}`}
            >
              Tahunan
              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-green-500/12 border border-green-500/28 text-[#4ADE80]">
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">
              Belum ada paket
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Tidak ada paket subscription publik yang tersedia saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {plans.map((plan, i) => {
              const icon = getPlanIcon(plan.slug);
              const IconComponent = icon;
              // Growth defaults to Paling Populer, Pro to Best Value if not configured in db
              const badge = plan.badge_text || null;
              const featured = plan.slug === "growth";
              const basicFeatures = getPlanBasicFeatures(plan);

              // Calculate price based on toggle
              const monthlyPrice = plan.price_monthly_idr;
              const yearlyPrice = plan.price_yearly_idr;
              const displayPrice = yearly
                ? Math.round(yearlyPrice / 12)
                : monthlyPrice;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-2xl overflow-visible border transition-all duration-300 ${
                    featured
                      ? "border-[#F47920]/42 bg-linear-to-br from-white to-orange-50 shadow-[0_12px_40px_rgba(244,121,32,0.08)] hover:-translate-y-1 hover:shadow-lg"
                      : "border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:-translate-y-1 hover:shadow-md hover:border-orange-500/22"
                  }`}
                >
                  {/* Badge */}
                  {badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[0.68rem] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full border ${
                          featured
                            ? "bg-[#F47920]/18 border-[#F47920]/42 text-[#F5913A]"
                            : "bg-green-500/12 border-green-500/32 text-[#4ADE80]"
                        }`}
                      >
                        <Sparkles size={10} className="fill-current" />
                        {badge}
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex flex-col gap-5 flex-1">
                    {/* Plan name */}
                    <div>
                      <div
                        className={`w-10 h-10 rounded-lg mb-3.5 flex items-center justify-center border ${
                          featured
                            ? "bg-[#F47920]/18 border-[#F47920]/35"
                            : "bg-slate-900/5 border-slate-900/10"
                        }`}
                      >
                        <IconComponent
                          size={18}
                          color={featured ? "#F47920" : "#64748b"}
                        />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800 m-0">
                        {plan.name}
                      </h3>
                      <p className="text-[0.8rem] text-slate-600 mt-1">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="border-t border-b border-slate-200 py-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={yearly ? "y" : "m"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-[1.65rem] sm:text-[1.85rem] font-black text-slate-800 tracking-tight">
                              {fmt(displayPrice)}
                            </span>
                            {displayPrice > 0 && (
                              <span className="text-xs font-bold text-slate-400">
                                /bln
                              </span>
                            )}
                          </div>
                          {yearly && displayPrice > 0 ? (
                            <p className="text-[0.72rem] text-slate-500 mt-1">
                              Ditagih {fmt(yearlyPrice)}/tahun
                            </p>
                          ) : (
                            <p className="text-[0.72rem] text-transparent select-none mt-1 pointer-events-none">
                              &nbsp;
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F47920] shrink-0" />
                        <span className="text-sm font-bold text-[#F47920]">
                          {plan.monthly_email_limit.toLocaleString("id-ID")}{" "}
                          email/bulan
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="list-none p-0 m-0 flex flex-col gap-2.5 flex-1">
                      {basicFeatures.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-[0.8375rem] text-slate-600"
                        >
                          <Check
                            size={15}
                            color="#4ADE80"
                            className="shrink-0 mt-0.5"
                          />
                          {f}
                        </li>
                      ))}
                      {PREMIUM_FEATURES.map((feat) => {
                        const included = feat.check(plan);
                        return (
                          <li
                            key={feat.key}
                            className={`flex items-start gap-2.5 text-[0.8375rem] ${
                              included
                                ? "text-slate-600 opacity-100 no-underline"
                                : "text-slate-400 opacity-45 line-through"
                            }`}
                          >
                            {included ? (
                              <Check
                                size={15}
                                color="#4ADE80"
                                className="shrink-0 mt-0.5"
                              />
                            ) : (
                              <X
                                size={15}
                                color="#EF4444"
                                className="shrink-0 mt-0.5"
                              />
                            )}
                            {feat.label}
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    <button
                      id={`pricing-${plan.id}`}
                      onClick={() => router.push("/register")}
                      className={`w-full block text-center rounded-lg text-sm mt-2 transition-all duration-200 cursor-pointer outline-none ${
                        featured
                          ? "px-6 py-3 font-bold text-white bg-linear-to-br from-[#F47920] to-[#D4661A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(244,121,32,0.3)] border-0"
                          : "px-6 py-2.5 font-medium text-slate-600 border border-slate-200 bg-transparent hover:text-[#1B2B5B] hover:border-orange-500/40 hover:bg-orange-500/5 hover:-translate-y-0.5"
                      }`}
                    >
                      {plan.slug === "free" ? "Mulai Gratis" : "Coba Sekarang"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Enterprise row */}
        <div className="bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/22 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-slate-800 mb-1">
              Butuh volume lebih besar?
            </p>
            <p className="text-sm text-slate-600 m-0">
              Paket Enterprise: IP pool custom, SLA 99.99%, dedicated support
              engineer.
            </p>
          </div>
          <button
            id="pricing-enterprise"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium text-slate-600 border border-slate-200 hover:text-[#1B2B5B] hover:border-orange-500/40 hover:bg-orange-500/5 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap px-6 py-2.5 text-sm cursor-pointer bg-transparent"
          >
            Hubungi Sales →
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-5">
          Melebihi kuota? Ditagih Rp 1.500 per 1.000 email tambahan — tidak
          langsung diblokir.
        </p>
      </div>
    </section>
  );
}
