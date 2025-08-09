import ToolsLayout from '@/pages/tools/ToolsLayout';
import { QRCodeGenerator } from '@/components/tools/QRCodeGenerator';

const QRCodePage = () => (
  <ToolsLayout title="QR Code Generator" description="Generate QR codes locally in your browser for links, texts, and more.">
    <QRCodeGenerator />
  </ToolsLayout>
);

export default QRCodePage;
