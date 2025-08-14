import { SEO } from "@/components/SEO";
import { YouTubeSummarizer } from "@/components/tools/YouTubeSummarizer";

const YouTubeSummaryPage = () => {
  return (
    <main>
      <SEO title="YouTube Video Summarizer | AI Tools Hub" description="Summarize YouTube videos in your browser by fetching or pasting the transcript and generating a concise summary." />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">YouTube Video Summarizer</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">Enter a YouTube URL or paste the transcript. We summarize it locally with an in-browser model.</p>
        <YouTubeSummarizer />
      </section>
    </main>
  );
};

export default YouTubeSummaryPage;
