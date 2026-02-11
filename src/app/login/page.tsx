'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { findUserByEmail } from '@/lib/data';

const MAX_FAILED_ATTEMPTS = 10;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      toast({
        title: 'Too Many Login Attempts',
        description: 'You are currently blocked. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = findUserByEmail(email);

    if (user && user.password === password) {
      if (user.role === 'User') {
        toast({
          title: 'Login Failed',
          description: 'You do not have permission to access the admin area.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Login Successful',
        description: `Redirecting to dashboard as ${user.role}...`,
      });
      setFailedAttempts(0);
      sessionStorage.setItem('loggedInUser', JSON.stringify(user));
      window.dispatchEvent(new Event('storage')); // Notify other components
      router.push('/admin');
    } else {
      const newAttemptCount = failedAttempts + 1;
      setFailedAttempts(newAttemptCount);
      setIsLoading(false);

      if (newAttemptCount >= MAX_FAILED_ATTEMPTS) {
        setIsBlocked(true);
        toast({
          title: 'Too Many Failed Attempts',
          description: `You have been locked out for ${BLOCK_DURATION_MS / 1000 / 60} minutes.`,
          variant: 'destructive',
        });
        setTimeout(() => {
          setIsBlocked(false);
          setFailedAttempts(0);
        }, BLOCK_DURATION_MS);
      } else {
        toast({
          title: 'Login Failed',
          description: `Invalid email or password. You have ${MAX_FAILED_ATTEMPTS - newAttemptCount} attempts remaining.`,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-2xl">Admin Portal</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isBlocked}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isBlocked}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isBlocked}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Authenticating...
                </>
              ) : isBlocked ? (
                'Temporarily Blocked'
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-xs text-center text-muted-foreground pt-2 space-y-1">
              <p>
                <strong>Super Admin:</strong> superadmin@poopticket.com
              </p>
              <p>
                <strong>Manager:</strong> manager1@poopticket.com
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
