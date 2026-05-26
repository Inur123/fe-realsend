"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Building, ShieldCheck, Save, RefreshCw, UserCheck } from "lucide-react";

export default function SettingsProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setFullName(user.full_name || "");
        setCompanyName(user.company_name_str || "");
        setEmail(user.email || "");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong");
      return;
    }
    if (!email.trim()) {
      toast.error("Alamat email tidak boleh kosong");
      return;
    }

    setProfileLoading(true);
    try {
      await api.auth.updateProfile({
        full_name: fullName,
        company_name: companyName,
        email,
      });
      await refreshUser();
      toast.success("Profil berhasil diperbarui", {
        description: "Detail profil Anda telah diperbarui di server.",
      });
    } catch (err: any) {
      toast.error("Gagal memperbarui profil", {
        description: err.message,
      });
    } finally {
      setProfileLoading(false);
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
          <form onSubmit={handleUpdateProfile}>
            <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-orange-500" />
                  Informasi Profil
                </CardTitle>
                <CardDescription>Perbarui nama lengkap dan perusahaan Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="h-4 w-4" />
                      </span>
                      <Input
                        id="fullName"
                        placeholder="Contoh: John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:ring-orange-500/20 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Alamat Email
                    </Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Contoh: user@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:ring-orange-500/20 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nama Perusahaan (Opsional)
                    </Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Building className="h-4 w-4" />
                      </span>
                      <Input
                        id="companyName"
                        placeholder="Contoh: PT RealSend Teknologi"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:ring-orange-500/20 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/5 px-6 py-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold h-11 px-6 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  {profileLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
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
              <CardTitle className="text-base font-bold">Metadata Akun</CardTitle>
              <CardDescription className="text-slate-300">
                Informasi sistem mengenai kredensial login Anda saat ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Utama</span>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role Akses</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200">
                    {user?.role || "user"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Akun</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200">
                    {user?.status || "active"}
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
