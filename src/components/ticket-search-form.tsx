'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TicketSearchForm() {
  const [citationId, setCitationId] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          placeholder="e.g., PT12345"
          value={citationId}
          onChange={(e) => setCitationId(e.target.value)}
          required
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
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
            Searching...
          </>
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
