import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResultItem { name: string; url: string; }

export const BatchResizer = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [quality, setQuality] = useState(85);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files || []);
    setFiles(fs);
    setResults([]);
  };

  const processAll = async () => {
    if (!files.length) return;
    try {
      setProcessing(true);
      const out: ResultItem[] = [];
      for (const f of files) {
        const img = await loadImage(f);
        const { canvas } = scaleToFit(img, maxWidth, maxHeight);
        const type = 'image/jpeg';
        const blob = await canvasToBlob(canvas, type, quality / 100);
        const url = URL.createObjectURL(blob);
        const base = f.name.replace(/\.[^.]+$/, '');
        out.push({ name: `${base}.jpg`, url });
      }
      setResults(out);
      toast({ title: 'Completed', description: `Processed ${out.length} images.` });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to process files', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Batch Resizer</CardTitle>
        <CardDescription>Resize multiple images at once. Downloads are provided individually.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" multiple accept="image/*" onChange={onFileChange} />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Width (px)</label>
            <Input type="number" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Height (px)</label>
            <Input type="number" value={maxHeight} onChange={(e) => setMaxHeight(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality: {quality}%</label>
            <Slider value={[quality]} max={100} min={50} step={1} onValueChange={(v) => setQuality(v[0])} />
          </div>
        </div>

        <Button onClick={processAll} disabled={!files.length || processing} variant="hero">
          {processing ? 'Processing…' : `Process ${files.length || ''}`}
        </Button>

        {!!results.length && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r) => (
              <div key={r.url} className="rounded-lg border p-3 bg-muted/20">
                <div className="aspect-video overflow-hidden rounded-md mb-2 flex items-center justify-center bg-muted/30">
                  <img src={r.url} alt={r.name} className="object-contain w-full h-full" />
                </div>
                <a href={r.url} download={r.name}>
                  <Button className="w-full" variant="outline">Download {r.name}</Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function scaleToFit(img: HTMLImageElement, maxW: number, maxH: number) {
  const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  const w = Math.round(img.naturalWidth * ratio);
  const h = Math.round(img.naturalHeight * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, w, h };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, type, quality);
  });
}
