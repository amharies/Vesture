import type { ClothingItem, OutfitLog } from '@/lib/types';
import imageData from './placeholder-images.json';
import { formatISO, subDays } from 'date-fns';

const placeholderImages = imageData.placeholderImages;

const findImage = (id: string) => placeholderImages.find(p => p.id === id)!;

export const mockClothingItems: ClothingItem[] = [
  { id: 'top1', name: 'Blue T-Shirt', category: 'Tops', subCategory: 'T-Shirt', wearType: 'Indoor', image: findImage('top1').imageUrl, imageHint: findImage('top1').imageHint },
  { id: 'top2', name: 'White Shirt', category: 'Tops', subCategory: 'Shirt', wearType: 'Outdoor', image: findImage('top2').imageUrl, imageHint: findImage('top2').imageHint },
  { id: 'top3', name: 'Gray Hoodie', category: 'Tops', subCategory: 'Hoodie', wearType: 'Outdoor', image: findImage('top3').imageUrl, imageHint: findImage('top3').imageHint },
  { id: 'top4', name: 'Black Sweatshirt', category: 'Tops', subCategory: 'Sweatshirt', wearType: 'Indoor', image: findImage('top4').imageUrl, imageHint: findImage('top4').imageHint },
  { id: 'top5', name: 'Beige Sweater', category: 'Tops', subCategory: 'Sweater', wearType: 'Indoor', image: findImage('top5').imageUrl, imageHint: findImage('top5').imageHint },
  { id: 'bottom1', name: 'Denim Shorts', category: 'Bottoms', subCategory: 'Shorts', wearType: 'Outdoor', image: findImage('bottom1').imageUrl, imageHint: findImage('bottom1').imageHint },
  { id: 'bottom2', name: 'Chino Pants', category: 'Bottoms', subCategory: 'Pants', wearType: 'Indoor', image: findImage('bottom2').imageUrl, imageHint: findImage('bottom2').imageHint },
  { id: 'bottom3', name: 'Cargo Shorts', category: 'Bottoms', subCategory: 'Three-Fourth Pants', wearType: 'Outdoor', image: findImage('bottom3').imageUrl, imageHint: findImage('bottom3').imageHint },
  { id: 'bottom4', name: 'Blue Jeans', category: 'Bottoms', subCategory: 'Pants', wearType: 'Outdoor', image: findImage('bottom4').imageUrl, imageHint: findImage('bottom4').imageHint },
  { id: 'bottom5', name: 'Khaki Shorts', category: 'Bottoms', subCategory: 'Shorts', wearType: 'Indoor', image: findImage('bottom5').imageUrl, imageHint: findImage('bottom5').imageHint },
];

export const mockOutfitLogs: OutfitLog[] = [
  {
    id: 'log1',
    date: formatISO(subDays(new Date(), 1), { representation: 'date' }),
    outfits: [
      { top: mockClothingItems[0], bottom: mockClothingItems[5] },
      { top: mockClothingItems[1], bottom: mockClothingItems[6] },
    ],
  },
  {
    id: 'log2',
    date: formatISO(subDays(new Date(), 2), { representation: 'date' }),
    outfits: [
      { top: mockClothingItems[2], bottom: mockClothingItems[7] },
    ],
  },
  {
    id: 'log3',
    date: formatISO(subDays(new Date(), 4), { representation: 'date' }),
    outfits: [
      { top: mockClothingItems[0], bottom: mockClothingItems[5] },
    ],
  },
];
