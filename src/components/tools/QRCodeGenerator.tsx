import { useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(512);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);
      const url = await QRCode.toDataURL(text || '');
      setDataUrl(url);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Create QR codes for any text or URL instantly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Text or URL</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Size (px)</label>
            <Input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={generate} disabled={!text || loading} variant="hero">{loading ? 'Generating…' : 'Generate'}</Button>
          {dataUrl && <Button onClick={download} variant="outline">Download</Button>}
        </div>
        <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
          {dataUrl ? (
            <img src={dataUrl} style={{ width: size, height: size }} alt="Generated QR code" />
          ) : (
            <span className="text-muted-foreground text-sm">Preview will appear here</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
