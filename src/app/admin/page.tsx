"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDateTime } from "@/lib/utils";
import { 
  UsersIcon, 
  MailIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  TrendingUpIcon, 
  ClockIcon, 
  ShieldAlertIcon,
  RefreshCwIcon,
  EyeIcon,
  MousePointerClickIcon
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AuditLog {
  id: string;
  actor_id: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string;
  ip_address: string;
  created_at: string;
}

interface GlobalStats {
  total: number;
  sent: number;
  delivered: number;
  bounced: number;
  failed: number;
  opened: number;
  clicked: number;
}

export default function AdminOverviewPage() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const statsRes = await api.admin.globalOverview(period);
      setStats(statsRes);

      const usersRes = await api.admin.listUsers({ page: 1, per_page: 1 });
      setUserCount(usersRes.total);

      const logsRes = await api.admin.auditLogs({ page: 1, per_page: 5 });
      setRecentLogs(logsRes.logs);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat data dashboard.";
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const deliveryRate = stats?.sent && stats.sent > 0 
    ? ((stats.delivered / stats.sent) * 100).toFixed(2)
    : "0.00";

  const bounceRate = stats?.sent && stats.sent > 0 
    ? ((stats.bounced / stats.sent) * 100).toFixed(2)
    : "0.00";

  const openRate = stats?.delivered && stats.delivered > 0 
    ? ((stats.opened / stats.delivered) * 100).toFixed(2)
    : "0.00";

  const clickRate = stats?.delivered && stats.delivered > 0 
    ? ((stats.clicked / stats.delivered) * 100).toFixed(2)
    : "0.00";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Admin Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Status analitik global, pengguna, dan performa pengiriman email di seluruh sistem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <RefreshCwIcon className={`h-4 w-4 text-slate-500 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Select value={period} onValueChange={(val) => val && setPeriod(val)}>
            <SelectTrigger className="w-36 bg-white dark:bg-slate-950">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="90d">90 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total Pengguna
            </CardTitle>
            <UsersIcon className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {userCount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Akun terdaftar dalam database
            </p>
          </CardContent>
        </Card>

        {/* Total Emails Sent */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-orange-500 to-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total Email Keluar
            </CardTitle>
            <MailIcon className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {stats?.sent.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Volume pengiriman di periode ini
            </p>
          </CardContent>
        </Card>

        {/* Delivery Rate */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Tingkat Terkirim
            </CardTitle>
            <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {deliveryRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.delivered.toLocaleString() || 0} email sukses diterima
            </p>
          </CardContent>
        </Card>

        {/* Bounce Rate */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-rose-500 to-red-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Tingkat Mental (Bounce)
            </CardTitle>
            <XCircleIcon className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {bounceRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.bounced.toLocaleString() || 0} email memantul / gagal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Charts & Additional Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stats Chart */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-orange-500" />
              Performa & Distribusi Pengiriman
            </CardTitle>
            <CardDescription>
              Representasi visual status pengiriman email pada sistem.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center relative">
            {stats && stats.sent > 0 ? (
              <div className="w-full h-full flex flex-col justify-between">
                {/* SVG Visualizer */}
                <div className="flex-1 flex items-end justify-between px-6 pt-4 gap-3">
                  {[
                    { label: "Sent", val: stats.sent, color: "bg-orange-500" },
                    { label: "Delivered", val: stats.delivered, color: "bg-emerald-500" },
                    { label: "Opened", val: stats.opened, color: "bg-blue-500" },
                    { label: "Clicked", val: stats.clicked, color: "bg-indigo-500" },
                    { label: "Bounced", val: stats.bounced, color: "bg-rose-500" },
                    { label: "Failed", val: stats.failed, color: "bg-red-600" }
                  ].map((item) => {
                    const percentage = ((item.val / stats.sent) * 100).toFixed(0);
                    const heightPercent = Math.max(12, Math.min(100, (item.val / stats.sent) * 100));
                    return (
                      <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                        <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.val.toLocaleString()}
                        </span>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-t-lg h-36 flex items-end overflow-hidden">
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className={`w-full ${item.color} rounded-t-lg transition-all duration-500 group-hover:brightness-110`}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-400 mt-1 uppercase tracking-wider">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold leading-none">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-2">
                <p className="text-slate-400 text-sm font-medium">Tidak ada data email terekam pada periode ini.</p>
                <p className="text-slate-500 text-xs">Pastikan agent worker dan server API berjalan normal.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Click and Open Rates */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
              Rasio Interaksi (Engagement)
            </CardTitle>
            <CardDescription>
              Tingkat pembacaan dan klik link email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <EyeIcon className="h-4 w-4 text-blue-500" />
                  Rasio Dibuka (Open Rate)
                </span>
                <span className="font-bold text-slate-800 dark:text-white">{openRate}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-linear-to-r from-blue-500 to-indigo-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, parseFloat(openRate))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {stats?.opened.toLocaleString() || 0} email berhasil dibuka oleh penerima.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MousePointerClickIcon className="h-4 w-4 text-indigo-500" />
                  Rasio Klik Link (CTR)
                </span>
                <span className="font-bold text-slate-800 dark:text-white">{clickRate}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, parseFloat(clickRate))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {stats?.clicked.toLocaleString() || 0} tautan di dalam email diklik oleh penerima.
              </p>
            </div>

            <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl text-[11px] text-slate-500 flex items-start gap-2.5">
              <ClockIcon className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
              <span>
                Statistik interaksi hanya akan dicatat jika opsi **Open Tracking** atau **Click Tracking** diaktifkan pada metadata pengiriman email.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Logs */}
      <Card className="border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
              Log Audit Terkini
            </CardTitle>
            <CardDescription>
              Aksi administratif yang baru saja dilakukan oleh Administrator.
            </CardDescription>
          </div>
          <Link 
            href="/admin/audit-logs" 
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-orange-500 font-bold hover:text-orange-600")}
          >
            Lihat Semua
          </Link>
        </CardHeader>
        <CardContent>
          {recentLogs && recentLogs.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-900">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <ShieldAlertIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Aktor: {log.actor_email || "System"} • IP: {log.ip_address}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              Tidak ada log audit tercatat.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
