import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const RunwareImageGen = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('A futuristic cityscape at dusk, cinematic lighting, ultra-detailed');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('RUNWARE_API_KEY') || '');
  const saveKey = () => {
    localStorage.setItem('RUNWARE_API_KEY', apiKey);
    toast({ title: 'API key saved' });
  };

  const generateViaEdge = async () => {
    const res = await fetch('/functions/v1/runware-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ positivePrompt: prompt }),
    });
    if (!res.ok) throw new Error('edge-failed');
    const data = await res.json();
    return data as { imageURL: string };
  };

  const generate = async () => {
    setIsLoading(true);
    try {
      const data = await generateViaEdge();
      setImageUrl(data.imageURL);
      toast({ title: 'Image ready' });
    } catch (_) {
      toast({ title: 'Error', description: 'Failed to generate image', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>AI Image Generator</CardTitle>
        <CardDescription>Uses secure server key via Supabase. No user API key needed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-2">
          <Input placeholder="Runware API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          <Button variant="outline" onClick={saveKey}>Save Key</Button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={generate} disabled={isLoading} variant="hero">
            {isLoading ? 'Generating…' : 'Generate Image'}
          </Button>
        </div>
        {imageUrl && (
          <div className="mt-4 rounded-lg overflow-hidden border">
            <img src={imageUrl} alt={`AI generated image for prompt: ${prompt.slice(0, 80)}`} className="w-full h-auto" loading="lazy" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
