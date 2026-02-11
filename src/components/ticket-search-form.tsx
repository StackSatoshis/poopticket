'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_ATTEMPTS = 5;
const TIME_WINDOW_MS = 60 * 1000; // 1 minute
const BLOCK_DURATION_MS = 30 * 1000; // 30 seconds

export function TicketSearchForm() {
  const [citationId, setCitationId] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = Date.now();
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < TIME_WINDOW_MS
    );

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      toast({
        title: 'Too Many Attempts',
        description: 'You have tried to search too many times. Please wait a moment before trying again.',
        variant: 'destructive',
      });
      setTimeout(() => {
        setIsBlocked(false);
        setAttempts([]); // Reset attempts after block
      }, BLOCK_DURATION_MS);
      return;
    }

    if (!isBlocked) {
      setAttempts([...recentAttempts, now]);
    }

    if (!citationId.trim() || !lastName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both a citation number and a last name.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        router.push(`/ticket/${encodeURIComponent(citationId.trim())}?lastName=${encodeURIComponent(lastName.trim())}`);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="citationId">Citation Number</Label>
        <Input
          id="citationId"
          placeholder="e.g., PW12345"
          value={citationId}
          onChange={(e) => setCitationId(e.target.value)}
          required
          disabled={isLoading || isBlocked}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="e.g., Smith"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={isLoading || isBlocked}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || isBlocked}>
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
            Searching...
          </>
        ) : isBlocked ? (
          'Please wait...'
        ) : (
          <>
            <Search className="mr-2" />
            Search Citation
          </>
        )}
      </Button>
    </form>
  );
}
