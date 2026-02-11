import type { Ticket, User, Property } from '@/lib/types';
import { subDays } from 'date-fns';

export const mockProperties: Property[] = [
  { id: 'prop1', name: 'Downtown Park' },
  { id: 'prop2', name: 'Uptown Green Space' },
  { id: 'prop3', name: 'Westside Community Garden' },
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'superadmin@poopticket.com',
    password: 'password123',
    role: 'Super Admin',
    firstName: 'Super',
    lastName: 'Admin',
    revenueGenerated: 15000.75,
  },
  {
    id: 'user2',
    email: 'manager1@poopticket.com',
    password: 'password123',
    role: 'Manager',
    assignedProperties: ['prop1', 'prop2'],
    firstName: 'Manager',
    lastName: 'One',
    revenueGenerated: 7500.25,
  },
  {
    id: 'user3',
    email: 'manager2@poopticket.com',
    password: 'password123',
    role: 'Manager',
    assignedProperties: ['prop3'],
    firstName: 'Manager',
    lastName: 'Two',
    revenueGenerated: 3200.5,
  },
  {
    id: 'user-regular',
    email: 'admin@poopticket.com',
    password: 'password123',
    role: 'User',
    firstName: 'Regular',
    lastName: 'User',
    revenueGenerated: 0,
  },
];

export const mockTickets: Ticket[] = [
  {
    id: 'PW-WARN-001',
    lastName: 'Davis',
    firstName: 'Jessica',
    date: subDays(new Date(), 2).toISOString(),
    amount: 0,
    status: 'Warning',
    violation: 'First-time failure to remove pet waste',
    location: 'Downtown Park, near pond',
    vehicle: 'Corgi, tan/white',
    propertyId: 'prop1',
  },
  {
    id: 'PW12345',
    lastName: 'Smith',
    firstName: 'John',
    date: subDays(new Date(), 45).toISOString(),
    amount: 75.5,
    status: 'Overdue',
    violation: 'Failure to remove pet waste',
    location: 'Central Park, Section B',
    vehicle: 'Golden Retriever, brown',
    propertyId: 'prop1',
  },
  {
    id: 'PW67890',
    lastName: 'Doe',
    firstName: 'Jane',
    date: subDays(new Date(), 10).toISOString(),
    amount: 50.0,
    status: 'Unpaid',
    violation: 'Improper disposal of pet waste',
    location: 'Elm Street Park, near fountain',
    vehicle: 'Poodle, white',
    propertyId: 'prop1',
  },
  {
    id: 'PW24680',
    lastName: 'Johnson',
    firstName: 'Robert',
    date: subDays(new Date(), 90).toISOString(),
    amount: 120.0,
    status: 'Paid',
    violation: 'Pet off-leash in designated on-leash area',
    location: 'Uptown Green Space, west entrance',
    vehicle: 'German Shepherd, black and tan',
    propertyId: 'prop2',
  },
  {
    id: 'PW13579',
    lastName: 'Williams',
    firstName: 'Emily',
    date: subDays(new Date(), 5).toISOString(),
    amount: 35.0,
    status: 'Unpaid',
    violation: 'Failure to remove pet waste',
    location: 'Westside Community Garden Plot #12',
    vehicle: 'Beagle, tri-color',
    propertyId: 'prop3',
  },
  {
    id: 'PW98765',
    lastName: 'Brown',
    firstName: 'Michael',
    date: subDays(new Date(), 62).toISOString(),
    amount: 250.0,
    status: 'Overdue',
    violation: 'Repeated failure to control pet',
    location: 'Uptown Green Space, playground area',
    vehicle: 'Bulldog, brindle',
    propertyId: 'prop2',
  },
  {
    id: 'PW54321',
    lastName: 'Jones',
    firstName: 'Sarah',
    date: subDays(new Date(), 200).toISOString(),
    amount: 65.0,
    status: 'Paid',
    violation: 'Failure to remove pet waste',
    location: 'Community Garden, near compost bins',
    vehicle: 'Labrador, yellow',
    propertyId: 'prop3',
  },
];

export const findTicket = (id: string, lastName: string): Ticket | undefined => {
  return mockTickets.find(
    (ticket) =>
      ticket.id.toLowerCase() === id.toLowerCase() &&
      ticket.lastName.toLowerCase() === lastName.toLowerCase()
  );
};

export const getAllTickets = (): Ticket[] => {
  return mockTickets;
};

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const getAllUsers = (): User[] => {
  return mockUsers;
};

export const getAllProperties = (): Property[] => {
  return mockProperties;
};

export const getTicketsForManager = (propertyIds: string[]): Ticket[] => {
  return mockTickets.filter((ticket) => propertyIds.includes(ticket.propertyId));
};
