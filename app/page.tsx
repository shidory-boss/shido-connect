import PWANav from '@/components/layout/PWANav';
import PWAFooter from '@/components/layout/PWAFooter';
import HeroSection from '@/components/vitrine/HeroSection';
import ServicesSection from '@/components/vitrine/ServicesSection';
import TeamSection from '@/components/vitrine/TeamSection';
import TestimonialsSection from '@/components/vitrine/TestimonialsSection';
import ContactSection from '@/components/vitrine/ContactSection';
import StatsBar from '@/components/vitrine/StatsBar';

export default function HomePage() {
  return (
    <>
      <PWANav />
      <main>
        <HeroSection />
        <StatsBar />
        <ServicesSection />
        <TeamSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <PWAFooter />
    </>
  );
}
