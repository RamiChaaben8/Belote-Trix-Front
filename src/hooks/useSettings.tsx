"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Lang } from "@/lib/i18n";

export type Theme = "dark" | "light";
export type CardStyle = "classic" | "modern" | "minimal";

interface Settings {
  sound: boolean;
  setSound: (v: boolean) => void;
  animations: boolean;
  setAnimations: (v: boolean) => void;
  theme: Theme;
  setTheme: (v: Theme) => void;
  cardStyle: CardStyle;
  setCardStyle: (v: CardStyle) => void;
  language: Lang;
  setLanguage: (v: Lang) => void;
  /** Translate a shell string (navbar, landing, settings, lobby). */
  t: (key: string) => string;
}

const KEY = {
  sound: "belote-sound",
  animations: "belote-animations",
  theme: "belote-theme",
  cardStyle: "belote-card-style",
  language: "belote-language",
} as const;

const THEMES: Theme[] = ["dark", "light"];
const CARD_STYLES: CardStyle[] = ["classic", "modern", "minimal"];

function stored(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

const Ctx = createContext<Settings>({
  sound: true,
  setSound: () => undefined,
  animations: true,
  setAnimations: () => undefined,
  theme: "dark",
  setTheme: () => undefined,
  cardStyle: "classic",
  setCardStyle: () => undefined,
  language: "en",
  setLanguage: () => undefined,
  t: (key) => translate("en", key),
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [sound, setSoundState] = useState(true);
  const [animations, setAnimationsState] = useState(true);
  const [theme, setThemeState] = useState<Theme>("dark");
  const [cardStyle, setCardStyleState] = useState<CardStyle>("classic");
  const [language, setLanguageState] = useState<Lang>("en");

  // Load preferences from this browser (guest build: everything is local).
  useEffect(() => {
    const s = stored(KEY.sound);
    if (s !== null) setSoundState(s === "1");
    const a = stored(KEY.animations);
    if (a !== null) setAnimationsState(a !== "0");
    const th = stored(KEY.theme);
    if (th && (THEMES as string[]).includes(th)) setThemeState(th as Theme);
    const cs = stored(KEY.cardStyle);
    if (cs && (CARD_STYLES as string[]).includes(cs)) setCardStyleState(cs as CardStyle);
    const lg = stored(KEY.language);
    if (lg === "en" || lg === "fr") setLanguageState(lg);
  }, []);

  // Apply the preferences to the document so CSS can react.
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-card-style", cardStyle);
    el.setAttribute("data-anim", animations ? "on" : "off");
    el.lang = language;
  }, [theme, cardStyle, animations, language]);

  const setSound = useCallback((v: boolean) => {
    setSoundState(v);
    try {
      localStorage.setItem(KEY.sound, v ? "1" : "0");
    } catch { /* private mode */ }
  }, []);

  const setAnimations = useCallback((v: boolean) => {
    setAnimationsState(v);
    try {
      localStorage.setItem(KEY.animations, v ? "1" : "0");
    } catch { /* private mode */ }
  }, []);

  const setTheme = useCallback((v: Theme) => {
    setThemeState(v);
    try {
      localStorage.setItem(KEY.theme, v);
    } catch { /* private mode */ }
  }, []);

  const setCardStyle = useCallback((v: CardStyle) => {
    setCardStyleState(v);
    try {
      localStorage.setItem(KEY.cardStyle, v);
    } catch { /* private mode */ }
  }, []);

  const setLanguage = useCallback((v: Lang) => {
    setLanguageState(v);
    try {
      localStorage.setItem(KEY.language, v);
    } catch { /* private mode */ }
  }, []);

  const t = useCallback((key: string) => translate(language, key), [language]);

  return (
    <Ctx.Provider
      value={{
        sound,
        setSound,
        animations,
        setAnimations,
        theme,
        setTheme,
        cardStyle,
        setCardStyle,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);
