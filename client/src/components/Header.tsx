import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Globe, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [location] = useLocation();

  const toggleLang = () => {
    setLang(prev => prev === "en" ? "ar" : "en");
    // In a real app, this would update a global context
    document.documentElement.dir = lang === "en" ? "rtl" : "ltr";
  };

  const navItems = [
    { label: lang === "en" ? "Menu" : "القائمة", href: "/" },
    { label: lang === "en" ? "About" : "قصتنا", href: "/about" },
    { label: lang === "en" ? "Contact" : "اتصل بنا", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
            {/* Abstract Cedar Tree Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 text-primary-foreground"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22v-8" />
              <path d="M12 14c-2.5-3-5-4-5-4l5-8 5 8s-2.5 1-5 4z" />
              <path d="M12 14c-1.5 1-3 1-3 1" />
              <path d="M12 14c1.5 1 3 1 3 1" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none text-primary tracking-tight">BEIRUT BISTRO</span>
            <span className="font-arabic text-sm text-primary/80">بيروت بيسترو</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.href ? "text-primary font-bold" : "text-muted-foreground"
              } ${item.label === "القائمة" ? "font-arabic text-lg" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLang}
            className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary rounded-full px-4"
          >
            <Globe className="w-4 h-4" />
            <span className="font-semibold">{lang === "en" ? "AR" : "EN"}</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20">
            {lang === "en" ? "Book a Table" : "احجز طاولة"}
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-primary/10 bg-background"
          >
            <nav className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium p-2 rounded-lg hover:bg-primary/5 ${
                    location === item.href ? "text-primary bg-primary/5" : "text-foreground"
                  } ${item.label === "القائمة" ? "font-arabic" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between p-2 border-t border-primary/10 mt-2 pt-4">
                <span className="text-muted-foreground text-sm">Language / اللغة</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleLang}
                  className="rounded-full"
                >
                  {lang === "en" ? "Arabic" : "English"}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
