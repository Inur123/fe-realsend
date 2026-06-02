"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  BarChart3Icon,
  ClockIcon,
  Loader2Icon,
  LockKeyholeIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: "Aman & Terpercaya",
    description: "Proses reset password yang aman dan terenkripsi.",
    className: "text-[#FF7A1A]",
  },
  {
    icon: MailIcon,
    title: "Mudah & Cepat",
    description: "Dapatkan link reset dalam hitungan menit.",
    className: "text-[#FF7A1A]",
  },
  {
    icon: BarChart3Icon,
    title: "Email Terjamin",
    description: "Instruksi reset dikirim langsung ke email Anda.",
    className: "text-white",
  },
]

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Silakan masukkan email Anda.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success("Instruksi reset password terkirim!", {
        description: `Kami telah mengirimkan link reset password ke ${email}.`,
      })
    }, 1500)
  }

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-[#F8FAFC] text-[#071938] select-none lg:fixed lg:inset-0 lg:h-screen lg:min-h-0">
      <style>{`
        @media (min-width: 1024px) and (max-height: 700px) {
          .forgot-left-brand,
          .forgot-left-hero {
            transform: scale(0.78);
            transform-origin: top left;
          }

          .forgot-left-hero {
            margin-top: 28px;
          }

          .forgot-form-shell {
            transform: translate(-42px, 10px) scale(0.78) !important;
            transform-origin: top center;
          }

          .forgot-trust-badges {
            bottom: 18px;
            transform: translateX(-50%) scale(0.82);
            transform-origin: bottom center;
          }
        }
      `}</style>

      <section
        className="relative hidden h-screen min-h-0 w-[58.5vw] min-w-[620px] overflow-hidden px-10 py-10 text-white lg:block"
        style={{
          background:
            "linear-gradient(135deg, #06275A 0%, #071C43 38%, #07142E 72%, #030918 100%)",
          clipPath: "polygon(0 0, 100% 0, 83% 100%, 0% 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_18%,rgba(68,137,217,0.22),transparent_30%),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,80px_80px,80px_80px]" />
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:9px_9px] [mask-image:radial-gradient(circle_at_58%_20%,black,transparent_23%)]" />
        <div className="absolute bottom-[-14%] left-[-8%] h-[54%] w-[70%] rounded-[50%] border border-[#FF7A1A]/20" />
        <div className="absolute right-[11%] top-0 h-full w-[2px] rotate-[11deg] bg-[#FF7A1A]" />

        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 880 760"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M670 42C614 20 552 12 506 32C452 56 482 94 540 96C632 100 674 68 724 88"
            stroke="#FF7A1A"
            strokeDasharray="8 10"
            strokeWidth="2"
            opacity="0.5"
          />
          <path
            d="M455 292C395 334 389 392 445 398C512 405 562 376 566 330C571 267 630 230 730 204"
            stroke="white"
            strokeDasharray="8 12"
            strokeWidth="2"
            opacity="0.82"
          />
          <path
            d="M102 704C180 682 280 680 358 706"
            stroke="#FF7A1A"
            strokeDasharray="7 12"
            strokeWidth="1.6"
            opacity="0.35"
          />
        </svg>

        <div className="forgot-left-brand relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/logo-realsend.png"
              alt="RealSend"
              width={68}
              height={68}
              className="h-[42px] w-[42px] object-contain xl:h-[48px] xl:w-[48px]"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="text-[26px] font-extrabold tracking-normal text-white xl:text-[31px]">
                Real<span className="text-[#FF7A1A]">Send</span>
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-[0.08em] text-white xl:text-[11px]">
                AUTHENTIC SMTP DELIVERY
              </span>
            </span>
          </Link>
        </div>

        <div className="forgot-left-hero relative z-10 mt-[44px] grid max-w-[780px] grid-cols-[minmax(380px,450px)_1fr] items-start gap-x-2 xl:mt-[52px] xl:max-w-[840px] xl:grid-cols-[minmax(450px,500px)_1fr]">
          <div className="relative z-20">
            <h1 className="text-[26px] font-extrabold leading-[1.22] tracking-normal xl:text-[32px] xl:leading-[1.28]">
              Lupa Password?
              <br />
              <span className="text-[#FF7A1A]">Jangan Khawatir</span>
            </h1>
            <p className="mt-5 max-w-[380px] text-[12px] leading-[1.6] text-slate-100/88 xl:mt-7 xl:max-w-[410px] xl:text-[14px] xl:leading-[1.72]">
              Masukkan email Anda dan kami akan mengirimkan instruksi reset
              password ke email tersebut.
            </p>

            <div className="mt-8 space-y-5 xl:mt-10 xl:space-y-7">
              {benefits.map((benefit) => {
                const Icon = benefit.icon

                return (
                  <div key={benefit.title} className="flex items-center gap-4 xl:gap-5">
                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[8px] bg-[#0D3A78]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_35px_rgba(0,0,0,0.16)] xl:h-[58px] xl:w-[58px]">
                      <Icon className={`h-6 w-6 ${benefit.className} xl:h-7 xl:w-7`} strokeWidth={2.3} />
                    </div>
                    <div>
                      <h2 className="text-[14px] font-extrabold text-white xl:text-[15px]">
                        {benefit.title}
                      </h2>
                      <p className="mt-1 max-w-[220px] text-[12px] leading-[1.45] text-slate-100/82 xl:mt-1.5 xl:max-w-[250px] xl:text-[13px] xl:leading-[1.55]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative hidden h-[460px] xl:block">
            <Image
              src="/images/logo-realsend.png"
              alt=""
              width={300}
              height={300}
              className="absolute left-[-4px] top-[-60px] h-[205px] w-[205px] rotate-[12deg] object-contain drop-shadow-[0_24px_28px_rgba(255,122,26,0.26)] xl:left-[-2px] xl:top-[-84px] xl:h-[245px] xl:w-[245px]"
              priority
            />

            <div className="absolute left-[-88px] top-[168px] flex h-[56px] w-[70px] rotate-[-4deg] items-center justify-center rounded-[8px] border border-white/10 bg-[#113A78]/75 shadow-2xl backdrop-blur xl:left-[-108px] xl:top-[154px] xl:h-[66px] xl:w-[82px]">
              <MailIcon className="h-7 w-7 text-white xl:h-9 xl:w-9" strokeWidth={1.8} />
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A1A] text-[10px] font-bold">
                1
              </span>
            </div>

            <div className="absolute left-[26px] top-[240px] h-[72px] w-[116px] rotate-[-7deg] rounded-[8px] border border-white/12 bg-[#183D75]/75 p-3 shadow-2xl backdrop-blur xl:left-[48px] xl:top-[224px] xl:h-[82px] xl:w-[130px] xl:p-3.5">
              <div className="flex h-full items-end gap-3">
                <span className="h-5 w-2.5 rounded-sm bg-white/85 xl:h-6 xl:w-3" />
                <span className="h-8 w-2.5 rounded-sm bg-white/90 xl:h-10 xl:w-3" />
                <span className="h-11 w-2.5 rounded-sm bg-[#FF7A1A] xl:h-14 xl:w-3" />
                <span className="h-7 w-2.5 rounded-sm bg-white/75 xl:h-8 xl:w-3" />
                <span className="h-12 w-2.5 rounded-sm bg-white xl:h-16 xl:w-3" />
              </div>
            </div>

            <div className="absolute bottom-[-46px] left-[-214px] h-[220px] w-[335px] xl:bottom-[-72px] xl:left-[-238px] xl:h-[255px] xl:w-[388px]">
              <svg viewBox="0 0 430 280" className="h-full w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.34)]">
                <polygon points="218,26 404,126 218,252 32,126" fill="#DCE8F7" />
                <polygon points="218,252 404,126 404,139 218,266" fill="#FF7A1A" />
                <polygon points="218,252 32,126 32,139 218,266" fill="#C76A24" />
                <polygon points="218,42 376,126 218,232 60,126" fill="#F8FBFF" />
                <g transform="translate(142 56)">
                  <polygon points="62,0 144,36 62,74 -20,36" fill="#AFC1DA" />
                  <polygon points="62,74 144,36 144,64 62,102" fill="#5E7AA5" />
                  <polygon points="62,74 -20,36 -20,64 62,102" fill="#274774" />
                  <rect x="22" y="14" width="92" height="46" rx="8" fill="#F8FBFF" />
                  <line x1="42" y1="30" x2="94" y2="30" stroke="#D3DEEC" strokeWidth="5" strokeLinecap="round" />
                  <line x1="42" y1="46" x2="82" y2="46" stroke="#D3DEEC" strokeWidth="5" strokeLinecap="round" />
                </g>
                <g transform="translate(104 132)">
                  <path d="M50 0L90 17V48C90 76 71 96 50 104C29 96 10 76 10 48V17L50 0Z" fill="#F4F7FB" stroke="#A9BBD5" strokeWidth="5" />
                  <path d="M34 52L46 64L68 38" stroke="#FF7A1A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 z-10 text-xs text-white/80">
          &copy; 2026 RealSend. All rights reserved.
        </div>
      </section>

      <section className="relative flex min-h-[100svh] flex-1 flex-col items-center justify-center overflow-hidden px-5 py-5 sm:px-8 lg:px-10">
        <div className="absolute right-[-18px] top-0 h-72 w-72 text-[#FF7A1A] opacity-55" aria-hidden="true">
          <svg viewBox="0 0 220 220" className="h-full w-full" fill="none">
            <path d="M82 -8L224 134" stroke="currentColor" strokeWidth="1" />
            <path d="M112 -8L254 134" stroke="currentColor" strokeWidth="1" />
            <path d="M142 -8L284 134" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_center,#8FA6C7_1px,transparent_1px)] [background-size:12px_12px] [mask-image:linear-gradient(180deg,black,transparent_48%)]" />

        <div className="forgot-form-shell relative z-10 w-full max-w-[400px] -translate-y-1 lg:-translate-x-6 xl:max-w-[430px] xl:-translate-x-10 xl:translate-y-0">
          {!submitted ? (
            <div className="rounded-[8px] border border-[#DCE3EE] bg-white/96 px-4 pb-5 pt-6 shadow-[0_8px_24px_rgba(21,37,65,0.05)] backdrop-blur-sm sm:px-7 sm:pb-6 sm:pt-8">
              <div className="space-y-3 pb-3 text-center">
                <div className="flex justify-center">
                  <Link href="/" className="flex items-center bg-transparent border-0 p-0 cursor-pointer shrink-0">
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
                  <h1 className="text-[20px] font-extrabold tracking-normal text-[#071938]">
                    Lupa Password?
                  </h1>
                  <p className="mx-auto max-w-[320px] text-[13px] leading-6 text-[#647490]">
                    Masukkan email Anda dan kami akan mengirimkan instruksi reset password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[12px] font-extrabold text-[#20304A]">
                    Alamat Email
                  </label>
                  <div className="relative w-full">
                    <span className="pointer-events-none absolute left-5 top-1/2 flex -translate-y-1/2 items-center text-[#91A3BD]">
                      <MailIcon className="h-5 w-5" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 rounded-[8px] border-[#D9E0EA] bg-white px-5 pl-14 text-[12px] font-semibold text-[#17233A] shadow-[0_1px_0_rgba(15,23,42,0.02)] placeholder:text-[#17233A] focus-visible:border-[#8EA4C5] focus-visible:ring-[#8EA4C5]/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-linear-to-r from-[#FF7A1A] to-[#F15A00] text-[14px] font-extrabold text-white shadow-[0_12px_24px_rgba(241,90,0,0.24)] transition-all hover:brightness-105"
                  >
                    {loading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim instruksi...
                      </>
                    ) : (
                      "Kirim Link Reset"
                    )}
                  </Button>

                  <div className="relative flex items-center justify-center py-0.5 xl:py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E6ECF4]" />
                    </div>
                    <span className="relative bg-white px-4 text-[10px] font-extrabold uppercase tracking-normal text-[#7890B2] select-none">
                      atau
                    </span>
                  </div>

                  <Link
                    href="/login"
                    className="flex h-11 w-full cursor-pointer items-center justify-center rounded-[8px] border border-[#D9E0EA] bg-white text-[14px] font-extrabold text-[#253653] shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all hover:border-[#B8C5D8] hover:bg-slate-50"
                  >
                    Kembali ke halaman login
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-[8px] border border-[#DCE3EE] bg-white/96 px-4 pb-5 pt-6 shadow-[0_8px_24px_rgba(21,37,65,0.05)] backdrop-blur-sm sm:px-7 sm:pb-6 sm:pt-8">
              <div className="space-y-3 pb-3 text-center">
                <div className="flex justify-center">
                  <Link href="/" className="flex items-center bg-transparent border-0 p-0 cursor-pointer shrink-0">
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
                  <h1 className="text-[20px] font-extrabold tracking-normal text-[#071938]">
                    Permintaan Dikirim
                  </h1>
                  <p className="mx-auto max-w-[320px] text-[13px] leading-6 text-[#647490]">
                    Jika email <strong>{email}</strong> terdaftar, link reset password sudah kami kirim.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  className="h-11 rounded-[8px] bg-linear-to-r from-[#FF7A1A] to-[#F15A00] text-[14px] font-extrabold text-white shadow-[0_12px_24px_rgba(241,90,0,0.24)] transition-all hover:brightness-105"
                  onClick={() => setSubmitted(false)}
                >
                  Coba email lain
                </Button>
                <Link
                  href="/login"
                  className="flex h-11 items-center justify-center rounded-[8px] border border-[#D9E0EA] bg-white text-[14px] font-extrabold text-[#253653] shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all hover:border-[#B8C5D8] hover:bg-slate-50"
                >
                  Kembali ke halaman login
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="forgot-trust-badges pointer-events-none absolute bottom-7 left-1/2 z-10 hidden w-max -translate-x-1/2 flex-nowrap items-center justify-center gap-x-5 whitespace-nowrap text-[11px] font-bold text-[#6D7E9C] lg:flex xl:bottom-8 xl:gap-x-7 xl:text-[12px]">
          <div className="flex items-center gap-2.5">
            <ShieldCheckIcon className="h-5 w-5 text-[#7890B2]" />
            <span>Keamanan Terjamin</span>
          </div>
          <div className="flex items-center gap-2.5">
            <LockKeyholeIcon className="h-5 w-5 text-[#7890B2]" />
            <span>Privasi Dilindungi</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ClockIcon className="h-5 w-5 text-[#7890B2]" />
            <span>99.9% Uptime</span>
          </div>
        </div>
      </section>
    </main>
  )
}
