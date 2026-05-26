"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import {
  Webhook as WebhookIcon,
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function WebhookDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm();

  const [webhook, setWebhook] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  const fetchWebhookDetails = React.useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.webhooks.get(id);
      setWebhook(data.webhook);
      setLogs(data.logs || []);
    } catch (err: any) {
      toast.error("Gagal memuat detail webhook", { description: err.message });
      router.push("/dashboard/webhooks");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    let active = true;
    if (id) {
      const timer = setTimeout(() => {
        if (active) fetchWebhookDetails();
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [id, fetchWebhookDetails]);

  const handleToggle = async (checked: boolean) => {
    if (!webhook) return;
    setToggling(true);
    try {
      const updated = await api.webhooks.update(id, {
        url: webhook.url,
        events: webhook.events,
        is_active: checked,
      });
      setWebhook(updated);
      toast.success(checked ? "Webhook diaktifkan" : "Webhook dinonaktifkan");
      setLoadingLogs(true);
      const refreshed = await api.webhooks.get(id);
      setLogs(refreshed.logs || []);
    } catch (err: any) {
      toast.error("Gagal memperbarui webhook", { description: err.message });
    } finally {
      setToggling(false);
      setLoadingLogs(false);
    }
  };

  const handleDelete = async () => {
    if (!webhook) return;
    const confirmed = await confirm(
      "Hapus Webhook?",
      "Apakah Anda yakin ingin menghapus webhook ini? Semua log delivery yang terkait akan ikut terhapus dari tampilan.",
      "destructive",
      "Hapus"
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.webhooks.delete(id);
      toast.success("Webhook berhasil dihapus");
      router.push("/dashboard/webhooks");
    } catch (err: any) {
      toast.error("Gagal menghapus webhook", { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(field);
    toast.success("Teks berhasil disalin!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

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

  if (!webhook) {
    return (
      <div className="text-center p-8 text-slate-500">
        Webhook tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 shrink-0 cursor-pointer shadow-sm"
            onClick={() => router.push("/dashboard/webhooks")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <WebhookIcon className="h-7 w-7 text-orange-500" />
              Webhook Detail
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm break-all">
              {webhook.url}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
              webhook.is_active
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200"
                : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            }`}
          >
            {webhook.is_active ? "Aktif" : "Non-aktif"}
          </span>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="outline"
            size="icon"
            title="Hapus Webhook"
            aria-label="Hapus Webhook"
            className="border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:hover:bg-red-950/30 h-9 rounded-lg cursor-pointer"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          {webhook.is_active ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Webhook Aktif</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                  RealSend akan mengirimkan event ke endpoint ini setiap kali trigger yang dipilih terjadi.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Webhook Non-aktif</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Callback untuk webhook ini sedang dijeda.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-900 rounded-xl">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Status Webhook</div>
              <p className="text-xs text-slate-400">Aktifkan atau non-aktifkan pengiriman callback event.</p>
            </div>
            <Switch
              checked={webhook.is_active}
              onCheckedChange={handleToggle}
              disabled={toggling}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Target URL</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Endpoint</span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  {webhook.url}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(webhook.url, "url")}
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {copiedKey === "url" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Signing Secret (HMAC)</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Secret</span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  {showSecret ? webhook.secret : "••••••••••••••••••••••••••••••••••••••••"}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSecret(!showSecret)}
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(webhook.secret, "secret")}
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {copiedKey === "secret" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Event Berlangganan</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Triggers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(webhook.events || []).map((ev: string) => (
                <span
                  key={ev}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded-full border border-orange-200/50 dark:border-orange-500/20"
                >
                  <ChevronRight className="h-3 w-3" />
                  {ev}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-white dark:bg-slate-950">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Created At</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {new Date(webhook.created_at).toLocaleString("id-ID")}
              </div>
            </div>
            <div className="border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-white dark:bg-slate-950">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Triggered</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {webhook.last_triggered_str || "Belum pernah dipicu"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-900">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {loadingLogs ? "Menyegarkan logs..." : `${logs.length} delivery log tersedia`}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Delivery Logs Terkini</h3>
            <p className="text-xs text-slate-500 mt-1">Riwayat respon POST HTTP untuk pengiriman event webhook.</p>
          </div>

          {loadingLogs ? (
            <div className="flex py-8 justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400">Belum ada pengiriman event terpicu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-900 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="text-left text-xs font-bold py-2.5 px-4">Event</th>
                    <th className="text-left text-xs font-bold py-2.5 px-4">Status Respon</th>
                    <th className="text-left text-xs font-bold py-2.5 px-4">Percobaan</th>
                    <th className="text-left text-xs font-bold py-2.5 px-4">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-slate-100 dark:border-slate-900 hover:bg-slate-50/20 text-xs">
                      <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300">{log.event_type}</td>
                      <td className="py-2.5 px-4">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            {log.response_status?.Int32 || log.response_status || 200} OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">
                            <XCircle className="h-3 w-3" />
                            {log.response_status?.Int32 || log.response_status || "ERR"} Gagal
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{log.attempts}x</td>
                      <td className="py-2.5 px-4 text-slate-400">{new Date(log.created_at).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog />
    </div>
  );
}
