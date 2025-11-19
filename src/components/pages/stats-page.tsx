'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '../clothing/confirmation-dialog';

interface WearFrequency {
  item: ClothingItem;
  count: number;
}

export default function StatsPage() {
  const { outfitLogs, clothingItems, deleteClothingItem } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const wearFrequency = useMemo(() => {
    const frequencyMap = new Map<string, WearFrequency>();

    clothingItems.forEach(item => {
        frequencyMap.set(item.id, { item, count: 0 });
    });

    outfitLogs.forEach(log => {
      log.outfits.forEach(outfit => {
        const items = [outfit.top, outfit.bottom];
        items.forEach(item => {
          if (frequencyMap.has(item.id)) {
            frequencyMap.get(item.id)!.count++;
          }
        });
      });
    });

    return Array.from(frequencyMap.values()).sort((a, b) => b.count - a.count);
  }, [outfitLogs, clothingItems]);

  const [sortOrder, setSortOrder] = useState<'most' | 'least'>('most');

  const sortedFrequency = useMemo(() => {
    const sorted = [...wearFrequency];
    if (sortOrder === 'least') {
      return sorted.sort((a, b) => a.count - b.count);
    }
    return sorted; // Default is most worn
  }, [wearFrequency, sortOrder]);


  const chartData = wearFrequency.slice(0, 5).map((item) => ({
    name: item.item.name,
    count: item.count,
  }));

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteClothingItem(selectedItems);
    setIsConfirmOpen(false);
    setSelectedItems([]);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">Outfit Statistics</h1>
        {clothingItems.length > 0 && (
          <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
            <Pencil className={cn("h-5 w-5", editMode && "text-primary")} />
          </Button>
        )}
      </div>

       {editMode && (
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setEditMode(false); setSelectedItems([]); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={selectedItems.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedItems.length})
            </Button>
        </div>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Wear Frequency</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant={sortOrder === 'most' ? 'secondary' : 'ghost'} onClick={() => setSortOrder('most')}>Most Worn</Button>
            <Button size="sm" variant={sortOrder === 'least' ? 'secondary' : 'ghost'} onClick={() => setSortOrder('least')}>Least Worn</Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedFrequency.length > 0 ? (
            <div className="space-y-4">
              {sortedFrequency.map(({ item, count }) => (
                 <button
                  key={item.id}
                  disabled={!editMode}
                  onClick={() => handleSelectItem(item.id)}
                  className={cn(
                      "relative flex items-center gap-4 p-2 rounded-lg border w-full text-left",
                      editMode && "cursor-pointer hover:bg-muted"
                  )}
                >
                  <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={item.imageHint} />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.subCategory}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{count}</p>
                    <p className="text-sm text-muted-foreground">time{count > 1 ? 's' : ''} worn</p>
                  </div>

                  {editMode && selectedItems.includes(item.id) && (
                    <div className="absolute inset-0 bg-primary/50 flex items-center justify-center rounded-lg">
                      <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No wear data available yet.</p>
          )}
        </CardContent>
      </Card>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Most Worn Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedItems.length} item(s)?`}
        description="This action cannot be undone. This will permanently delete the selected clothing item(s) and any outfit logs they are part of."
      />
    </div>
  );
}
