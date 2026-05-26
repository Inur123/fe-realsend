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
import { Key, Plus, Loader2, Copy, Check, AlertCircle, ShieldCheck, Eye } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.apiKeys.list();
      setKeys(list || []);
    } catch (err: any) {
      toast.error("Gagal memuat API Keys", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKeys();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchKeys]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    try {
      const res = await api.apiKeys.create(newKeyName);
      const secret = res.raw_key || res.key || res.api_key;
      if (secret) {
        setCreatedKey(secret);
        setIsSecretOpen(true);
      } else {
        toast.success("API Key berhasil dibuat!");
      }
      setNewKeyName("");
      setIsCreateOpen(false);
      await fetchKeys();
    } catch (err: any) {
      toast.error("Gagal membuat API Key", { description: err.message });
    }
  };

  const copyToClipboard = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey);
    setCopied(true);
    toast.success("API Key disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">API Keys</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gunakan API Key untuk mengintegrasikan pengiriman email dari aplikasi backend Anda melalui REST API.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer rounded-lg shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Buat API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Buat API Key Baru</DialogTitle>
              <DialogDescription>
                Beri nama API Key ini agar mudah dikenali saat dipakai oleh aplikasi backend Anda.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateKey} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key_name" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nama Key
                </Label>
                <Input
                  id="key_name"
                  placeholder="Server Produksi Web"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                  required
                />
              </div>
              <DialogFooter className="pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  className="w-full h-11 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  Buat Key
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={isSecretOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreatedKey(null);
          }
          setIsSecretOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4 mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">Simpan API Key Anda</DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Salin kunci ini sekarang. Untuk alasan keamanan, kami tidak akan menampilkan API Key ini kembali setelah dialog ditutup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4 p-4 border border-orange-200/50 bg-orange-50/20 rounded-2xl">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-inner">
              <code className="text-xs font-mono font-bold text-orange-600 break-all select-all flex-1">
                {createdKey}
              </code>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2 text-xs text-orange-700 dark:text-orange-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Jaga kerahasiaan kunci ini. Siapapun yang memiliki key ini dapat mengirim email atas nama domain terverifikasi Anda.
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

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : keys.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-12 text-center">
          <Key className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada API Key</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
            API Key dibutuhkan untuk mengautentikasi pengiriman email dari backend sistem aplikasi Anda.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="mt-6 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold cursor-pointer rounded-lg shadow-sm"
          >
            Buat API Key Pertama
          </Button>
        </Card>
      ) : (
        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Daftar API Key</CardTitle>
              <CardDescription>
                Menampilkan {keys.length} API key terdaftar di akun Anda.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">No.</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Nama API Key</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Prefix</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Last 4</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Dibuat</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Terakhir Digunakan</TableHead>
                    <TableHead className="text-right font-semibold text-slate-500 dark:text-slate-400 pr-6 py-4">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((k, idx) => (
                    <TableRow key={k.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                      <TableCell className="py-4 font-bold text-slate-800 dark:text-slate-200">{k.name}</TableCell>
                      <TableCell className="py-4 font-mono text-slate-500">{k.key_prefix}</TableCell>
                      <TableCell className="py-4 font-mono text-slate-500">•••• {k.last_4}</TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-slate-500">{formatDate(k.created_at)}</TableCell>
                      <TableCell className="py-4 text-slate-500">
                        {k.last_used_at ? formatDateTime(k.last_used_at) : "Belum pernah"}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Button
                          onClick={() => {
                            router.push(`/dashboard/api-keys/${k.id}`);
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
