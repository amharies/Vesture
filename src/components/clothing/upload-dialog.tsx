'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { clothingCategories, topSubCategories, bottomSubCategories, wearTypes, type ClothingCategory, type ClothingSubCategory } from '@/lib/types';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  image: z.any().refine(file => file instanceof File, 'Image is required.'),
  name: z.string().min(1, 'Item name is required.'),
  category: z.enum(clothingCategories),
  subCategory: z.string().min(1, 'Sub-category is required.'),
  wearType: z.enum(wearTypes),
});

export default function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const { addClothingItem } = useAppContext();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { wearType: 'Indoor' },
  });

  const selectedCategory = useWatch({
    control: form.control,
    name: 'category',
  });

  useEffect(() => {
    form.setValue('subCategory', '');
  }, [selectedCategory, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(values.image);
      reader.onloadend = () => {
        const base64Image = reader.result as string;

        const newItem = {
          id: `item-${Date.now()}`,
          name: values.name,
          image: base64Image,
          imageHint: 'custom upload',
          category: values.category,
          subCategory: values.subCategory as ClothingSubCategory,
          wearType: values.wearType,
        };
        addClothingItem(newItem);
        toast({ title: 'Item Saved!', description: 'Your new clothing item has been added to your wardrobe.' });
        resetAndClose();
      };
      reader.onerror = (error) => {
        throw new Error("Failed to read file.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({ variant: 'destructive', title: 'Save Failed', description: errorMessage });
      setIsSaving(false);
    }
  };

  const resetAndClose = () => {
    form.reset();
    setPreview(null);
    setIsSaving(false);
    onOpenChange(false);
  }

  const subCategoryOptions = selectedCategory === 'Tops' ? topSubCategories : bottomSubCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Clothing Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Clothing Photo</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview && <Image src={preview} alt="Preview" width={200} height={200} className="mx-auto rounded-lg" />}

             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blue Casual T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clothingCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedCategory && (
              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategoryOptions.map(subCat => <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="wearType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Wear Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="Indoor" /></FormControl>
                        <FormLabel className="font-normal">Indoor</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="Outdoor" /></FormControl>
                        <FormLabel className="font-normal">Outdoor</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetAndClose}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
