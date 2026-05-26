import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

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
    <html lang="id" className="light scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/logo-realsend.png" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
