import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export const WatermarkTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [text, setText] = useState('© Your Brand');
  const [opacity, setOpacity] = useState(30);
  const [size, setSize] = useState(32);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const apply = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = await loadImage(file);
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Draw watermark bottom-right
      ctx.font = `${size}px sans-serif`;
      ctx.textBaseline = 'bottom';
      const padding = Math.max(16, Math.round(size * 0.5));
      const metrics = ctx.measureText(text);
      const x = canvas.width - metrics.width - padding;
      const y = canvas.height - padding;
      ctx.fillStyle = `hsla(var(--foreground) / ${opacity / 100})`;
      // Fallback color if CSS variable not resolved in canvas
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
      // Add subtle shadow for contrast
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(text, x, y);

      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png'));
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Watermark</CardTitle>
        <CardDescription>Add a text watermark to your image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" onChange={onFileChange} />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {preview ? <img src={preview} alt="original preview" className="object-contain w-full h-full" /> : <span className="text-muted-foreground text-sm">Upload an image</span>}
          </div>
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {resultUrl ? <img src={resultUrl} alt="watermarked preview" className="object-contain w-full h-full" /> : <span className="text-muted-foreground text-sm">Result will appear here</span>}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Opacity: {opacity}%</label>
            <Slider value={[opacity]} max={100} min={5} step={1} onValueChange={(v) => setOpacity(v[0])} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size: {size}px</label>
            <Slider value={[size]} max={128} min={12} step={1} onValueChange={(v) => setSize(v[0])} />
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex items-center gap-2">
          <Button onClick={apply} disabled={!file || processing} variant="hero">{processing ? 'Applying…' : 'Apply Watermark'}</Button>
          {resultUrl && <a href={resultUrl} download="watermarked.png"><Button variant="outline">Download</Button></a>}
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
