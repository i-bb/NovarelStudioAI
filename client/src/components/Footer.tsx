export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-cursive text-2xl text-primary mb-4">NovarelStudio</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered content automation for the modern creator.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors" data-testid="link-footer-features">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors" data-testid="link-footer-pricing">Pricing</a></li>
              <li><a href="#dashboard" className="hover:text-foreground transition-colors" data-testid="link-footer-dashboard">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-about">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-blog">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 NovarelStudio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
