export const clothingCategories = ['Tops', 'Bottoms'] as const;
export type ClothingCategory = (typeof clothingCategories)[number];

export const topSubCategories = ['T-Shirt', 'Shirt', 'Hoodie', 'Sweatshirt', 'Sweater', 'Jersey'] as const;
export type TopSubCategory = (typeof topSubCategories)[number];

export const bottomSubCategories = ['Shorts', 'Pants', 'Three-Fourth Pants', 'Capri'] as const;
export type BottomSubCategory = (typeof bottomSubCategories)[number];

export type ClothingSubCategory = TopSubCategory | BottomSubCategory;

export const wearTypes = ['Indoor', 'Outdoor'] as const;
export type WearType = (typeof wearTypes)[number];

export interface ClothingItem {
  id: string;
  name: string;
  image: string;
  imageHint: string;
  category: ClothingCategory;
  subCategory: ClothingSubCategory;
  wearType: WearType;
}

export interface Outfit {
  top: ClothingItem;
  bottom: ClothingItem;
}

export interface OutfitLog {
  id: string;
  date: string;
  outfits: Outfit[];
}

export interface TodayOutfit {
  topId: string;
  bottomId: string;
}
