import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Flame, Plus, CheckCircle } from "lucide-react";
import { MenuItem } from "../types";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

const CATEGORIES = ["All", "Main Meals", "Local Ghanaian", "Fast Food", "Drinks", "Special Offers"];

export default function MenuSection({ onAddToCart, menuItems }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCartWithAlert = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemNotification(item.name);
    setTimeout(() => {
      setAddedItemNotification(null);
    }, 2000);
  };

  return (
    <section id="menu" className="py-24 bg-white dark:bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-brand-orange text-xs font-black uppercase tracking-widest block">
            Gastronomy Experience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-zinc-900 dark:text-white">
            Explore Our <span className="text-brand-orange">Dishes</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-light text-sm sm:text-base">
            Every dish is handcrafted using local spices and fresh market produce in Kumasi, bringing you rich, unforgettable flavors.
          </p>
        </div>

        {/* Search and Category Filter Controls */}
        <div className="space-y-6 mb-12">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search dishes (e.g. Jollof, Tilapia, Pizza)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs list */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20 scale-105"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div id="menu-items-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isSpecial = item.special;
              return (
                <motion.div
                  id={`menu-item-${item.id}`}
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-100/80 dark:border-zinc-800/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative aspect-video sm:aspect-square overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Promo/Special Badges */}
                    {isSpecial && (
                      <div className="absolute top-4 left-4">
                        <span className="flex items-center gap-1 bg-brand-gold text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md animate-pulse">
                          <Flame className="w-3 h-3" />
                          Special Offer
                        </span>
                      </div>
                    )}
                    
                    {/* Category Label Overlay */}
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-900/85 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Info contents */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg group-hover:text-brand-orange transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-light line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                      <span className="text-xl font-bold text-brand-orange">
                        ₵{item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCartWithAlert(item)}
                        className="px-4 py-2.5 bg-brand-orange hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state for search/filters */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="text-5xl">🍽️</div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white">No dishes found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
              We couldn't find any dishes matching "{searchQuery}". Try selecting a different category or clearing the search bar.
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Added Item Toast */}
      <AnimatePresence>
        {addedItemNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 bg-zinc-950 text-white py-3.5 px-5 rounded-2xl border border-zinc-800 shadow-xl flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle className="w-4 h-4 text-brand-orange" />
            <span>Added "{addedItemNotification}" to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
