import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Header } from "./components/layout/Header";
import YouTubeSummaryPage from "./pages/tools/YouTubeSummary";
import ImageCompressorPage from "./pages/tools/ImageCompressor";
import TTSPage from "./pages/tools/TTS";
import ImageGenPage from "./pages/tools/ImageGen";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools/youtube-summary" element={<YouTubeSummaryPage />} />
            <Route path="/tools/image-compressor" element={<ImageCompressorPage />} />
            <Route path="/tools/tts" element={<TTSPage />} />
            <Route path="/tools/image-gen" element={<ImageGenPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
