import { SubjectHeroSection } from '@/components/aspire/SubjectHero/SubjectHeroSection';
import { AboutSection } from '@/components/aspire/AboutSection';
import { SubjectsSection } from '@/components/aspire/SubjectsSection';
import { CtaSection } from '@/components/aspire/CtaSection';
import { WhyAspireSection } from '@/components/aspire/WhyAspireSection';
import { ComparisonTableSection } from '@/components/aspire/ComparisonTableSection';
import { HowItWorksSection } from '@/components/aspire/HowItWorksSection';
import { TestimonialsSection } from '@/components/aspire/TestimonialsSection';
import { LocationSection } from '@/components/aspire/LocationSection';
import { FaqSection } from '@/components/aspire/FaqSection';
import { ContourFormSection } from '@/components/aspire/ContourForm/ContourFormSection';
import { Footer } from '@/components/aspire/Footer';

export default function VCEChemistryNewFormPage() {
  return (
    <main className="min-h-screen">
      {/* Subject Hero Section */}
      <SubjectHeroSection subject="Chemistry" />

      {/* At Aspire Section - Philosophy and key features */}
      <AboutSection />

      {/* Subjects Section - All subjects offered */}
      <SubjectsSection />

      {/* Mid-page CTA */}
      <CtaSection title="Aspire will help push your child to their full potential" />

      {/* Why Aspire Section - Three key benefits */}
      <WhyAspireSection />

      {/* Comparison Table - Aspire vs Others */}
      <ComparisonTableSection />

      {/* How It Works Section - 3-step process */}
      <HowItWorksSection />

      {/* Testimonials Section - Social proof */}
      <TestimonialsSection />

      {/* Location Section - Map and address */}
      <LocationSection />

      {/* FAQ Section - Common questions */}
      <FaqSection />

      {/* Final CTA Section */}
      <CtaSection
        title="Let's Make This School Year Count"
        description="Get the academic support your child deserves. Book your free trial now, no obligations"
      />

      {/* New Contour-style Form */}
      <ContourFormSection subject="Chemistry" />

      {/* Footer - Contact information */}
      <Footer />
    </main>
  );
}
