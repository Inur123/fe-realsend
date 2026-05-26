/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  includeMeta?: boolean;
}

interface ApiError extends Error {
  status?: number;
  isNetworkError?: boolean;
  payload?: unknown;
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

// Global fetch wrapper with error handling and JWT injection
async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, includeMeta = false, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(fetchOptions.headers || {});

  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = localStorage.getItem("realsend_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  try {
    let response: Response;
    try {
      response = await fetch(url, config);
    } catch {
      const networkError = new Error("Tidak dapat terhubung ke server API. Pastikan backend sedang berjalan.") as ApiError;
      networkError.isNetworkError = true;
      throw networkError;
    }

    // Handle token expiration or unauthorized access
    if (response.status === 419 || (response.status === 401 && requiresAuth)) {
      localStorage.removeItem("realsend_token");
      localStorage.removeItem("realsend_user");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?message=Sesi Anda telah berakhir, silakan login kembali.`;
      }
    }

    const data = await readResponseBody(response);

    if (!response.ok) {
      const errorMsg =
        (data && typeof data === "object" && "error" in data && (data as any).error?.message) ||
        (data && typeof data === "object" && "message" in data && (data as any).message) ||
        "Terjadi kesalahan pada server.";
      const apiError = new Error(errorMsg) as ApiError;
      apiError.status = response.status;
      apiError.payload = data;
      throw apiError;
    }

    if (includeMeta) {
      return data;
    }

    return data && typeof data === "object" && "data" in data && (data as any).data !== undefined ? (data as any).data : data;
  } catch (error: any) {
    throw error;
  }
}

// API Methods
export const api = {
  // Auth
  auth: {
    login: (credentials: any) =>
      apiFetch<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        requiresAuth: false,
      }),
    register: (userData: any) =>
      apiFetch<{ token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        requiresAuth: false,
      }),
    me: () => apiFetch<any>("/auth/me"),
    updateProfile: (profileData: any) =>
      apiFetch<any>("/auth/me", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }),
    changePassword: (passwordData: any) =>
      apiFetch<any>("/auth/me/password", {
        method: "PUT",
        body: JSON.stringify(passwordData),
      }),
  },

  // Plans
  plans: {
    list: () => apiFetch<any[]>("/plans", { requiresAuth: false }),
    get: (id: string) => apiFetch<any>(`/plans/${id}`, { requiresAuth: false }),
  },

  // Domains
  domains: {
    list: () => apiFetch<any[]>("/domains"),
    get: (id: string) => apiFetch<any>(`/domains/${id}`),
    add: (domain_name: string) =>
      apiFetch<any>("/domains", {
        method: "POST",
        body: JSON.stringify({ domain_name }),
      }),
    verify: (id: string) =>
      apiFetch<any>(`/domains/${id}/verify`, {
        method: "POST",
      }),
    delete: (id: string) =>
      apiFetch<any>(`/domains/${id}`, {
        method: "DELETE",
      }),
  },

  // API Keys
  apiKeys: {
    list: () => apiFetch<any[]>("/api-keys"),
    get: (id: string) => apiFetch<any>(`/api-keys/${id}`),
    create: (name: string) =>
      apiFetch<any>("/api-keys", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    revoke: (id: string) =>
      apiFetch<any>(`/api-keys/${id}`, {
        method: "DELETE",
      }),
  },

  // Webhooks
  webhooks: {
    list: () => apiFetch<any[]>("/webhooks"),
    get: (id: string) => apiFetch<any>(`/webhooks/${id}`),
    create: (webhookData: { url: string; events: string[] }) =>
      apiFetch<any>("/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      }),
    update: (id: string, webhookData: { url: string; events: string[]; is_active: boolean }) =>
      apiFetch<any>(`/webhooks/${id}`, {
        method: "PUT",
        body: JSON.stringify(webhookData),
      }),
    delete: (id: string) =>
      apiFetch<any>(`/webhooks/${id}`, {
        method: "DELETE",
      }),
  },

  // Email Logs
  logs: {
    list: (params: {
      status?: string;
      start_date?: string;
      end_date?: string;
      domain_id?: string;
      search?: string;
      page?: number;
      per_page?: number;
    }) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && String(val) !== "") {
          query.set(key, String(val));
        }
      });
      const queryString = query.toString();
      return apiFetch<{ data: any[]; meta: any }>(`/logs?${queryString}`, { includeMeta: true })
        .then((res) => ({
          logs: res.data || [],
          total: res.meta?.total || 0,
        }));
    },
  },

  // Analytics
  analytics: {
    overview: (period?: string) => {
      const q = period ? `?period=${period}` : "";
      return apiFetch<any>(`/analytics/overview${q}`);
    },
    daily: (startDate: string, endDate: string) =>
      apiFetch<any[]>(`/analytics/daily?start_date=${startDate}&end_date=${endDate}`),
    domains: () => apiFetch<any[]>(`/analytics/domains`),
  },

  // Admin Operations
  admin: {
    listUsers: (params?: { page?: number; per_page?: number; search?: string }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && String(val) !== "") {
            query.set(key, String(val));
          }
        });
      }
      const queryString = query.toString();
      return apiFetch<{ data: any[]; meta: any }>(`/admin/users?${queryString}`, { includeMeta: true })
        .then((res) => ({
          users: res.data || [],
          total: res.meta?.total || 0,
        }));
    },
    suspendUser: (id: string, reason?: string) =>
      apiFetch<any>(`/admin/users/${id}/suspend`, {
        method: "PUT",
        body: JSON.stringify({ reason: reason || "" }),
      }),
    unsuspendUser: (id: string) =>
      apiFetch<any>(`/admin/users/${id}/unsuspend`, {
        method: "PUT",
      }),
    changeRole: (id: string, role: string) =>
      apiFetch<any>(`/admin/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      }),
    deleteUser: (id: string) =>
      apiFetch<any>(`/admin/users/${id}`, {
        method: "DELETE",
      }),
    overrideFeature: (id: string, override: { feature_key: string; value: string; note?: string; duration_days?: number }) =>
      apiFetch<any>(`/admin/users/${id}/override`, {
        method: "POST",
        body: JSON.stringify(override),
      }),
    deleteOverride: (id: string, featureKey: string) =>
      apiFetch<any>(`/admin/users/${id}/override/${featureKey}`, {
        method: "DELETE",
      }),
    globalOverview: (period?: string) => {
      const q = period ? `?period=${period}` : "";
      return apiFetch<any>(`/admin/analytics/overview${q}`);
    },
    auditLogs: (params?: { page?: number; per_page?: number }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && String(val) !== "") {
            query.set(key, String(val));
          }
        });
      }
      const queryString = query.toString();
      return apiFetch<{ data: any[]; meta: any }>(`/admin/audit-logs?${queryString}`, { includeMeta: true })
        .then((res) => ({
          logs: res.data || [],
          total: res.meta?.total || 0,
        }));
    },
    getAuditLog: (id: string) =>
      apiFetch<any>(`/admin/audit-logs/${id}`),
    listPlans: () =>
      apiFetch<any[]>("/admin/plans"),
    createPlan: (plan: any) =>
      apiFetch<any>("/admin/plans", {
        method: "POST",
        body: JSON.stringify(plan),
      }),
    updatePlan: (id: string, plan: any) =>
      apiFetch<any>(`/admin/plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(plan),
      }),
    deletePlan: (id: string) =>
      apiFetch<any>(`/admin/plans/${id}`, {
        method: "DELETE",
      }),
  },
};
