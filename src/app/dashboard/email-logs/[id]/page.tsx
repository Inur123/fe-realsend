"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  MousePointer,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function EmailLogDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.logs.get(id);
      setLog(data);
    } catch (err: any) {
      toast.error("Gagal memuat detail email log", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    if (id) {
      const timer = setTimeout(() => {
        if (active) fetchLogDetails();
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [id, fetchLogDetails]);

  const getStatusBadge = (logStatus: string) => {
    const badges: Record<string, string> = {
      queued: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200",
      processing: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200",
      sent: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200",
      delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200",
      bounced: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200",
      failed: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200",
      opened: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200",
      clicked: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200",
    };

    const badgeClass = badges[logStatus] || "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200";

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${badgeClass}`}>
        {logStatus}
      </span>
    );
  };

  const getNullString = (val: any): string => {
    if (!val) return "";
    if (typeof val === "object" && val !== null && "String" in val) {
      return val.Valid ? val.String : "";
    }
    return typeof val === "string" ? val : "";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl p-6">
          <div className="space-y-6">
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/email-logs")}
          className="rounded-full border-slate-200 hover:bg-slate-50 cursor-pointer shadow-sm text-slate-600 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div className="text-center py-16 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-slate-500 font-semibold">
          Detail log email tidak ditemukan atau Anda tidak memiliki akses.
        </div>
      </div>
    );
  }

  const smtpResponse = getNullString(log.smtp_response);
  const bounceReason = getNullString(log.bounce_reason);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 shrink-0 cursor-pointer shadow-sm"
            onClick={() => router.push("/dashboard/email-logs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Detail Log Pengiriman
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm font-mono break-all">
              ID: {log.id}
            </p>
          </div>
        </div>

        <div className="self-start md:self-center">
          {getStatusBadge(log.status)}
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">

          {log.status === "delivered" ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Email Sukses Terkirim</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                  Email berhasil terkirim dan diterima dengan sukses oleh server email penerima.
                </p>
              </div>
            </div>
          ) : log.status === "bounced" || log.status === "failed" ? (
            <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400">Email Mental / Gagal Kirim</h4>
                <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5 leading-relaxed">
                  Pengiriman email ini gagal karena ditolak atau tidak ditemukan oleh server email tujuan.
                </p>
              </div>
            </div>
          ) : log.status === "opened" || log.status === "clicked" ? (
            <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <Eye className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Email Dibuka / Interaksi</h4>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                  Email telah berhasil dikirim, dan penerima telah membuka atau melakukan klik pada tautan di dalam email.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400">Email Sedang Diproses</h4>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5 leading-relaxed">
                  Email ini sedang berada di dalam antrean sistem untuk segera dikirimkan.
                </p>
              </div>
            </div>
          )}

          {/* Grid Layout for General Info & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: General Info */}
            <div className="space-y-6">
              {/* ── Email Subject ──────────────────────────────── */}
              <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Subject</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Email Subject</span>
                </div>
                <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 min-h-10">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex-1 leading-snug">
                    {log.subject || "(tanpa subjek)"}
                  </span>
                </div>
              </div>

              {/* ── Sender & Recipient ─────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient */}
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Penerima (To)</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Recipient</span>
                  </div>
                  <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 h-10">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                      {log.to_address}
                    </code>
                  </div>
                </div>

                {/* Sender */}
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Pengirim (From)</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Sender</span>
                  </div>
                  <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 h-10">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                      {log.from_address}
                    </code>
                  </div>
                </div>
              </div>

              {/* ── SMTP Response / Bounce info ────────────────── */}
              {(smtpResponse || bounceReason) && (
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Respon Server (SMTP)</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">SMTP / Bounce</span>
                  </div>
                  <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-lg p-5 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                    {smtpResponse && (
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Server Response:</span>
                        <p className="text-emerald-400 break-all whitespace-pre-wrap">{smtpResponse}</p>
                      </div>
                    )}
                    {bounceReason && (
                      <div className={smtpResponse ? "mt-4 pt-4 border-t border-slate-800" : ""}>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Bounce / Fail Reason:</span>
                        <p className="text-rose-400 break-all">{bounceReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Timeline Status */}
            <div className="space-y-6">
              {/* ── Timeline Status ────────────────────────────── */}
              <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50 h-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Timeline Status</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Progress</span>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                  <div className="space-y-6 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-900">
                    {/* Queued */}
                    <div className="flex gap-4 relative">
                      <div className="h-7.5 w-7.5 rounded-full bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center shrink-0 z-10">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Diterima Sistem (Queued)</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {formatDateTime(log.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Sent */}
                    <div className="flex gap-4 relative">
                      <div className={`h-7.5 w-7.5 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                        log.sent_at 
                          ? "bg-orange-50 border-orange-200 text-orange-500" 
                          : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                      }`}>
                        <Send className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${log.sent_at ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                          Dikirim via Relay SMTP (Sent)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.sent_at ? formatDateTime(log.sent_at) : "Menunggu pengiriman..."}
                        </p>
                      </div>
                    </div>

                    {/* Delivered / Bounced / Failed */}
                    <div className="flex gap-4 relative">
                      {log.status === "bounced" || log.status === "failed" ? (
                        <div className="h-7.5 w-7.5 rounded-full bg-red-50 border border-red-200 text-red-500 flex items-center justify-center shrink-0 z-10">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className={`h-7.5 w-7.5 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                          log.delivered_at 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-500" 
                            : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                        }`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-bold ${
                          log.delivered_at 
                            ? "text-slate-800 dark:text-slate-200" 
                            : log.status === "bounced" 
                              ? "text-red-600 dark:text-red-400" 
                              : log.status === "failed" 
                                ? "text-red-600 dark:text-red-400" 
                                : "text-slate-400"
                        }`}>
                          {log.status === "bounced" 
                            ? "Pengiriman Mental (Bounced)" 
                            : log.status === "failed" 
                              ? "Pengiriman Gagal (Failed)" 
                              : "Diterima server tujuan (Delivered)"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.delivered_at 
                            ? formatDateTime(log.delivered_at) 
                            : log.status === "bounced" || log.status === "failed" 
                              ? "Email gagal diterima server tujuan." 
                              : "Menunggu konfirmasi server tujuan..."}
                        </p>
                      </div>
                    </div>

                    {/* Opened */}
                    <div className="flex gap-4 relative">
                      <div className={`h-7.5 w-7.5 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                        log.opened_at 
                          ? "bg-amber-50 border-amber-200 text-amber-500" 
                          : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                      }`}>
                        <Eye className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${log.opened_at ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                          Dibuka oleh penerima (Opened)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.opened_at 
                            ? `${formatDateTime(log.opened_at)} (Terbuka ${log.opened_count || 1}x)` 
                            : "Email belum dibaca penerima."}
                        </p>
                      </div>
                    </div>

                    {/* Clicked */}
                    <div className="flex gap-4 relative">
                      <div className={`h-7.5 w-7.5 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                        log.clicked_at 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-500" 
                          : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                      }`}>
                        <MousePointer className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${log.clicked_at ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                          Link dalam email diklik (Clicked)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.clicked_at 
                            ? `${formatDateTime(log.clicked_at)} (Diklik ${log.clicked_count || 1}x)` 
                            : "Penerima belum mengklik tautan apapun."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
