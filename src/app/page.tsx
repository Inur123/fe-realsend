import dynamic from 'next/dynamic';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';

// Below-fold sections — lazy loaded after initial paint
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), { ssr: true });
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'), { ssr: true });
const StatsAndTestimonials = dynamic(() => import('@/components/landing/StatsAndTestimonials'), { ssr: true });
const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), { ssr: true });
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: true });
const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'), { ssr: true });

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsAndTestimonials />
      <PricingSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
