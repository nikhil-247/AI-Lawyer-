import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";
import { SessionProvider } from "@/contexts/SessionContext";

import Splash from "@/pages/Splash";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PatientSetup from "@/pages/PatientSetup";
import Home from "@/pages/Home";
import SessionGenerator from "@/pages/SessionGenerator";
import SessionFamily from "@/pages/SessionFamily";
import SessionCoreMemories from "@/pages/SessionCoreMemories";
import SessionReassurances from "@/pages/SessionReassurances";
import SessionMorningRoutine from "@/pages/SessionMorningRoutine";
import SessionNightRoutine from "@/pages/SessionNightRoutine";
import SchedulePage from "@/pages/Schedule";
import Emergency from "@/pages/Emergency";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/welcome" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/patient-setup" component={PatientSetup} />
      <Route path="/home">
        {() => <ProtectedRoute component={Home} />}
      </Route>
      <Route path="/session-generator">
        {() => <ProtectedRoute component={SessionGenerator} />}
      </Route>
      <Route path="/session-family">
        {() => <ProtectedRoute component={SessionFamily} />}
      </Route>
      <Route path="/session-core-memories">
        {() => <ProtectedRoute component={SessionCoreMemories} />}
      </Route>
      <Route path="/session-reassurances">
        {() => <ProtectedRoute component={SessionReassurances} />}
      </Route>
      <Route path="/session-morning-routine">
        {() => <ProtectedRoute component={SessionMorningRoutine} />}
      </Route>
      <Route path="/session-night-routine">
        {() => <ProtectedRoute component={SessionNightRoutine} />}
      </Route>
      <Route path="/schedule">
        {() => <ProtectedRoute component={SchedulePage} />}
      </Route>
      <Route path="/emergency">
        {() => <ProtectedRoute component={Emergency} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PatientProvider>
            <SessionProvider>
              <Router />
              <Toaster />
            </SessionProvider>
          </PatientProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
