"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { loadIdentity } from "@/lib/identity";

// ============================================================
// AUTHENTICATION REMOVED — guest-only build.
// The signed-in navigation (Leaderboard / History / Profile /
// Sign in / Sign out) is preserved at the bottom of this file.
// ============================================================
// import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { sound, setSound, t } = useSettings();
  const navRef = useRef<HTMLElement | null>(null);
  const [guestName, setGuestName] = useState("Guest");

  // Guest name: generated once per browser, shown instead of an account.
  useEffect(() => {
    setGuestName(loadIdentity().name);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string }>).detail;
      if (detail?.name) setGuestName(detail.name);
    };
    window.addEventListener("belote-identity-changed", onChange);
    return () => window.removeEventListener("belote-identity-changed", onChange);
  }, []);

  // Publish the navbar's real height as --nav-h so the game screen can
  // occupy exactly `100dvh - nav-h` (the navbar wraps to 2 rows on
  // narrow screens, so a hardcoded value would overlap or waste space).
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
        <Link href="/" className="text-lg font-extrabold text-emerald-400">
          ♠ Belote Trix
        </Link>
        {/* Leaderboard / History / Profile / Sign in / Sign out — removed (guest-only build).
        <Link href="/leaderboard" className="text-slate-300 hover:text-white">Leaderboard</Link>
        <Link href="/history" className="text-slate-300 hover:text-white">History</Link>
        <Link href="/profile" className="text-slate-300 hover:text-white">Profile</Link>
        */}
        <Link href="/settings" className="text-slate-300 hover:text-white">
          {t("nav.settings")}
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <button
            aria-label={t("nav.sound")}
            title={t("nav.sound")}
            onClick={() => setSound(!sound)}
            className="text-lg"
          >
            {sound ? "🔊" : "🔇"}
          </button>
          {/* Guest name replaces the account avatar / sign-in button. */}
          <span
            className="max-w-[11rem] truncate rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-100"
            title={guestName}
            data-testid="guest-name"
          >
            {guestName}
          </span>
          {/*
          {data?.user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-slate-300 hover:text-white">
              Sign out ({data.user.name})
            </button>
          ) : (
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
          )}
          */}
        </div>
      </div>
    </nav>
  );
}
