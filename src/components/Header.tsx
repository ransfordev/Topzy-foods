import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShoppingCart, Sun, Moon, User, LogOut, ShieldAlert, ShieldCheck, ClipboardList, Sparkles, Utensils, ChefHat, MessageSquare, Calendar, PhoneCall, Flame } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cartCount: number;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
  view: "user" | "admin";
  setView: (val: "user" | "admin") => void;
  currentUser: FirebaseUser | null;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenOrders: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  cartCount,
  onOpenCart,
  onScrollTo,
  view,
  setView,
  currentUser,
  isAdmin,
  onOpenAuth,
  onLogout,
  onOpenOrders,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Specials", id: "specials", icon: Sparkles },
    { label: "Menu", id: "menu", icon: Utensils },
    { label: "Reservation", id: "reservation", icon: Calendar },
    { label: "Contact", id: "contact", icon: PhoneCall },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled || mobileMenuOpen || view === "admin"
          ? "bg-white/95 dark:bg-zinc-900/95 shadow-md py-3 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          id="logo-btn"
          onClick={() => {
            setView("user");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 text-2xl font-black font-serif focus:outline-none cursor-pointer group"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange group-hover:scale-105 transition-transform duration-300">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden sm:flex items-baseline">
            <span className="text-zinc-900 dark:text-white font-serif">Topzy</span>
            <span className="text-brand-orange font-sans font-black ml-0.5 tracking-tight">Foods</span>
          </div>
          {view === "admin" && (
            <span className="ml-2 px-2.5 py-0.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 text-[9px] font-black uppercase rounded-full tracking-wider">
              Admin
            </span>
          )}
        </button>

        {/* Desktop Navigation */}
        {view === "user" ? (
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onScrollTo(link.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-full transition-all cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
            {currentUser && (
              <button
                onClick={onOpenOrders}
                className="text-xs font-black uppercase tracking-wider text-brand-orange hover:bg-brand-orange/5 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>
            )}
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => setView("user")}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-brand-orange transition-colors cursor-pointer"
            >
              ← Customer View
            </button>
            <span className="text-xs text-zinc-400 font-mono">
              Role: Authorized Administrator
            </span>
          </nav>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-5 h-5 text-brand-gold" /> : <Moon className="w-5 h-5 text-zinc-700" />}
          </button>

          {/* User profile & Login / Admin Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 relative">
                <button
                  onClick={onOpenOrders}
                  title="View order history"
                  className="hidden md:inline-flex p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-sm"
                    title={currentUser.displayName || currentUser.email || "Profile"}
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shadow-inner"
                      />
                    ) : (
                      <div className="p-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-xl p-4 z-50 text-left space-y-3"
                        >
                          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                            {currentUser.photoURL ? (
                              <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full object-cover shadow-sm"
                              />
                            ) : (
                              <div className="p-2.5 rounded-full bg-brand-orange/15 text-brand-orange">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                                {currentUser.displayName || "Valued Customer"}
                              </p>
                              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate font-mono">
                                {currentUser.email}
                              </p>
                            </div>
                          </div>

                          {isAdmin && (
                            <div className="bg-brand-orange/10 text-brand-orange rounded-lg py-1.5 px-2 text-center text-[10px] font-black uppercase tracking-wider">
                              Authorized Admin
                            </div>
                          )}

                          <div className="space-y-1 pt-1">
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                onOpenOrders();
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-brand-orange dark:hover:text-brand-orange transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              <ClipboardList className="w-4 h-4" />
                              <span>Order History</span>
                            </button>
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                onLogout();
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Log Out</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Sign In button */}
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-brand-orange py-2 px-3.5 border border-zinc-200 dark:border-zinc-700 hover:border-brand-orange rounded-full transition-all cursor-pointer"
                >
                  Sign In
                </button>
                {/* Mobile Sign In icon button */}
                <button
                  onClick={onOpenAuth}
                  className="inline-flex sm:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                  title="Sign In"
                >
                  <User className="w-5.5 h-5.5" />
                </button>
              </>
            )}

            {/* Admin Switcher */}
            {isAdmin && (
              <button
                onClick={() => setView(view === "user" ? "admin" : "user")}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  view === "admin"
                    ? "bg-brand-orange text-white"
                    : "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white"
                }`}
                title={view === "admin" ? "Switch to Customer Site" : "Switch to Admin Dashboard"}
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cart Icon Button (Only in user view) */}
          {view === "user" && (
            <button
              id="cart-toggle-btn"
              onClick={onOpenCart}
              aria-label="Open Cart"
              className="hidden sm:inline-flex p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-zinc-900"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Reserve CTA */}
          {view === "user" && (
            <button
              id="reserve-nav-btn"
              onClick={() => onScrollTo("reservation")}
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-brand-orange hover:bg-brand-dark text-white transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              Reserve Table
            </button>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-850 overflow-hidden shadow-inner"
          >
            <div className="px-5 pt-3 pb-7 space-y-2">
              {view === "user" ? (
                <>
                  {navLinks.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onScrollTo(link.id);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-brand-orange dark:hover:text-brand-orange transition-all cursor-pointer"
                      >
                        <LinkIcon className="w-4 h-4 text-zinc-400" />
                        <span>{link.label}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCart();
                    }}
                    className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-brand-orange dark:hover:text-brand-orange transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 text-zinc-400" />
                      <span>Shopping Cart</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-brand-orange text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenOrders();
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-brand-orange hover:bg-brand-orange/5 transition-all cursor-pointer"
                    >
                      <ClipboardList className="w-4 h-4 text-brand-orange" />
                      <span>My Orders History</span>
                    </button>
                  )}
                  <button
                    id="reserve-mobile-nav-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onScrollTo("reservation");
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-brand-orange text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-brand-dark transition-colors cursor-pointer shadow-md shadow-brand-orange/15"
                  >
                    <span>Reserve Table</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setView("user");
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-brand-orange"
                  >
                    ← Back to Customer View
                  </button>
                  {isAdmin && (
                    <div className="px-3 py-2 text-xs text-brand-orange font-bold uppercase tracking-wider">
                      ADMIN PORTAL ACTIVE
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
