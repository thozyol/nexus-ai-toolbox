import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlService } from '@/utils/FirecrawlService';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

export const CrawlForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleSaveKey = async () => {
    if (!apiKey) return;
    const ok = await FirecrawlService.testApiKey(apiKey);
    if (ok) {
      FirecrawlService.saveApiKey(apiKey);
      toast({ title: 'API key saved', description: 'Firecrawl key verified and saved' });
    } else {
      toast({ title: 'Invalid key', description: 'Please check your API key', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);

    try {
      const hasKey = FirecrawlService.getApiKey();
      if (!hasKey) {
        toast({ title: 'Error', description: 'Please set your API key first', variant: 'destructive' });
        return;
      }

      setProgress(10);
      const result = await FirecrawlService.crawlWebsite(url);
      setProgress(80);

      if (result.success) {
        toast({ title: 'Success', description: 'Website crawled successfully' });
        setCrawlResult(result.data);
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to crawl website', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error crawling website:', error);
      toast({ title: 'Error', description: 'Failed to crawl website', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass-surface rounded-lg elevated-shadow">
      <div className="grid md:grid-cols-[1fr_auto] gap-2 mb-4">
        <Input placeholder="Firecrawl API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <Button onClick={handleSaveKey} disabled={!apiKey} variant="outline">Save Key</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">Website URL</label>
          <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required />
        </div>
        {isLoading && <Progress value={progress} className="w-full" />}
        <Button type="submit" disabled={isLoading} className="w-full" variant="hero">
          {isLoading ? 'Crawling…' : 'Start Crawl'}
        </Button>
      </form>

      {crawlResult && (
        <Card className="mt-6 p-4">
          <h3 className="text-lg font-semibold mb-2">Crawl Results</h3>
          <div className="space-y-2 text-sm">
            {'status' in crawlResult && <p>Status: {crawlResult.status}</p>}
            {'completed' in crawlResult && <p>Completed Pages: {crawlResult.completed}</p>}
            {'total' in crawlResult && <p>Total Pages: {crawlResult.total}</p>}
            {'creditsUsed' in crawlResult && <p>Credits Used: {crawlResult.creditsUsed}</p>}
            {'expiresAt' in crawlResult && <p>Expires At: {new Date(crawlResult.expiresAt || '').toLocaleString()}</p>}
          </div>
        </Card>
      )}
    </div>
  );
};
