'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';

import { useAppContext } from '@/contexts/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ClothingItem, ClothingSubCategory } from '@/lib/types';
import { topSubCategories, bottomSubCategories } from '@/lib/types';
import UploadDialog from '@/components/clothing/upload-dialog';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '@/components/clothing/confirmation-dialog';

export default function WardrobePage() {
  const { clothingItems, deleteClothingItem } = useAppContext();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const getItemsByCategory = (category: 'Tops' | 'Bottoms') => {
    return clothingItems.filter(item => item.category === category);
  };

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
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>My Wardrobe</CardTitle>
          {clothingItems.length > 0 && (
            <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
              <Pencil className={cn("h-5 w-5", editMode && "text-primary")} />
            </Button>
          )}
        </CardHeader>
        {editMode && (
          <div className="flex justify-end gap-2 px-6 pb-4">
              <Button variant="outline" onClick={() => { setEditMode(false); setSelectedItems([]); }}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={selectedItems.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedItems.length})
              </Button>
          </div>
        )}
        <CardContent>
           <Tabs defaultValue="tops">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tops">Tops</TabsTrigger>
              <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
            </TabsList>
            <TabsContent value="tops" className="pt-4">
                <WardrobeCategoryContent 
                    category="Tops"
                    subCategories={[...topSubCategories]}
                    items={getItemsByCategory('Tops')}
                    onUpload={() => setIsUploadOpen(true)}
                    editMode={editMode}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                />
            </TabsContent>
            <TabsContent value="bottoms" className="pt-4">
                <WardrobeCategoryContent
                    category="Bottoms"
                    subCategories={[...bottomSubCategories]}
                    items={getItemsByCategory('Bottoms')}
                    onUpload={() => setIsUploadOpen(true)}
                    editMode={editMode}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <UploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedItems.length} item(s)?`}
        description="This action cannot be undone. This will permanently delete the selected clothing item(s) and any outfit logs they are part of."
      />

      <Button onClick={() => setIsUploadOpen(true)} className="fixed bottom-20 right-4 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90">
        <Plus className="h-8 w-8" />
        <span className="sr-only">Upload clothing</span>
      </Button>
    </div>
  );
}

interface WardrobeCategoryContentProps {
    category: 'Tops' | 'Bottoms';
    subCategories: ClothingSubCategory[];
    items: ClothingItem[];
    onUpload: () => void;
    editMode: boolean;
    selectedItems: string[];
    onSelectItem: (id: string) => void;
}

function WardrobeCategoryContent({ subCategories, items, onUpload, editMode, selectedItems, onSelectItem }: WardrobeCategoryContentProps) {
    const getItemsBySubCategory = (subCategory: ClothingSubCategory) => {
        return items.filter(item => item.subCategory === subCategory);
    };

    return (
        <div className="space-y-8">
            {subCategories.map(subCategory => (
                <div key={subCategory}>
                    <h4 className="text-lg font-semibold mb-2">{subCategory}</h4>
                    <ClothingCategoryCarousel 
                      items={getItemsBySubCategory(subCategory)} 
                      onUpload={onUpload}
                      subCategory={subCategory}
                      editMode={editMode}
                      selectedItems={selectedItems}
                      onSelectItem={onSelectItem}
                    />
                </div>
            ))}
        </div>
    );
}

interface ClothingCategoryCarouselProps {
  items: ClothingItem[];
  onUpload: () => void;
  subCategory: ClothingSubCategory;
  editMode: boolean;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
}

function ClothingCategoryCarousel({ items, onUpload, subCategory, editMode, selectedItems, onSelectItem }: ClothingCategoryCarouselProps) {

  if (items.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center">
        <p className="mb-4 text-muted-foreground">
          No items in your '{subCategory}' collection.
        </p>
        <Button onClick={onUpload} variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Clothing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        <Carousel opts={{ align: "start", dragFree: true }}>
          <CarouselContent className="-ml-2">
            {items.map(item => (
              <CarouselItem key={item.id} className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4">
                <button 
                  className="w-full"
                  onClick={() => editMode && onSelectItem(item.id)}
                  disabled={!editMode}
                >
                  <Card className={cn("overflow-hidden", selectedItems.includes(item.id) && "border-primary border-2")}>
                    <CardContent className="p-0 relative">
                      <Image src={item.image} alt={item.name} width={200} height={200} className="aspect-square h-auto w-full object-cover" data-ai-hint={item.imageHint} />
                       {editMode && selectedItems.includes(item.id) && (
                          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                          </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-2">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                    </CardFooter>
                  </Card>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      ) : (
        <div className="py-10 text-center text-muted-foreground">
          <p>No items in this category.</p>
        </div>
      )}
    </div>
  );
}
