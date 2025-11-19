'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '@/components/clothing/confirmation-dialog';

export default function HistoryPage() {
  const { outfitLogs, deleteOutfitLog } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<{ logId: string, outfitIndex: number } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Sort logs by date descending
  const sortedLogs = [...outfitLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSelect = (logId: string, outfitIndex: number) => {
    setSelected({ logId, outfitIndex });
  };

  const handleDelete = () => {
    if (selected) {
      setIsConfirmOpen(true);
    }
  };
  
  const handleConfirmDelete = () => {
    if (selected) {
      deleteOutfitLog(selected.logId, selected.outfitIndex);
    }
    setIsConfirmOpen(false);
    setSelected(null);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">Outfit History</h1>
        {sortedLogs.length > 0 && (
          <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
            <Pencil className={cn("h-5 w-5", editMode && "text-primary")} />
          </Button>
        )}
      </div>

      {editMode && (
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setEditMode(false); setSelected(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={!selected}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
            </Button>
        </div>
      )}

      {sortedLogs.length > 0 ? (
        <div className="space-y-4">
          {sortedLogs.map(log => (
            <Card key={log.id}>
              <CardHeader>
                <CardTitle>{format(parseISO(log.date), 'EEEE, MMMM d, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {log.outfits.map((outfit, index) => (
                   <button
                    key={index}
                    disabled={!editMode}
                    onClick={() => handleSelect(log.id, index)}
                    className={cn(
                      "flex items-center gap-4 p-2 rounded-lg border text-left w-full",
                      editMode && "cursor-pointer hover:bg-muted",
                      selected?.logId === log.id && selected?.outfitIndex === index && "border-primary border-2"
                    )}
                  >
                    <Image src={outfit.top.image} alt={outfit.top.name} width={80} height={80} className="rounded-md object-cover" data-ai-hint={outfit.top.imageHint} />
                    <Image src={outfit.bottom.image} alt={outfit.bottom.name} width={80} height={80} className="rounded-md object-cover" data-ai-hint={outfit.bottom.imageHint} />
                    <div className="text-sm">
                      <p className="font-semibold">{outfit.top.name}</p>
                      <p className="font-semibold">{outfit.bottom.name}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't logged any outfits yet.</p>
        </div>
      )}

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Outfit Log?"
        description="This action cannot be undone. This will permanently delete the selected outfit log."
      />
    </div>
  );
}
