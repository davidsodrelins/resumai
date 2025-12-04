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
import DonationSuccess from "@/pages/DonationSuccess";
import Profile from "@/pages/Profile";
import { ResetPassword } from "@/pages/ResetPassword";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { Admin } from "@/pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/verify-email"} component={VerifyEmail} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/admin"}>
        <ProtectedRoute><Admin /></ProtectedRoute>
      </Route>
      <Route path={"/donation/success"}>
        <ProtectedRoute><DonationSuccess /></ProtectedRoute>
      </Route>
      <Route path={"/history"}>
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
