import { TicketSearchForm } from '@/components/ticket-search-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import Image from 'next/image';

export default function ViolationsPage() {
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
              <div className="mx-auto bg-destructive text-destructive-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <CircleAlert className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-headline">Settle Your Violation Notice</CardTitle>
              <CardDescription>
                Enter your citation details below to avoid further penalties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-6">
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Failure to pay your citation in a timely manner may result in additional fines, and your case may be referred to a collections agency. Resolve your citation today to avoid legal penalties.
                </AlertDescription>
              </Alert>
              <TicketSearchForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
