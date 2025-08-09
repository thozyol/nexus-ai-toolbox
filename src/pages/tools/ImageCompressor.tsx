import { SEO } from "@/components/SEO";
import { ImageCompressor } from "@/components/tools/ImageCompressor";

const ImageCompressorPage = () => {
  return (
    <main>
      <SEO title="Image Compressor | AI Tools Hub" description="Compress and resize images locally in your browser while maintaining quality." />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Image Compressor</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">Upload an image, pick quality and size, and download an optimized version instantly.</p>
        <ImageCompressor />
      </section>
    </main>
  );
};

export default ImageCompressorPage;
