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
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/content">
        <DashboardLayout>
          <DashboardContent />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/content/:id">
        <DashboardLayout>
          <VideoDetail />
        </DashboardLayout>
      </Route>

      <Route path="/subscription">
        <DashboardLayout>
          <Subscription />
        </DashboardLayout>
      </Route>

      <Route path="/transactions">
        <DashboardLayout>
          <Transactions />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/content/:id/reel/:reelId">
        <DashboardLayout>
          <SingleVideoDetails />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/accounts">
        <DashboardLayout>
          <ConnectedAccountsPage />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/profile">
        <DashboardLayout>
          <ProfilePage />
        </DashboardLayout>
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
