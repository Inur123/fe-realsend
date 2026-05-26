import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'RealSend — Layanan SMTP Profesional Indonesia | Authentic SMTP Delivery',
  description:
    'RealSend adalah platform email transaksional profesional untuk developer dan bisnis Indonesia. Deliverability tinggi, dedicated IP, analytics real-time, dan harga terjangkau.',
  keywords: [
    'SMTP Indonesia',
    'email transaksional',
    'layanan email',
    'dedicated IP',
    'email delivery',
    'SMTP server',
    'email API',
    'RealSend',
  ],
  authors: [{ name: 'RealSend', url: 'https://realsend.id' }],
  creator: 'RealSend',
  openGraph: {
    title: 'RealSend — Authentic SMTP Delivery',
    description: 'Platform email transaksional profesional untuk developer & bisnis Indonesia.',
    url: 'https://realsend.id',
    siteName: 'RealSend',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealSend — Authentic SMTP Delivery',
    description: 'Platform email transaksional profesional untuk developer & bisnis Indonesia.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`light scroll-smooth ${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/logo-realsend.png" />
      </head>
      <body className={`antialiased ${inter.className}`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

