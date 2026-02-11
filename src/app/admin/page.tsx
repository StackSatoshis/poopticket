'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Ticket, Property } from '@/lib/types';
import { getAllUsers, getAllProperties, getTicketsForManager, getAllTickets } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminTicketTable } from '@/components/admin-ticket-table';
import { UserManagementTable } from '@/components/user-management-table';
import { PropertyManagementTable, type PropertyWithRevenue } from '@/components/property-management-table';
import { SubmitTicketForm } from '@/components/submit-ticket-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Ticket as TicketIcon, DollarSign, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AddUserDialog } from '@/components/add-user-dialog';
import { AddPropertyDialog } from '@/components/add-property-dialog';
import { PropertyAssignmentModal } from '@/components/property-assignment-modal';
import { isAfter, subMonths, parseISO } from 'date-fns';
import { EditPropertyDialog } from '@/components/edit-property-dialog';

function SuperAdminDashboard() {
  const users = getAllUsers();
  const properties = getAllProperties();
  const tickets = getAllTickets();

  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState<User | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<PropertyWithRevenue | null>(null);

  const totalRevenue = tickets
    .filter((ticket) => ticket.status === 'Paid')
    .reduce((acc, ticket) => acc + ticket.amount, 0);
  const totalTickets = tickets.length;
  const totalProperties = properties.length;
  
  const now = new Date();
  const propertiesWithRevenue: PropertyWithRevenue[] = properties.map((property) => {
    const propertyTickets = tickets.filter(
      (ticket) => ticket.propertyId === property.id && ticket.status === 'Paid'
    );
    const revenue = propertyTickets.reduce((acc, ticket) => acc + ticket.amount, 0);

    const getRevenueForPeriod = (months: number) =>
      propertyTickets
        .filter((ticket) => isAfter(parseISO(ticket.date), subMonths(now, months)))
        .reduce((acc, ticket) => acc + ticket.amount, 0);
    
    return {
      ...property,
      revenue, // total revenue
      revenue1m: getRevenueForPeriod(1),
      revenue3m: getRevenueForPeriod(3),
      revenue6m: getRevenueForPeriod(6),
      revenue1y: getRevenueForPeriod(12),
    };
  });

  const handleEditAssignments = (user: User) => {
    if (user.role === 'Manager') {
      setSelectedUserForAssignment(user);
    }
  };

  const handleEditProperty = (property: PropertyWithRevenue) => {
    setPropertyToEdit(property);
  };

  return (
    <>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="properties">Property Management</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">from all properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <TicketIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalTickets}</div>
                <p className="text-xs text-muted-foreground">across all properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Managed Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProperties}</div>
                <p className="text-xs text-muted-foreground">in the system</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>A complete list of all citations in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTicketTable tickets={tickets} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users, roles, and property assignments.</CardDescription>
              </div>
              <AddUserDialog />
            </CardHeader>
            <CardContent>
              <UserManagementTable users={users} properties={properties} onEditAssignments={handleEditAssignments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="properties">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>Manage properties in the system.</CardDescription>
              </div>
              <AddPropertyDialog />
            </CardHeader>
            <CardContent>
              <PropertyManagementTable properties={propertiesWithRevenue} onEditProperty={handleEditProperty} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <PropertyAssignmentModal
        isOpen={!!selectedUserForAssignment}
        onOpenChange={(isOpen) => !isOpen && setSelectedUserForAssignment(null)}
        user={selectedUserForAssignment}
        properties={properties}
      />
      <EditPropertyDialog
        isOpen={!!propertyToEdit}
        onOpenChange={(isOpen) => !isOpen && setPropertyToEdit(null)}
        property={propertyToEdit}
        users={users}
      />
    </>
  );
}

function ManagerDashboard({ user }: { user: User }) {
  const tickets = user.assignedProperties ? getTicketsForManager(user.assignedProperties) : [];
  const properties = getAllProperties().filter((p) => user.assignedProperties?.includes(p.id));

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>
              Citations for your assigned properties: {properties.map((p) => p.name).join(', ')}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminTicketTable tickets={tickets} />
          </CardContent>
        </Card>
      </div>
      <div>
        <SubmitTicketForm />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      if (parsedUser.role === 'Super Admin' || parsedUser.role === 'Manager') {
        setUser(parsedUser);
      } else {
        toast({ title: 'Access Denied', description: "You don't have permission.", variant: 'destructive' });
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router, toast]);

  if (loading || !user) {
    return (
      <div className="container mx-auto py-8 sm:py-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const greeting = `Welcome back, ${user.firstName}!`;
  const roleDescription = `You are logged in as a ${user.role}.`;

  return (
    <div className="container mx-auto py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">{greeting}</h1>
        <p className="text-muted-foreground">{roleDescription}</p>
      </div>

      {user.role === 'Super Admin' && <SuperAdminDashboard />}
      {user.role === 'Manager' && <ManagerDashboard user={user} />}
    </div>
  );
}
