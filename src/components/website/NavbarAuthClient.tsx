"use client";

import { Providers } from "@/app/providers";
import Link from "@/components/website/AppLink";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LogIn, LogOut, Mail, User, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

const LoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setIsLoading(false);
      setIsEmailSent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const res = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/my-booking",
    });

    setIsLoading(false);

    if (res?.error) {
      alert("Error sending email. Please try again.");
    } else {
      setIsEmailSent(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">
            {isEmailSent ? "Check your inbox" : "Welcome Back"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 text-center">
          {isEmailSent ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Magic Link Sent!
              </h4>
              <p className="text-sm text-slate-500 mb-6">
                We sent a login link to <strong>{email}</strong>.
                <br />
                Please check your email (and spam folder) to sign in.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-lime-600" />
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Log in to your account
              </h4>
              <p className="text-sm text-slate-500 mb-6">
                Access your bookings and manage trips.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => signIn("google")}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase">
                    Or continue with email
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-lime-200 focus:border-lime-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-jvto-dark text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Login Link"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            By logging in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-sm border-2 transition-all ${
          isOpen
            ? "bg-jvto-green text-jvto-dark border-jvto-dark"
            : "border-jvto-green bg-jvto-green text-jvto-dark hover:bg-jvto-dark hover:border-jvto-dark hover:text-white"
        }`}
      >
        <User size={16} /> My Account
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1">
          <Link
            href="/my-booking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-jvto-green"
          >
            <LayoutDashboard size={16} />
            My Booking
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const DesktopAuthInner = ({
  finalMenuIconClass,
}: {
  finalMenuIconClass: string;
}) => {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      {session ? (
        <ProfileDropdown />
      ) : (
        <button
          onClick={() => setIsLoginOpen(true)}
          aria-label="Open login"
          className="hidden md:inline-flex p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors"
        >
          <User size={20} className={finalMenuIconClass} />
        </button>
      )}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

const MobileAuthInner = ({
  onOpenLogin,
}: {
  onOpenLogin?: () => void;
}) => {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => {
    onOpenLogin?.();
    setIsLoginOpen(true);
  };

  return (
    <>
      {session ? (
        <>
          <Link
            href="/my-booking"
            prefetch={false}
            className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-green hover:text-jvto-dark transition-colors"
          >
            <LayoutDashboard size={20} /> My Booking
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 border-b border-gray-100 pb-4 text-red-600 hover:text-red-800 transition-colors text-left"
          >
            <LogOut size={20} /> Log Out
          </button>
        </>
      ) : (
        <button
          onClick={openLogin}
          className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-dark hover:text-jvto-green transition-colors text-left"
        >
          <LogIn size={20} /> Log In
        </button>
      )}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export const NavbarDesktopAuthIsland = ({
  finalMenuIconClass,
}: {
  finalMenuIconClass: string;
}) => (
  <Providers>
    <DesktopAuthInner finalMenuIconClass={finalMenuIconClass} />
  </Providers>
);

export const NavbarMobileAuthIsland = ({
  onOpenLogin,
}: {
  onOpenLogin?: () => void;
}) => (
  <Providers>
    <MobileAuthInner onOpenLogin={onOpenLogin} />
  </Providers>
);
