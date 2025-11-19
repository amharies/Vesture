'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, CheckCircle2 } from 'lucide-react';
import { formatISO } from 'date-fns';

import { useAppContext } from '@/contexts/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import LogOutfitDialog from '@/components/clothing/log-outfit-dialog';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '../clothing/confirmation-dialog';

export default function HomePage() {
  const { outfitLogs, deleteOutfitLog } = useAppContext();
  const [isLogOutfitOpen, setIsLogOutfitOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOutfits, setSelectedOutfits] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const today = formatISO(new Date(), { representation: 'date' });
  const todaysLog = outfitLogs.find(log => log.date === today);

  const toggleSelectOutfit = (index: number) => {
    setSelectedOutfits(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  
  const handleDelete = () => {
    if (selectedOutfits.length > 0) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (todaysLog) {
      // Sort indices in descending order to avoid shifting issues
      const sortedIndices = [...selectedOutfits].sort((a, b) => b - a);
      sortedIndices.forEach(index => {
        deleteOutfitLog(todaysLog.id, index);
      });
    }
    setIsConfirmOpen(false);
    setSelectedOutfits([]);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Outfit</CardTitle>
          {todaysLog && todaysLog.outfits.length > 0 && (
            <div className="flex items-center gap-2">
              {editMode && (
                <>
                  <Button variant="outline" size="sm" onClick={() => { setEditMode(false); setSelectedOutfits([]); }}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={selectedOutfits.length === 0}>Delete</Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
                <Pencil className={cn("h-5 w-5", editMode && "text-primary")} />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {todaysLog && todaysLog.outfits.length > 0 ? (
            <Carousel>
              <CarouselContent>
                {todaysLog.outfits.map((outfit, index) => (
                  <CarouselItem key={index}>
                    <button 
                      className="w-full relative"
                      onClick={() => editMode && toggleSelectOutfit(index)}
                      disabled={!editMode}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <Image src={outfit.top.image} alt="Top" width={200} height={200} className="rounded-lg object-cover" data-ai-hint={outfit.top.imageHint} />
                        <Image src={outfit.bottom.image} alt="Bottom" width={200} height={200} className="rounded-lg object-cover" data-ai-hint={outfit.bottom.imageHint} />
                      </div>
                      {editMode && selectedOutfits.includes(index) && (
                        <div className="absolute inset-0 bg-primary/50 flex items-center justify-center rounded-lg">
                          <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {todaysLog.outfits.length > 1 && !editMode && (
                <>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="text-center text-muted-foreground space-y-4 py-8">
              <p>No outfit logged for today.</p>
              <Button onClick={() => setIsLogOutfitOpen(true)} className="bg-accent hover:bg-accent/90">Log Today's Outfit</Button>
            </div>
          )}
        </CardContent>
        {todaysLog && todaysLog.outfits.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button onClick={() => setIsLogOutfitOpen(true)} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" /> Log Another
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <LogOutfitDialog open={isLogOutfitOpen} onOpenChange={setIsLogOutfitOpen} />
      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedOutfits.length} outfit(s)?`}
        description="This action cannot be undone. This will permanently delete the selected outfit log(s) for today."
      />
    </div>
  );
}
