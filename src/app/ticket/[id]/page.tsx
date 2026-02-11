import { findTicket } from '@/lib/data';
import type { Ticket } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle2, CircleAlert, Clock, CreditCard, Dog, FileText, LocateIcon, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, parseISO, differenceInDays } from 'date-fns';

type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function getStatusInfo(ticket: Ticket): { variant: StatusVariant; icon: React.ReactNode; daysOverdue: number } {
  const issueDate = parseISO(ticket.date);
  const daysOverdue = differenceInDays(new Date(), issueDate) - 30;

  if (ticket.status === 'Paid') {
    return { variant: 'default', icon: <CheckCircle2 className="h-4 w-4" />, daysOverdue: 0 };
  }
  if (ticket.status === 'Warning') {
    return { variant: 'outline', icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, daysOverdue: 0 };
  }
  if (ticket.status === 'Overdue' || (ticket.status === 'Unpaid' && daysOverdue > 0)) {
    return { variant: 'destructive', icon: <CircleAlert className="h-4 w-4" />, daysOverdue: Math.max(0, daysOverdue) };
  }
  return { variant: 'secondary', icon: <Clock className="h-4 w-4" />, daysOverdue: 0 };
}


function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function CitationHtmlView({ ticket }: { ticket: Ticket }) {
  // In a real app, this HTML should be sanitized to prevent XSS attacks.
  const htmlContent = `
    <div style="font-family: monospace; border: 1px solid #ccc; padding: 16px; border-radius: 8px;">
      <h3 style="text-align: center; margin: 0 0 16px; font-size: 1.2em;">HEALTH VIOLATION NOTICE</h3>
      <p><strong>CITATION #:</strong> ${ticket.id}</p>
      <p><strong>DATE:</strong> ${format(parseISO(ticket.date), 'MM/dd/yyyy')}</p>
      <p><strong>NAME:</strong> ${ticket.lastName}, ${ticket.firstName}</p>
      <hr style="margin: 12px 0;">
      <p><strong>PET DETAILS:</strong> ${ticket.vehicle}</p>
      <p><strong>LOCATION:</strong> ${ticket.location}</p>
      <p><strong>VIOLATION:</strong> ${ticket.violation}</p>
      <hr style="margin: 12px 0;">
       <p><strong>${ticket.status === 'Warning' ? 'STATUS' : 'AMOUNT DUE'}: ${ticket.status === 'Warning' ? 'WARNING' : `$${ticket.amount.toFixed(2)}`}</strong></p>
    </div>
  `;
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}


export default function TicketDetailsPage({ params, searchParams }: { params: { id: string }; searchParams: { lastName: string } }) {
  const ticket = findTicket(params.id, searchParams.lastName);

  if (!ticket) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Citation Not Found</AlertTitle>
          <AlertDescription>
            The citation number and last name combination could not be found. Please check your information and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { variant, icon, daysOverdue } = getStatusInfo(ticket);
  const badgeClassName = ticket.status === 'Warning' ? 'border-amber-500 text-amber-600' : '';

  return (
    <div className="container mx-auto py-8 sm:py-12">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-headline">Citation Details</CardTitle>
              <CardDescription>Citation ID: {ticket.id}</CardDescription>
            </div>
            <Badge variant={variant} className={`flex items-center gap-2 text-sm ${badgeClassName}`}>
              {icon}
              <span>{ticket.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                 <DetailRow icon={<User className="w-4 h-4"/>} label="Name" value={`${ticket.firstName} ${ticket.lastName}`} />
                 <DetailRow icon={<FileText className="w-4 h-4"/>} label="Violation" value={ticket.violation} />
                 <DetailRow icon={<LocateIcon className="w-4 h-4"/>} label="Location" value={ticket.location} />
                 <DetailRow icon={<Dog className="w-4 h-4"/>} label="Pet Details" value={ticket.vehicle} />
                 <DetailRow icon={<Clock className="w-4 h-4"/>} label="Date Issued" value={format(parseISO(ticket.date), 'MMMM d, yyyy')} />
              </div>
              <Separator/>
              {ticket.status === 'Warning' ? (
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 !text-amber-600" />
                    <AlertTitle className="text-amber-700">This is an Official Warning</AlertTitle>
                    <AlertDescription className="text-amber-600">
                    No fine is associated with this notice. Future violations may result in fines.
                    </AlertDescription>
                </Alert>
                ) : (
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted-foreground">{ticket.status === 'Paid' ? 'Amount Paid' : 'Amount Due'}</p>
                            <p className="text-3xl font-bold text-primary">${ticket.amount.toFixed(2)}</p>
                        </div>
                        {ticket.status === 'Paid' ? (
                            <div className="text-right">
                            <p className="text-sm font-semibold text-primary">Revenue</p>
                            <p className="text-3xl font-bold text-primary">${ticket.amount.toFixed(2)}</p>
                            </div>
                        ) : daysOverdue > 0 && (
                            <div className="text-right">
                            <p className="text-sm text-destructive font-semibold">Days Overdue</p>
                            <p className="text-3xl font-bold text-destructive">{daysOverdue}</p>
                            </div>
                        )}
                    </div>
                </div>
              )}
               {ticket.status !== 'Paid' && ticket.status !== 'Warning' && (
                <div className="space-y-3">
                  <p className="font-medium text-center">Select Payment Method</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button size="lg" className="w-full">
                      <CreditCard className="mr-2" /> Pay with Stripe
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>PayPal</title><path d="M7.333 22.365a.64.64 0 0 1-.634-.522l-2.01-12.235a.638.638 0 0 1 .52-.733h8.315c5.358 0 8.01 2.222 7.425 7.155-.407 3.52-2.85 5.82-6.85 5.82H8.212l-.88 5.37a.64.64 0 0 1-.632.52zm.89-3.815h1.16c2.51 0 4.21-.92 4.61-3.23.36-2.02-.3-3.32-2.11-3.32h-4.32l.66 6.55zm-1.85-9.152.79 4.81h-1.6L5.323 9.4h3.9c2.49 0 3.82.72 3.4 3.02-.23 1.25-1.12 1.8-2.39 1.8H7.4l-.84-5.12h1.313a.64.64 0 0 1 .58.49z"/></svg>
                         Pay with PayPal
                    </Button>
                  </div>
                   <p className="text-xs text-center text-muted-foreground pt-2">
                    Payment processing is handled securely. Your information is safe.
                   </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
                <p className="font-medium">Citation HTML View</p>
                <CitationHtmlView ticket={ticket} />
                <p className="text-xs text-muted-foreground">This is a representation of the original citation document.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
