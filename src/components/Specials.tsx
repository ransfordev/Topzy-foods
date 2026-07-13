import React from "react";
import { motion } from "motion/react";
import { Sparkles, ShoppingCart } from "lucide-react";
import { DailySpecial } from "../types";

interface SpecialsProps {
  onAddSpecialToCart: (special: DailySpecial) => void;
  specials: DailySpecial[];
}

export default function Specials({ onAddSpecialToCart, specials }: SpecialsProps) {
  return (
    <section id="specials" className="py-20 bg-brand-cream/50 dark:bg-zinc-900/50 relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/15 text-brand-orange text-xs font-bold rounded-full uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Limited Availability
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-zinc-900 dark:text-white"
          >
            Today's <span className="text-brand-orange">Promotions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-600 dark:text-zinc-400 font-light"
          >
            Indulge in our carefully selected daily culinary packages, crafted to perfection at unmatched values.
          </motion.p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specials.map((item, idx) => {
            const isBestValue = item.tag === "Best Value";
            const isTodayOnly = item.tag === "Today Only";
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative group bg-white dark:bg-zinc-800 rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isBestValue
                    ? "border-brand-gold/60 dark:border-brand-gold/40 ring-4 ring-brand-gold/10"
                    : "border-zinc-100 dark:border-zinc-700/60"
                }`}
              >
                {/* Badge Tag */}
                <div className="absolute top-6 right-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isBestValue
                        ? "bg-brand-gold text-white"
                        : isTodayOnly
                        ? "bg-brand-orange text-white"
                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center text-brand-orange text-2xl">
                    <Sparkles className="w-6 h-6 text-brand-orange animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-serif font-black text-brand-orange mt-2">
                      ₵{item.price.toFixed(2)}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-700/50">
                  <button
                    onClick={() => onAddSpecialToCart(item)}
                    className="w-full py-3 px-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-xl text-sm hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Claim Promotion</span>
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
