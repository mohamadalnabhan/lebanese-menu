import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get(api.categories.get.path, async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  // Menu Items
  app.get(api.menu.list.path, async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const fusionType = req.query.fusionType as string | undefined;
    const isVegetarian = req.query.isVegetarian === 'true' ? true : undefined;

    const items = await storage.getMenuItems(categoryId, fusionType, isVegetarian);
    res.json(items);
  });

  app.get(api.menu.get.path, async (req, res) => {
    const item = await storage.getMenuItem(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  // Seed data on startup
  await storage.seedData();

  return httpServer;
}
