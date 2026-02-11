import type {Metadata} from 'next';
import './globals.css';
import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'PoopTicket',
  description: 'Pet waste citation payment portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-grow">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
