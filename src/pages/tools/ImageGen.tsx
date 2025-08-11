import { SEO } from "@/components/SEO";
import { RunwareImageGen } from "@/components/tools/RunwareImageGen";

const ImageGenPage = () => {
  return (
    <main>
      <SEO title="AI Image Generator | AI Tools Hub" description="Create stunning images from text prompts using Runware, securely via Supabase." />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">AI Image Generator</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">Generate high-quality images with powerful diffusion. No API key required for users.</p>
        <RunwareImageGen />
      </section>
    </main>
  );
};

export default ImageGenPage;
