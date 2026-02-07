import { Category } from "@shared/schema";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface CategoryNavProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryNav({ categories, selectedId, onSelect }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4 mb-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={cn(
              "flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
              selectedId === null
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "bg-background text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
            )}
          >
            All Items / الجميع
          </motion.button>

          {categories.map((category) => {
            const isSelected = selectedId === category.id;
            
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(category.id)}
                className={cn(
                  "flex-shrink-0 relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border overflow-hidden group",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-background text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <span className={cn("leading-none", isSelected ? "text-white" : "group-hover:text-primary")}>
                    {category.nameEn}
                  </span>
                  <span className={cn("text-xs font-arabic leading-none opacity-80", isSelected ? "text-white" : "group-hover:text-primary")}>
                    {category.nameAr}
                  </span>
                </div>
                
                {isSelected && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary z-0"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
