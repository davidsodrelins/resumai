import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import History from "./pages/History";
import Generator from "./pages/Generator";
import CoverLetter from "./pages/CoverLetter";
import Compare from "./pages/Compare";
import Analysis from "@/pages/Analysis";
import SoftSkills from "@/pages/SoftSkills";
import Portfolio from "@/pages/Portfolio";
import Resources from "@/pages/Resources";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import DonationSuccess from "@/pages/DonationSuccess";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import AdminMetrics from "@/pages/AdminMetrics";
import AdminNotifications from "@/pages/AdminNotifications";
import AdminReports from "@/pages/AdminReports";
import PaymentHistory from "@/pages/PaymentHistory";
import { AdminBlog } from "@/pages/AdminBlog";
import { AdminBlogEditor } from "@/pages/AdminBlogEditor";
import Referral from "@/pages/Referral";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ReferralProgram from "@/pages/ReferralProgram";
import PublicHome from "@/pages/PublicHome";
import ProtectedRoute from "./components/ProtectedRoute";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FloatingCTA from "@/components/FloatingCTA";
import Onboarding from "@/components/Onboarding";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={PublicHome} />
      <Route path={"/home"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/donation/success"}>
        <ProtectedRoute><DonationSuccess /></ProtectedRoute>
      </Route>
      <Route path={"/referral"}>
        <ProtectedRoute><Referral /></ProtectedRoute>
      </Route>
      <Route path={"/indique-e-ganhe"}>
        <ProtectedRoute><ReferralProgram /></ProtectedRoute>
      </Route>
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/admin/blog"}>
        <ProtectedRoute><AdminBlog /></ProtectedRoute>
      </Route>
      <Route path={"/admin/blog/new"}>
        <ProtectedRoute><AdminBlogEditor /></ProtectedRoute>
      </Route>
      <Route path={"/admin/blog/edit/:id"}>
        <ProtectedRoute><AdminBlogEditor /></ProtectedRoute>
      </Route>      <Route path={"/history"}>
        <ProtectedRoute><History /></ProtectedRoute>
      </Route>
      <Route path={"/generator"}>
        <ProtectedRoute><Generator /></ProtectedRoute>
      </Route>
      <Route path={"/cover-letter"}>
        <ProtectedRoute><CoverLetter /></ProtectedRoute>
      </Route>
      <Route path={"/compare"}>
        <ProtectedRoute><Compare /></ProtectedRoute>
      </Route>
      <Route path="/analysis">
        <ProtectedRoute><Analysis /></ProtectedRoute>
      </Route>
      <Route path="/soft-skills">
        <ProtectedRoute><SoftSkills /></ProtectedRoute>
      </Route>
      <Route path="/portfolio">
        <ProtectedRoute><Portfolio /></ProtectedRoute>
      </Route>
      <Route path="/resources">
        <ProtectedRoute><Resources /></ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute><Admin /></ProtectedRoute>
      </Route>
      <Route path="/admin/metrics">
        <ProtectedRoute><AdminMetrics /></ProtectedRoute>
      </Route>
      <Route path="/admin/notifications">
        <ProtectedRoute><AdminNotifications /></ProtectedRoute>
      </Route>
      <Route path="/admin/reports">
        <ProtectedRoute><AdminReports /></ProtectedRoute>
      </Route>
      <Route path="/payment-history">
        <ProtectedRoute><PaymentHistory /></ProtectedRoute>
      </Route>
      <Route path={"/404"} component={NotFound} />      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <Onboarding />
          <ExitIntentPopup />
          <FloatingCTA />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
