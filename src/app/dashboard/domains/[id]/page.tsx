"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { DomainDetailSkeleton } from "../skeleton";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  Copy,
  Check,
  ArrowLeft,
  Trash2,
  CheckCircle,
  Settings,
} from "lucide-react";

export default function DomainDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm();

  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchDomainDetails = React.useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.domains.get(id);
      setDomain(data.domain);
    } catch (err: any) {
      toast.error("Gagal memuat detail domain", { description: err.message });
      router.push("/dashboard/domains");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    let active = true;
    if (id) {
      const timer = setTimeout(() => {
        if (active) {
          fetchDomainDetails();
        }
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [id, fetchDomainDetails]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await api.domains.verify(id);
      if (res.status === "verified") {
        toast.success("Domain terverifikasi!", { description: "Status domain Anda sekarang aktif." });
      } else {
        toast.warning("Verifikasi gagal", {
          description: "Catatan DNS belum terdeteksi. Silakan tunggu beberapa menit dan coba lagi.",
        });
      }
      await fetchDomainDetails(true);
    } catch (err: any) {
      toast.error("Gagal melakukan verifikasi", { description: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!domain) return;
    const confirmed = await confirm(
      "Hapus Domain?",
      `Apakah Anda yakin ingin menghapus domain ${domain.domain_name}? Semua data integrasi domain ini akan terhapus.`,
      "destructive",
      "Hapus"
    );
    if (!confirmed) return;

    try {
      await api.domains.delete(id);
      toast.success("Domain berhasil dihapus");
      router.push("/dashboard/domains");
    } catch (err: any) {
      toast.error("Gagal menghapus domain", { description: err.message });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Teks berhasil disalin!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return <DomainDetailSkeleton />;
  }

  if (!domain) {
    return (
      <div className="text-center p-8 text-slate-500">
        Domain tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 shrink-0 cursor-pointer shadow-sm"
            onClick={() => router.push("/dashboard/domains")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-all">
              {domain.domain_name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm break-all">
              ID: {domain.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {domain.status !== "verified" ? (
            <Button
              onClick={handleVerify}
              disabled={verifying}
              className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold h-9 text-xs rounded-lg cursor-pointer shadow-sm"
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Memeriksa...
                </>
              ) : (
                "Verifikasi DNS"
              )}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-250 uppercase tracking-wider">
              Verified
            </span>
          )}
          <Button
            onClick={handleDelete}
            variant="outline"
            size="icon"
            className="border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:hover:bg-red-950/30 h-9 w-9 rounded-lg cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Domain Status & DNS Records (Takes 7 columns on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
            <CardContent className="pt-6 space-y-6">
              {/* Status Callout (Verified / Pending) */}
              {domain.status === "verified" ? (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Domain Terverifikasi</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                      Domain Anda telah melewati otorisasi SPF, DKIM, dan DMARC. Anda sekarang dapat menggunakan domain ini untuk mengirim email transaksional.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Verifikasi DNS Tertunda</h4>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                      Tambahkan catatan DNS di bawah ini ke penyedia domain Anda (seperti Cloudflare, Niagahoster, dll.) kemudian klik tombol <strong>Verifikasi DNS</strong> di atas untuk memvalidasi otorisasi.
                    </p>
                  </div>
                </div>
              )}

              {/* DNS Records List */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">Konfigurasi Record DNS</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Silakan tambahkan record TXT dan CNAME berikut pada DNS Manager domain Anda.
                  </p>
                </div>

                {/* SPF Record */}
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">SPF Record (TXT)</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Host: @</span>
                  </div>
                  <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                      {domain.spf_record || "v=spf1 include:spf.realsend.web.id ~all"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(domain.spf_record || "v=spf1 include:spf.realsend.web.id ~all", "spf")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {copiedField === "spf" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* DKIM Record */}
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">DKIM Record (TXT)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Host: {domain.dkim_selector || "realsend"}._domainkey</span>
                  </div>
                  <div className="flex gap-2 items-start bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 line-clamp-3 select-all">
                      {domain.dkim_public_key || "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(domain.dkim_public_key, "dkim")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mt-1"
                    >
                      {copiedField === "dkim" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* DMARC Record */}
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">DMARC Record (TXT)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Host: _dmarc</span>
                  </div>
                  <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                      {domain.dmarc_record || "v=DMARC1; p=none; rua=mailto:dmarc@realsend.web.id"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(domain.dmarc_record || "v=DMARC1; p=none; rua=mailto:dmarc@realsend.web.id", "dmarc")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {copiedField === "dmarc" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Return Path CNAME */}
                <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Return-Path CNAME</span>
                    <span className="text-[10px] text-slate-400 font-mono">Host: pm</span>
                  </div>
                  <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                      {domain.return_path_cname || "feedback.realsend.web.id"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(domain.return_path_cname || "feedback.realsend.web.id", "return_path")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {copiedField === "return_path" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: SMTP Relay Configuration (Takes 5 columns on large screens) */}
        <div className="lg:col-span-5">
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden sticky top-6">
            <CardContent className="pt-6 space-y-5">
              <div>
                <h4 className="text-base font-extrabold tracking-tight uppercase text-orange-500 flex items-center gap-1.5">
                  <Settings className="h-5 w-5 text-orange-500 animate-pulse" />
                  SMTP Relay
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Kirim email dari aplikasi atau server eksternal menggunakan kredensial SMTP standar berikut.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Host</span>
                  <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">smtp.realsend.web.id</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("smtp.realsend.web.id", "smtp_host")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {copiedField === "smtp_host" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Port</span>
                  <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">587</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("587", "smtp_port")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {copiedField === "smtp_port" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Username</span>
                  <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">realsend</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("realsend", "smtp_user")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {copiedField === "smtp_user" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Password / API Key</span>
                  <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                    <code className="text-xs font-mono text-slate-400 break-all flex-1 select-all">YOUR_API_KEY</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push("/dashboard/api-keys")}
                      className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                      title="Pergi ke menu API Keys untuk membuat key baru"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex flex-wrap gap-2 pt-2.5 border-t border-slate-150 dark:border-slate-800/80">
                <span>Port Alternatif: <strong>465</strong> (SSL) atau <strong>2525</strong> (Insecure/StartTLS)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
}
