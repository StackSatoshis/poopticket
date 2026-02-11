'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send } from 'lucide-react';

export function SubmitTicketForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Ticket Submitted',
        description: 'The new citation has been successfully created.',
      });
      // In a real app, you would reset the form
      e.currentTarget.reset();
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Citation</CardTitle>
        <CardDescription>Manually create a new pet waste citation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="citationId">Citation Number</Label>
              <Input id="citationId" placeholder="e.g., PW55555" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Pet Details (Breed, Color)</Label>
              <Input id="vehicle" placeholder="e.g., Golden Retriever, brown" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location of Violation</Label>
            <Input id="location" placeholder="e.g., Central Park, near playground" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="violation">Violation Description</Label>
            <Textarea id="violation" placeholder="e.g., Failure to remove pet waste" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Fine Amount</Label>
            <Input id="amount" type="number" step="0.01" placeholder="50.00" required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2" />
                Submit Citation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
