import { categories, menuItems, type Category, type MenuItem, type InsertCategory, type InsertMenuItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getMenuItems(categoryId?: number, fusionType?: string, isVegetarian?: boolean): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getMenuItems(categoryId?: number, fusionType?: string, isVegetarian?: boolean): Promise<MenuItem[]> {
    let query = db.select().from(menuItems);
    
    // Simple in-memory filtering for lite build if multiple conditions, 
    // but Drizzle query builder is better. 
    // Since this is a simple list, let's fetch all and filter in memory if complex, 
    // or chain wheres.
    
    // Note: Drizzle's dynamic where is a bit verbose, so I'll just fetch all for this scale 
    // or simple match.
    const allItems = await query;
    
    return allItems.filter(item => {
      if (categoryId && item.categoryId !== categoryId) return false;
      if (fusionType && item.fusionType !== fusionType) return false;
      if (isVegetarian && !item.isVegetarian) return false;
      return true;
    });
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async seedData(): Promise<void> {
    const existingCategories = await this.getCategories();
    if (existingCategories.length > 0) return;

    // Categories
    const cats: InsertCategory[] = [
      { nameEn: "Mezze & Appetizers", nameAr: "مقبلات", slug: "mezze", imageUrl: "/images/mezze.jpg" },
      { nameEn: "Fusion Main Courses", nameAr: "أطباق رئيسية", slug: "fusion-main", imageUrl: "/images/fusion-main.jpg" },
      { nameEn: "Lebanese Grills", nameAr: "مشاوي", slug: "grills", imageUrl: "/images/grill.jpg" },
      { nameEn: "Western with Lebanese Twist", nameAr: "أطباق غربية", slug: "western", imageUrl: "/images/western.jpg" },
      { nameEn: "Desserts", nameAr: "حلويات", slug: "desserts", imageUrl: "/images/dessert.jpg" },
      { nameEn: "Drinks", nameAr: "مشروبات", slug: "drinks", imageUrl: "/images/drink.jpg" },
    ];

    const insertedCats = await db.insert(categories).values(cats).returning();
    const catMap = new Map(insertedCats.map(c => [c.slug, c.id]));

    // Menu Items
    const items: InsertMenuItem[] = [
      // Mezze
      {
        categoryId: catMap.get("mezze")!,
        nameEn: "Hummus with Truffle Oil",
        nameAr: "حمص بالكمأة",
        pronunciation: "(Hum-mus bil Kam-a)",
        description: "Traditional chickpea dip elevated with black truffle oil",
        price: "8.99",
        priceDisplay: "$8.99",
        imageUrl: "/images/mezze.jpg", // Reuse category image for now or use placeholders
        fusionType: "fusion",
        isVegetarian: true,
        isGlutenFree: true,
      },
      {
        categoryId: catMap.get("mezze")!,
        nameEn: "Halloumi Fries",
        nameAr: "جبنة حلوم مقلية",
        pronunciation: "(Jib-neh Hal-lou-mi)",
        description: "Crispy fried halloumi cheese with pomegranate molasses dip",
        price: "10.50",
        priceDisplay: "$10.50",
        imageUrl: "/images/mezze.jpg",
        fusionType: "fusion",
        isVegetarian: true,
      },
      {
        categoryId: catMap.get("mezze")!,
        nameEn: "Kibbeh Sliders",
        nameAr: "كبة صغيرة",
        pronunciation: "(Kib-beh)",
        description: "Mini kibbeh patties on brioche buns with garlic sauce",
        price: "12.99",
        priceDisplay: "$12.99",
        imageUrl: "/images/mezze.jpg",
        fusionType: "fusion",
      },

      // Fusion Main
      {
        categoryId: catMap.get("fusion-main")!,
        nameEn: "Shawarma Spiced Burger",
        nameAr: "برجر شاورما",
        pronunciation: "(Bur-ger Sha-wa-rmā)",
        description: "Beef patty with shawarma spices, garlic sauce, pickles in brioche bun",
        price: "18.99",
        priceDisplay: "$18.99",
        imageUrl: "/images/fusion-main.jpg",
        fusionType: "fusion",
        spiceLevel: 1,
      },
      {
        categoryId: catMap.get("fusion-main")!,
        nameEn: "Za'atar Crusted Salmon",
        nameAr: "سلمون بالزعتر",
        pronunciation: "(Sal-mon bil Za-a-tar)",
        description: "Atlantic salmon with za'atar crust, lemon tahini sauce, roasted vegetables",
        price: "24.50",
        priceDisplay: "$24.50",
        imageUrl: "/images/fusion-main.jpg",
        fusionType: "fusion",
        isGlutenFree: true,
      },
      {
        categoryId: catMap.get("fusion-main")!,
        nameEn: "Mansaf Pizza",
        nameAr: "بيتزا منسف",
        pronunciation: "(Piz-za Man-saf)",
        description: "Thin crust pizza with yogurt sauce, lamb, pine nuts, and parsley",
        price: "21.99",
        priceDisplay: "$21.99",
        imageUrl: "/images/fusion-main.jpg",
        fusionType: "fusion",
      },

      // Grills
      {
        categoryId: catMap.get("grills")!,
        nameEn: "Mixed Grill Platter",
        nameAr: "مشاوي متنوعة",
        pronunciation: "(Ma-sha-wi)",
        description: "Chicken shish tawook, kafta, lamb chops with grilled vegetables",
        price: "28.99",
        priceDisplay: "$28.99",
        imageUrl: "/images/grill.jpg",
        fusionType: "traditional",
        isFeatured: true,
      },
      {
        categoryId: catMap.get("grills")!,
        nameEn: "Filet Mignon with Toum",
        nameAr: "لحم فيليه مع ثومية",
        pronunciation: "(Fi-let Mig-non ma Toum)",
        description: "Premium beef filet with Lebanese garlic sauce, truffle fries",
        price: "32.99",
        priceDisplay: "$32.99",
        imageUrl: "/images/grill.jpg",
        fusionType: "western",
      },

      // Western
      {
        categoryId: catMap.get("western")!,
        nameEn: "Lebanese Steak Frites",
        nameAr: "ستيك لبناني",
        pronunciation: "(Steak)",
        description: "Ribeye steak with garlic sauce, sumac fries, fattoush salad",
        price: "29.99",
        priceDisplay: "$29.99",
        imageUrl: "/images/western.jpg",
        fusionType: "western",
      },
      {
        categoryId: catMap.get("western")!,
        nameEn: "Pasta Harra",
        nameAr: "باستا حرة",
        pronunciation: "(Pas-ta Har-ra)",
        description: "Spaghetti with spicy tomato sauce, chickpeas, pine nuts",
        price: "16.99",
        priceDisplay: "$16.99",
        imageUrl: "/images/western.jpg",
        fusionType: "fusion",
        spiceLevel: 2,
        isVegetarian: true,
      },

      // Desserts
      {
        categoryId: catMap.get("desserts")!,
        nameEn: "Baklava Cheesecake",
        nameAr: "تشيز كيك ببقلاوة",
        pronunciation: "(Cheese-cake Bak-la-va)",
        description: "Classic cheesecake with baklava layers and pistachio crust",
        price: "9.99",
        priceDisplay: "$9.99",
        imageUrl: "/images/dessert.jpg",
        fusionType: "fusion",
      },
      {
        categoryId: catMap.get("desserts")!,
        nameEn: "Rosewater Crème Brûlée",
        nameAr: "كريم برولي بماء الورد",
        pronunciation: "(Crème Brûlée)",
        description: "Traditional dessert infused with Lebanese rosewater",
        price: "8.50",
        priceDisplay: "$8.50",
        imageUrl: "/images/dessert.jpg",
        fusionType: "fusion",
        isGlutenFree: true,
      },

      // Drinks
      {
        categoryId: catMap.get("drinks")!,
        nameEn: "Cardamom Coffee",
        nameAr: "قهوة بالهيل",
        pronunciation: "(Qah-wa bil Hail)",
        description: "Traditional Arabic coffee with cardamom",
        price: "4.50",
        priceDisplay: "$4.50",
        imageUrl: "/images/drink.jpg",
        fusionType: "traditional",
      },
      {
        categoryId: catMap.get("drinks")!,
        nameEn: "Pomegranate Mojito",
        nameAr: "موجيتو رمان",
        pronunciation: "(Mo-ji-to)",
        description: "Non-alcoholic refreshing drink with mint and pomegranate",
        price: "7.99",
        priceDisplay: "$7.99",
        imageUrl: "/images/drink.jpg",
        fusionType: "fusion",
      },
      {
        categoryId: catMap.get("drinks")!,
        nameEn: "Jallab Smoothie",
        nameAr: "جلاب",
        pronunciation: "(Jal-lab)",
        description: "Classic grape molasses drink blended with ice",
        price: "6.99",
        priceDisplay: "$6.99",
        imageUrl: "/images/drink.jpg",
        fusionType: "traditional",
      },
    ];

    await db.insert(menuItems).values(items);
  }
}

export const storage = new DatabaseStorage();
