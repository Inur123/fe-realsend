"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Code2 } from "lucide-react";
import { toast } from "sonner";

const installCommands = {
  npm: "npm install realsend-sdk",
  yarn: "yarn add realsend-sdk",
  pnpm: "pnpm add realsend-sdk",
  bun: "bun add realsend-sdk",
};

const codeSnippets = {
  curl: `curl -X POST https://api.realsend.web.id/v1/emails/send \\
  -H "Authorization: Bearer rs_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@domainanda.com",
    "to": "recipient@example.com",
    "subject": "Halo dari RealSend!",
    "body": "<p>Email ini dikirim secara otentik menggunakan RealSend API.</p>",
    "content_type": "text/html"
  }'`,
  node: `const { RealSend } = require('realsend-sdk');

const sendEmail = async () => {
  try {
    const realsend = new RealSend('rs_live_your_api_key');
    const response = await realsend.send({
      from: 'sender@domainanda.com',
      to: 'recipient@example.com',
      subject: 'Halo dari RealSend!',
      body: '<p>Email ini dikirim secara otentik menggunakan Node.js SDK.</p>',
      contentType: 'text/html'
    });
    console.log('Email berhasil dikirim:', response.message);
  } catch (error) {
    console.error('Gagal mengirim email:', error.message);
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
	req, _ := http.NewRequest("POST", "https://api.realsend.web.id/v1/emails/send", bytes.NewBuffer(jsonPayload))
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

$ch = curl_init('https://api.realsend.web.id/v1/emails/send');

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

url = "https://api.realsend.web.id/v1/emails/send"
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
    print("Gagal mengirim email:", response.status_code, response.text)`
};

export default function SdkLibrariesClient() {
  const [activeInstallTab, setActiveInstallTab] = useState<keyof typeof installCommands>("npm");
  const [activeTab, setActiveTab] = useState<keyof typeof codeSnippets>("curl");
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyInstallToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInstall(true);
    toast.success("Perintah instalasi disalin!");
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Kode disalin ke clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          SDK & Libraries
        </h1>
        <p className="text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
          Integrasikan pengiriman email ke dalam kode Anda kurang dari 5 menit menggunakan SDK dan request REST API RealSend.
        </p>
      </div>

      {/* INSTALLATION SECTION */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-orange-500" />
          <span>Instalasi SDK</span>
        </h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
          <div className="flex border-b border-slate-800 bg-slate-900 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            {(["npm", "yarn", "pnpm", "bun"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveInstallTab(tab)}
                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeInstallTab === tab
                    ? "border-orange-500 text-orange-400 font-extrabold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative p-4 font-mono text-xs leading-relaxed flex items-center justify-between">
            <span className="text-slate-300 font-bold select-all">{installCommands[activeInstallTab]}</span>
            <button
              onClick={() => copyInstallToClipboard(installCommands[activeInstallTab])}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md border border-slate-800 cursor-pointer transition-all shrink-0"
              title="Salin Perintah"
            >
              {copiedInstall ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </section>

      {/* CODE EXAMPLE SECTION */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Code2 className="h-5 w-5 text-orange-500" />
          <span>Contoh Integrasi</span>
        </h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
          <div className="flex border-b border-slate-800 bg-slate-900 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            {(["curl", "node", "go", "php", "python"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer capitalize ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-400 font-extrabold"
                    : "border-transparent text-slate-450 hover:text-slate-200"
                }`}
              >
                {tab === "curl" ? "cURL / CLI" : tab === "node" ? "Node.js" : tab}
              </button>
            ))}
          </div>
          <div className="relative p-5 font-mono text-[11px] leading-relaxed overflow-x-auto">
            <button
              onClick={() => copyCodeToClipboard(codeSnippets[activeTab])}
              className="absolute right-4 top-4 p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer transition-all"
              title="Salin Kode"
            >
              {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="whitespace-pre">{codeSnippets[activeTab]}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
