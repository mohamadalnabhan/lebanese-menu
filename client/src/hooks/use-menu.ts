import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// ============================================
// MENU HOOKS
// ============================================

export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: [api.categories.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.categories.get.path, { slug });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch category");
      return api.categories.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

interface MenuFilters {
  categoryId?: number;
  fusionType?: string;
  isVegetarian?: boolean;
}

export function useMenuItems(filters: MenuFilters = {}) {
  return useQuery({
    queryKey: [api.menu.list.path, filters],
    queryFn: async () => {
      // Build query string manually since URLSearchParams doesn't handle undefined well
      const params = new URLSearchParams();
      if (filters.categoryId) params.append("categoryId", filters.categoryId.toString());
      if (filters.fusionType) params.append("fusionType", filters.fusionType);
      if (filters.isVegetarian) params.append("isVegetarian", "true");
      
      const url = `${api.menu.list.path}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return api.menu.list.responses[200].parse(await res.json());
    },
  });
}

export function useMenuItem(id: number) {
  return useQuery({
    queryKey: [api.menu.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.menu.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch menu item");
      return api.menu.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
