import type { Ticket } from '@/lib/types';
import { subDays } from 'date-fns';

export const mockTickets: Ticket[] = [
  {
    id: 'PT12345',
    lastName: 'Smith',
    firstName: 'John',
    date: subDays(new Date(), 45).toISOString(),
    amount: 75.5,
    status: 'Overdue',
    violation: 'Illegal Parking - Fire Hydrant',
    location: '123 Main St, Anytown, USA',
    vehicle: 'Toyota Camry - ABC-123',
  },
  {
    id: 'PT67890',
    lastName: 'Doe',
    firstName: 'Jane',
    date: subDays(new Date(), 10).toISOString(),
    amount: 50.0,
    status: 'Unpaid',
    violation: 'Expired Meter',
    location: '456 Oak Ave, Anytown, USA',
    vehicle: 'Honda Civic - XYZ-789',
  },
  {
    id: 'PT24680',
    lastName: 'Johnson',
    firstName: 'Robert',
    date: subDays(new Date(), 90).toISOString(),
    amount: 120.0,
    status: 'Paid',
    violation: 'Speeding in a School Zone',
    location: '789 Pine Ln, Anytown, USA',
    vehicle: 'Ford F-150 - FJB-456',
  },
  {
    id: 'PT13579',
    lastName: 'Williams',
    firstName: 'Emily',
    date: subDays(new Date(), 5).toISOString(),
    amount: 35.0,
    status: 'Unpaid',
    violation: 'No Parking 2am-6am',
    location: '101 Maple Dr, Anytown, USA',
    vehicle: 'Chevrolet Equinox - EWL-111',
  },
  {
    id: 'PT98765',
    lastName: 'Brown',
    firstName: 'Michael',
    date: subDays(new Date(), 62).toISOString(),
    amount: 250.0,
    status: 'Overdue',
    violation: 'Reckless Driving',
    location: '222 Birch Blvd, Anytown, USA',
    vehicle: 'Dodge Charger - MBB-987',
  },
  {
    id: 'PT54321',
    lastName: 'Jones',
    firstName: 'Sarah',
    date: subDays(new Date(), 200).toISOString(),
    amount: 65.0,
    status: 'Paid',
    violation: 'Failure to Stop at Sign',
    location: '333 Cedar Ct, Anytown, USA',
    vehicle: 'Nissan Altima - SJO-543',
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
