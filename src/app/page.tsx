import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsAndTestimonials from '@/components/landing/StatsAndTestimonials';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

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
