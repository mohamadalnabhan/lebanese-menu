// hooks/use-menu.ts
import { useState, useEffect } from 'react';

// Mock data interfaces
export interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
}

export interface MenuItem {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  fusionType: 'traditional' | 'fusion' | 'western';
  isVegetarian: boolean;
  isSpicy?: boolean;
}

// Mock data
const mockCategories: Category[] = [
  { id: 1, nameEn: "Appetizers", nameAr: "مقبلات" },
  { id: 2, nameEn: "Main Courses", nameAr: "الأطباق الرئيسية" },
  { id: 3, nameEn: "Salads", nameAr: "سلطات" },
  { id: 4, nameEn: "Desserts", nameAr: "حلويات" },
  { id: 5, nameEn: "Beverages", nameAr: "مشروبات" },
];

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    nameEn: "Hummus with a Twist",
    nameAr: "حمص بطعم مميز",
    description: "Creamy chickpea dip with pine nuts and olive oil, served with warm pita",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop",
    categoryId: 1,
    fusionType: "traditional",
    isVegetarian: true,
    isSpicy: false
  },
  {
    id: 2,
    nameEn: "Falafel Burger",
    nameAr: "برغر فلافل",
    description: "Crispy falafel patty with tahini sauce in a brioche bun",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w-600&auto=format&fit=crop",
    categoryId: 2,
    fusionType: "fusion",
    isVegetarian: true,
    isSpicy: true
  },
  {
    id: 3,
    nameEn: "Shawarma Pizza",
    nameAr: "بيتزا شاورما",
    description: "Thin crust pizza topped with chicken shawarma, garlic sauce, and vegetables",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w-600&auto=format&fit=crop",
    categoryId: 2,
    fusionType: "fusion",
    isVegetarian: false,
    isSpicy: false
  },
  {
    id: 4,
    nameEn: "Lebanese Grilled Salmon",
    nameAr: "سلمون مشوي لبناني",
    description: "Atlantic salmon grilled with za'atar spices and lemon butter sauce",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop",
    categoryId: 2,
    fusionType: "western",
    isVegetarian: false,
    isSpicy: false
  },
  {
    id: 5,
    nameEn: "Fattoush Salad",
    nameAr: "سلطة فتوش",
    description: "Traditional salad with mixed greens, radish, sumac, and crispy pita chips",
    price: 10.99,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop",
    categoryId: 3,
    fusionType: "traditional",
    isVegetarian: true,
    isSpicy: false
  },
  {
    id: 6,
    nameEn: "Baklava Cheesecake",
    nameAr: "تشيز كيك بقلاوة",
    description: "Creamy cheesecake layered with pistachios and phyllo pastry",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop",
    categoryId: 4,
    fusionType: "fusion",
    isVegetarian: true,
    isSpicy: false
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hooks using mock data
export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        await delay(800); // Simulate network delay
        setData(mockCategories);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { data, isLoading, error };
}

export function useMenuItems(filters?: {
  categoryId?: number;
  fusionType?: string;
  isVegetarian?: boolean;
}) {
  const [data, setData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        await delay(600); // Simulate network delay
        
        let filteredItems = [...mockMenuItems];
        
        // Apply filters
        if (filters?.categoryId) {
          filteredItems = filteredItems.filter(item => item.categoryId === filters.categoryId);
        }
        
        if (filters?.fusionType && filters.fusionType !== 'all') {
          filteredItems = filteredItems.filter(item => item.fusionType === filters.fusionType);
        }
        
        if (filters?.isVegetarian) {
          filteredItems = filteredItems.filter(item => item.isVegetarian === true);
        }
        
        setData(filteredItems);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [filters?.categoryId, filters?.fusionType, filters?.isVegetarian]);

  return { data, isLoading, error };
}
