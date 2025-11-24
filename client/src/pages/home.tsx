import { AppLayout } from "@/components/layout/AppLayout";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import VideoShowcase from "@/components/VideoShowcase";
import PlatformIntegration from "@/components/PlatformIntegration";
import DashboardPreview from "@/components/DashboardPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95">
        <Hero />
        <section className="border-t border-white/5 bg-gradient-to-b from-black/40 via-background to-black/90">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 space-y-32">
            <FeaturesSection />
            <HowItWorks />
            <VideoShowcase />
            <PlatformIntegration />
            <DashboardPreview />
            <CTASection />
          </div>
        </section>
        <Footer />
      </main>
    </AppLayout>
  );
}
