'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ClothingItem, OutfitLog, TodayOutfit } from '@/lib/types';

interface AppContextType {
  clothingItems: ClothingItem[];
  outfitLogs: OutfitLog[];
  addClothingItem: (item: ClothingItem) => void;
  logOutfit: (outfit: TodayOutfit) => void;
  deleteClothingItem: (itemIds: string[]) => void;
  deleteOutfitLog: (logId: string, outfitIndex: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
