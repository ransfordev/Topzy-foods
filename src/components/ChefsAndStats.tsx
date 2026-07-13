import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Award, Users, Star, Utensils, HeartHandshake } from "lucide-react";
import { CHEFS } from "../data";

export default function ChefsAndStats() {
  return (
    <section id="chefs" className="py-24 bg-brand-cream/40 dark:bg-zinc-900/30 relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Chef's section heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-orange text-xs font-black uppercase tracking-widest block">
            Meet the Masters
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-zinc-900 dark:text-white">
            Chef <span className="text-brand-orange">Recommendations</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-light">
            Behind every extraordinary recipe is our team of culinary masterminds, crafting signature experiences that keep Kumasi coming back for more.
          </p>
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {CHEFS.map((chef, index) => {
            return (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-700/50 shadow-sm hover:shadow-xl transition-all text-center relative group"
              >
                {/* Floating Cap Icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-lg shadow-brand-orange/20">
                  <i className={`fa-solid ${chef.icon} text-lg`} />
                </div>

                <div className="pt-6 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange/10 dark:bg-brand-orange/20 px-3 py-1 rounded-full">
                      {chef.role}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-3 group-hover:text-brand-orange transition-colors">
                      {chef.name}
                    </h3>
                  </div>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    "Every pinch of spice and degree of heat is calibrated to deliver unforgettable taste buds pleasure."
                  </p>

                  <div className="bg-brand-cream dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                      Signature Dish
                    </span>
                    <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">
                      🍴 {chef.signature}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white">
            Topzy Foods <span className="text-brand-orange">By The Numbers</span>
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mt-2">
            A testament to our culinary legacy and commitment to standard taste satisfaction.
          </p>
        </div>

        {/* Stats Counters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <StatCounter title="Meals Served" target={5000} suffix="+" icon={<Utensils className="w-5 h-5 text-brand-orange" />} />
          <StatCounter title="Customer Satisfaction" target={98} suffix="%" icon={<HeartHandshake className="w-5 h-5 text-brand-orange" />} />
          <StatCounter title="Menu Items" target={45} suffix="+" icon={<Star className="w-5 h-5 text-brand-orange" />} />
          <StatCounter title="Awards Won" target={8} suffix="+" icon={<Award className="w-5 h-5 text-brand-orange" />} />
        </div>

      </div>
    </section>
  );
}

interface StatCounterProps {
  title: string;
  target: number;
  suffix?: string;
  icon: React.ReactNode;
}

function StatCounter({ title, target, suffix = "", icon }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const end = target;
    const incrementTime = Math.max(Math.floor(duration / end), 20);

    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-700/50 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-black font-serif text-brand-orange">
          {count}
          {suffix}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium leading-tight">
          {title}
        </div>
      </div>
    </div>
  );
}
