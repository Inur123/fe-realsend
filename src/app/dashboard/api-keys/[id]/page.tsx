"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import {
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  Clock,
  Globe,
  Link2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function ApiKeyDetailPage() {
  const { id: routeId } = useParams() as { id: string };
  const [currentId, setCurrentId] = useState(routeId);
  const [prevRouteId, setPrevRouteId] = useState(routeId);
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm();

  if (routeId !== prevRouteId) {
    setPrevRouteId(routeId);
    setCurrentId(routeId);
  }

  const [key, setKey] = useState<any>(null);
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showDomainId, setShowDomainId] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);


  const fetchKeyDetails = React.useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        let data = null;
        try {
          data = await api.apiKeys.get(currentId);
        } catch {
          const keys = await api.apiKeys.list();
          data = keys.find((item: any) => item.id === currentId) || null;
        }

        setKey(data);

        if (data?.domain_id_str) {
          try {
            const dom = await api.domains.get(data.domain_id_str);
            setDomain(dom?.domain || null);
          } catch {
            setDomain(null);
          }
        } else {
          setDomain(null);
        }
      } catch (err: any) {
        toast.error("Gagal memuat detail API Key", {
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [currentId],
  );

  useEffect(() => {
    let active = true;
    if (currentId) {
      // Avoid loading fetch if key details are already populated for the currentId
      if (key && key.id === currentId) {
        return;
      }
      const timer = setTimeout(() => {
        if (active) fetchKeyDetails();
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [currentId, key, fetchKeyDetails]);

  const handleRevoke = async () => {
    if (!key) return;
    const confirmed = await confirm(
      "Cabut API Key?",
      `Apakah Anda yakin ingin mencabut API Key "${key.name}"? Aplikasi yang memakai key ini akan langsung kehilangan akses.`,
      "destructive",
      "Cabut",
    );
    if (!confirmed) return;

    setRevoking(true);
    try {
      await api.apiKeys.revoke(currentId);
      toast.success("API Key berhasil dicabut");
      router.push("/dashboard/api-keys");
    } catch (err: any) {
      toast.error("Gagal mencabut API Key", { description: err.message });
    } finally {
      setRevoking(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Teks berhasil disalin!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRegenerateSecret = async () => {
    if (!key) return;
    const confirmed = await confirm(
      "Regenerate API Key Secret?",
      `Ini akan mencabut API Key "${key.name}" yang lama dan membuat secret baru. Aplikasi yang menggunakan key lama akan langsung kehilangan akses.`,
      "destructive",
      "Ya, Regenerate",
    );
    if (!confirmed) return;

    setRegenerating(true);
    try {
      // Revoke old key
      await api.apiKeys.revoke(currentId);
      // Create new key with same name
      const res = await api.apiKeys.create(key.name);
      const secret = res?.data?.token;
      if (!secret) {
        toast.error("Secret baru tidak diterima dari backend.");
        return;
      }
      setCreatedKey(secret);
      setIsSecretOpen(true);
      toast.success("API Key Secret berhasil di-regenerate!");

      const newKeyId = res?.data?.metadata?.id;
      if (newKeyId) {
        setCurrentId(newKeyId);
        setKey(res.data.metadata);
        setDomain(null);
        window.history.replaceState(
          null,
          "",
          `/dashboard/api-keys/${newKeyId}`,
        );
      }
    } catch (err: any) {
      toast.error("Gagal regenerate secret", { description: err.message });
    } finally {
      setRegenerating(false);
    }
  };

  const copySecret = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey);
    setSecretCopied(true);
    toast.success("API Key disalin!");
    setTimeout(() => setSecretCopied(false), 2000);
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

  if (!key) {
    return (
      <div className="text-center p-8 text-slate-500">
        API Key tidak ditemukan.
      </div>
    );
  }

  const isActive = key.is_active;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 shrink-0 cursor-pointer shadow-sm"
            onClick={() => router.push("/dashboard/api-keys")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-all">
              {key.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm break-all">
              ID: {key.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {isActive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              Revoked
            </span>
          )}
          <Button
            onClick={handleRevoke}
            disabled={revoking || !isActive}
            variant="outline"
            size="icon"
            title="Cabut API Key"
            aria-label="Cabut API Key"
            className="border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:hover:bg-red-950/30 h-9 w-9 rounded-lg cursor-pointer"
          >
            {revoking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          {isActive ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  API Key Aktif
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                  Key ini masih dapat digunakan untuk mengirim email melalui
                  API.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  API Key Dicabut
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Key ini sudah tidak bisa lagi digunakan oleh aplikasi Anda.
                </p>
              </div>
            </div>
          )}

          {/* ── API Key Secret ─────────────────────────────── */}
          <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                API Key Secret
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Hidden
              </span>
            </div>
            <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 min-h-[40px]">
              <code className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all flex-1 select-none">
                {key.key_prefix}••••••••••••••••••••••••••••••••
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateSecret}
                disabled={regenerating || !isActive}
                className="shrink-0 h-8 px-3 text-xs font-bold border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30 cursor-pointer rounded-lg"
                title="Regenerate secret baru untuk API Key ini"
              >
                {regenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Regenerate Secret
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Secret penuh hanya muncul saat API Key pertama kali dibuat atau
              di-regenerate. Klik <strong>Regenerate Secret</strong> jika Anda
              lupa atau perlu memperbarui secret.
            </p>
          </div>

          {/* ── Binding Domain & Created At ─────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Binding Domain */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Binding Domain
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Optional
                </span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 h-10">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  {showDomainId
                    ? key.domain_id_str || "Tidak terikat ke domain"
                    : key.domain_id_str
                      ? "••••••••••••••••••••••••••••••••••••••"
                      : "Tidak terikat ke domain"}
                </code>
                {key.domain_id_str && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowDomainId(!showDomainId)}
                      className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showDomainId ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(key.domain_id_str, "domain")
                      }
                      className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {copiedField === "domain" ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
              {domain?.domain_name && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Domain: {domain.domain_name}</span>
                </div>
              )}
            </div>

            {/* Created At */}
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Created At
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Timestamp
                </span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 h-10">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  {new Date(key.created_at).toLocaleString("id-ID")}
                </code>
              </div>
            </div>
          </div>

          {/* ── Scopes ─────────────────────────────────────── */}
          <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Scopes
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Permissions
              </span>
            </div>
            <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 min-h-[40px]">
              {(key.scopes || []).length > 0 ? (
                (key.scopes || []).map((scope: string) => (
                  <span
                    key={scope}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded-full border border-orange-200/50 dark:border-orange-500/20"
                  >
                    <Link2 className="h-3 w-3" />
                    {scope}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-mono">
                  Tidak ada scope
                </span>
              )}
            </div>
          </div>

          {/* ── Last Used & Expires At ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Last Used
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Activity
                </span>
              </div>
              <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 min-h-[40px]">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 flex-1">
                  {key.last_used_at_str || "Belum pernah digunakan"}
                </code>
              </div>
            </div>
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Expires At
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Validity
                </span>
              </div>
              <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 min-h-[40px]">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 flex-1">
                  {key.expires_at_str || "Tidak ada masa berlaku"}
                </code>
              </div>
            </div>
          </div>

          {/* ── Footer Status ────────────────────────────────── */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-900 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {isActive
              ? "API Key aktif dan siap dipakai."
              : "API Key ini sudah dicabut."}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isSecretOpen}
        onOpenChange={(open) => {
          setIsSecretOpen(open);
          if (!open) {
            setCreatedKey(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4 mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">
              Simpan API Key Anda
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Salin kunci ini sekarang. Untuk alasan keamanan, kami tidak akan
              menampilkan API Key ini kembali setelah dialog ditutup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4 p-4 border border-orange-200/50 bg-orange-50/20 rounded-2xl">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-inner">
              <code className="text-xs font-mono font-bold text-orange-600 break-all select-all flex-1">
                {createdKey}
              </code>
              <Button
                onClick={copySecret}
                variant="outline"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg shrink-0"
              >
                {secretCopied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2 text-xs text-orange-700 dark:text-orange-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Jaga kerahasiaan kunci ini. Siapapun yang memiliki key ini dapat
                mengirim email atas nama domain terverifikasi Anda.
              </span>
            </div>
          </div>
          <DialogFooter className="sm:justify-center border-t border-slate-100 pt-4">
            <Button
              onClick={() => setIsSecretOpen(false)}
              className="w-full sm:w-auto px-6 h-11 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg cursor-pointer shadow-sm"
            >
              Saya Sudah Menyimpannya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}
