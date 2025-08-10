import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ELEVEN_VOICES, getElevenKey, saveElevenKey } from '@/utils/eleven';

export const TTSForm = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(getElevenKey());
  const [voiceId, setVoiceId] = useState(ELEVEN_VOICES[0].id);
  const [text, setText] = useState('Hello! This AI hub can convert text to lifelike speech.');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey) return;
    saveElevenKey(apiKey);
    toast({ title: 'API key saved' });
  };

  const handleSpeak = async () => {
    setIsLoading(true);
    try {
      // Prefer secure server key via Supabase Edge Function
      const res = await fetch('/functions/v1/eleven-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId, model_id: 'eleven_turbo_v2_5' }),
      });
      if (!res.ok) throw new Error('edge-failed');
      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = objectURL;
        await audioRef.current.play();
      }
      toast({ title: 'Playing audio' });
    } catch (edgeErr) {
      // Fallback to client-side key if provided
      if (!apiKey) {
        toast({ title: 'Server unavailable', description: 'Add your ElevenLabs API key as a temporary fallback.', variant: 'destructive' });
      } else {
        try {
          const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=0&output_format=mp3_44100_128`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, model_id: 'eleven_turbo_v2_5' }),
          });
          if (!res.ok) throw new Error('request-failed');
          const blob = await res.blob();
          const objectURL = URL.createObjectURL(blob);
          if (audioRef.current) {
            audioRef.current.src = objectURL;
            await audioRef.current.play();
          }
          toast({ title: 'Playing audio (fallback)' });
        } catch (e) {
          toast({ title: 'Error', description: 'Failed to synthesize speech', variant: 'destructive' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
        <CardDescription>Uses secure server key (Supabase). Optional custom key.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-2">
          <Input placeholder="ElevenLabs API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          <Button variant="outline" onClick={handleSaveKey} disabled={!apiKey}>Save Key</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Voice</label>
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger><SelectValue placeholder="Select a voice" /></SelectTrigger>
              <SelectContent>
                {ELEVEN_VOICES.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Text</label>
          <Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSpeak} disabled={isLoading} variant="hero">
            {isLoading ? 'Generating…' : 'Speak'}
          </Button>
          <Button variant="outline" onClick={() => audioRef.current?.pause()}>Pause</Button>
        </div>
      </CardContent>
    </Card>
  );
};
