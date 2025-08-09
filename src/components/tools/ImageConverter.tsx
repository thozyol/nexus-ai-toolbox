import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ImageConverter = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(90);
  const [processing, setProcessing] = useState(false);

  const filenameOut = useMemo(() => {
    if (!file) return 'converted';
    const base = file.name.replace(/\.[^.]+$/, '');
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    return `${base}.${ext}`;
  }, [file, format]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    try {
      setProcessing(true);
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);

      const q = format === 'image/jpeg' || format === 'image/webp' ? quality / 100 : undefined;
      const blob = await canvasToBlob(canvas, format, q);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast({ title: 'Converted', description: 'Image converted successfully.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to convert image', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Image Converter</CardTitle>
        <CardDescription>Convert images between PNG, JPG, and WebP in your browser.</CardDescription>
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
              <img src={resultUrl} alt="converted image preview" className="object-contain w-full h-full" />
            ) : (
              <span className="text-muted-foreground text-sm">Result will appear here</span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="image/png">PNG (.png)</option>
              <option value="image/jpeg">JPG (.jpg)</option>
              <option value="image/webp">WebP (.webp)</option>
            </select>
          </div>
          {(format === 'image/jpeg' || format === 'image/webp') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality: {quality}%</label>
              <Slider value={[quality]} max={100} min={50} step={1} onValueChange={(v) => setQuality(v[0])} />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Output filename</label>
            <Input value={filenameOut} readOnly />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={convert} disabled={!file || processing} variant="hero">
            {processing ? 'Converting…' : 'Convert'}
          </Button>
          {resultUrl && (
            <a href={resultUrl} download={filenameOut}><Button variant="outline">Download</Button></a>
          )}
        </div>
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

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, type, quality);
  });
}
