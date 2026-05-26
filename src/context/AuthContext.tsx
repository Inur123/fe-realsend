"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name?: string;
  full_name: string;
  company_name?: string | { String: string; Valid: boolean };
  company_name_str?: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "suspended" | "pending_verification";
  email_verified: boolean;
  plan_name?: string;
  plan_slug?: string;
  subscription?: {
    id: string;
    plan_id: string;
    status: string;
    emails_sent_this_month: number;
    emails_sent_today: number;
    month_reset_at?: string;
    payment_method?: string;
    started_at?: string;
    plan?: {
      name: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, string>) => Promise<void>;
  register: (userData: Record<string, string>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load auth state from localStorage on startup
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem("realsend_token");
      const storedUser = localStorage.getItem("realsend_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        try {
          // Fetch fresh user data from server to verify token
          const freshUser = await api.auth.me();
          setUser(freshUser);
          localStorage.setItem("realsend_user", JSON.stringify(freshUser));
        } catch (err) {
          if (!(err instanceof Error) || !(err as Error & { isNetworkError?: boolean }).isNetworkError) {
            localStorage.removeItem("realsend_token");
            localStorage.removeItem("realsend_user");
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (credentials: Record<string, string>) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(credentials);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("realsend_token", res.token);
      localStorage.setItem("realsend_user", JSON.stringify(res.user));
      toast.success("Login berhasil!", { description: `Selamat datang kembali, ${res.user.name || res.user.full_name || 'User'}.` });
      router.push("/dashboard");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Login gagal", { description: msg });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Record<string, string>) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(userData);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("realsend_token", res.token);
      localStorage.setItem("realsend_user", JSON.stringify(res.user));
      toast.success("Pendaftaran berhasil!", { description: `Akun Anda telah dibuat.` });
      router.push("/dashboard");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Pendaftaran gagal", { description: msg });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("realsend_token");
    localStorage.removeItem("realsend_user");
    setToken(null);
    setUser(null);
    toast.info("Anda telah logout.");
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const freshUser = await api.auth.me();
      setUser(freshUser);
      localStorage.setItem("realsend_user", JSON.stringify(freshUser));
    } catch {
      // Best-effort refresh; keep the current user state if the API is unavailable.
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
