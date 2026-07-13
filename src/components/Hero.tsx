import { motion } from "motion/react";
import { ArrowRight, Utensils, Award, Users } from "lucide-react";

interface HeroProps {
  onScrollToMenu: () => void;
  onScrollToReserve: () => void;
  onOpenCart: () => void;
}

export default function Hero({ onScrollToMenu, onScrollToReserve, onOpenCart }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-brand-brown pt-20 overflow-hidden"
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1600&q=80"
          alt="Restaurant ambiance"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-brown via-zinc-950/80 to-transparent" />
      </div>

      {/* Floating Animated Background Blobs */}
      <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 text-brand-gold px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            Voted #1 Taste in Kumasi
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-none"
          >
            Topzy <span className="text-brand-orange">Foods</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-zinc-300 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Delicious Food, Great Taste, Memorable Moments — in the heart of Kumasi. Crafting authentic local Ghanaian staples, gourmet smash burgers, and signature pizzas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={onScrollToMenu}
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-orange/20 cursor-pointer text-base"
            >
              View Menu
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                onOpenCart();
                onScrollToMenu();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-all cursor-pointer text-base"
            >
              Order Now
            </button>
            <button
              onClick={onScrollToReserve}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-brand-gold/10 text-brand-gold font-bold rounded-full border border-brand-gold/30 transition-all cursor-pointer text-base"
            >
              Reserve Table
            </button>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0"
          >
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-1 text-2xl lg:text-3xl font-bold font-serif text-brand-orange">
                <Users className="w-5 h-5 text-brand-gold hidden sm:inline" />
                <span>120+</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mt-1">Happy Customers Daily</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-1 text-2xl lg:text-3xl font-bold font-serif text-brand-orange">
                <Utensils className="w-5 h-5 text-brand-gold hidden sm:inline" />
                <span>45+</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mt-1">Dishes on Menu</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-1 text-2xl lg:text-3xl font-bold font-serif text-brand-orange">
                <Award className="w-5 h-5 text-brand-gold hidden sm:inline" />
                <span>8+</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mt-1">Years of Excellence</p>
            </div>
          </motion.div>
        </div>

        {/* Right floating food image column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center items-center relative"
        >
          {/* Decorative rotating gold ring */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 border-4 border-dashed border-brand-gold/20 rounded-full animate-[spin_40s_linear_infinite]" />
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-brand-orange/30 shadow-2xl shadow-black/50 animate-[float_6s_ease-in-out_infinite]">
            <img
              src="https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=800&q=80"
              alt="Delicious Jollof Rice"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Tag Badges */}
          <div className="absolute top-4 left-4 bg-zinc-900/90 text-white p-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 backdrop-blur-sm animate-bounce">
            <span className="p-1.5 rounded-lg bg-brand-orange text-white">🌶️</span>
            <div>
              <p className="text-xs font-bold">Spicy & Hot</p>
              <p className="text-[10px] text-zinc-400">Fresh Jollof</p>
            </div>
          </div>

          <div className="absolute bottom-6 right-4 bg-zinc-900/90 text-white p-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 backdrop-blur-sm animate-pulse">
            <span className="p-1.5 rounded-lg bg-brand-gold text-white">🇬🇭</span>
            <div>
              <p className="text-xs font-bold">100% Local</p>
              <p className="text-[10px] text-zinc-400">Kumasi Standard</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Wave Divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-px">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[40px] text-white dark:text-zinc-950 fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,3,57.05,11.58,90,21.57,173.18,46.77,250.58,69.52,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}
