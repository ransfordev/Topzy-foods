import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, X, Download, ArrowRight } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let showPromptTimer: ReturnType<typeof setTimeout> | undefined;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if the user has already dismissed this prompt in this session
      const isDismissed = sessionStorage.getItem("topzy-pwa-prompt-dismissed");
      if (!isDismissed) {
        // Show after a brief delay for a better user experience
        showPromptTimer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Detect if the app is already launched in standalone (installed) mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                         (window.navigator as any).standalone === true;
                         
    if (isStandalone) {
      console.log("[PWA] Running in standalone mode.");
    }

    return () => {
      if (showPromptTimer) clearTimeout(showPromptTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("topzy-pwa-prompt-dismissed", "true");
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full p-1 sm:p-0">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4 text-white"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-gradient-to-tr from-brand-orange to-brand-gold rounded-xl text-white shadow-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight text-white font-sans">
                  Install Topzy Foods
                </h4>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mt-0.5">
                  App Shortcut Available
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-white hover:bg-zinc-800 p-1 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-300 font-light leading-relaxed">
            Get offline-ready ordering, direct order logs, and instant access right from your home screen or desktop dock.
          </p>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-1.5 text-zinc-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 bg-brand-orange hover:bg-brand-dark text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
