'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!sessionStorage.getItem('loggedInUser'));
    };

    checkLoginStatus();

    // Listen for changes to sessionStorage
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    // Dispatch a storage event to trigger updates in other tabs/components
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg group-hover:scale-110 transition-transform">
              <Ticket className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary font-headline">
              PoopTicket
            </h1>
          </Link>
          <nav>
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="ghost">
                Logout
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/login">Admin Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
