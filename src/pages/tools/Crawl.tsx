import { SEO } from "@/components/SEO";
import { CrawlForm } from "@/components/tools/CrawlForm";

const CrawlPage = () => {
  return (
    <main>
      <SEO title="AI Web Crawler | AI Tools Hub" description="Crawl and extract website content using Firecrawl. Bring your API key." />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">AI Web Crawler</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">Crawl websites and extract structured content. Set your Firecrawl API key, enter a URL, and start.</p>
        <CrawlForm />
      </section>
    </main>
  );
};

export default CrawlPage;
