import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

export const BackgroundRemover = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const handleRemove = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const img = await loadImage(file);
      const blob = await removeBackground(img);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast({ title: 'Success', description: 'Background removed successfully!' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to remove background', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Background Remover</CardTitle>
        <CardDescription>Remove backgrounds in-browser with AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" onChange={onFileChange} />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="original image preview" className="object-contain w-full h-full" />
            ) : (
              <span className="text-muted-foreground text-sm">Upload an image</span>
            )}
          </div>
          <div className="aspect-square rounded-lg border overflow-hidden flex items-center justify-center bg-muted/30">
            {resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resultUrl} alt="output image with background removed" className="object-contain w-full h-full" />
            ) : (
              <span className="text-muted-foreground text-sm">Result will appear here</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRemove} disabled={!file || isProcessing} variant="hero">
            {isProcessing ? 'Processing…' : 'Remove Background'}
          </Button>
          {resultUrl && (
            <a href={resultUrl} download="background-removed.png">
              <Button variant="outline">Download PNG</Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
