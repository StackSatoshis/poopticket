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
import { Edit, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type RevenuePeriod = '1m' | '3m' | '6m' | '1y';

const revenuePeriods: RevenuePeriod[] = ['1m', '3m', '6m', '1y'];
const revenuePeriodLabels: Record<RevenuePeriod, string> = {
  '1m': '1M Revenue',
  '3m': '3M Revenue',
  '6m': '6M Revenue',
  '1y': '1Y Revenue',
};

type PropertyWithRevenue = Property & {
  revenue: number;
  revenue1m: number;
  revenue3m: number;
  revenue6m: number;
  revenue1y: number;
};

export function PropertyManagementTable({
  properties,
}: {
  properties: PropertyWithRevenue[];
}) {
  const { toast } = useToast();
  const [currentPeriod, setCurrentPeriod] = React.useState<RevenuePeriod>('1m');

  const handleCyclePeriod = () => {
    const currentIndex = revenuePeriods.indexOf(currentPeriod);
    const nextIndex = (currentIndex + 1) % revenuePeriods.length;
    setCurrentPeriod(revenuePeriods[nextIndex]);
  };

  const getRevenueForPeriod = (property: PropertyWithRevenue) => {
    switch (currentPeriod) {
      case '1m':
        return property.revenue1m;
      case '3m':
        return property.revenue3m;
      case '6m':
        return property.revenue6m;
      case '1y':
        return property.revenue1y;
      default:
        return 0;
    }
  };

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
          <TableHead className="text-right">Total Revenue</TableHead>
          <TableHead className="text-right">
            <Button
              variant="ghost"
              onClick={handleCyclePeriod}
              className="font-medium hover:bg-transparent px-0"
            >
              {revenuePeriodLabels[currentPeriod]}
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
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
              ${getRevenueForPeriod(property).toFixed(2)}
            </TableCell>
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
