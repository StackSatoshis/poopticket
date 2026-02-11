export type TicketStatus = 'Paid' | 'Unpaid' | 'Overdue';

export type Ticket = {
  id: string;
  lastName: string;
  firstName: string;
  date: string; // ISO 8601 format
  amount: number;
  status: TicketStatus;
  violation: string;
  location: string;
  vehicle: string;
};
