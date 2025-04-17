import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/dark-mode/ThemeProvider";
import { MicroSegmentationProvider } from "./context/MicroSegmentationContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/utils/protectedRoutes";
import { SegmentToggleProvider } from "./context/SegmentToggleContext";
import { SegmentDataProvider } from "./context/SegmentDataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SegmentToggleProvider>
          <SegmentDataProvider>
              <MicroSegmentationProvider>
                <BrowserRouter>
                  <AuthProvider>
                    <ProtectedRoutes />
                  </AuthProvider>
                </BrowserRouter>
              </MicroSegmentationProvider>
          </SegmentDataProvider>
        </SegmentToggleProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
