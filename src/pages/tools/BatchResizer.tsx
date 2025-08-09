import ToolsLayout from '@/pages/tools/ToolsLayout';
import { BatchResizer } from '@/components/tools/BatchResizer';

const BatchResizerPage = () => (
  <ToolsLayout title="Batch Resizer" description="Resize multiple images at once with max width/height and quality controls.">
    <BatchResizer />
  </ToolsLayout>
);

export default BatchResizerPage;
