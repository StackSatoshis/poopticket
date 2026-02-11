'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Ticket } from '@/lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function getStatusVariant(status: Ticket['status']): StatusVariant {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Unpaid':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
}

function CitationHtmlView({ ticket }: { ticket: Ticket }) {
  // In a real app, this HTML should be sanitized to prevent XSS attacks.
  const htmlContent = `
    <div style="font-family: monospace; border: 1px solid #ccc; padding: 16px; border-radius: 8px; background-color: #fff; color: #000;">
      <h3 style="text-align: center; margin: 0 0 16px; font-size: 1.2em;">PARKING VIOLATION NOTICE</h3>
      <p><strong>CITATION #:</strong> ${ticket.id}</p>
      <p><strong>DATE:</strong> ${format(parseISO(ticket.date), 'MM/dd/yyyy')}</p>
      <p><strong>NAME:</strong> ${ticket.lastName}, ${ticket.firstName}</p>
      <hr style="margin: 12px 0;">
      <p><strong>VEHICLE:</strong> ${ticket.vehicle}</p>
      <p><strong>LOCATION:</strong> ${ticket.location}</p>
      <p><strong>VIOLATION:</strong> ${ticket.violation}</p>
      <hr style="margin: 12px 0;">
      <p><strong>AMOUNT DUE: $${ticket.amount.toFixed(2)}</strong></p>
    </div>
  `;
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export function AdminTicketTable({ tickets }: { tickets: Ticket[] }) {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);

  const handleResendNotification = (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    // This is a placeholder for a real notification system.
    // In a real application, this would trigger a backend service.
    console.log(`Manual override: Resending notification for citation ID: ${ticketId}`);
    toast({
      title: 'Notification Sent',
      description: `A new notification has been queued for citation ${ticketId}.`,
    });
  };

  const getDaysOverdue = (ticket: Ticket) => {
    if (ticket.status === 'Paid') return 0;
    const issueDate = parseISO(ticket.date);
    const days = differenceInDays(new Date(), issueDate);
    if(days > 30) return days - 30;
    return 0;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Citation ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Days Overdue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="cursor-pointer">
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>{ticket.lastName}, {ticket.firstName}</TableCell>
              <TableCell>{format(parseISO(ticket.date), 'MM/dd/yyyy')}</TableCell>
              <TableCell>
                {getDaysOverdue(ticket) > 0 ? (
                  <span className="text-destructive font-medium">{getDaysOverdue(ticket)}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleResendNotification(e, ticket.id)}
                          >
                              <Send className="h-4 w-4" />
                              <span className="sr-only">Resend Notification</span>
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>Resend Notification</p>
                      </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedTicket} onOpenChange={(isOpen) => { if (!isOpen) setSelectedTicket(null); }}>
        <DialogContent className="sm:max-w-2xl">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>Citation HTML View</DialogTitle>
                <DialogDescription>
                  This is a representation of the original citation document for ticket #{selectedTicket.id}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <CitationHtmlView ticket={selectedTicket} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
