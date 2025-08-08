import { SEO } from "@/components/SEO";

const ToolsLayout = ({ children, title, description }: { children: React.ReactNode; title: string; description: string; }) => (
  <main>
    <SEO title={`${title} | AI Tools Hub`} description={description} />
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">{description}</p>
      {children}
    </section>
  </main>
);

export default ToolsLayout;
