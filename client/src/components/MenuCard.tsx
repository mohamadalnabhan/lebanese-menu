import { MenuItem } from "@shared/schema";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame, Leaf, WheatOff } from "lucide-react";
import { useState } from "react";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Fusion Type Badges
  const getFusionBadge = (type: string) => {
    switch (type) {
      case "traditional":
        return <Badge className="bg-primary/90 hover:bg-primary text-white border-none shadow-sm">Traditional</Badge>;
      case "fusion":
        return <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white border-none shadow-sm">Fusion</Badge>;
      case "western":
        return <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-white border-none shadow-sm">Western</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-card rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Descriptive comment for Unsplash fallback if dynamic image fails */}
        {/* appetizing lebanese food dish professional photography */}
        <img
          src={item.imageUrl}
          alt={item.nameEn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            // Fallback to placeholder if image load fails
            e.currentTarget.src = "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80";
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full font-bold shadow-lg text-lg border border-primary/10">
          {item.priceDisplay}
        </div>

        {/* Featured Badge */}
        {item.isFeatured && (
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-foreground animate-pulse" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <h3 className="font-bold text-xl text-primary leading-tight group-hover:text-accent-foreground transition-colors">
              {item.nameEn}
            </h3>
            <h4 className="font-arabic text-xl text-primary/80 mt-1" dir="rtl">
              {item.nameAr}
            </h4>
          </div>
        </div>

        {item.pronunciation && (
          <p className="text-xs text-muted-foreground italic mb-3 font-medium">
            "{item.pronunciation}"
          </p>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
          {item.description}
        </p>

        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {getFusionBadge(item.fusionType)}
            
            {item.spiceLevel > 0 && (
              <div className="flex items-center gap-0.5 text-destructive bg-destructive/5 px-2 py-0.5 rounded-full border border-destructive/10" title={`Spice Level: ${item.spiceLevel}`}>
                {Array.from({ length: item.spiceLevel }).map((_, i) => (
                  <Flame key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            )}

            {item.isVegetarian && (
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100" title="Vegetarian">
                <Leaf className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Veg</span>
              </div>
            )}
            
            {item.isGlutenFree && (
              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100" title="Gluten Free">
                <WheatOff className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">GF</span>
              </div>
            )}
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isHovered ? "bg-primary text-white" : "bg-primary/10 text-primary"
            }`}
          >
            <span className="text-xl leading-none mb-0.5">+</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
