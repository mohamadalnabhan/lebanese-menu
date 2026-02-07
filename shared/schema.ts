import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  pronunciation: text("pronunciation"),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  priceDisplay: text("price_display").notNull(),
  imageUrl: text("image_url").notNull(),
  fusionType: text("fusion_type").notNull(), // 'traditional', 'fusion', 'western'
  spiceLevel: integer("spice_level").default(0),
  isVegetarian: boolean("is_vegetarian").default(false),
  isGlutenFree: boolean("is_gluten_free").default(false),
  isFeatured: boolean("is_featured").default(false),
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertMenuItemSchema = createInsertSchema(menuItems);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
