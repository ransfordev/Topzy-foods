import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageSquare, ChevronRight } from "lucide-react";

interface FooterProps {
  onScrollTo: (id: string) => void;
  onOpenCartAndMenu: () => void;
  whatsappNumber?: string;
  phoneNumber?: string;
}

export default function Footer({ 
  onScrollTo, 
  onOpenCartAndMenu, 
  whatsappNumber = "233598404079", 
  phoneNumber = "+233598404079" 
}: FooterProps) {
  return (
    <footer id="contact" className="bg-brand-brown text-zinc-300 relative overflow-hidden pt-20">
      
      {/* 4.14 CTA BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-brand-orange to-brand-dark rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-center space-y-6 overflow-hidden shadow-2xl"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <span className="text-brand-gold text-xs font-black uppercase tracking-widest block">
            Satisfy Your Cravings Today
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-white max-w-2xl mx-auto leading-tight">
            Ready to Order the Best Taste in Kumasi?
          </h2>
          <p className="text-white/80 font-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Choose your favorites, click add to cart, and check out directly via WhatsApp for lightning-fast preparation and secure delivery!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onScrollTo("menu")}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-100 text-brand-dark font-black rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm shadow-lg shadow-black/10"
            >
              View Menu
            </button>
            <button
              onClick={onOpenCartAndMenu}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-950 hover:bg-zinc-900 text-white font-black rounded-full border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4.5 h-4.5 text-brand-orange" />
              <span>Order via WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* 4.15 FOOTER & CONTACT INFO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/5">
        
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center space-x-2 text-2xl font-bold font-serif">
            <span className="text-white">Topzy</span>
            <span className="text-brand-orange">Foods</span>
          </div>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            Voted #1 taste and premium food preparation center in Kumasi, Ghana. Specializing in highly authentic local Ghanaian delicacies, sizzling loaded pizzas, and custom-styled flame-grilled burgers.
          </p>
          
          {/* Socials */}
          <div className="flex items-center space-x-3.5 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-orange text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-orange text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-orange text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-green-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-2 space-y-6">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-3.5 text-sm text-zinc-400">
            {["Specials", "Menu", "Chef Recommendations", "Reviews", "Reservation"].map((nav, i) => {
              const ids = ["specials", "menu", "chefs", "reviews", "reservation"];
              return (
                <li key={i}>
                  <button
                    onClick={() => onScrollTo(ids[i])}
                    className="flex items-center gap-1 hover:text-brand-orange transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>{nav}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="md:col-span-3 space-y-6">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <span>Kumasi, Ashanti Region, Ghana</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <a href={`tel:${phoneNumber}`} className="hover:text-brand-orange transition-colors">
                {phoneNumber}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <a href="mailto:info@topzyfoods.com" className="hover:text-brand-orange transition-colors">
                info@topzyfoods.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-zinc-300">Mon – Sun</p>
                <p className="text-xs">8:00 AM – 10:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Google Maps Column */}
        <div className="md:col-span-3 space-y-6">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">
            Find Our Restaurant
          </h4>
          <div className="w-full h-44 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            {/* Real Google Maps embed searching Topzy Foods Kumasi Ghana */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15848.401490210086!2d-1.62443!3d6.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb93f18dc0ffcf%3A0xe2f1837ef585b!2sTopzy%20Foods%20Kumasi%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Topzy Foods Google Maps Embed"
            />
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-zinc-950/80 py-6 text-xs text-zinc-500 font-medium text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          © 2026 Topzy Foods. All rights reserved. • Premium Restaurant in Kumasi, Ghana.
        </div>
      </div>
    </footer>
  );
}
