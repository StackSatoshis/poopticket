import { getAllTickets } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminTicketTable } from '@/components/admin-ticket-table';
import { Users } from 'lucide-react';

export default function AdminPage() {
  // In a real app, this data would be fetched from a secure API endpoint.
  const tickets = getAllTickets();

  return (
    <div className="container mx-auto py-8 sm:py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">Admin Dashboard</CardTitle>
              <CardDescription>Manage and review all citations in the system.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdminTicketTable tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}
