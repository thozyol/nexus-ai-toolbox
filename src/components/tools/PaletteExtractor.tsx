import { useEffect, useRef, useState } from 'react';
import ColorThief from 'color-thief-browser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function rgbToHex([r, g, b]: number[]) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export const PaletteExtractor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imgUrl) return;
    const img = imgRef.current;
    if (!img) return;
    if (!img.complete) return; // wait until load handler fires
    const ct = new ColorThief();
    try {
      const pal = ct.getPalette(img, 6) as number[][];
      setPalette(pal.map(rgbToHex));
    } catch (e) {
      console.warn('Palette extraction failed', e);
    }
  }, [imgUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPalette([]);
    setImgUrl(f ? URL.createObjectURL(f) : null);
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Color Palette Extractor</CardTitle>
        <CardDescription>Extract the dominant colors from an image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" onChange={onFileChange} />
        <div className="grid md:grid-cols-2 gap-4 items-start">
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {imgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={imgRef} src={imgUrl} crossOrigin="anonymous" alt="source" className="object-contain w-full h-full" onLoad={() => setImgUrl((u) => u)} />
            ) : (
              <span className="text-muted-foreground text-sm">Upload an image</span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {palette.length ? (
              palette.map((hex) => (
                <div key={hex} className="rounded-md border overflow-hidden">
                  <div className="h-12" style={{ backgroundColor: hex }} />
                  <div className="text-xs text-center py-1">{hex}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground col-span-3 sm:col-span-6">Colors will appear here</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
