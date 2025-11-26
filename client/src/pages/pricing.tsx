import { AppLayout } from "@/components/layout/AppLayout";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Pricing() {
  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <section className="border-t border-white/5 bg-gradient-to-b from-black/40 via-background to-black/90">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-20 space-y-32">
            <PricingSection />
            <CTASection />
          </div>
        </section>
        <Footer />
      </main>
    </AppLayout>
  );
}
