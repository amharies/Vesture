'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { ClothingItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface LogOutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogOutfitDialog({ open, onOpenChange }: LogOutfitDialogProps) {
  const { clothingItems, logOutfit } = useAppContext();
  const { toast } = useToast();
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);

  const tops = clothingItems.filter(item => item.category === 'Tops');
  const bottoms = clothingItems.filter(item => item.category === 'Bottoms');

  const handleLogOutfit = () => {
    if (selectedTop && selectedBottom) {
      logOutfit({ topId: selectedTop, bottomId: selectedBottom });
      toast({ title: 'Success', description: 'Outfit logged for today!' });
      setSelectedTop(null);
      setSelectedBottom(null);
      onOpenChange(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select one top and one bottom.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Today's Outfit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="tops">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tops">Select Top</TabsTrigger>
              <TabsTrigger value="bottoms">Select Bottom</TabsTrigger>
            </TabsList>
            <TabsContent value="tops">
              <ClothingSelectionGrid items={tops} selectedItem={selectedTop} onSelectItem={setSelectedTop} />
            </TabsContent>
            <TabsContent value="bottoms">
              <ClothingSelectionGrid items={bottoms} selectedItem={selectedBottom} onSelectItem={setSelectedBottom} />
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleLogOutfit} className="bg-accent hover:bg-accent/90">Log Outfit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ClothingSelectionGridProps {
  items: ClothingItem[];
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
}

function ClothingSelectionGrid({ items, selectedItem, onSelectItem }: ClothingSelectionGridProps) {
  return (
    <ScrollArea className="h-72">
      <div className="grid grid-cols-3 gap-4 p-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item.id)}
            className={cn(
              "relative rounded-lg overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              selectedItem === item.id ? "border-primary" : "border-transparent"
            )}
          >
            <Image src={item.image} alt={item.subCategory} width={150} height={150} className="w-full h-auto object-cover aspect-square" data-ai-hint={item.imageHint}/>
            {selectedItem === item.id && (
              <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
