'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import AppContext from '@/contexts/app-context';
import type { ClothingItem, Outfit, OutfitLog, TodayOutfit } from '@/lib/types';
import { mockClothingItems, mockOutfitLogs } from '@/lib/mock-data';
import { formatISO } from 'date-fns';

const CLOTHING_ITEMS_STORAGE_KEY = 'vesture_clothing_items';
const OUTFIT_LOGS_STORAGE_KEY = 'vesture_outfit_logs';

const getInitialState = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
  }
  return fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(() => 
    getInitialState<ClothingItem>(CLOTHING_ITEMS_STORAGE_KEY, mockClothingItems)
  );
  
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>(() =>
    getInitialState<OutfitLog>(OUTFIT_LOGS_STORAGE_KEY, mockOutfitLogs)
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(CLOTHING_ITEMS_STORAGE_KEY, JSON.stringify(clothingItems));
      } catch (error) {
        console.error('Failed to save clothing items to localStorage:', error);
      }
    }
  }, [clothingItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(OUTFIT_LOGS_STORAGE_KEY, JSON.stringify(outfitLogs));
      } catch (error) {
        console.error('Failed to save outfit logs to localStorage:', error);
      }
    }
  }, [outfitLogs, isLoaded]);

  const addClothingItem = (item: ClothingItem) => {
    setClothingItems((prev) => [...prev, item]);
  };

  const logOutfit = (outfit: TodayOutfit) => {
    const today = formatISO(new Date(), { representation: 'date' });
    const top = clothingItems.find(c => c.id === outfit.topId);
    const bottom = clothingItems.find(c => c.id === outfit.bottomId);

    if (!top || !bottom) {
      console.error("Could not find clothing items for outfit log");
      return;
    }
    
    const newOutfit: Outfit = { top, bottom };

    setOutfitLogs(prevLogs => {
      const todayLogIndex = prevLogs.findIndex(log => log.date === today);
      if (todayLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[todayLogIndex].outfits.push(newOutfit);
        return updatedLogs;
      } else {
        const newLog: OutfitLog = {
          id: `log-${Date.now()}`,
          date: today,
          outfits: [newOutfit],
        };
        return [newLog, ...prevLogs];
      }
    });
  };

  const deleteClothingItem = (itemIds: string[]) => {
    setClothingItems(prev => prev.filter(item => !itemIds.includes(item.id)));
    setOutfitLogs(prevLogs => 
      prevLogs.map(log => ({
        ...log,
        outfits: log.outfits.filter(outfit => !itemIds.includes(outfit.top.id) && !itemIds.includes(outfit.bottom.id))
      })).filter(log => log.outfits.length > 0)
    );
  };

  const deleteOutfitLog = (logId: string, outfitIndex: number) => {
    setOutfitLogs(prevLogs => {
      const logIndex = prevLogs.findIndex(log => log.id === logId);
      if (logIndex === -1) return prevLogs;

      const updatedLogs = [...prevLogs];
      const logToUpdate = { ...updatedLogs[logIndex] };
      logToUpdate.outfits = [...logToUpdate.outfits];
      logToUpdate.outfits.splice(outfitIndex, 1);

      if (logToUpdate.outfits.length === 0) {
        updatedLogs.splice(logIndex, 1);
      } else {
        updatedLogs[logIndex] = logToUpdate;
      }
      
      return updatedLogs;
    });
  };

  const value = {
    clothingItems,
    outfitLogs,
    addClothingItem,
    logOutfit,
    deleteClothingItem,
    deleteOutfitLog,
  };

  if (!isLoaded) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
