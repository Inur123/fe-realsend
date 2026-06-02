"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2Icon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FullPageLoading } from "@/components/full-page-loading";

function LoginFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();

  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  useEffect(() => {
    if (errorParam) {
      toast.error("Login gagal", { description: errorParam });
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
    if (messageParam) {
      toast.info(messageParam);
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [errorParam, messageParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login({ email, password });
    } catch {
      // Ignored: error is already handled and displayed as toast inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-[8px] border border-[#DCE3EE] bg-white/96 px-4 pt-6 pb-5 shadow-[0_8px_24px_rgba(21,37,65,0.05)] backdrop-blur-sm sm:px-7 sm:pt-8 sm:pb-6">
        <CardHeader className="space-y-3 text-center pb-3">
          <div className="flex justify-center">
            <Link
              href="/"
              className="flex items-center bg-transparent border-0 p-0 cursor-pointer shrink-0"
            >
              <Image
                src="/images/logo-text-realsend.png"
                alt="RealSend Logo"
                width={242}
                height={72}
                className="h-[42px] w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-[20px] font-extrabold tracking-normal text-[#071938]">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="mx-auto max-w-[310px] text-[13px] leading-6 text-[#647490]">
              Masukkan email dan password Anda untuk masuk ke dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[12px] font-extrabold text-[#20304A]"
              >
                Alamat Email
              </label>
              <div className="relative w-full">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#91A3BD] pointer-events-none flex items-center">
                  <MailIcon className="h-5 w-5" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-[8px] border-[#D9E0EA] bg-white px-5 pl-14 text-[12px] font-semibold text-[#17233A] shadow-[0_1px_0_rgba(15,23,42,0.02)] placeholder:text-[#17233A] focus-visible:border-[#8EA4C5] focus-visible:ring-[#8EA4C5]/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[12px] font-extrabold text-[#20304A]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-[#FF6B0F] transition-colors hover:text-[#D4661A] hover:underline underline-offset-4"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative w-full">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#91A3BD] pointer-events-none flex items-center">
                  <LockIcon className="h-5 w-5" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-[8px] border-[#D9E0EA] bg-white px-5 pl-14 pr-14 text-[12px] font-semibold text-[#17233A] shadow-[0_1px_0_rgba(15,23,42,0.02)] placeholder:text-[#17233A] focus-visible:border-[#8EA4C5] focus-visible:ring-[#8EA4C5]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#91A3BD] hover:text-[#52657F] focus:outline-none flex items-center cursor-pointer p-1.5 rounded-[8px] hover:bg-slate-100/70 transition-colors"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
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
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-linear-to-r from-[#FF7A1A] to-[#F15A00] text-[14px] font-extrabold text-white shadow-[0_12px_24px_rgba(241,90,0,0.24)] transition-all hover:brightness-105"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Masuk ke Akun...
                  </>
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>

              {/* Separator */}
              <div className="relative flex items-center justify-center py-0.5 xl:py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6ECF4]" />
                </div>
                <span className="relative bg-white px-4 text-[10px] font-extrabold uppercase tracking-normal text-[#7890B2] select-none">
                  atau
                </span>
              </div>

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[8px] border border-[#D9E0EA] bg-white text-[14px] font-extrabold text-[#253653] shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all hover:border-[#B8C5D8] hover:bg-slate-50"
                onClick={() => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                  window.location.href = `${apiUrl}/auth/google`;
                }}
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.37C21.68,11.83 21.57,11.43 21.35,11.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12,20.9c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.07,0.97 -3.3,0.97c-2.34,0 -4.33,-1.58 -5.04,-3.71H2.9v2.65C4.38,18.99 7.94,20.9 12,20.9z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.96,13.41c-0.18,-0.54 -0.28,-1.12 -0.28,-1.71s0.1,-1.17 0.28,-1.71V7.34H2.9C2.3,8.53 1.96,9.88 1.96,11.7s0.34,3.17 0.94,4.36L6.96,13.41z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12,5.92c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.22 14.42,2.42 12,2.42c-4.06,0 -7.62,1.91 -9.1,4.92l4.06,3.16C7.67,7.5 9.66,5.92 12,5.92z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Masuk dengan Google</span>
              </Button>
            </div>

            {/* Redirect link */}
            <div className="mt-1 border-t border-[#EEF2F7] pt-4 text-center text-[13px] text-[#647490]">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                className="font-extrabold text-[#FF6B0F] transition-colors hover:text-[#D4661A] hover:underline underline-offset-4"
              >
                Daftar Disini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <React.Suspense fallback={<FullPageLoading />}>
      <LoginFormContent {...props} />
    </React.Suspense>
  );
}
