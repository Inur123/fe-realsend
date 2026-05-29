/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle,
  AlertTriangle,
  Eye,
  MousePointer,
  ArrowRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { DashboardSkeleton } from "./skeleton";
import { toast } from "sonner";

interface OverviewData {
  total: number;
  sent: number;
  delivered: number;
  bounced: number;
  failed: number;
  opened: number;
  clicked: number;
  queued: number;
  rejected: number;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState("7d");

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const now = new Date();
      const end = now.toISOString();
      const start = new Date(
        new Date().setDate(new Date().getDate() - (timePeriod === "7d" ? 7 : 30))
      ).toISOString();

      // Fetch all 3 concurrently instead of sequentially (was ~3x slower before)
      const [overviewRes, dailyRes, logsRes] = await Promise.all([
        api.analytics.overview(timePeriod),
        api.analytics.daily(start, end),
        api.logs.list({ per_page: 5 }),
      ]);

      setOverview(overviewRes);
      setDailyStats(dailyRes || []);
      setRecentLogs(logsRes?.logs || []);
    } catch (err: any) {
      toast.error("Gagal memuat data", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculate rates
  const totalSent = overview?.sent || 0;
  const deliveryRate = totalSent ? ((overview?.delivered || 0) / totalSent) * 100 : 0;
  const bounceRate = totalSent ? ((overview?.bounced || 0) / totalSent) * 100 : 0;
  const openRate = totalSent ? ((overview?.opened || 0) / totalSent) * 100 : 0;
  const clickRate = totalSent ? ((overview?.clicked || 0) / totalSent) * 100 : 0;

  const hasTrafficData = dailyStats.some(
    (item) => (item.sent || 0) > 0 || (item.delivered || 0) > 0,
  );

  // Render SVG Chart
  const renderSVGChart = () => {
    if (!hasTrafficData) {
      return (
        <div className="flex h-64 w-full items-center justify-center rounded-xl border border-slate-100 bg-white/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">
              Tidak ada data email terekam pada periode ini.
            </p>
            <p className="text-xs text-slate-500">
              Kirim email pertama Anda menggunakan API Key agar grafik performa
              muncul di sini.
            </p>
          </div>
        </div>
      );
    }

    const width = 600;
    const height = 200;
    const padding = 20;

    const maxVal = Math.max(...dailyStats.map((d) => d.sent), 10);
    const getX = (idx: number) =>
      dailyStats.length > 1
        ? padding + (idx * (width - padding * 2)) / (dailyStats.length - 1)
        : width / 2;
    const getY = (val: number) => height - padding - (val * (height - padding * 2)) / maxVal;

    const sentPoints = dailyStats.length > 1 
      ? dailyStats.map((d, i) => `${getX(i).toFixed(1)},${getY(d.sent).toFixed(1)}`).join(" ")
      : `${getX(0).toFixed(1)},${getY(dailyStats[0].sent).toFixed(1)}`;
    const delPoints = dailyStats.length > 1
      ? dailyStats.map((d, i) => `${getX(i).toFixed(1)},${getY(d.delivered).toFixed(1)}`).join(" ")
      : `${getX(0).toFixed(1)},${getY(dailyStats[0].delivered).toFixed(1)}`;

    return (
      <div className="w-full h-64 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-between">
        <div className="flex-1 w-full min-h-0">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
              const y = padding + r * (height - padding * 2);
              return (
                <line
                  key={idx}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="dark:stroke-slate-800"
                />
              );
            })}

            {/* Sent Area */}
            <path
              d={`M${getX(0)},${height - padding} L${sentPoints} L${getX(dailyStats.length - 1)},${height - padding} Z`}
              fill="url(#sentGrad)"
            />

            {/* Sent Line */}
            <polyline fill="none" stroke="#f97316" strokeWidth="2" points={sentPoints} />

            {/* Delivered Line */}
            <polyline fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" points={delPoints} />

            {/* Data Dots */}
            {dailyStats.map((d, idx) => (
              <g key={idx} className="group">
                <circle
                  cx={getX(idx)}
                  cy={getY(d.sent)}
                  r="3.5"
                  className="fill-orange-500 stroke-white dark:stroke-slate-900 cursor-pointer transition-all hover:r-5"
                />
                <title>{`${d.date}: ${d.sent} dikirim, ${d.delivered} terkirim`}</title>
              </g>
            ))}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold px-2 uppercase">
          {dailyStats.map((d, idx) => {
            if (dailyStats.length > 7 && idx % 3 !== 0) return null;
            // Format YYYY-MM-DD to DD MMM
            const parts = d.date.split("-");
            const day = parts[2] || "";
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            const monthIdx = parseInt(parts[1], 10) - 1;
            const month = monthNames[monthIdx] || "";
            return <span key={idx}>{`${day} ${month}`}</span>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Selamat Datang, {user?.full_name || user?.name || "User"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Pantau status pengiriman email, analytics, serta integrasi SMTP domain Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Toggles */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/50">
            <button
              onClick={() => setTimePeriod("7d")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                timePeriod === "7d"
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimePeriod("30d")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                timePeriod === "30d"
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              30 Hari
            </button>
          </div>

          <Button
            onClick={() => loadData(true)}
            variant="outline"
            size="icon"
            className="border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Sent Card */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Sent</span>
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-md">
                <Send className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
              {overview?.sent?.toLocaleString() || 0}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              100% terkirim ke gateway
            </p>
          </CardContent>
        </Card>

        {/* Delivered Card */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Delivered</span>
              <div className="p-1.5 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-md">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
              {overview?.delivered?.toLocaleString() || 0}
            </h3>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 font-bold">
              Rate: {deliveryRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        {/* Bounced Card */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Bounced</span>
              <div className="p-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-md">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
              {overview?.bounced?.toLocaleString() || 0}
            </h3>
            <p className={`text-[10px] mt-1 font-bold ${bounceRate > 2 ? "text-red-500" : "text-slate-500"}`}>
              Rate: {bounceRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        {/* Opened Card */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Opened</span>
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-md">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
              {overview?.opened?.toLocaleString() || 0}
            </h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
              Rate: {openRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        {/* Clicked Card */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm col-span-2 md:col-span-1">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Clicked</span>
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-md">
                <MousePointer className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
              {overview?.clicked?.toLocaleString() || 0}
            </h3>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-bold">
              Rate: {clickRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Chart + Recent logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sending Chart */}
        <Card className="lg:col-span-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Trafik Pengiriman</CardTitle>
                <CardDescription className="text-xs text-slate-400">Grafik total email yang dikirim vs terkirim harian.</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Sent
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-green-500 border border-dashed border-green-600" />
                  Delivered
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderSVGChart()}</CardContent>
        </Card>

        {/* Recent logs */}
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Aktivitas Terkini</CardTitle>
              <CardDescription className="text-xs text-slate-400">Daftar pengiriman email terbaru.</CardDescription>
            </div>
            <Link href="/dashboard/email-logs">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:bg-orange-50 gap-1 p-1">
                Semua
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Inbox className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada email</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Semua aktivitas pengiriman email Anda akan dicatat dan muncul secara realtime di panel ini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-900">
                {recentLogs.map((log) => {
                  const statusColors: Record<string, string> = {
                    queued: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",
                    processing: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
                    sent: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400",
                    delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400",
                    bounced: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
                    rejected: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
                    failed: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
                    opened: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400",
                    clicked: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400",
                  };
                  return (
                    <div key={log.id} className="py-3 flex justify-between items-start text-sm">
                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {log.to_address}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                          {log.subject || "(tanpa subjek)"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          statusColors[log.status] || "bg-slate-100 text-slate-600"
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
