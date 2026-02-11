import { TicketSearchForm } from '@/components/ticket-search-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://www.sherwoodoregon.gov/wp-content/uploads/2025/01/snyder-dog-park-by-david-gilmore-1200x800-1200x756.jpg"
          alt="Dog park background"
          fill
          className="object-cover opacity-50"
          data-ai-hint="dog park grass"
        />
      </div>
      <div className="container mx-auto py-8 sm:py-12 md:py-16">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg shadow-lg bg-card/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Dog className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-headline">Find Your Citation</CardTitle>
              <CardDescription>Enter your citation number and last name to view details and make a payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <TicketSearchForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
