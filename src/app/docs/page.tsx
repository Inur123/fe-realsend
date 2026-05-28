"use client";

import React, { useState } from "react";
import { Copy, Check, Zap, Server, Terminal, Code2, ShieldAlert, Sparkles, Webhook, KeyRound } from "lucide-react";
import { toast } from "sonner";

// Sidebar categories and articles configuration
const sidebarItems = [
  {
    category: "Dokumentasi",
    items: [
      { id: "intro", label: "Pengenalan" },
      { id: "quickstart", label: "Mulai Cepat" },
    ],
  },
  {
    category: "Metode Integrasi",
    items: [
      { id: "smtp", label: "SMTP Relay" },
      { id: "api-send", label: "API Sending" },
    ],
  },
  {
    category: "Fitur Lanjutan",
    items: [
      { id: "webhooks", label: "Webhooks" },
      { id: "api-keys", label: "Kunci API (Auth)" },
    ],
  },
];

// Code snippet examples for different languages
const codeSnippets = {
  curl: `curl -X POST https://api.realsend.id/v1/emails/send \\
  -H "Authorization: Bearer rs_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@domainanda.com",
    "to": "recipient@example.com",
    "subject": "Halo dari RealSend!",
    "body": "<p>Email ini dikirim secara otentik menggunakan RealSend API.</p>",
    "content_type": "text/html"
  }'`,
  node: `const axios = require('axios');

const sendEmail = async () => {
  try {
    const response = await axios.post('https://api.realsend.id/v1/emails/send', {
      from: 'sender@domainanda.com',
      to: 'recipient@example.com',
      subject: 'Halo dari RealSend!',
      body: '<p>Email ini dikirim secara otentik menggunakan Node.js.</p>',
      content_type: 'text/html'
    }, {
      headers: {
        'Authorization': 'Bearer rs_live_your_api_key',
        'Content-Type': 'application/json'
      }
    });
    console.log('Email berhasil dikirim:', response.data);
  } catch (error) {
    console.error('Gagal mengirim email:', error.response?.data || error.message);
  }
};

sendEmail();`,
  go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type EmailPayload struct {
	From        string \`json:"from"\`
	To          string \`json:"to"\`
	Subject     string \`json:"subject"\`
	Body        string \`json:"body"\`
	ContentType string \`json:"content_type"\`
}

func main() {
	payload := EmailPayload{
		From:        "sender@domainanda.com",
		To:          "recipient@example.com",
		Subject:     "Halo dari RealSend!",
		Body:        "<p>Email ini dikirim secara otentik menggunakan Golang.</p>",
		ContentType: "text/html",
	}

	jsonPayload, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "https://api.realsend.id/v1/emails/send", bytes.NewBuffer(jsonPayload))
	req.Header.Set("Authorization", "Bearer rs_live_your_api_key")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Status pengiriman:", resp.Status)
}`,
  php: `<?php

$ch = curl_init('https://api.realsend.id/v1/emails/send');

$payload = json_encode([
    'from' => 'sender@domainanda.com',
    'to' => 'recipient@example.com',
    'subject' => 'Halo dari RealSend!',
    'body' => '<p>Email ini dikirim secara otentik menggunakan PHP.</p>',
    'content_type' => 'text/html'
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer rs_live_your_api_key',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    echo "Email berhasil dikirim: " . $response;
} else {
    echo "Gagal mengirim email. Code: " . $http_code . " Error: " . $response;
}
?>`,
  python: `import requests

url = "https://api.realsend.id/v1/emails/send"
headers = {
    "Authorization": "Bearer rs_live_your_api_key",
    "Content-Type": "application/json"
}
payload = {
    "from": "sender@domainanda.com",
    "to": "recipient@example.com",
    "subject": "Halo dari RealSend!",
    "body": "<p>Email ini dikirim secara otentik menggunakan Python.</p>",
    "content_type": "text/html"
}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 200:
    print("Email berhasil dikirim:", response.json())
else:
    print("Gagal mengirim email:", response.status_code, response.text)`,
  smtp: `Host: smtp.realsend.id
Port: 587 (rekomendasi, TLS) atau 2525
Username: <Kunci API Anda, misal: rs_live_xxxxxxx>
Password: <Sama dengan Kunci API Anda atau kosongkan jika menggunakan API langsung>
Encryption: STARTTLS / TLS`
};

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof codeSnippets>("curl");
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Kode disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 py-10">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] overflow-y-auto pr-4 border-r border-slate-100 dark:border-slate-800">
        <div className="space-y-8">
          {sidebarItems.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                {cat.category}
              </h4>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleScrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border-0 cursor-pointer ${
                        activeSection === item.id
                          ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-bold"
                          : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-900/5 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Main Article Content Container */}
      <main className="flex-1 max-w-3xl min-w-0 space-y-16">
        
        {/* SECTION: INTRODUCTION */}
        <section id="intro" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 border border-orange-200/30 text-[10px] font-bold text-orange-600 dark:text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>RealSend SMTP & API v1.0</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Pengenalan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              RealSend adalah platform pengiriman email transaksional modern yang dirancang khusus untuk pengembang aplikasi dan bisnis mandiri yang membutuhkan sistem pengiriman email berkinerja tinggi, otentik, dan mudah diintegrasikan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl space-y-2">
              <Server className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">SMTP Relay Handal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Kirim email langsung dari platform Anda (WordPress, Laravel, Node.js) hanya dengan mengganti kredensial SMTP default Anda.
              </p>
            </div>
            <div className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl space-y-2">
              <Code2 className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">HTTP API Cepat</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gunakan RESTful API berlatensi rendah untuk mengirim email dalam format HTML atau teks biasa dengan lampiran dan metadata dinamis.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: QUICKSTART */}
        <section id="quickstart" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Mulai Cepat
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Integrasikan pengiriman email ke dalam kode Anda kurang dari 5 menit menggunakan REST API RealSend.
            </p>
          </div>

          {/* Interactive Code Switcher Tabs */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
            <div className="flex border-b border-slate-800 bg-slate-900 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
              {(["curl", "node", "go", "php", "python"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer capitalize ${
                    activeTab === tab
                      ? "border-orange-500 text-orange-400 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab === "curl" ? "cURL / CLI" : tab === "node" ? "Node.js" : tab}
                </button>
              ))}
            </div>
            <div className="relative p-5 font-mono text-[11px] leading-relaxed overflow-x-auto">
              <button
                onClick={() => copyToClipboard(codeSnippets[activeTab])}
                className="absolute right-4 top-4 p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer transition-all"
                title="Salin Kode"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <pre className="whitespace-pre">{codeSnippets[activeTab]}</pre>
            </div>
          </div>
        </section>

        {/* SECTION: SMTP RELAY */}
        <section id="smtp" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              SMTP Relay
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Jika aplikasi Anda mendukung integrasi SMTP standar (seperti CMS WordPress, server Laravel, NodeMailer, atau Jenkins), gunakan detail koneksi berikut:
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4 text-sm">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 font-bold text-slate-400 uppercase tracking-wider pr-4">Host / Server</td>
                  <td className="py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">smtp.realsend.id</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 font-bold text-slate-400 uppercase tracking-wider pr-4">Port (TLS)</td>
                  <td className="py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">587 (Rekomendasi) atau 2525</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 font-bold text-slate-400 uppercase tracking-wider pr-4">Username</td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400">
                    <span className="font-mono bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-350">rs_live_your_api_key</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 font-bold text-slate-400 uppercase tracking-wider pr-4">Password</td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400">
                    <span className="italic">Gunakan Kunci API yang sama dengan Username Anda</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-400 uppercase tracking-wider pr-4">Encryption</td>
                  <td className="py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">STARTTLS / TLS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-xs text-amber-800 dark:text-amber-400 rounded-xl leading-relaxed">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <span className="font-bold">PENTING:</span> Sebelum mengirim email lewat SMTP, Anda harus mendaftarkan domain pengirim Anda di menu **Domain Sending** di dashboard Anda dan memverifikasi rekaman DNS (SPF/DKIM) terlebih dahulu.
            </div>
          </div>
        </section>

        {/* SECTION: API SENDING */}
        <section id="api-send" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              API Sending
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Kirim email transaksional dengan mengirimkan request HTTP POST JSON.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-lg text-[10px] tracking-wide uppercase">POST</span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">https://api.realsend.id/v1/emails/send</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
              <div className="flex border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400">
                Payload Request Body (JSON)
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-350">
                <pre>{`{
  "from": "sender@domainanda.com",  // Wajib (Email pengirim terdaftar)
  "to": "recipient@example.com",     // Wajib (Email tujuan)
  "subject": "Halo Dunia",          // Wajib
  "body": "<h1>Isi Email</h1>",     // Wajib
  "content_type": "text/html",       // Opsional (text/html atau text/plain)
  "tags": ["otp", "transaksional"]   // Opsional (Max 5 tags)
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WEBHOOKS */}
        <section id="webhooks" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Webhook className="h-6 w-6 text-orange-500" />
              <span>Webhooks</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              RealSend dapat mengirimkan event webhook HTTP secara real-time ke URL server Anda ketika status pengiriman email berubah.
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Anda dapat memantau event seperti:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-650 dark:text-slate-400 space-y-1">
            <li><span className="font-mono font-bold text-slate-800 dark:text-slate-200">email.sent</span>: Terkirim dari server RealSend.</li>
            <li><span className="font-mono font-bold text-slate-800 dark:text-slate-200">email.delivered</span>: Berhasil diterima di inbox tujuan.</li>
            <li><span className="font-mono font-bold text-slate-800 dark:text-slate-200">email.bounced</span>: Gagal terkirim (email salah/ditolak).</li>
            <li><span className="font-mono font-bold text-slate-800 dark:text-slate-200">email.opened</span>: Penerima membuka email Anda (fitur tracking).</li>
            <li><span className="font-mono font-bold text-slate-800 dark:text-slate-200">email.clicked</span>: Penerima mengklik link di dalam email (fitur tracking).</li>
          </ul>
        </section>

        {/* SECTION: API KEYS */}
        <section id="api-keys" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-orange-500" />
              <span>Kunci API (Auth)</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Semua request API HTTP atau integrasi SMTP ke RealSend harus diautentikasi menggunakan API Key.
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Buat Kunci API di menu **API Keys** di dashboard Anda, lalu sertakan kunci tersebut dalam header request HTTP Anda:
          </p>
          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto">
            <pre>Authorization: Bearer rs_live_your_api_key</pre>
          </div>
        </section>

      </main>

      {/* 3. Right Sidebar (On this page anchor list) */}
      <aside className="hidden xl:block w-48 shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pl-4 border-l border-slate-100 dark:border-slate-800 text-[11px]">
        <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-3">On this page</h4>
        <ul className="space-y-2 font-semibold">
          <li>
            <button
              onClick={() => handleScrollToSection("intro")}
              className={`text-left transition-colors border-0 bg-transparent cursor-pointer hover:text-slate-950 dark:hover:text-white ${
                activeSection === "intro" ? "text-orange-500 font-bold" : "text-slate-500"
              }`}
            >
              Pengenalan
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollToSection("quickstart")}
              className={`text-left transition-colors border-0 bg-transparent cursor-pointer hover:text-slate-950 dark:hover:text-white ${
                activeSection === "quickstart" ? "text-orange-500 font-bold" : "text-slate-500"
              }`}
            >
              Mulai Cepat
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollToSection("smtp")}
              className={`text-left transition-colors border-0 bg-transparent cursor-pointer hover:text-slate-950 dark:hover:text-white ${
                activeSection === "smtp" ? "text-orange-500 font-bold" : "text-slate-500"
              }`}
            >
              SMTP Relay
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollToSection("api-send")}
              className={`text-left transition-colors border-0 bg-transparent cursor-pointer hover:text-slate-950 dark:hover:text-white ${
                activeSection === "api-send" ? "text-orange-500 font-bold" : "text-slate-500"
              }`}
            >
              API Sending
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollToSection("webhooks")}
              className={`text-left transition-colors border-0 bg-transparent cursor-pointer hover:text-slate-950 dark:hover:text-white ${
                activeSection === "webhooks" ? "text-orange-500 font-bold" : "text-slate-500"
              }`}
            >
              Webhooks
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollToSection("api-keys")}
              className={`text-left transition-colors border-0 bg-transparent cursor-pointer hover:text-slate-950 dark:hover:text-white ${
                activeSection === "api-keys" ? "text-orange-500 font-bold" : "text-slate-500"
              }`}
            >
              Kunci API
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
}
