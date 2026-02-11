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
import { Input } from './ui/input';
import { ArrowUp, ArrowDown, Send } from 'lucide-react';
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
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

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
      <h3 style="text-align: center; margin: 0 0 16px; font-size: 1.2em;">HEALTH VIOLATION NOTICE</h3>
      <p><strong>CITATION #:</strong> ${ticket.id}</p>
      <p><strong>DATE:</strong> ${format(parseISO(ticket.date), 'MM/dd/yyyy')}</p>
      <p><strong>NAME:</strong> ${ticket.lastName}, ${ticket.firstName}</p>
      <hr style="margin: 12px 0;">
      <p><strong>PET DETAILS:</strong> ${ticket.vehicle}</p>
      <p><strong>LOCATION:</strong> ${ticket.location}</p>
      <p><strong>VIOLATION:</strong> ${ticket.violation}</p>
      <hr style="margin: 12px 0;">
      <p><strong>AMOUNT DUE: $${ticket.amount.toFixed(2)}</strong></p>
    </div>
  `;
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

function DetailRow({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium text-sm text-right">{value}</div>
      </div>
    );
  }

type SortableKeys = keyof Ticket | 'daysOverdue';

export function AdminTicketTable({ tickets }: { tickets: Ticket[] }) {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });
  const [statusFilter, setStatusFilter] = React.useState<Ticket['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const getDaysOverdue = (ticket: Ticket) => {
    if (ticket.status === 'Paid') return 0;
    const issueDate = parseISO(ticket.date);
    const days = differenceInDays(new Date(), issueDate);
    if (days > 30) return days - 30;
    return 0;
  };

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
  
  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredTickets = React.useMemo(() => {
    let filterableTickets = [...tickets];

    if (statusFilter !== 'all') {
      filterableTickets = filterableTickets.filter((ticket) => ticket.status === statusFilter);
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filterableTickets = filterableTickets.filter(ticket =>
            ticket.id.toLowerCase().includes(lowercasedSearchTerm) ||
            `${ticket.firstName} ${ticket.lastName}`.toLowerCase().includes(lowercasedSearchTerm) ||
            ticket.vehicle.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    if (sortConfig !== null) {
      filterableTickets.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === 'daysOverdue') {
          aValue = getDaysOverdue(a);
          bValue = getDaysOverdue(b);
        } else if (sortConfig.key === 'date') {
            aValue = parseISO(a.date).getTime();
            bValue = parseISO(b.date).getTime();
        } else {
            aValue = a[sortConfig.key as keyof Ticket];
            bValue = b[sortConfig.key as keyof Ticket];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filterableTickets;
  }, [tickets, statusFilter, searchTerm, sortConfig]);

  const SortableHeader = ({ sortKey, children, className }: { sortKey: SortableKeys, children: React.ReactNode, className?: string }) => (
      <TableHead onClick={() => requestSort(sortKey)} className={cn("cursor-pointer", className)}>
          <div className="flex items-center gap-1">
              {children}
              {sortConfig?.key === sortKey &&
                  (sortConfig.direction === 'ascending' ? (
                      <ArrowUp className="h-3 w-3" />
                  ) : (
                      <ArrowDown className="h-3 w-3" />
                  ))}
          </div>
      </TableHead>
  );


  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search by ID, name, pet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-full sm:max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All</Button>
          <Button size="sm" variant={statusFilter === 'Paid' ? 'default' : 'outline'} onClick={() => setStatusFilter('Paid')}>Paid</Button>
          <Button size="sm" variant={statusFilter === 'Unpaid' ? 'default' : 'outline'} onClick={() => setStatusFilter('Unpaid')}>Unpaid</Button>
          <Button size="sm" variant={statusFilter === 'Overdue' ? 'default' : 'outline'} onClick={() => setStatusFilter('Overdue')}>Overdue</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader sortKey="id">Citation ID</SortableHeader>
            <SortableHeader sortKey="lastName">Name</SortableHeader>
            <SortableHeader sortKey="date">Date</SortableHeader>
            <SortableHeader sortKey="daysOverdue">Days Overdue</SortableHeader>
            <SortableHeader sortKey="status">Status</SortableHeader>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredTickets.map((ticket) => (
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
        <DialogContent className="sm:max-w-4xl">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>Citation Details</DialogTitle>
                <DialogDescription>
                  Full details for citation #{selectedTicket.id}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-8 py-4">
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                        <DetailRow label="Citation ID" value={selectedTicket.id} />
                        <Separator/>
                        <DetailRow label="Name" value={`${selectedTicket.firstName} ${selectedTicket.lastName}`} />
                        <Separator/>
                        <DetailRow label="Status" value={<Badge variant={getStatusVariant(selectedTicket.status)}>{selectedTicket.status}</Badge>} />
                        <Separator/>
                        <DetailRow label="Date Issued" value={format(parseISO(selectedTicket.date), 'MMMM d, yyyy')} />
                        {getDaysOverdue(selectedTicket) > 0 && (
                            <>
                                <Separator/>
                                <DetailRow
                                    label="Days Overdue"
                                    value={<span className="text-destructive font-bold">{getDaysOverdue(selectedTicket)}</span>}
                                />
                            </>
                        )}
                        <Separator/>
                        <DetailRow label="Violation" value={selectedTicket.violation} />
                        <Separator/>
                        <DetailRow label="Location" value={selectedTicket.location} />
                        <Separator/>
                        <DetailRow label="Pet Details" value={selectedTicket.vehicle} />
                        <Separator/>
                        <DetailRow label="Amount" value={`$${selectedTicket.amount.toFixed(2)}`} />
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="font-medium">Citation HTML View</p>
                    <CitationHtmlView ticket={selectedTicket} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
