"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailIcon, ArrowLeftIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Silakan masukkan email Anda.");
      return;
    }
    setLoading(true);
    // Simulate sending email reset
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Instruksi reset password terkirim!", {
        description: `Kami telah mengirimkan link reset password ke ${email}.`,
      });
    }, 1500);
  };

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#F8FAFC] overflow-hidden select-none">
      {/* Fine Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#F47920]/5 blur-[80px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[90px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="relative w-full max-w-[440px] z-10 flex flex-col gap-6">
        <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/80 backdrop-blur-sm bg-white/95 rounded-2xl p-4 sm:p-6">
          {!submitted ? (
            <>
              <CardHeader className="space-y-1.5 text-center pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">Lupa Password?</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Masukkan email Anda dan kami akan mengirimkan instruksi reset password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Alamat Email
                    </label>
                    <div className="relative w-full">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                        <MailIcon className="h-5 w-5" />
                      </span>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-xl bg-linear-to-br from-[#F47920] to-[#D4661A] hover:brightness-110 text-white font-bold cursor-pointer transition-all text-sm shadow-[0_4px_12px_rgba(244,121,32,0.15)]"
                    >
                      {loading ? (
                        <>
                          <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                          Mengirim instruksi...
                        </>
                      ) : (
                        "Kirim Link Reset"
                      )}
                    </Button>
                  </div>

                  <div className="border-t border-slate-100/80 pt-4 text-center mt-1">
                    <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeftIcon className="h-4 w-4" />
                      Kembali ke halaman login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-4 text-center">
              <div className="flex flex-col items-center justify-center py-4 w-full">
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-5 shadow-sm">
                  <CheckCircle2Icon className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Permintaan Dikirim</h2>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
                  Jika email <strong>{email}</strong> terdaftar, Anda akan segera menerima email berisi link untuk reset password.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 cursor-pointer h-11 mb-4"
                >
                  Coba email lain
                </Button>
                <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Kembali ke halaman login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
