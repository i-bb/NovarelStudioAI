import { AppLayout } from "@/components/layout/AppLayout";
import Footer from "@/components/Footer";
import { FileText, Mail } from "lucide-react";

export default function TermsPage() {
  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <FileText className="h-3.5 w-3.5" />
              Legal
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: Nov 11, 2025
            </p>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                1. Service Description
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Novarel Studio is an automated content creation and distribution platform that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Monitors streaming platforms such as Twitch</li>
                <li>Processes video content using <strong className="text-foreground">Waterloop AI</strong>, our internal engine</li>
                <li>Distributes curated clips to social media platforms (<strong className="text-foreground">Instagram, TikTok, YouTube</strong>)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The service operates via automated workflows for internal business operations and <strong className="text-foreground">platform verification</strong> purposes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                2. Automated Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Workflows include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Live stream recording (via FFmpeg and Streamlink)</li>
                <li>AI-based content analysis and clip generation using <strong className="text-foreground">Waterloop AI</strong></li>
                <li>Automated content distribution to connected social media accounts</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All processing is <strong className="text-foreground">fully automated</strong>; no manual intervention is required.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                3. Content Processing
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Streams are recorded in segments (typically 30 minutes)</li>
                <li>Clips are generated from engaging moments identified by <strong className="text-foreground">Waterloop AI</strong></li>
                <li>Generated clips are automatically posted to authorized social media accounts</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                4. Platform Integration
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>This service depends on third-party APIs and platforms, including: Twitch, <strong className="text-foreground">AWS S3</strong>, Instagram, TikTok, and YouTube.</li>
                <li><strong className="text-foreground">Availability and performance</strong> of these platforms may affect workflow execution.</li>
                <li><strong className="text-foreground">Waterloop AI</strong> is fully internal; no third-party AI service is used.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                5. Service Availability
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Workflows are subject to stream schedules and external platform availability.</li>
                <li>No guarantee of uninterrupted or error-free operation is provided.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                6. Modifications
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Terms of Service and automated workflows may be updated at any time to maintain <strong className="text-foreground">compliance and operational efficiency</strong>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                7. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For inquiries regarding these Terms:
              </p>
              <a 
                href="mailto:novarel.studio@gmail.com" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                data-testid="link-terms-email"
              >
                <Mail className="h-4 w-4" />
                novarel.studio@gmail.com
              </a>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
                8. Disclaimer
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provided "as is" without warranties.</li>
                <li>Novarel Studio is <strong className="text-foreground">not responsible</strong> for errors, service interruptions, or losses arising from use or reliance on this system.</li>
              </ul>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </AppLayout>
  );
}
