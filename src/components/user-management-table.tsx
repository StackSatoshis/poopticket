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
import type { User, Property } from '@/lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { KeyRound, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function UserManagementTable({
  users,
  properties,
  onEditAssignments,
}: {
  users: User[];
  properties: Property[];
  onEditAssignments: (user: User) => void;
}) {
  const { toast } = useToast();

  const handlePasswordReset = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    console.log(`Password reset for ${user.email}`);
    toast({
      title: 'Password Reset',
      description: `A password reset link has been sent to ${user.email}.`,
    });
  };

  const getPropertyNames = (propertyIds?: string[]) => {
    if (!propertyIds || propertyIds.length === 0) return 'N/A';
    return propertyIds.map((id) => properties.find((p) => p.id === id)?.name || id).join(', ');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Assigned Properties</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>{getPropertyNames(user.assignedProperties)}</TableCell>
            <TableCell className="text-right">${user.revenueGenerated.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => handlePasswordReset(e, user)}>
                      <KeyRound className="h-4 w-4" />
                      <span className="sr-only">Reset Password</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Password</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAssignments(user);
                      }}
                      disabled={user.role !== 'Manager'}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Assignments</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Assignments</p>
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
