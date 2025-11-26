import { AppLayout } from "@/components/layout/AppLayout";
import Footer from "@/components/Footer";
import { Shield, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24 pb-16">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Shield className="h-3.5 w-3.5" />
              Legal
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: Nov 11, 2025
            </p>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Novarel Studio collects and processes streaming data from platforms such as Twitch to automatically create and distribute content clips. Collected data includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Technical metadata from streams (timestamps, content identifiers)</li>
                <li>Stream recordings necessary for automated workflows</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We <strong className="text-foreground">do not collect personally identifiable information</strong> beyond the minimum required for account authentication and social media integration.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Collected data is used exclusively for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Automated content creation and distribution</li>
                <li>Recording live streams and segmenting video content</li>
                <li>AI-based analysis of video segments using our <strong className="text-foreground">internal engine, Waterloop AI</strong>, to generate engaging clips</li>
                <li>Posting clips/reels to connected social media accounts (Instagram, YouTube, TikTok)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                No user data is used for advertising, resale, or purposes outside the automated workflow.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                3. Data Storage and Security
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>All content and metadata are securely stored using <strong className="text-foreground">AWS S3</strong>, with access restricted to authorized personnel.</li>
                <li>Industry-standard security measures (such as encryption and access control) are applied to protect data during storage and processing.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                4. Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our service integrates with external platforms only as required to perform automated workflows:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Twitch</strong> – stream source</li>
                <li><strong className="text-foreground">AWS</strong> – secure content storage</li>
                <li><strong className="text-foreground">Instagram, TikTok, YouTube</strong> – automated content distribution</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong className="text-foreground">Waterloop AI</strong> is fully internal; all AI processing occurs within our own systems.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                5. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Processed content and metadata are retained <strong className="text-foreground">only as long as necessary</strong> to support automated workflows and platform compliance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                6. User Control
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Users can <strong className="text-foreground">disconnect social media accounts</strong> at any time, revoking future access to their content and data.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                7. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions regarding this Privacy Policy or data handling practices:
              </p>
              <a 
                href="mailto:novarel.studio@gmail.com" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                data-testid="link-privacy-email"
              >
                <Mail className="h-4 w-4" />
                novarel.studio@gmail.com
              </a>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                8. Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Updates may occur periodically. Changes will be reflected on this page with a revised effective date.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </AppLayout>
  );
}
