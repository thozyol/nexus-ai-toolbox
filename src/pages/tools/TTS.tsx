import { SEO } from "@/components/SEO";
import { TTSForm } from "@/components/tools/TTSForm";

const TTSPage = () => {
  return (
    <main>
      <SEO title="AI Text to Speech | AI Tools Hub" description="Convert text to lifelike speech with ElevenLabs voices, securely via Supabase." />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">AI Text to Speech</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">Generate natural-sounding speech from text with multiple premium voices. No API key required for users.</p>
        <TTSForm />
      </section>
    </main>
  );
};

export default TTSPage;
