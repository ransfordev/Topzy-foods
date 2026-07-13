import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User as UserIcon, Sparkles, LogIn, Key, ShieldAlert } from "lucide-react";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSandboxFallback, setShowSandboxFallback] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowSandboxFallback(false);
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: displayName || email.split("@")[0],
        });
        if (onLoginSuccess) {
          onLoginSuccess(userCredential.user);
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (onLoginSuccess) {
          onLoginSuccess(userCredential.user);
        }
      }
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setShowSandboxFallback(true);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password combination. If this account is not registered yet on your Firebase project, switch to 'Create Account' above to sign up first, or use the Sandbox Bypass below.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use. Try signing in instead, or bypass with Sandbox Mode.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Email/Password authentication is not enabled in your Firebase project. Please go to your Firebase Console -> Authentication -> Sign-in Method, and enable the 'Email/Password' provider, or use Sandbox Mode below."
        );
      } else {
        setError(err.message || "An authentication error occurred. Please try again or use the Sandbox Bypass.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxBypass = () => {
    if (!email) {
      setError("Please specify an email address first to launch Sandbox Mode.");
      return;
    }
    const mockUser = {
      uid: "sandbox-uid-" + Math.random().toString(36).substring(2, 9),
      email: email,
      displayName: displayName || email.split("@")[0],
    };
    if (onLoginSuccess) {
      onLoginSuccess(mockUser);
    }
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      const errorCode = err.code || "";
      const errorMessage = err.message || "";
      
      if (errorCode === "auth/popup-closed-by-user" || errorMessage.includes("popup-closed-by-user") || errorMessage.includes("popup_closed_by_user")) {
        setError("Sign-in popup was closed. If your browser blocked the popup, please enable popups for this site or use the standard Email/Password form above.");
      } else if (errorCode === "auth/user-cancelled" || errorMessage.includes("user-cancelled") || errorMessage.includes("denied")) {
        setError("Sign-in was cancelled or access was denied. Please try again or use the Email/Password sign-in options above.");
      } else if (errorCode === "auth/popup-blocked" || errorMessage.includes("popup-blocked")) {
        setError("The Google Sign-In popup was blocked by your browser. Please allow popups or use the Email/Password fields to log in.");
      } else {
        setError(errorMessage || "Failed to sign in with Google. Please try again or use Email/Password sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl z-10 p-8 space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-serif font-black text-zinc-900 dark:text-white">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">
                {isSignUp
                  ? "Sign up to track order histories across all your devices."
                  : "Sign in to access your custom profile & order logs."}
              </p>
            </div>

            {error && (
              <div className="space-y-2">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                  {error}
                </div>
                {showSandboxFallback && (
                  <button
                    type="button"
                    onClick={handleSandboxBypass}
                    className="w-full py-3 bg-brand-gold hover:bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Bypass Auth & Enter Sandbox Mode</span>
                  </button>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ama Serwaa"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}</span>
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-150 dark:border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Or Connect With
              </span>
              <div className="flex-grow border-t border-zinc-150 dark:border-zinc-800"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-xs transition-all border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Guest Promo / Switch Auth Mode */}
            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-brand-orange hover:underline font-bold"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
