
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/dark-mode/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import RFM from "./pages/RFM";
import Lifecycle from "./pages/Lifecycle";
import Settings from "./pages/Settings";
import Sync from "./pages/Sync";
import Segmentation from "./pages/Segmentation";
import DataModeling from "./pages/DataModeling";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/rfm" element={<RFM />} />
            <Route path="/lifecycle" element={<Lifecycle />} />
            <Route path="/sync" element={<Sync />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="/data-modeling" element={<DataModeling />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
