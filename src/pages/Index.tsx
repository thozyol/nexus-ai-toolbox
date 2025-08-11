import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/SEO';

const Index = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <main>
      <SEO title="AI Tools Hub | Powerful AI Toolkit" description="All-in-one AI tools: background remover, web crawler, text to speech, and image generator." />
      <header ref={heroRef} onMouseMove={onMove} className="bg-hero">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-sm uppercase tracking-wider text-accent mb-3">Your Multi‑AI Playground</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">AI Tools Hub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            A curated collection of powerful AI utilities in one sleek workspace. Create images, voice, scrape sites, and edit photos.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/tools/image-gen"><Button variant="hero" size="lg">Generate Image</Button></Link>
            
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-surface elevated-shadow">
          <CardHeader>
            <CardTitle>Image Converter</CardTitle>
            <CardDescription>Convert between PNG, JPG, and WebP</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tools/image-converter"><Button className="w-full" variant="premium">Open</Button></Link>
          </CardContent>
        </Card>
        <Card className="glass-surface elevated-shadow">
          <CardHeader>
            <CardTitle>Batch Resizer</CardTitle>
            <CardDescription>Resize multiple images at once</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tools/batch-resizer"><Button className="w-full" variant="premium">Open</Button></Link>
          </CardContent>
        </Card>
        <Card className="glass-surface elevated-shadow">
          <CardHeader>
            <CardTitle>QR Code Generator</CardTitle>
            <CardDescription>Create QR codes from text/URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tools/qr-generator"><Button className="w-full" variant="premium">Open</Button></Link>
          </CardContent>
        </Card>
        <Card className="glass-surface elevated-shadow">
          <CardHeader>
            <CardTitle>Watermark Tool</CardTitle>
            <CardDescription>Add custom watermarks to images</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tools/watermark"><Button className="w-full" variant="premium">Open</Button></Link>
          </CardContent>
        </Card>
        <Card className="glass-surface elevated-shadow">
          <CardHeader>
            <CardTitle>Text to Speech</CardTitle>
            <CardDescription>ElevenLabs premium voices</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tools/tts"><Button className="w-full" variant="premium">Open</Button></Link>
          </CardContent>
        </Card>
        <Card className="glass-surface elevated-shadow">
          <CardHeader>
            <CardTitle>Image Generator</CardTitle>
            <CardDescription>Runware diffusion models</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tools/image-gen"><Button className="w-full" variant="premium">Open</Button></Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Index;
