"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FullPageLoading } from "@/components/full-page-loading";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const token = searchParams.get("token");

    if (token) {
      hasProcessed.current = true;
      
      const processLogin = async () => {
        try {
          // Store token in localStorage
          localStorage.setItem("realsend_token", token);
          localStorage.setItem("realsend_auth_ts", String(Date.now()));

          // Fetch fresh user data
          const freshUser = await api.auth.me();
          localStorage.setItem("realsend_user", JSON.stringify(freshUser));

          // Save login toast message to sessionStorage so it displays after page reload
          sessionStorage.setItem(
            "realsend_login_toast",
            `Selamat datang kembali, ${freshUser.name || freshUser.full_name || "User"}.`
          );

          // Perform full page reload to refresh auth state in all components cleanly
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Auth callback error:", error);
          localStorage.removeItem("realsend_token");
          localStorage.removeItem("realsend_user");
          localStorage.removeItem("realsend_auth_ts");
          toast.error("Gagal memproses login Google", {
            description: error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
          });
          router.push("/login");
        }
      };

      processLogin();
    } else {
      toast.error("Tautan login tidak valid", {
        description: "Token tidak ditemukan dalam respons Google.",
      });
      router.push("/login");
    }
  }, [searchParams, router]);

  return <FullPageLoading />;
}
