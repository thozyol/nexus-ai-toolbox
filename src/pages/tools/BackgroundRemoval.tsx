import { SEO } from "@/components/SEO";
import { BackgroundRemover } from "@/components/tools/BackgroundRemover";

const BackgroundRemovalPage = () => {
  return (
    <main>
      <SEO title="AI Background Remover | AI Tools Hub" description="Remove image backgrounds instantly in your browser using AI segmentation." />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">AI Background Remover</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">Upload an image and remove the background fully in your browser using state-of-the-art segmentation. No uploads needed.</p>
        <BackgroundRemover />
      </section>
    </main>
  );
};

export default BackgroundRemovalPage;
