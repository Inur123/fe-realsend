"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  SearchIcon, 
  UserXIcon, 
  UserCheckIcon, 
  ShieldCheckIcon, 
  PlusIcon,
  Trash2Icon,
  Loader2Icon,
  InfoIcon,
  ZapIcon,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { formatDate, formatDateTime } from "@/lib/utils";
import { AdminUsersSkeleton } from "./skeleton";

interface Override {
  id: string;
  user_id: string;
  feature_key: string;
  override_value: string;
  note: string;
  expires_at: string | null;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  company_name_str?: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "suspended" | "pending_verification";
  email_verified: boolean;
  plan_name: string;
  last_login_at?: string;
  created_at: string;
  overrides?: Override[];
}

export default function UserManagementPage() {
  const [ConfirmDialog, confirm] = useConfirm();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [plansList, setPlansList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load both users (up to 1000) and subscription plans
      const [usersRes, plansRes] = await Promise.all([
        api.admin.listUsers({ page: 1, per_page: 1000, search: "" }),
        api.admin.listPlans()
      ]);
      setUsers(usersRes.users);
      setPlansList(plansRes);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedPlan("all");
    setPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      !search.trim() ||
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.company_name_str && user.company_name_str.toLowerCase().includes(search.toLowerCase()));

    const matchStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    const matchPlan =
      selectedPlan === "all" ||
      (user.plan_name || "Free Tier").toLowerCase() === selectedPlan.toLowerCase();

    return matchSearch && matchStatus && matchPlan;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / perPage) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  // Selected user context for dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Modals state
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  // New Override form state
  const [newOverrideKey, setNewOverrideKey] = useState("daily_email_limit");
  const [newOverrideValue, setNewOverrideValue] = useState("");
  const [newOverrideBoolean, setNewOverrideBoolean] = useState(true);
  const [newOverrideNote, setNewOverrideNote] = useState("");
  const [newOverrideDuration, setNewOverrideDuration] = useState("");

  const loadUsers = loadData; // Alias for backward compatibility in actions

  // Suspend action
  const openSuspendModal = (user: User) => {
    if (user.role === "super_admin" && currentUser?.role !== "super_admin") {
      toast.error("Hanya Super Admin yang dapat menangguhkan Super Admin.");
      return;
    }
    setSelectedUser(user);
    setSuspendReason("");
    setSuspendModalOpen(true);
  };

  const handleSuspendSubmit = async () => {
    if (!selectedUser) return;
    setSubmittingAction(true);
    try {
      await api.admin.suspendUser(selectedUser.id, suspendReason);
      toast.success(`Pengguna ${selectedUser.email} berhasil ditangguhkan.`);
      setSuspendModalOpen(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menangguhkan pengguna.");
    } finally {
      setSubmittingAction(false);
    }
  };

  // Unsuspend action
  const handleUnsuspend = async (user: User) => {
    if (user.role === "super_admin" && currentUser?.role !== "super_admin") {
      toast.error("Hanya Super Admin yang dapat mengaktifkan Super Admin.");
      return;
    }
    const confirmed = await confirm(
      "Aktifkan Kembali Akun?",
      `Aktifkan kembali akun ${user.email}?`,
      "default",
      "Aktifkan"
    );
    if (!confirmed) return;
    try {
      await api.admin.unsuspendUser(user.id);
      toast.success(`Akun ${user.email} berhasil diaktifkan kembali.`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengaktifkan kembali akun.");
    }
  };
 
  // Delete action
  const handleDeleteUser = async (user: User) => {
    if (currentUser?.role !== "super_admin") {
      toast.error("Hanya Super Admin yang dapat menghapus pengguna.");
      return;
    }
    if (user.id === currentUser?.id) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    const confirmed = await confirm(
      "Hapus Akun Pengguna?",
      `Hapus permanen akun ${user.email}? Semua data pengiriman, domain, dan log milik user ini juga akan dihapus.`,
      "destructive",
      "Hapus Permanen"
    );
    if (!confirmed) return;

    try {
      await api.admin.deleteUser(user.id);
      toast.success(`Akun ${user.email} berhasil dihapus.`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus pengguna.");
    }
  };

  // Change Role action
  const openRoleModal = (user: User) => {
    if (currentUser?.role !== "super_admin") {
      toast.error("Hanya Super Admin yang dapat mengubah role pengguna.");
      return;
    }
    setSelectedUser(user);
    setSelectedRole(user.role);
    setRoleModalOpen(true);
  };

  const handleRoleSubmit = async () => {
    if (!selectedUser || !selectedRole) return;
    if (currentUser?.role !== "super_admin") {
      toast.error("Hanya Super Admin yang dapat mengubah role pengguna.");
      return;
    }
    if (selectedUser.id === currentUser?.id) {
      toast.error("Anda tidak dapat mengubah role Anda sendiri.");
      return;
    }
    setSubmittingAction(true);
    try {
      await api.admin.changeRole(selectedUser.id, selectedRole);
      toast.success(`Role pengguna ${selectedUser.email} diperbarui menjadi ${selectedRole}.`);
      setRoleModalOpen(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui role pengguna.");
    } finally {
      setSubmittingAction(false);
    }
  };

  // Overrides management modal
  const openOverrideModal = (user: User) => {
    if (currentUser?.role !== "super_admin" && (user.role !== "user" || user.id === currentUser?.id)) {
      if (user.id === currentUser?.id) {
        toast.error("Anda tidak dapat mengelola limit Anda sendiri.");
      } else {
        toast.error("Admin hanya dapat mengelola limit untuk user biasa.");
      }
      return;
    }
    setSelectedUser(user);
    setNewOverrideKey("daily_email_limit");
    setNewOverrideValue("");
    setNewOverrideBoolean(true);
    setNewOverrideNote("");
    setNewOverrideDuration("");
    setOverrideModalOpen(true);
  };

  const handleAddOverride = async () => {
    if (!selectedUser) return;
    const isBoolFeature = ["custom_smtp", "open_tracking", "click_tracking", "webhooks"].includes(newOverrideKey);
    const value = isBoolFeature ? String(newOverrideBoolean) : newOverrideValue.trim();

    if (!value) {
      toast.error("Nilai limit/fitur harus diisi.");
      return;
    }

    setSubmittingAction(true);
    try {
      const payload = {
        feature_key: newOverrideKey,
        value,
        note: newOverrideNote.trim(),
        duration_days: newOverrideDuration ? parseInt(newOverrideDuration) : undefined
      };

      await api.admin.overrideFeature(selectedUser.id, payload);
      toast.success("Feature override berhasil disetel.");
      
      // Reload current overrides for modal view
      const updatedUsersRes = await api.admin.listUsers({ page, per_page: perPage, search: search.trim() });
      const updatedUser = updatedUsersRes.users.find((u: any) => u.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
      
      setNewOverrideValue("");
      setNewOverrideNote("");
      setNewOverrideDuration("");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyetel override.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDeleteOverride = async (key: string) => {
    if (!selectedUser) return;
    const confirmed = await confirm(
      "Hapus Override?",
      `Hapus override untuk ${key}?`,
      "destructive",
      "Hapus"
    );
    if (!confirmed) return;

    try {
      await api.admin.deleteOverride(selectedUser.id, key);
      toast.success("Override berhasil dihapus.");

      // Reload current overrides for modal view
      const updatedUsersRes = await api.admin.listUsers({ page, per_page: perPage, search: search.trim() });
      const updatedUser = updatedUsersRes.users.find((u: any) => u.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus override.");
    }
  };

  const isBooleanFeature = (key: string) => {
    return ["custom_smtp", "open_tracking", "click_tracking", "webhooks"].includes(key);
  };

  if (loading) {
    return <AdminUsersSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Manajemen Pengguna
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Daftar seluruh pengguna sistem, modifikasi role, suspensi akun, dan pengaturan limitasi custom (override).
        </p>
      </div>

      {/* Control Actions & Search */}
      <div className="flex w-full flex-wrap md:flex-nowrap items-end gap-4">
        {/* Search Input */}
        <div className="space-y-1.5 flex-2 min-w-[280px]">
          <Label htmlFor="search-user" className="text-xs font-bold text-slate-500  tracking-wide">Cari Pengguna</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search-user"
              type="text"
              placeholder="Cari pengguna berdasarkan nama, email, perusahaan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 h-10 w-full"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <Label htmlFor="status-filter" className="text-xs font-bold text-slate-500  tracking-wide">Status</Label>
          <div>
            <Select value={selectedStatus} onValueChange={(val) => {
              if (val) {
                setSelectedStatus(val);
                setPage(1);
              }
            }}>
              <SelectTrigger id="status-filter" className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200">
                <SelectValue placeholder="Status: Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending_verification">Pending Verifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Package Filter */}
        <div className="space-y-1.5 flex-1 min-w-[180px]">
          <Label htmlFor="plan-filter" className="text-xs font-bold text-slate-500 tracking-wide">Paket Langganan</Label>
          <div>
            <Select value={selectedPlan} onValueChange={(val) => {
              if (val) {
                setSelectedPlan(val);
                setPage(1);
              }
            }}>
              <SelectTrigger id="plan-filter" className="w-full h-10! bg-white dark:bg-slate-900 border-slate-200">
                <SelectValue placeholder="Paket: Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Paket</SelectItem>
                <SelectItem value="Free Tier">Free Tier</SelectItem>
                {plansList.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Filter Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={search === "" && selectedStatus === "all" && selectedPlan === "all"}
            className="h-10 px-4 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-rose-650 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer text-sm font-semibold w-fit"
            title="Reset semua filter"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
              Data Akun Terdaftar
            </CardTitle>
            <CardDescription>
              Menampilkan {paginatedUsers.length} dari {totalUsers} pengguna terdaftar {users.length !== totalUsers && `(difilter dari ${users.length} total)`}.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                 <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/30">
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 pl-6 py-4 w-16">No.</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Nama & Email</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Paket</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4 font-mono">Role</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">Registrasi</TableHead>
                    <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4 text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user, idx) => (
                    <TableRow key={user.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
                      <TableCell className="pl-6 py-4 font-mono text-xs text-slate-400">
                        {(page - 1) * perPage + idx + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {user.full_name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {user.email}
                        </div>
                        {user.company_name_str && (
                          <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                            {user.company_name_str}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4 font-medium text-slate-600 dark:text-slate-300">
                        {user.plan_name || "Free Tier"}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.role === "super_admin" 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" 
                            : user.role === "admin" 
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" 
                            : "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400"
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.status === "active" 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" 
                            : user.status === "suspended" 
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse" 
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          {user.status === "suspended" ? "suspended" : user.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-400">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6 space-x-1">
                        {(() => {
                          const cannotModify = user.role === "super_admin" && currentUser?.role !== "super_admin";
                          const cannotManageOverrides = currentUser?.role !== "super_admin" && (user.role !== "user" || user.id === currentUser?.id);
                          return (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openOverrideModal(user)}
                                disabled={cannotManageOverrides}
                                className="h-8 text-xs font-semibold border-slate-200 text-slate-600 hover:text-orange-500 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                  cannotManageOverrides 
                                    ? user.id === currentUser?.id 
                                      ? "Anda tidak dapat mengelola limit Anda sendiri" 
                                      : "Admin hanya dapat mengelola limit untuk user biasa" 
                                    : undefined
                                }
                              >
                                <ZapIcon className="h-3.5 w-3.5 mr-1" />
                                Limit & Fitur
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openRoleModal(user)}
                                disabled={currentUser?.role !== "super_admin" || user.id === currentUser?.id}
                                className="h-8 text-xs font-semibold border-slate-200 text-slate-600 hover:text-blue-500 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                  currentUser?.role !== "super_admin"
                                    ? "Hanya Super Admin yang dapat mengubah role pengguna"
                                    : user.id === currentUser?.id 
                                    ? "Anda tidak dapat mengubah role Anda sendiri" 
                                    : undefined
                                }
                              >
                                <ShieldCheckIcon className="h-3.5 w-3.5 mr-1" />
                                Role
                              </Button>
                              {user.status === "suspended" ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleUnsuspend(user)}
                                  disabled={cannotModify}
                                  className="h-8 text-xs font-semibold border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={cannotModify ? "Hanya Super Admin yang dapat mengaktifkan Super Admin" : undefined}
                                >
                                  <UserCheckIcon className="h-3.5 w-3.5 mr-1" />
                                  Aktifkan
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openSuspendModal(user)}
                                  disabled={cannotModify || user.id === currentUser?.id}
                                  className="h-8 text-xs font-semibold border-rose-100 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={
                                    user.id === currentUser?.id 
                                      ? "Anda tidak dapat menangguhkan diri sendiri" 
                                      : cannotModify 
                                      ? "Hanya Super Admin yang dapat menangguhkan Super Admin" 
                                      : undefined
                                  }
                                >
                                  <UserXIcon className="h-3.5 w-3.5 mr-1" />
                                  Suspend
                                </Button>
                              )}
                              {currentUser?.role === "super_admin" && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDeleteUser(user)}
                                  disabled={user.id === currentUser?.id}
                                  className="h-8 text-xs font-semibold border-red-200 text-red-650 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={user.id === currentUser?.id ? "Anda tidak dapat menghapus akun Anda sendiri" : undefined}
                                >
                                  <Trash2Icon className="h-3.5 w-3.5 mr-1 text-red-500" />
                                  Hapus
                                </Button>
                              )}
                            </>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400 text-sm">
              Tidak ada pengguna ditemukan.
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && filteredUsers.length > 0 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
              <span className="text-xs text-slate-400 font-semibold">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8"
                >
                  Sebelumnya
                </Button>
                {getPageNumbers().map((p, index) => {
                  if (p === "...") {
                    return (
                      <span key={`dots-${index}`} className="px-2 py-1 text-slate-400 text-sm select-none">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === page;
                  return (
                    <Button
                      key={p}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(Number(p))}
                      className={isCurrent ? "bg-orange-500! hover:bg-orange-600! text-white! border-orange-500! font-bold h-8 w-8 p-0" : "h-8 w-8 p-0"}
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG 1: Suspend Account */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-950 border border-slate-100 shadow-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 dark:text-white">
              Tangguhkan Akun Pengguna
            </DialogTitle>
            <DialogDescription>
              Menangguhkan {selectedUser?.email} akan mencegah pengiriman email baru, verifikasi domain, atau pembuatan API Key.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Alasan Penangguhan (Opsional)
              </Label>
              <Input
                id="suspend-reason"
                placeholder="Masukkan alasan pemblokiran akun..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="bg-white border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendModalOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSuspendSubmit} 
              disabled={submittingAction}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {submittingAction && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Tangguhkan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Change User Role */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-950 border border-slate-100 shadow-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 dark:text-white">
              Ubah Role Akses Pengguna
            </DialogTitle>
            <DialogDescription>
              Modifikasi otorisasi akun {selectedUser?.email} di dalam platform RealSend.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-select" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Pilih Role Pengguna
              </Label>
              <Select value={selectedRole} onValueChange={(val) => val && setSelectedRole(val)}>
                <SelectTrigger id="role-select" className="w-full h-10 bg-white dark:bg-slate-900 border-slate-200">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Standard)</SelectItem>
                  <SelectItem value="admin">Admin Console</SelectItem>
                  <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleRoleSubmit} 
              disabled={submittingAction}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
            >
              {submittingAction && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Perbarui Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Manage Limit & Feature Overrides */}
      <Dialog open={overrideModalOpen} onOpenChange={setOverrideModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-950 border border-slate-100 shadow-2xl rounded-2xl overflow-hidden p-0">
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-900">
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ZapIcon className="h-5 w-5 text-orange-500" />
              Kelola Limitasi & Fitur Override
            </DialogTitle>
            <DialogDescription className="mt-1">
              Setel pembatasan custom (kuota pengiriman, domain, dll.) atau aktifkan fitur khusus untuk **{selectedUser?.email}**.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Active Overrides Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Override Aktif ({selectedUser?.overrides?.length || 0})
              </h3>
              {selectedUser?.overrides && selectedUser.overrides.length > 0 ? (
                <div className="border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-900 bg-white dark:bg-slate-950">
                  {selectedUser.overrides.map((ov) => (
                    <div key={ov.id} className="p-3.5 flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/5 px-2 py-0.5 rounded text-xs">
                            {ov.feature_key}
                          </span>
                          <span className="text-slate-700 dark:text-slate-350 font-semibold">
                            = {ov.override_value}
                          </span>
                        </div>
                        {ov.note && (
                          <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            <InfoIcon className="h-3 w-3 shrink-0" />
                            Catatan: {ov.note}
                          </p>
                        )}
                        {ov.expires_at && (
                          <p className="text-[10px] text-rose-500 font-semibold">
                            Berlaku hingga: {formatDateTime(ov.expires_at)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOverride(ov.feature_key)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                  Tidak ada limitasi custom untuk pengguna ini. Limit default mengikuti paket subscription saat ini.
                </div>
              )}
            </div>

            {/* Set New Override Form */}
            <div className="border-t border-slate-100 dark:border-slate-900 pt-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tambah Override Baru
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="ov-key" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pilih Fitur / Batasan</Label>
                  <Select value={newOverrideKey} onValueChange={(val) => {
                    if (val) {
                      setNewOverrideKey(val);
                      setNewOverrideValue("");
                    }
                  }}>
                    <SelectTrigger id="ov-key" className="w-full h-10 bg-white dark:bg-slate-900 border-slate-200">
                      <SelectValue placeholder="Pilih Kunci Override" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily_email_limit">daily_email_limit (Kuota Harian)</SelectItem>
                      <SelectItem value="monthly_email_limit">monthly_email_limit (Kuota Bulanan)</SelectItem>
                      <SelectItem value="max_domains">max_domains (Domain Max)</SelectItem>
                      <SelectItem value="max_api_keys">max_api_keys (API Key Max)</SelectItem>
                      <SelectItem value="max_webhooks">max_webhooks (Webhook Max)</SelectItem>
                      <SelectItem value="custom_smtp">custom_smtp (Custom SMTP)</SelectItem>
                      <SelectItem value="open_tracking">open_tracking (Open Tracking)</SelectItem>
                      <SelectItem value="click_tracking">click_tracking (Click Tracking)</SelectItem>
                      <SelectItem value="webhooks">webhooks (Fitur Webhooks)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1 flex flex-col justify-end">
                  {isBooleanFeature(newOverrideKey) ? (
                    <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-white h-10">
                      <Label htmlFor="ov-bool" className="text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer">Status Fitur</Label>
                      <Switch 
                        id="ov-bool" 
                        checked={newOverrideBoolean} 
                        onCheckedChange={setNewOverrideBoolean} 
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label htmlFor="ov-val" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nilai Batasan Baru</Label>
                      <Input
                        id="ov-val"
                        type="number"
                        placeholder="Nilai angka limit..."
                        value={newOverrideValue}
                        onChange={(e) => setNewOverrideValue(e.target.value)}
                        className="bg-white border-slate-200 h-10"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="ov-dur" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Durasi Berlaku (Hari)</Label>
                  <Input
                    id="ov-dur"
                    type="number"
                    placeholder="Kosongkan jika selamanya..."
                    value={newOverrideDuration}
                    onChange={(e) => setNewOverrideDuration(e.target.value)}
                    className="bg-white border-slate-200 h-10"
                  />
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="ov-note" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Catatan Alasan</Label>
                  <Input
                    id="ov-note"
                    placeholder="Contoh: Upgrade kuota sementara event promo..."
                    value={newOverrideNote}
                    onChange={(e) => setNewOverrideNote(e.target.value)}
                    className="bg-white border-slate-200 h-10"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  onClick={handleAddOverride} 
                  disabled={submittingAction}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 px-5"
                >
                  {submittingAction ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlusIcon className="h-4 w-4" />
                  )}
                  Terapkan Override Limit
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-900 flex justify-end">
            <Button variant="outline" onClick={() => setOverrideModalOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
