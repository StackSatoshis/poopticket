import Link from 'next/link';
import { Button } from './ui/button';
import { Ticket } from 'lucide-react';

export function AppHeader() {
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
            <Button asChild variant="ghost">
              <Link href="/login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
