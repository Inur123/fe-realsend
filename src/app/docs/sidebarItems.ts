export interface SidebarItem {
  path: string;
  label: string;
}

export interface SidebarCategory {
  category: string;
  items: SidebarItem[];
}

export const sidebarItems: SidebarCategory[] = [
  {
    category: "Dokumentasi",
    items: [
      { path: "/docs", label: "Pengenalan" },
      { path: "/docs/sdk-libraries", label: "SDK & Libraries" },
    ],
  },
  {
    category: "Metode Integrasi",
    items: [
      { path: "/docs/smtp-relay", label: "SMTP Relay" },
      { path: "/docs/api-reference", label: "API Reference" },
    ],
  },
  {
    category: "Fitur Lanjutan",
    items: [
      { path: "/docs/webhooks", label: "Webhooks" },
      { path: "/docs/status-page", label: "Status Page" },
    ],
  },
];
