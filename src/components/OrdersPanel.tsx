import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ClipboardList, Clock, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: string;
  userName: string;
  userPhone: string;
  location: string;
  notes?: string;
  deliveryFee: number;
  grandTotal: number;
  status: string; // 'pending' | 'preparing' | 'delivery' | 'completed' | 'cancelled'
  createdAt: string;
  items: OrderItem[];
}

interface OrdersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
}

export default function OrdersPanel({ isOpen, onClose, orders }: OrdersPanelProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
      case "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400";
      case "delivery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Received (Pending Approval)";
      case "preparing":
        return "Preparing Food In Kitchen";
      case "delivery":
        return "Out For Delivery with Dispatcher";
      case "completed":
        return "Delivered & Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg bg-white dark:bg-zinc-950 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold">
                <ClipboardList className="w-5 h-5 text-brand-orange" />
                <span className="font-serif">My Orders History</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-5xl">📋</div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">No orders found</h3>
                  <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto">
                    You haven't placed any orders yet. Place an order and checkout via WhatsApp to see it updated here in real-time!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-150 dark:border-zinc-800/80 space-y-4 shadow-sm"
                    >
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                            Order ID: {order.id.slice(0, 8)}...
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recently placed"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">
                          Ordered Items:
                        </span>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded text-[10px]">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-bold text-zinc-500 dark:text-zinc-400 font-mono">
                              ₵{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      <div className="space-y-1 text-xs border-t border-zinc-150 dark:border-zinc-800 pt-3">
                        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          <span className="font-bold">Landmark:</span>
                          <span className="text-zinc-500 dark:text-zinc-400">{order.location}</span>
                        </div>
                        {order.notes && (
                          <p className="text-zinc-400 dark:text-zinc-500 italic text-[11px] mt-1 pl-5">
                            "{order.notes}"
                          </p>
                        )}
                      </div>

                      {/* Billing detail */}
                      <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-3.5 text-xs">
                        <span className="font-medium text-zinc-500 dark:text-zinc-400">
                          Total Amount Paid:
                        </span>
                        <span className="text-base font-black text-brand-orange font-serif">
                          ₵{order.grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-brand-orange text-xs font-black">
                <Sparkles className="w-4 h-4 text-brand-orange animate-spin" />
                <span>Real-time Order Status System</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">
                Our kitchen managers will immediately update your order status as they cook and package!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
