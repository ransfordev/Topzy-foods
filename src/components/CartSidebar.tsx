import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, ShoppingBag, Send, MapPin, Phone, User as UserIcon, Notebook, CheckCircle2 } from "lucide-react";
import { CartItem } from "../types";
import { User as FirebaseUser } from "firebase/auth";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  currentUser: FirebaseUser | null;
  onSubmitOrder: (orderData: {
    name: string;
    phone: string;
    location: string;
    notes: string;
    deliveryFee: number;
    grandTotal: number;
  }) => Promise<void>;
  whatsappNumber?: string;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onSubmitOrder,
  whatsappNumber = "233598404079",
}: CartSidebarProps) {
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custLocation, setCustLocation] = useState("");
  const [custNotes, setCustNotes] = useState("");
  const [calcDelivery, setCalcDelivery] = useState(10.0); // Default standard delivery fee in Kumasi
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !custName) {
        setCustName(currentUser.displayName);
      }
      if (currentUser.phoneNumber && !custPhone) {
        setCustPhone(currentUser.phoneNumber);
      }
    }
  }, [currentUser]);

  const itemsTotal = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const grandTotal = itemsTotal > 0 ? itemsTotal + calcDelivery : 0;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!custName || !custPhone || !custLocation) {
      alert("Please fill in all required customer details (Name, Phone, Delivery Location) to proceed.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit order details to Firebase Firestore database first
      await onSubmitOrder({
        name: custName,
        phone: custPhone,
        location: custLocation,
        notes: custNotes,
        deliveryFee: calcDelivery,
        grandTotal: grandTotal,
      });

      // 2. Generate WhatsApp checkout message EXACTLY as specified in guidelines:
      let message = `🛒 *NEW ORDER FROM TOPZY FOODS* 🍽️\n`;
      message += `============================\n\n`;

      message += `👤 *CUSTOMER INFO:*\n`;
      message += `Name: ${custName}\n`;
      message += `Phone: ${custPhone}\n`;
      message += `Delivery Location: ${custLocation}\n`;
      if (custNotes.trim()) {
        message += `Additional Notes: ${custNotes}\n`;
      }
      message += `\n----------------------------\n\n`;

      message += `📦 *ORDER ITEMS:*\n\n`;
      cartItems.forEach((item, index) => {
        message += `*Item #${index + 1}*\n`;
        message += `Name: ${item.menuItem.name}\n`;
        message += `Quantity: ${item.quantity}x\n`;
        message += `Price: ₵${(item.menuItem.price * item.quantity).toFixed(2)}\n`;
        message += `Image: ${item.menuItem.imageUrl || "None"}\n\n`;
      });

      message += `----------------------------\n`;
      message += `💰 *BILLING DETAIL:*\n`;
      message += `Subtotal: ₵${itemsTotal.toFixed(2)}\n`;
      message += `Estimated Delivery Fee: ₵${calcDelivery.toFixed(2)}\n`;
      message += `*Grand Total: ₵${grandTotal.toFixed(2)}*\n\n`;
      message += `============================\n`;
      message += `Please confirm my order and let me know the preparation time. Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Set state to display the direct success button
      setSubmittedWhatsappUrl(whatsappUrl);
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong saving your order. Please try checking out again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessRedirectClick = () => {
    onClearCart();
  };

  if (submittedWhatsappUrl) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                onClearCart();
                setSubmittedWhatsappUrl(null);
                onClose();
              }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Cart Sidebar Drawer */}
            <motion.div
              id="shopping-cart-sidebar-success"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold">
                  <span className="font-serif text-emerald-600 dark:text-emerald-400">Order Saved Successfully! 🎉</span>
                </div>
                <button
                  onClick={() => {
                    onClearCart();
                    setSubmittedWhatsappUrl(null);
                    onClose();
                  }}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex items-center justify-center text-emerald-500 animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white">
                    Order Saved!
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light max-w-xs mx-auto">
                    Your order was recorded in our database. Now, send the invoice message to WhatsApp to finalize your delivery!
                  </p>
                </div>

                {/* Recipient / Order details card */}
                <div className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Customer:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{custName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Phone:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{custPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Delivery Location:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[180px]">{custLocation}</span>
                  </div>
                  <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-black text-sm text-zinc-900 dark:text-white">
                    <span>Total Bill:</span>
                    <span className="text-brand-orange font-serif">₵{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-brand-orange/5 border border-brand-orange/15 text-brand-orange text-[10px] rounded-xl font-medium leading-relaxed uppercase tracking-wider">
                  ⚠️ CLICK THE GREEN BUTTON BELOW TO CHAT DIRECTLY WITH US ON WHATSAPP AND START COOKING!
                </div>
              </div>

              {/* Bottom direct button */}
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
                <a
                  href={submittedWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSuccessRedirectClick}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/20 text-sm transition-all text-center cursor-pointer font-sans"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp Chat</span>
                </a>

                <button
                  onClick={() => {
                    onClearCart();
                    setSubmittedWhatsappUrl(null);
                    onClose();
                  }}
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Back to Menu
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Cart Sidebar Drawer */}
          <motion.div
            id="shopping-cart-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold">
                <ShoppingBag className="w-5 h-5 text-brand-orange animate-bounce" />
                <span className="font-serif">Shopping Cart ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-5xl">🥡</div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Your cart is empty</h3>
                  <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto">
                    Browse our gourmet menu items and add dishes to satisfy your hunger cravings today!
                  </p>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.menuItem.id}
                        className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60"
                      >
                        <img
                          src={item.menuItem.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"}
                          alt={item.menuItem.name}
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm truncate">
                              {item.menuItem.name}
                            </h4>
                            <span className="font-serif font-black text-brand-orange text-xs sm:text-sm shrink-0">
                              ₵{(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1 rounded-lg">
                              <button
                                onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 px-1 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.menuItem.id)}
                              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information Checkout Form inside cart sidebar */}
                  <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      📋 Customer Information
                    </h3>

                    <form onSubmit={handleCheckout} className="space-y-3.5">
                      {/* Name input */}
                      <div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                            <UserIcon className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Full Name (required)"
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                            <Phone className="w-4 h-4" />
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number (required)"
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                          />
                        </div>
                      </div>

                      {/* Delivery location input */}
                      <div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                            <MapPin className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Delivery Location / Landmark (required)"
                            value={custLocation}
                            onChange={(e) => setCustLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                          />
                        </div>
                      </div>

                      {/* Additional notes input */}
                      <div>
                        <div className="relative">
                          <span className="absolute top-3 left-0 pl-3.5 flex items-start text-zinc-400">
                            <Notebook className="w-4 h-4" />
                          </span>
                          <textarea
                            rows={2}
                            placeholder="Additional instructions (e.g. Extra hot pepper sauce, call when arriving)..."
                            value={custNotes}
                            onChange={(e) => setCustNotes(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
                          />
                        </div>
                      </div>

                      {/* Delivery Fee Selector */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">
                          Select Delivery Zone (Kumasi Region):
                        </label>
                        <select
                          value={calcDelivery}
                          onChange={(e) => setCalcDelivery(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none"
                        >
                          <option value="5.0">0–2 km (Close Area) — ₵5.00</option>
                          <option value="10.0">2–5 km (Mid Area) — ₵10.00</option>
                          <option value="18.0">5–10 km (Medium) — ₵18.00</option>
                          <option value="30.0">10–20 km (Outer) — ₵30.00</option>
                          <option value="45.0">20+ km (Suburbs) — ₵45.00</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>

            {/* Footer Pricing Summary & Actions */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400 font-medium">
                    <span>Subtotal:</span>
                    <span>₵{itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400 font-medium">
                    <span>Delivery Fee:</span>
                    <span>₵{calcDelivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-zinc-900 dark:text-white text-lg pt-1.5 border-t border-dashed border-zinc-200 dark:border-zinc-700">
                    <span>Grand Total:</span>
                    <span className="text-brand-orange font-serif">₵{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-brand-orange/20 cursor-pointer text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Processing..." : "Checkout via WhatsApp"}</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
