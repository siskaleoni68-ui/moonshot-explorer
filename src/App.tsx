import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import LearnBasics from "./pages/LearnBasics";
import RocketAnatomy from "./pages/RocketAnatomy";
import VirtualLab from "./pages/VirtualLab";
import MoonMission from "./pages/MoonMission";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useOnboardingStore } from "./stores/onboardingStore";

const queryClient = new QueryClient();

function AppRoutes() {
  const { hasCompletedOnboarding } = useOnboardingStore();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          hasCompletedOnboarding ? <Navigate to="/learn" replace /> : <Onboarding />
        } 
      />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/learn" element={<LearnBasics />} />
      <Route path="/anatomy" element={<RocketAnatomy />} />
      <Route path="/lab" element={<VirtualLab />} />
      <Route path="/mission" element={<MoonMission />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
