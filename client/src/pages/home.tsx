import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import VideoShowcase from "@/components/VideoShowcase";
import PlatformIntegration from "@/components/PlatformIntegration";
import DashboardPreview from "@/components/DashboardPreview";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <VideoShowcase />
        <PlatformIntegration />
        <DashboardPreview />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
