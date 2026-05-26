"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { SettingsSecuritySkeleton } from "./skeleton";

export default function SettingsSecurityPage() {
  const { user } = useAuth();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    return <SettingsSecuritySkeleton />;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error("Password lama wajib diisi");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.auth.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password berhasil diperbarui", {
        description: "Silakan gunakan password baru untuk login selanjutnya.",
      });
    } catch (err: any) {
      toast.error("Gagal mengubah password", {
        description: err.message,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Pengaturan Akun</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Kelola informasi profil Anda, nama perusahaan, serta ubah kredensial keamanan akun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleChangePassword}>
            <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-orange-500" />
                  Keamanan Akun
                </CardTitle>
                <CardDescription>Amankan akun Anda dengan mengganti password secara berkala.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Password Lama
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="oldPassword"
                      type="password"
                      placeholder="Masukkan password saat ini"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pl-10 h-11 border-slate-200 focus:ring-orange-500/20 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Password Baru
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-11 border-slate-200 focus:ring-orange-500/20 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Konfirmasi Password Baru
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ulangi password baru Anda"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 border-slate-200 focus:ring-orange-500/20 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/5 px-6 py-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold h-11 px-6 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  {passwordLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Ubah Password
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-linear-to-tr from-slate-900 to-slate-800 text-white border-none p-5">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <ShieldCheck className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle className="text-base font-bold">Keamanan Akun</CardTitle>
              <CardDescription className="text-slate-300">
                Jaga password dan kredensial login tetap aman dengan menggantinya secara berkala.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Utama</span>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Sesi</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200">
                    Aktif
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
