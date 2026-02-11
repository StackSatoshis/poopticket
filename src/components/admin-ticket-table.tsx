'use client';

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

export function AdminTicketTable({ tickets }: { tickets: Ticket[] }) {
  const { toast } = useToast();

  const handleResendNotification = (ticketId: string) => {
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
          <TableRow key={ticket.id}>
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
                            onClick={() => handleResendNotification(ticket.id)}
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
  );
}
