"use client";

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2Icon, UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"

function SignupFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Semua kolom harus diisi.");
      return;
    }
    setLoading(true);
    try {
      await register({ full_name: name, email, password });
    } catch {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/80 backdrop-blur-sm bg-white/95 rounded-2xl p-4 sm:p-6">
        <CardHeader className="space-y-1.5 text-center pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Daftar Akun Baru
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Mulai kirim email transaksional dengan kehandalan tinggi dalam beberapa menit saja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Nama Lengkap
              </label>
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                  <UserIcon className="h-5 w-5" />
                </span>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

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

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                  <LockIcon className="h-5 w-5" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center cursor-pointer p-1.5 rounded-lg hover:bg-slate-100/50 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions Container */}
            <div className="flex flex-col gap-3 pt-1">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-linear-to-br from-[#F47920] to-[#D4661A] hover:brightness-110 text-white font-bold cursor-pointer transition-all text-sm shadow-[0_4px_12px_rgba(244,121,32,0.15)]"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Membuat Akun...
                  </>
                ) : (
                  "Mulai Pendaftaran"
                )}
              </Button>

              {/* Separator */}
              <div className="relative flex items-center justify-center py-0.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800/60" />
                </div>
                <span className="relative bg-white dark:bg-slate-950 px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
                  atau
                </span>
              </div>

              {/* Google Signup Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 font-bold cursor-pointer transition-all text-sm flex items-center justify-center gap-2.5 text-slate-700 dark:text-slate-300 shadow-sm"
                onClick={() => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                  window.location.href = `${apiUrl}/api/v1/auth/google`;
                }}
              >
                <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.37C21.68,11.83 21.57,11.43 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.9c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.07,0.97 -3.3,0.97c-2.34,0 -4.33,-1.58 -5.04,-3.71H2.9v2.65C4.38,18.99 7.94,20.9 12,20.9z" fill="#34A853" />
                  <path d="M6.96,13.41c-0.18,-0.54 -0.28,-1.12 -0.28,-1.71s0.1,-1.17 0.28,-1.71V7.34H2.9C2.3,8.53 1.96,9.88 1.96,11.7s0.34,3.17 0.94,4.36L6.96,13.41z" fill="#FBBC05" />
                  <path d="M12,5.92c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.22 14.42,2.42 12,2.42c-4.06,0 -7.62,1.91 -9.1,4.92l4.06,3.16C7.67,7.5 9.66,5.92 12,5.92z" fill="#EA4335" />
                </svg>
                <span>Daftar dengan Google</span>
              </Button>
            </div>

            {/* Redirect Link */}
            <div className="border-t border-slate-100/80 pt-4 text-center text-sm text-slate-500 mt-1">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-semibold text-[#F47920] hover:text-[#D4661A] transition-colors underline underline-offset-4">
                Masuk Disini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function SignupForm(props: React.ComponentProps<"div">) {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center p-8 bg-white/95 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/80 min-h-[400px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-[#F47920]" />
      </div>
    }>
      <SignupFormContent {...props} />
    </React.Suspense>
  )
}
