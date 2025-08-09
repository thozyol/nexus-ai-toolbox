import ToolsLayout from '@/pages/tools/ToolsLayout';
import { WatermarkTool } from '@/components/tools/WatermarkTool';

const WatermarkPage = () => (
  <ToolsLayout title="Watermark" description="Add a clean text watermark to your images directly in the browser.">
    <WatermarkTool />
  </ToolsLayout>
);

export default WatermarkPage;
