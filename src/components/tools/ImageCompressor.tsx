import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

export const ImageCompressor = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [isProcessing, setIsProcessing] = useState(false);

  const originalSizeKB = useMemo(() => file ? Math.round(file.size / 1024) : 0, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const processImage = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const img = await loadImage(file);
      const { canvas } = scaleToFit(img, maxWidth, maxHeight);
      const blob = await canvasToBlob(canvas, 'image/jpeg', quality / 100);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast({ title: 'Success', description: 'Image optimized successfully!' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to process image', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const optimizedSizeKB = useMemo(() => {
    if (!resultUrl) return 0;
    return 0; // Not available until blob fetched; show 0 and rely on visual result
  }, [resultUrl]);

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Image Compressor</CardTitle>
        <CardDescription>Resize and compress images directly in your browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" onChange={onFileChange} />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {preview ? (
              <img src={preview} alt="original image preview" className="object-contain w-full h-full" />
            ) : (
              <span className="text-muted-foreground text-sm">Upload an image</span>
            )}
          </div>
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {resultUrl ? (
              <img src={resultUrl} alt="optimized image preview" className="object-contain w-full h-full" />
            ) : (
              <span className="text-muted-foreground text-sm">Result will appear here</span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality: {quality}%</label>
            <Slider value={[quality]} max={100} min={10} step={1} onValueChange={(v) => setQuality(v[0])} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Width (px)</label>
            <Input type="number" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Height (px)</label>
            <Input type="number" value={maxHeight} onChange={(e) => setMaxHeight(Number(e.target.value))} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={processImage} disabled={!file || isProcessing} variant="hero">
            {isProcessing ? 'Processing…' : 'Optimize'}
          </Button>
          {resultUrl && (
            <a href={resultUrl} download="optimized.jpg">
              <Button variant="outline">Download JPG</Button>
            </a>
          )}
        </div>

        {file && (
          <div className="text-xs text-muted-foreground">
            Original: {originalSizeKB.toLocaleString()} KB{optimizedSizeKB ? ` → Optimized: ${optimizedSizeKB.toLocaleString()} KB` : ''}
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

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, type, quality);
  });
}
