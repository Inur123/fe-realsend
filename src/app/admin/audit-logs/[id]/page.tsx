"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock3Icon, MapPinIcon, MonitorIcon, NetworkIcon, ShieldAlertIcon, InfoIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface AuditLogDetail {
  id: string;
  actor_id: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string;
  ip_address: string;
  user_agent?: string;
  location?: string;
  created_at: string;
}

function detectBrowser(userAgent?: string) {
  if (!userAgent) return "Tidak tersedia";
  if (userAgent.includes("Edg/")) return "Microsoft Edge";
  if (userAgent.includes("OPR/") || userAgent.includes("Opera")) return "Opera";
  if (userAgent.includes("Firefox/")) return "Mozilla Firefox";
  if (userAgent.includes("Chrome/") && !userAgent.includes("Edg/") && !userAgent.includes("OPR/")) return "Google Chrome";
  if (userAgent.includes("Safari/") && userAgent.includes("Version/") && !userAgent.includes("Chrome/")) return "Safari";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer";
  return "Browser tidak dikenal";
}

function prettyDetails(details: string) {
  if (!details) return "Tidak ada detail payload.";
  let decoded = details;
  try {
    if (/^[A-Za-z0-9+/=]+$/.test(details.trim()) && !details.includes("{")) {
      decoded = atob(details.trim());
    }
  } catch {
    // fallback to original string
  }
  try {
    return JSON.stringify(JSON.parse(decoded), null, 2);
  } catch {
    return decoded;
  }
}

export default function AuditLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [log, setLog] = useState<AuditLogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDetail = async () => {
      if (!id) {
        setError("ID audit log tidak valid.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await api.admin.getAuditLog(id);
        if (!active) return;
        setLog(res);
      } catch (err: unknown) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Gagal memuat detail audit log.";
        setError(message);
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="text-center p-8 text-slate-500">
        Audit log tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-650 hover:bg-slate-50/50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 flex-shrink-0 cursor-pointer shadow-sm bg-white dark:bg-slate-950"
            onClick={() => router.push("/admin/audit-logs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlertIcon className="h-7 w-7 text-orange-500" />
              {log.action}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Log ID: {log.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-850 uppercase tracking-wider">
            {log.target_type}
          </span>
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          {/* Status / Callout Box */}
          <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlertIcon className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400">Aktivitas Audit Terekam</h4>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5 leading-relaxed">
                Aksi <strong>{log.action}</strong> berhasil diselesaikan oleh <strong>{log.actor_email || "System/Internal"}</strong> dari alamat IP <strong>{log.ip_address}</strong>.
              </p>
            </div>
          </div>

          {/* DNS Records list style grid context */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Konteks & Metadata Aktivitas</h3>

            {/* Waktu */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock3Icon className="h-4 w-4 text-slate-400" />
                  Waktu Kejadian
                </span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1">
                  {formatDateTime(log.created_at)}
                </code>
              </div>
            </div>

            {/* IP Address */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <NetworkIcon className="h-4 w-4 text-slate-400" />
                  Alamat IP
                </span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1">
                  {log.ip_address || "Tidak tersedia"}
                </code>
              </div>
            </div>

            {/* Browser */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MonitorIcon className="h-4 w-4 text-slate-400" />
                  Perangkat & Browser (User Agent)
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {detectBrowser(log.user_agent)}
                </span>
                <code className="text-[11px] font-mono text-slate-500 break-all">
                  {log.user_agent || "Tidak tersedia"}
                </code>
              </div>
            </div>

            {/* Lokasi */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  Estimasi Lokasi
                </span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-all flex-1">
                  {log.location || "Tidak tersedia"}
                </code>
              </div>
            </div>

            {/* Target ID & Actor Metadata */}
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/30">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Metadata Identitas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Actor ID</p>
                    <p className="mt-2 break-all font-mono text-xs text-slate-700 dark:text-slate-300">{log.actor_id}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Target ID</p>
                    <p className="mt-2 break-all font-mono text-xs text-slate-700 dark:text-slate-300">{log.target_id || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/30">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Detail Payload JSON</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[14rem] overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 dark:border-slate-800 whitespace-pre-wrap break-all">
                    {prettyDetails(log.details)}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] text-slate-500 flex items-start gap-2.5">
              <InfoIcon className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>
                Data payload di atas disimpan secara permanen di database PostgreSQL untuk keperluan audit keamanan dan kepatuhan sistem.
              </span>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
