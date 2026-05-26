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
                    Membuat Akun...
                  </>
                ) : (
                  "Mulai Pendaftaran"
                )}
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
