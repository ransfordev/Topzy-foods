import { motion } from "motion/react";
import { Star, MessageSquare } from "lucide-react";
import { TESTIMONIALS, GALLERY_IMAGES } from "../data";

export default function ReviewsAndGallery() {
  return (
    <section id="reviews" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-orange text-xs font-black uppercase tracking-widest block">
            What Our Patrons Say
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-zinc-900 dark:text-white">
            Customer <span className="text-brand-orange">Reviews</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-light">
            We are honored to receive beautiful endorsements from locals, travelers, and food lovers who make Topzy Foods their primary taste retreat in Kumasi.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {TESTIMONIALS.map((review, index) => {
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800/80 shadow-sm relative group"
              >
                {/* Quote Icon */}
                <span className="absolute top-6 right-8 text-brand-orange/15 text-5xl font-serif select-none pointer-events-none font-bold">
                  “
                </span>

                <div className="space-y-6">
                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-brand-gold text-brand-gold shrink-0" />
                    ))}
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed italic">
                    "{review.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-sm">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                        {review.author}
                      </h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gallery Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white">
            Visual <span className="text-brand-orange">Feast Gallery</span>
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mt-2">
            A glimpse of our delicious food presentations, freshly made on order.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {GALLERY_IMAGES.map((img, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-3xl group aspect-square bg-zinc-100 dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-lg"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Dynamic hover overlay */}
                <div className="absolute inset-0 bg-brand-brown/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-brand-gold text-2xl mb-2">🍽️</span>
                  <h4 className="font-serif font-bold text-white text-base sm:text-lg">
                    {img.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-300 font-light mt-1 tracking-widest uppercase">
                    Topzy Foods Kumasi
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
