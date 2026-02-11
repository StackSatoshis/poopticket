import { TicketSearchForm } from '@/components/ticket-search-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto py-8 sm:py-12 md:py-16">
      <div className="flex justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8" />
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
  );
}
