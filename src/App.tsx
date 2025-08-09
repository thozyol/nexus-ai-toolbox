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
import TTSPage from "./pages/tools/TTS";
import ImageGenPage from "./pages/tools/ImageGen";
import ImageConverterPage from "./pages/tools/ImageConverter";
import BatchResizerPage from "./pages/tools/BatchResizer";
import QRCodePage from "./pages/tools/QRCode";
import WatermarkPage from "./pages/tools/Watermark";
import PaletteExtractorPage from "./pages/tools/PaletteExtractor";

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
            <Route path="/tools/image-converter" element={<ImageConverterPage />} />
            <Route path="/tools/batch-resizer" element={<BatchResizerPage />} />
            <Route path="/tools/qr-generator" element={<QRCodePage />} />
            <Route path="/tools/watermark" element={<WatermarkPage />} />
            <Route path="/tools/palette-extractor" element={<PaletteExtractorPage />} />
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
