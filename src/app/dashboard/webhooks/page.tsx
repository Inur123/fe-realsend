"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Webhook as WebhookIcon, Plus, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const AVAILABLE_EVENTS = [
  { id: "email.sent", label: "Email Terkirim ke Gateway (email.sent)" },
  { id: "email.delivered", label: "Email Berhasil Sampai (email.delivered)" },
  { id: "email.bounced", label: "Email Bounce / Mental (email.bounced)" },
  { id: "email.opened", label: "Email Dibuka (email.opened)" },
  { id: "email.clicked", label: "Link Email Diklik (email.clicked)" },
  { id: "email.failed", label: "Gagal Kirim (email.failed)" },
];

export default function WebhooksPage() {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["email.delivered", "email.bounced"]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.webhooks.list();
      setWebhooks(list || []);
    } catch (err: any) {
      toast.error("Gagal memuat webhooks", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWebhooks();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchWebhooks]);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    if (selectedEvents.length === 0) {
      toast.error("Pilih minimal satu event.");
      return;
    }

    try {
      await api.webhooks.create({
        url: targetUrl,
        events: selectedEvents,
      });
      toast.success("Webhook berhasil dibuat!");
      setTargetUrl("");
      setIsCreateOpen(false);
      await fetchWebhooks();
    } catch (err: any) {
      toast.error("Gagal membuat webhook", { description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Webhooks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kirim event email secara real-time ke endpoint HTTP POST Anda.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer rounded-lg shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Buat Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Buat Webhook Baru</DialogTitle>
              <DialogDescription>
                RealSend akan mengirimkan payload JSON via POST ke URL target ketika event yang dipilih terpicu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWebhook} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="webhook_url" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target URL Endpoint
                </Label>
                <Input
                  id="webhook_url"
                  placeholder="https://yourdomain.com/webhooks/realsend"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Event untuk Berlangganan
                </Label>
                <div className="grid grid-cols-1 gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {AVAILABLE_EVENTS.map((event) => (
                    <label
                      key={event.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => handleEventToggle(event.id)}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500/20 h-4 w-4 accent-orange-500"
                      />
                      <span className="font-medium text-slate-700">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  className="w-full h-11 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  Buat Webhook
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : webhooks.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-12 text-center">
          <WebhookIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada Webhook</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
            Mulai kirim callback status email ke server Anda dengan mengaktifkan webhook.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="mt-6 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer rounded-lg shadow-sm"
          >
            Buat Webhook Pertama
          </Button>
        </Card>
      ) : (
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Daftar Webhook</CardTitle>
              <CardDescription>
                Menampilkan {webhooks.length} webhook terdaftar di akun Anda.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">No.</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">URL</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Events</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Dibuat</TableHead>
                    <TableHead className="text-right font-semibold text-slate-500 dark:text-slate-400 pr-6 py-4">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook, idx) => (
                    <TableRow key={webhook.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold break-all text-slate-800 dark:text-slate-200">{webhook.url}</span>
                      </TableCell>
                      <TableCell className="py-4 text-slate-500">{webhook.events?.length || 0} events</TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            webhook.is_active
                              ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                              : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900"
                          }`}
                        >
                          {webhook.is_active ? "Aktif" : "Non-aktif"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-slate-500">{formatDate(webhook.created_at)}</TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Button
                          onClick={() => {
                            router.push(`/dashboard/webhooks/${webhook.id}`);
                          }}
                          variant="outline"
                          className="h-9 px-3 border-slate-200 dark:border-slate-800 rounded-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
