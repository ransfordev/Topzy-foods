import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Flame,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  X,
  FileImage,
  DollarSign,
  User,
  ExternalLink,
  RefreshCw,
  Settings,
} from "lucide-react";
import { MenuItem, DailySpecial } from "../types";

// Order records interface same as inside OrdersPanel
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
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface AdminDashboardProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  onDeleteMenuItem: (id: string) => Promise<void>;
  onUpdateMenuItem: (id: string, updated: Partial<MenuItem>) => Promise<void>;

  specials: DailySpecial[];
  onAddSpecial: (special: Omit<DailySpecial, "id">) => Promise<void>;
  onDeleteSpecial: (id: string) => Promise<void>;
  onUpdateSpecial: (id: string, updated: Partial<DailySpecial>) => Promise<void>;

  orders: OrderRecord[];
  onUpdateOrderStatus: (id: string, status: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;

  currentUser: any;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  onLoginAsAdmin: () => void;
  storeSettings?: {
    whatsappNumber: string;
    phoneNumber: string;
    ogImage: string;
  };
  onUpdateStoreSettings?: (updated: {
    whatsappNumber: string;
    phoneNumber: string;
    ogImage: string;
  }) => Promise<void>;
}

export default function AdminDashboard({
  menuItems,
  onAddMenuItem,
  onDeleteMenuItem,
  onUpdateMenuItem,
  specials,
  onAddSpecial,
  onDeleteSpecial,
  onUpdateSpecial,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  currentUser,
  isAdmin,
  isSuperAdmin = false,
  onLoginAsAdmin,
  storeSettings = {
    whatsappNumber: "233598404079",
    phoneNumber: "+233598404079",
    ogImage: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=1200&h=630&fit=crop"
  },
  onUpdateStoreSettings,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"items" | "specials" | "orders">("orders");

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemPrice(String(item.price));
    setNewItemDesc(item.description || "");
    setNewItemCategory(item.category);
    setNewItemImage(item.imageUrl || "");
    setNewItemIsSpecial(!!item.special);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemDesc("");
    setNewItemCategory("Main Meals");
    setNewItemImage("");
    setNewItemIsSpecial(false);
  };

  // Store Settings state
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(storeSettings.whatsappNumber);
  const [settingsPhone, setSettingsPhone] = useState(storeSettings.phoneNumber);
  const [settingsOgImage, setSettingsOgImage] = useState(storeSettings.ogImage);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  React.useEffect(() => {
    setSettingsWhatsapp(storeSettings.whatsappNumber);
    setSettingsPhone(storeSettings.phoneNumber);
    setSettingsOgImage(storeSettings.ogImage);
  }, [storeSettings]);

  // Add Menu Item states
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Main Meals");
  const [newItemImage, setNewItemImage] = useState("");
  const [newItemIsSpecial, setNewItemIsSpecial] = useState(false);

  // Add Special states
  const [newSpecialName, setNewSpecialName] = useState("");
  const [newSpecialPrice, setNewSpecialPrice] = useState("");
  const [newSpecialDesc, setNewSpecialDesc] = useState("");
  const [newSpecialTag, setNewSpecialTag] = useState("Today Only");

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    try {
      if (editingItem) {
        await onUpdateMenuItem(String(editingItem.id), {
          name: newItemName,
          price: Number(newItemPrice),
          description: newItemDesc,
          category: newItemCategory,
          imageUrl: newItemImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
          special: newItemIsSpecial,
        });
        showNotification("Menu item updated in Firestore successfully!");
        handleCancelEdit();
      } else {
        await onAddMenuItem({
          name: newItemName,
          price: Number(newItemPrice),
          description: newItemDesc,
          category: newItemCategory,
          imageUrl: newItemImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
          special: newItemIsSpecial,
        });

        setNewItemName("");
        setNewItemPrice("");
        setNewItemDesc("");
        setNewItemImage("");
        setNewItemIsSpecial(false);
        showNotification("Menu item added to Firestore successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving item to database.");
    }
  };

  const handleCreateSpecial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialName || !newSpecialPrice) return;

    try {
      await onAddSpecial({
        name: newSpecialName,
        price: Number(newSpecialPrice),
        description: newSpecialDesc,
        tag: newSpecialTag,
        icon: "fa-utensils",
      });

      setNewSpecialName("");
      setNewSpecialPrice("");
      setNewSpecialDesc("");
      setNewSpecialTag("Today Only");
      showNotification("Promo special added to Firestore successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving special to database.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-black text-zinc-900 dark:text-white">
              Administrator Access Only
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
              This page manages real-time food catalog inventories, promotions, and kitchen order dispatch logs. Only authorized administrators are allowed access.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 text-left text-xs space-y-2">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">How to access?</span>
            <p className="text-zinc-500 dark:text-zinc-400">
              Sign In using our preset demo credentials. They are configured with administrative authorization.
            </p>
          </div>

          <button
            onClick={onLoginAsAdmin}
            className="w-full py-3.5 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Sign In to Admin Portal</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate high-level metrics
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((acc, curr) => acc + curr.grandTotal, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const activeOrdersCount = orders.filter((o) => o.status === "preparing" || o.status === "delivery").length;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title with Statistics Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
              <span>Admin Management Dashboard</span>
              <span className="px-2.5 py-0.5 bg-brand-orange/10 text-brand-orange text-xs font-black uppercase rounded-full tracking-wider border border-brand-orange/25">
                Authorized
              </span>
            </h1>
            <p className="text-xs text-zinc-400 font-light mt-1.5">
              Live updates directly synchronize with all active customers on Topzy Foods.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-2xl text-center space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Completed Revenue</span>
              <span className="text-base font-black text-brand-orange font-mono">₵{totalRevenue.toFixed(2)}</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-2xl text-center space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Pending Orders</span>
              <span className="text-base font-black text-amber-500 font-mono">{pendingOrdersCount}</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-2xl text-center space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">In Preparation</span>
              <span className="text-base font-black text-blue-500 font-mono">{activeOrdersCount}</span>
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 py-3 px-5 rounded-2xl text-xs font-bold fixed top-24 right-6 z-50 shadow-xl border border-zinc-800 dark:border-zinc-200 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Controls styled like User Nav rounded pills */}
        <div className="flex flex-wrap items-center gap-2 bg-white/60 dark:bg-zinc-900/60 p-1.5 rounded-full border border-zinc-150 dark:border-zinc-800 w-fit">
          <button
            onClick={() => {
              setActiveTab("orders");
              handleCancelEdit();
            }}
            className={`py-2 px-5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-brand-orange text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Kitchen Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("items");
              handleCancelEdit();
            }}
            className={`py-2 px-5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "items"
                ? "bg-brand-orange text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Food Menu ({menuItems.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("specials");
              handleCancelEdit();
            }}
            className={`py-2 px-5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "specials"
                ? "bg-brand-orange text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Specials & Promos ({specials.length})</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="space-y-6">

          {/* tab 1: Orders log */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white">
                  Submitted Kitchen Orders (Real-time logs)
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  Click status pill to update preparation state
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3">
                  <span className="text-4xl">🥡</span>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">No active orders yet</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto font-light">
                    Incoming custom client checkout logs will register on this screen instantly via Firebase subscription listener.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-950 dark:text-white">
                              Cust: {order.userName}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                              ID: {order.id.slice(0, 8)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-zinc-500 block mt-1">
                            Phone: {order.userPhone}
                          </span>
                        </div>

                        {/* Status Select dropdown */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                            Set Status
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                            className="text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivery">Out for Delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 text-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between font-medium">
                            <span className="text-zinc-700 dark:text-zinc-300">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-mono text-zinc-500">
                              ₵{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="text-xs bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 space-y-1.5 font-light">
                        <p className="text-zinc-600 dark:text-zinc-400">
                          <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Delivery Landmark: </strong>
                          {order.location}
                        </p>
                        {order.notes && (
                          <p className="text-zinc-500 italic">
                            " {order.notes} "
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-400 font-mono pt-1">
                          Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recently"}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                        {isSuperAdmin ? (
                          <button
                            onClick={async () => {
                              if (confirm("Are you sure you want to purge this order from history?")) {
                                try {
                                  await onDeleteOrder(order.id);
                                  showNotification("Order record purged successfully!");
                                } catch (err: any) {
                                  console.error("Failed to delete order:", err);
                                  alert("Error deleting order: " + (err.message || "Insufficient permissions. Please verify you are logged in as a Superadmin authenticated via Firebase Auth. Sandbox users cannot bypass Firestore security rules on the server."));
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Order Record</span>
                          </button>
                        ) : (
                          <div 
                            className="text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1 cursor-not-allowed select-none"
                            title="Deleting history is locked for standard admins. Only Superadmins added via the Authentication tab can delete orders."
                          >
                            <Trash2 className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                            <span className="text-[10px]">History locked (Superadmin only)</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-zinc-500">Grand Total:</span>
                          <span className="text-base font-black text-brand-orange font-serif">
                            ₵{order.grandTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* tab 2: Menu manager */}
          {activeTab === "items" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Left Side: Add Food Item */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded-3xl space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                    {editingItem ? (
                      <>
                        <Edit2 className="w-5 h-5 text-brand-gold" />
                        <span>Edit Menu Item</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-brand-orange" />
                        <span>Add New Food Item</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light">
                    {editingItem ? `Updating details for "${editingItem.name}"` : "Publish gourmet food details directly to Firestore"}
                  </p>
                </div>

                <form onSubmit={handleCreateMenuItem} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Premium Spicy Jollof Meal"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                        Price (₵) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 75.00"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                        Category *
                      </label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none"
                      >
                        <option value="Main Meals">Main Meals</option>
                        <option value="Local Ghanaian">Local Ghanaian</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Special Offers">Special Offers</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Dish Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Handcrafted with Ghanaian red beans, premium basmati rice..."
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Unsplash Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="special-offer"
                      checked={newItemIsSpecial}
                      onChange={(e) => setNewItemIsSpecial(e.target.checked)}
                      className="w-4 h-4 accent-brand-orange rounded"
                    />
                    <label
                      htmlFor="special-offer"
                      className="text-xs text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                    >
                      Tag as Special Promotion Offer
                    </label>
                  </div>

                  {editingItem ? (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand-gold hover:bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Update Dish</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="py-3 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4.5 h-4.5" />
                      <span>Publish Food Dish</span>
                    </button>
                  )}
                </form>
              </div>

              {/* Grid List Right Side: Manage Existing Menu Items */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white">
                    Active Food Items Inventory
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    Total: {menuItems.length}
                  </span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 group justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-zinc-400">
                              {item.category}
                            </span>
                            <span className="text-xs font-bold text-brand-orange">
                              ₵{item.price.toFixed(2)}
                            </span>
                            {item.special && (
                              <span className="bg-brand-gold/10 text-brand-gold text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-brand-gold/20">
                                Promo Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            editingItem?.id === item.id
                              ? "text-brand-gold bg-amber-50 dark:bg-amber-950/25"
                              : "text-zinc-400 hover:text-brand-gold hover:bg-zinc-100 dark:hover:bg-zinc-855"
                          }`}
                          title="Edit Item details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Remove "${item.name}" from your active menu?`)) {
                              await onDeleteMenuItem(String(item.id));
                              showNotification("Menu item deleted from Firestore.");
                              if (editingItem?.id === item.id) {
                                handleCancelEdit();
                              }
                            }
                          }}
                          className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* tab 3: Specials manager */}
          {activeTab === "specials" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Add Special Form */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded-3xl space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white">
                    Add Specials / Promo Deal
                  </h3>
                  <p className="text-xs text-zinc-400 font-light">
                    Publish limited-time combinations to main promotions panel
                  </p>
                </div>

                <form onSubmit={handleCreateSpecial} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Promotion Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jollof Party Box & Free Drinks"
                      value={newSpecialName}
                      onChange={(e) => setNewSpecialName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                        Promo Price (₵) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 120.00"
                        value={newSpecialPrice}
                        onChange={(e) => setNewSpecialPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                        Tag Badge *
                      </label>
                      <select
                        value={newSpecialTag}
                        onChange={(e) => setNewSpecialTag(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none"
                      >
                        <option value="Best Value">Best Value</option>
                        <option value="Today Only">Today Only</option>
                        <option value="Weekend Special">Weekend Special</option>
                        <option value="Hot Seller">Hot Seller</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Description details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Feeds up to 3 people, includes fried plantains..."
                      value={newSpecialDesc}
                      onChange={(e) => setNewSpecialDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Publish Special Promotion</span>
                  </button>
                </form>
              </div>

              {/* Manage Specials List */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded-3xl space-y-6">
                <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white">
                  Active Promotional Specials
                </h3>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {specials.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 group"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-white bg-brand-orange px-1.5 py-0.5 rounded">
                            {item.tag}
                          </span>
                          <span className="text-xs font-bold text-brand-orange">
                            ₵{item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1.5 line-clamp-1 font-light">
                          {item.description}
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          if (confirm(`Remove promotion "${item.name}"?`)) {
                            await onDeleteSpecial(String(item.id));
                            showNotification("Promotion special deleted from Firestore.");
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        title="Delete Special"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
