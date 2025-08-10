import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { pipeline, env } from '@huggingface/transformers';

// transformers.js config
env.allowLocalModels = false;
env.useBrowserCache = false;

type Summarizer = (input: any, options?: any) => Promise<any>;

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const paths = u.pathname.split('/');
    const idx = paths.indexOf('shorts');
    if (idx >= 0 && paths[idx + 1]) return paths[idx + 1];
    return null;
  } catch {
    return null;
  }
}

async function fetchTranscript(videoId: string): Promise<string | null> {
  const candidates = [
    `https://video.google.com/timedtext?lang=en&v=${videoId}&fmt=json3`,
    `https://video.google.com/timedtext?lang=en&v=${videoId}`,
    `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.events)) {
          const text = data.events
            .map((e: any) => (e.segs ? e.segs.map((s: any) => s.utf8).join('') : ''))
            .join(' ');
          if (text.trim()) return text;
        }
      } else {
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const nodes = Array.from(xml.getElementsByTagName('text'));
        const decoded = nodes
          .map((n) => n.textContent || '')
          .join(' ')
          .replace(/\s+/g, ' ');
        if (decoded.trim()) return decoded;
      }
    } catch (e) {
      // ignore and try next
      console.warn('Transcript fetch attempt failed for', url, e);
      continue;
    }
  }
  return null;
}

export const YouTubeSummarizer = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [manualTranscript, setManualTranscript] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [transcriptPreview, setTranscriptPreview] = useState('');

  const valid = useMemo(() => !!extractVideoId(url) || manualTranscript.trim().length > 0, [url, manualTranscript]);

  const chunkText = (text: string, maxLen = 2000) => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let current = '';
    for (const s of sentences) {
      if ((current + ' ' + s).length > maxLen) {
        if (current) chunks.push(current.trim());
        current = s;
      } else {
        current += (current ? ' ' : '') + s;
      }
    }
    if (current) chunks.push(current.trim());
    return chunks;
  };

  const generateSummary = useCallback(async (fullText: string) => {
    setProgress(20);
    const summarizer = (await pipeline('summarization', 'Xenova/distilbart-cnn-12-6', { device: 'webgpu' })) as unknown as Summarizer;
    setProgress(40);

    const chunks = chunkText(fullText, 1800);
    const partials: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const out = await summarizer(chunks[i], { max_new_tokens: 200, do_sample: false });
      const text = Array.isArray(out) ? out[0]?.summary_text || '' : (out as any).summary_text || '';
      partials.push(text);
      setProgress(40 + Math.round(((i + 1) / chunks.length) * 40));
    }

    let combined = partials.join(' ');
    if (combined.length > 1800) {
      const out = await summarizer(combined, { max_new_tokens: 220, do_sample: false });
      combined = Array.isArray(out) ? out[0]?.summary_text || '' : (out as any).summary_text || '';
    }

    setProgress(95);
    setSummary(combined.trim());
    setProgress(100);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      setProgress(5);
      setSummary('');

      let transcript = manualTranscript.trim();
      if (!transcript) {
        const id = extractVideoId(url);
        if (!id) {
          toast({ title: 'Invalid URL', description: 'Please enter a valid YouTube URL', variant: 'destructive' });
          return;
        }
        toast({ title: 'Fetching transcript', description: 'Attempting to retrieve captions…' });
        transcript = (await fetchTranscript(id)) || '';
      }

      if (!transcript) {
        toast({ title: 'Transcript unavailable', description: 'Paste captions manually and try again.', variant: 'destructive' });
        return;
      }

      setTranscriptPreview(transcript.slice(0, 5000));
      await generateSummary(transcript);
      toast({ title: 'Done', description: 'Summary generated successfully.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to summarize video', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [url, manualTranscript, generateSummary, toast]);

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'youtube-summary.txt';
    a.click();
  };

  return (
    <Card className="glass-surface elevated-shadow">
      <CardHeader>
        <CardTitle>YouTube Video Summarizer</CardTitle>
        <CardDescription>Fetch captions (if available) and summarize fully in-browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="yturl" className="text-sm font-medium">YouTube URL</label>
          <Input id="yturl" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="manual" className="text-sm font-medium">Or paste transcript (optional)</label>
          <Textarea id="manual" rows={6} placeholder="Paste the video transcript here if auto-fetch fails" value={manualTranscript} onChange={(e) => setManualTranscript(e.target.value)} />
        </div>
        {isLoading && <Progress value={progress} className="w-full" />}
        <div className="flex items-center gap-2">
          <Button onClick={onSubmit} disabled={isLoading || !valid} variant="hero">
            {isLoading ? 'Summarizing…' : 'Fetch & Summarize'}
          </Button>
          {summary && (
            <Button onClick={downloadSummary} variant="outline">Download Summary</Button>
          )}
        </div>
        {transcriptPreview && (
          <div className="text-xs text-muted-foreground">Transcript preview: {transcriptPreview.slice(0, 300)}{transcriptPreview.length > 300 ? '…' : ''}</div>
        )}
        {summary && (
          <div className="mt-4 p-4 rounded-lg border bg-muted/20">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
