import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import HowItWorksPage from "@/pages/how-it-works";
import Pricing from "@/pages/pricing";
import ShowcasePage from "@/pages/showcase";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import Dashboard from "@/pages/dashboard";
import DashboardContent from "@/pages/dashboard-content";
import VideoDetail from "@/pages/video-detail";
import ConnectedAccountsPage from "@/pages/connected-accounts";
import ProfilePage from "@/pages/profile";
import CheckoutSuccessPage from "@/pages/checkout-success";
import CheckoutCancelPage from "@/pages/checkout-cancel";
import NotFound from "@/pages/not-found";
import SingleVideoDetails from "./pages/singleVideoDetails";
import Subscription from "./pages/subscription";
import Transactions from "./pages/transactions";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ForgotPassword from "./pages/forgot-password";
import { AuthProvider } from "./hooks/AuthProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/showcase" component={ShowcasePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />

      <Route path="/dashboard">
        <AuthProvider>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/dashboard/content">
        <AuthProvider>
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/dashboard/content/:id">
        <AuthProvider>
          <DashboardLayout>
            <VideoDetail />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/subscription">
        <AuthProvider>
          <DashboardLayout>
            <Subscription />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/transactions">
        <AuthProvider>
          <DashboardLayout>
            <Transactions />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/dashboard/content/:id/reel/:reelId">
        <AuthProvider>
          <DashboardLayout>
            <SingleVideoDetails />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/dashboard/accounts">
        <AuthProvider>
          <DashboardLayout>
            <ConnectedAccountsPage />
          </DashboardLayout>
        </AuthProvider>
      </Route>

      <Route path="/dashboard/profile">
        <AuthProvider>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </AuthProvider>
      </Route>
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/checkout/cancel" component={CheckoutCancelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
