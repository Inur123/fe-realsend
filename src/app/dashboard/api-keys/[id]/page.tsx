"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import {
  Key,
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
} from "lucide-react";

export default function ApiKeyDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm();

  const [key, setKey] = useState<any>(null);
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showDomainId, setShowDomainId] = useState(false);

  const fetchKeyDetails = React.useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      let data = null;
      try {
        data = await api.apiKeys.get(id);
      } catch {
        const keys = await api.apiKeys.list();
        data = keys.find((item: any) => item.id === id) || null;
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
      toast.error("Gagal memuat detail API Key", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    if (id) {
      const timer = setTimeout(() => {
        if (active) fetchKeyDetails();
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [id, fetchKeyDetails]);

  const handleRevoke = async () => {
    if (!key) return;
    const confirmed = await confirm(
      "Cabut API Key?",
      `Apakah Anda yakin ingin mencabut API Key "${key.name}"? Aplikasi yang memakai key ini akan langsung kehilangan akses.`,
      "destructive",
      "Cabut"
    );
    if (!confirmed) return;

    setRevoking(true);
    try {
      await api.apiKeys.revoke(id);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 h-10 w-10 shrink-0 cursor-pointer shadow-sm"
            onClick={() => router.push("/dashboard/api-keys")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="h-7 w-7 text-orange-500" />
              {key.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              ID: {key.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {isActive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <Trash2 className="h-3.5 w-3.5" />
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
            {revoking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          {isActive ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">API Key Aktif</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                  Key ini masih dapat digunakan untuk mengirim email melalui API.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">API Key Dicabut</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Key ini sudah tidak bisa lagi digunakan oleh aplikasi Anda.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">API Key Prefix</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Prefix</span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  {key.key_prefix}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(key.key_prefix, "prefix")}
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {copiedField === "prefix" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Last 4</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Visible suffix</span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  •••• {key.last_4}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(key.last_4, "last4")}
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {copiedField === "last4" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Binding Domain</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Optional</span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
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
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showDomainId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(key.domain_id_str, "domain")}
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {copiedField === "domain" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
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

            <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Created At</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Timestamp</span>
              </div>
              <div className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all flex-1 select-all">
                  {new Date(key.created_at).toLocaleString("id-ID")}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(key.created_at, "created")}
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {copiedField === "created" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Scopes</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Permissions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(key.scopes || []).map((scope: string) => (
                <span
                  key={scope}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded-full border border-orange-200/50 dark:border-orange-500/20"
                >
                  <Link2 className="h-3 w-3" />
                  {scope}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-white dark:bg-slate-950">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Used</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {key.last_used_at_str || "Belum pernah digunakan"}
              </div>
            </div>
            <div className="border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-white dark:bg-slate-950">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Expires At</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {key.expires_at_str || "Tidak ada masa berlaku"}
              </div>
            </div>
            <div className="border border-slate-100 dark:border-slate-900 rounded-xl p-4 bg-white dark:bg-slate-950">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Last 4</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                •••• {key.last_4}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-900">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {isActive ? "API Key aktif dan siap dipakai." : "API Key ini sudah dicabut."}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog />
    </div>
  );
}
