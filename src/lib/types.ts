export type UserRole = 'Super Admin' | 'Manager' | 'User';

export type Property = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  assignedProperties?: string[]; // Array of property IDs
  revenueGenerated: number;
};

export type TicketStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Warning';

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
  propertyId: string;
};
