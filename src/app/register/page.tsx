import Link from "next/link"
import Image from "next/image"
import { SignupForm } from "@/components/signup-form"

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#F8FAFC] overflow-hidden select-none">
      {/* Fine Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#F47920]/5 blur-[80px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[90px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="relative w-full max-w-[440px] z-10 flex flex-col gap-6">
        {/* Logo floating above card */}
        <div className="flex justify-center mb-2">
          <Link href="/">
            <Image
              src="/images/logo-text-realsend.png"
              alt="RealSend Logo"
              width={160}
              height={40}
              priority
              className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>
        
        <SignupForm />
      </div>
    </div>
  )
}
