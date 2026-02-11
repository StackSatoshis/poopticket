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
import type { Property } from '@/lib/types';
import { Button } from './ui/button';
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type PropertyWithRevenue = Property & { revenue: number };

export function PropertyManagementTable({
  properties,
}: {
  properties: PropertyWithRevenue[];
}) {
  const { toast } = useToast();

  const handleEditProperty = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    // In a real app, this would open an edit modal
    console.log(`Editing property ${property.name}`);
    toast({
      title: 'Edit Not Implemented',
      description: 'Editing properties will be available soon.',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property ID</TableHead>
          <TableHead>Property Name</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">{property.id}</TableCell>
            <TableCell>{property.name}</TableCell>
            <TableCell className="text-right">${property.revenue.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEditProperty(e, property)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Property</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Property</p>
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
