import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { MenuCard } from "@/components/MenuCard";
import { useCategories, useMenuItems } from "@/hooks/use-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Utensils, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fusionFilter, setFusionFilter] = useState<string>("all");
  const [vegetarianFilter, setVegetarianFilter] = useState(false);

  // Fetch Data
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: menuItems, isLoading: isMenuLoading, error } = useMenuItems({
    categoryId: selectedCategory || undefined,
    fusionType: fusionFilter === "all" ? undefined : fusionFilter,
    isVegetarian: vegetarianFilter || undefined,
  });

  // Client-side search filtering (since backend search isn't implemented in this specific prompt)
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    if (!searchQuery) return menuItems;
    
    const query = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.nameEn.toLowerCase().includes(query) || 
      item.nameAr.includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  // Loading State
  if (isCategoriesLoading || (isMenuLoading && !menuItems)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-medium animate-pulse">Loading the flavors of Beirut...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-destructive gap-4 p-4 text-center">
        <AlertCircle className="w-16 h-16" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">We couldn't load the menu. Please try refreshing.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-texture">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">Welcome to</span>
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-2 tracking-tight">
              Beirut <span className="text-accent">Bistro</span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-arabic text-primary/80 mb-6">بيروت بيسترو</h2>
            <p className="max-w-xl mx-auto text-muted-foreground text-lg mb-8 leading-relaxed">
              A culinary journey blending traditional Lebanese heritage with modern Western flair. 
              Taste the fusion.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search menu... / ابحث في القائمة" 
                className="pl-10 h-12 bg-background border-border/50 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <Select value={fusionFilter} onValueChange={setFusionFilter}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="fusion">Fusion</SelectItem>
                  <SelectItem value="western">Western</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border/50 h-12">
                <Switch 
                  id="veg-mode" 
                  checked={vegetarianFilter}
                  onCheckedChange={setVegetarianFilter}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="veg-mode" className="cursor-pointer font-medium text-sm flex items-center gap-1">
                  <span className="hidden sm:inline">Vegetarian</span>
                  <span className="sm:hidden">Veg</span>
                  <LeafIcon className="w-3 h-3 text-green-600" />
                </Label>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Navigation */}
      <CategoryNav 
        categories={categories || []} 
        selectedId={selectedCategory} 
        onSelect={setSelectedCategory} 
      />

      {/* Menu Grid */}
      <main className="container mx-auto px-4 pb-32">
        <div className="mb-8 flex items-end justify-between border-b border-border/40 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              {selectedCategory 
                ? categories?.find(c => c.id === selectedCategory)?.nameEn 
                : "All Menu Items"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Showing {filteredItems.length} delicious options
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-border">
            <Utensils className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No dishes found</h3>
            <p className="text-muted-foreground/80">Try adjusting your filters or search term.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery("");
                setFusionFilter("all");
                setVegetarianFilter(false);
                setSelectedCategory(null);
              }}
              className="mt-2 text-primary"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-primary text-primary-foreground py-12 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-8 h-8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22v-8" />
              <path d="M12 14c-2.5-3-5-4-5-4l5-8 5 8s-2.5 1-5 4z" />
            </svg>
            <span className="font-bold text-2xl tracking-tight">BEIRUT BISTRO</span>
          </div>
          <p className="text-primary-foreground/70 max-w-md mx-auto mb-8 font-light">
            Bringing the authentic taste of Lebanon to your table, with a modern twist.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Facebook</a>
            <a href="#" className="hover:opacity-100 transition-opacity">TripAdvisor</a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-xs opacity-40">
            &copy; {new Date().getFullYear()} Beirut Bistro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
