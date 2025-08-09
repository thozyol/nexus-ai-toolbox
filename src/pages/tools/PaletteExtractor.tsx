import ToolsLayout from '@/pages/tools/ToolsLayout';
import { PaletteExtractor } from '@/components/tools/PaletteExtractor';

const PaletteExtractorPage = () => (
  <ToolsLayout title="Palette Extractor" description="Extract dominant colors from any image and copy hex values.">
    <PaletteExtractor />
  </ToolsLayout>
);

export default PaletteExtractorPage;
