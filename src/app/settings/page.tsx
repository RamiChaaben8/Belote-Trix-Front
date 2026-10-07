"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, Input } from "@/components/ui/card";
import { useSettings, type CardStyle, type Theme } from "@/hooks/useSettings";
import { loadIdentity, saveIdentity } from "@/lib/identity";
import { LANGS, type Lang } from "@/lib/i18n";

// ============================================================
// Guest settings — everything here is stored in this browser only
// (localStorage). No account, no session, no server round-trip.
//
// Removed with authentication: the /api/profile PATCH call that
// persisted name/avatar/sound to the user record.
// ============================================================
// import { useSession } from "next-auth/react";
// if (session?.user) await fetch("/api/profile", { method: "PATCH", ... });

const AVATARS = ["🙂", "🦊", "🐻", "🐼", "🦁", "🐯", "🐸", "🐙", "🦉", "🐧"];

function randomGuestName(): string {
  return "Guest" + Math.floor(Math.random() * 900 + 100);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 py-3 last:border-b-0">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const {
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
  } = useSettings();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🙂");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const id = loadIdentity();
    setName(id.name);
    setAvatar(id.avatar);
  }, []);

  function applyIdentity() {
    saveIdentity({ name: name.trim() || randomGuestName(), avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <CardTitle>{t("settings.title")}</CardTitle>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← {t("settings.backToRoom")}
        </Button>
      </div>

      <div className="mb-4 space-y-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t("settings.guest")}
        </span>
        <div className="flex items-end gap-2">
          <label className="block flex-1 text-sm text-slate-300">
            {t("settings.name")}
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              className="mt-1"
              aria-label={t("settings.name")}
              data-testid="guest-name-input"
            />
          </label>
          <Button
            variant="outline"
            onClick={() => setName(randomGuestName())}
            title={t("settings.newName")}
          >
            🎲 {t("settings.newName")}
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm text-slate-300">{t("settings.avatar")}</p>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                aria-label={a}
                className={`rounded-lg px-2 py-1 text-2xl ${avatar === a ? "bg-emerald-700" : "bg-slate-800"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-1">
          <Button onClick={applyIdentity} data-testid="save-identity">
            {saved ? `${t("settings.applied")}` : t("settings.apply")}
          </Button>
        </div>
        <p className="text-xs text-slate-500">{t("settings.hintName")}</p>
      </div>

      <div className="mb-4 border-b border-slate-800 pb-1">
        <Row label={t("settings.sound")}>
          <Button size="sm" variant={sound ? "default" : "outline"} onClick={() => setSound(true)}>
            ON
          </Button>
          <Button size="sm" variant={!sound ? "default" : "outline"} onClick={() => setSound(false)}>
            OFF
          </Button>
        </Row>
        <Row label={t("settings.animations")}>
          <Button size="sm" variant={animations ? "default" : "outline"} onClick={() => setAnimations(true)}>
            ON
          </Button>
          <Button size="sm" variant={!animations ? "default" : "outline"} onClick={() => setAnimations(false)}>
            OFF
          </Button>
        </Row>
      </div>

      <Row label={t("settings.theme")}>
        {(["dark", "light"] as Theme[]).map((v) => (
          <Button
            key={v}
            size="sm"
            variant={theme === v ? "default" : "outline"}
            onClick={() => setTheme(v)}
            data-testid={`theme-${v}`}
          >
            {v === "dark" ? t("theme.dark") : t("theme.light")}
          </Button>
        ))}
      </Row>

      <Row label={t("settings.cardStyle")}>
        {(["classic", "modern", "minimal"] as CardStyle[]).map((v) => (
          <Button
            key={v}
            size="sm"
            variant={cardStyle === v ? "default" : "outline"}
            onClick={() => setCardStyle(v)}
            data-testid={`card-style-${v}`}
          >
            {t(`card.${v}`)}
          </Button>
        ))}
      </Row>

      <Row label={t("settings.language")}>
        {LANGS.map((v: Lang) => (
          <Button
            key={v}
            size="sm"
            variant={language === v ? "default" : "outline"}
            onClick={() => setLanguage(v)}
            data-testid={`lang-${v}`}
          >
            {t(`lang.${v}`)}
          </Button>
        ))}
      </Row>

      <p className="mt-4 text-xs text-slate-500">{t("settings.hintLocal")}</p>
    </Card>
  );
}
