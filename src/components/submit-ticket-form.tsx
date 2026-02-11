'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function SubmitTicketForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [amount, setAmount] = useState('50.00');

  const handleWarningToggle = (checked: boolean) => {
    setIsWarning(checked);
    if (checked) {
      setAmount('0');
    } else {
      setAmount('50.00'); // Default amount
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newCitation = {
        id: formData.get('citationId'),
        vehicle: formData.get('vehicle'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        location: formData.get('location'),
        violation: formData.get('violation'),
        amount: parseFloat(amount),
        status: isWarning ? 'Warning' : 'Unpaid',
    };

    console.log('New Citation Data:', newCitation);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isWarning ? 'Warning Issued' : 'Ticket Submitted',
        description: `The new citation has been successfully created.`,
      });
      // In a real app, you would reset the form
      e.currentTarget.reset();
      setIsWarning(false);
      setAmount('50.00');
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Citation</CardTitle>
        <CardDescription>Manually create a new pet waste citation or issue a warning.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-accent/50 p-3 rounded-md">
              <AlertTriangle className="text-amber-500" />
              <Label htmlFor="warning-switch" className="flex-grow">Issue as a Warning (No Fine)</Label>
              <Switch id="warning-switch" checked={isWarning} onCheckedChange={handleWarningToggle} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="citationId">Citation Number</Label>
              <Input id="citationId" name="citationId" placeholder="e.g., PW55555" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Pet Details (Breed, Color)</Label>
              <Input id="vehicle" name="vehicle" placeholder="e.g., Golden Retriever, brown" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location of Violation</Label>
            <Input id="location" name="location" placeholder="e.g., Central Park, near playground" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="violation">Violation Description</Label>
            <Textarea id="violation" name="violation" placeholder="e.g., Failure to remove pet waste" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Fine Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="50.00"
              required
              disabled={isWarning || isLoading}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
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
                {isWarning ? 'Issue Warning' : 'Submit Citation'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
