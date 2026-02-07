import { z } from 'zod';
import { insertCategorySchema, insertMenuItemSchema, categories, menuItems } from './schema';

export const api = {
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories' as const,
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/categories/:slug' as const,
      responses: {
        200: z.custom<typeof categories.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    }
  },
  menu: {
    list: {
      method: 'GET' as const,
      path: '/api/menu' as const,
      input: z.object({
        categoryId: z.coerce.number().optional(),
        fusionType: z.string().optional(),
        isVegetarian: z.coerce.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof menuItems.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/menu/:id' as const,
      responses: {
        200: z.custom<typeof menuItems.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
