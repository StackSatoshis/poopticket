'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { User, Property } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

interface PropertyAssignmentModalProps {
  user: User | null;
  properties: Property[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PropertyAssignmentModal({
  user,
  properties,
  isOpen,
  onOpenChange,
}: PropertyAssignmentModalProps) {
  const { toast } = useToast();
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.assignedProperties) {
      setSelectedProperties(new Set(user.assignedProperties));
    } else {
      setSelectedProperties(new Set());
    }
  }, [user]);

  const handleCheckboxChange = (propertyId: string, checked: boolean | 'indeterminate') => {
    setSelectedProperties((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(propertyId);
      } else {
        newSet.delete(propertyId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setIsLoading(true);
    // Simulate API call
    console.log(`Saving properties for ${user.id}:`, Array.from(selectedProperties));
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Assignments Updated',
        description: `Property assignments for ${user.firstName} have been updated. (Mock)`,
      });
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Property Assignments</DialogTitle>
          <DialogDescription>
            Assign properties to {user?.firstName} {user?.lastName}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="font-medium mb-4">Available Properties</p>
          <ScrollArea className="h-64 border rounded-md p-4">
            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`prop-${property.id}`}
                    checked={selectedProperties.has(property.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(property.id, checked)}
                  />
                  <Label htmlFor={`prop-${property.id}`} className="font-normal">
                    {property.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
