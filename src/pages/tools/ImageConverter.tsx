import ToolsLayout from '@/pages/tools/ToolsLayout';
import { ImageConverter } from '@/components/tools/ImageConverter';

const ImageConverterPage = () => {
  return (
    <ToolsLayout title="Image Converter" description="Convert images between PNG, JPG, and WebP locally in your browser.">
      <ImageConverter />
    </ToolsLayout>
  );
};

export default ImageConverterPage;
