"use client";

// ============================================================
// SessionProvider removed — guest-only build (no authentication).
// import { SessionProvider } from "next-auth/react";
// ============================================================
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { SettingsProvider, useSettings } from "@/hooks/useSettings";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // <SessionProvider>
    <SettingsProvider>
      <AnimationGate>{children}</AnimationGate>
    </SettingsProvider>
    // </SessionProvider>
  );
}

/** Applies the local "Animations" setting to every framer-motion component. */
function AnimationGate({ children }: { children: ReactNode }) {
  const { animations } = useSettings();
  return <MotionConfig reducedMotion={animations ? "never" : "always"}>{children}</MotionConfig>;
}
