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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Property, User } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';

interface EditPropertyDialogProps {
  property: Property | null;
  users: User[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditPropertyDialog({
  property,
  users,
  isOpen,
  onOpenChange,
}: EditPropertyDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [assignedManagers, setAssignedManagers] = useState<Set<string>>(new Set());
  
  const managers = users.filter(user => user.role === 'Manager');

  useEffect(() => {
    if (property && users) {
      setName(property.name);
      
      const managerIdsForProperty = users
        .filter(user => user.role === 'Manager' && user.assignedProperties?.includes(property.id))
        .map(user => user.id);
        
      setAssignedManagers(new Set(managerIdsForProperty));
    }
  }, [property, users]);

  const handleManagerAssignmentChange = (managerId: string, checked: boolean | 'indeterminate') => {
    setAssignedManagers((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(managerId);
      } else {
        newSet.delete(managerId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!property) return;

    setIsLoading(true);
    
    // Simulate API call
    console.log('Updated Property Data:', { ...property, name });
    console.log(`Updating manager assignments for ${property.name}:`, Array.from(assignedManagers));
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Property Updated',
        description: `Property "${name}" and its assignments have been updated. (Mock)`,
      });
      onOpenChange(false);
      // In a real app, you'd want to trigger a state refresh here
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Make changes to the property and manage user assignments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Downtown Parking Garage" 
                required 
                disabled={isLoading} />
          </div>
          
          <Separator />

          <div className="space-y-3">
            <Label>Assign Managers</Label>
             <ScrollArea className="h-48 border rounded-md p-4">
                <div className="space-y-3">
                {managers.map((manager) => (
                    <div key={manager.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={`manager-${manager.id}`}
                        checked={assignedManagers.has(manager.id)}
                        onCheckedChange={(checked) => handleManagerAssignmentChange(manager.id, checked)}
                        disabled={isLoading}
                    />
                    <Label htmlFor={`manager-${manager.id}`} className="font-normal">
                        {manager.firstName} {manager.lastName}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
