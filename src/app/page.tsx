"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, Input } from "@/components/ui/card";
import { loadIdentity } from "@/lib/identity";
import { useSettings } from "@/hooks/useSettings";
import { emitAck } from "@/socket/client";
import type { ModeId } from "@/types";

// ============================================================
// Guest-only landing page: Create room / Join room / Settings.
// - "Your name" card removed → guest nicknames are generated
//   automatically (see src/lib/identity.ts).
// - Leaderboard / History / Profile / Sign in links removed.
// Original page preserved in git history.
// ============================================================

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const QUICK_MODES: ModeId[] = ["KingOfHearts", "Diamonds", "Queens", "Turns", "LastTrick", "Trix", "General", "FiftyOne"];

function randomCode(): string {
  return Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
}

export default function HomePage() {
  const router = useRouter();
  const { t } = useSettings();
  const [guest, setGuest] = useState<{ name: string; avatar: string }>({ name: "Guest", avatar: "🙂" });
  const [roomCode, setRoomCode] = useState("");
  const [bots, setBots] = useState(3);
  const [gameType, setGameType] = useState<"full" | "quick">("full");
  const [quickMode, setQuickMode] = useState<ModeId>("KingOfHearts");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setGuest(loadIdentity());
    setRoomCode(randomCode());
  }, []);

  async function create() {
    setBusy(true);
    setError(null);
    const res = await emitAck("create_room", {
      gameType,
      quickMode,
      bots,
      code: roomCode.trim().toUpperCase(),
    });
    if (!res.ok || !res.code) {
      setError(res.error ?? t("home.error.create"));
      setBusy(false);
      return;
    }
    router.push(`/room/${res.code}`);
  }

  function join() {
    if (joinCode.trim().length < 4) return setError(t("home.error.code"));
    setError(null);
    router.push(`/room/${joinCode.trim().toUpperCase()}`);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <h1 className="text-4xl font-extrabold text-white">Belote Trix</h1>
        <p className="mt-2 text-slate-300">{t("home.tagline")}</p>
        <p className="mt-3 text-sm text-slate-400">
          {t("home.playingAs")}{" "}
          <b className="font-mono text-emerald-400">
            {guest.avatar} {guest.name}
          </b>{" "}
          <Link className="text-emerald-400 underline-offset-2 hover:underline" href="/settings">
            — {t("home.changeSettings")}
          </Link>
        </p>
      </div>

      {/* ---------------- Create room ---------------- */}
      <Card>
        <CardTitle>{t("home.createTitle")}</CardTitle>

        <div className="mb-3 space-y-1.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t("home.roomCode")}
            </span>
            <button
              type="button"
              onClick={() => setRoomCode(randomCode())}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              aria-label={t("home.newCode")}
            >
              ↻ {t("home.newCode")}
            </button>
          </div>
          <Input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={10}
            className="font-mono text-center text-base tracking-[0.3em] uppercase"
            aria-label={t("home.roomCode")}
            data-testid="room-code"
          />
        </div>

        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-slate-300">{t("home.bots")}:</span>
          {[0, 1, 2, 3].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={bots === n ? "default" : "outline"}
              onClick={() => setBots(n)}
              data-testid={`bots-${n}`}
            >
              {n}
            </Button>
          ))}
        </div>

        {/* Game Type option: Full Match vs Quick Test */}
        <div className="mb-3.5 space-y-1.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t("home.gameType")}:
          </span>
          <div className="flex gap-4 text-xs font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 hover:text-white">
              <input
                type="radio"
                name="gameType"
                value="full"
                checked={gameType === "full"}
                onChange={() => setGameType("full")}
                className="accent-amber-400"
              />
              <span>{t("home.fullMatch")}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 hover:text-amber-200">
              <input
                type="radio"
                name="gameType"
                value="quick"
                checked={gameType === "quick"}
                onChange={() => setGameType("quick")}
                className="accent-amber-400"
              />
              <span className="flex items-center gap-1">
                <span>{t("home.quickTest")}</span>
                <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  {t("home.quickBadge")}
                </span>
              </span>
            </label>
          </div>

          {gameType === "quick" && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-xs text-amber-300/90 font-medium">{t("home.mode")}:</span>
              <select
                value={quickMode}
                onChange={(e) => setQuickMode(e.target.value as ModeId)}
                className="bg-slate-950 text-slate-100 border border-amber-500/40 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {QUICK_MODES.map((m) => (
                  <option key={m} value={m}>
                    {t(`mode.${m}`)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <Button onClick={() => void create()} disabled={busy} className="w-full" data-testid="create-room">
          {t("home.createCta")}
        </Button>
      </Card>

      {/* ---------------- Join room ---------------- */}
      <Card>
        <CardTitle>{t("home.joinTitle")}</CardTitle>
        <p className="mb-3 text-xs text-slate-400">{t("home.joinHint")}</p>
        <Input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          maxLength={10}
          className="mb-3 font-mono uppercase"
          aria-label={t("lobby.invite")}
          data-testid="join-code"
        />
        <Button onClick={join} className="w-full" data-testid="join-room">
          {t("home.joinCta")}
        </Button>
        <p className="mt-3 text-xs text-slate-400">
          {t("home.playingAs")}{" "}
          <b className="font-mono text-emerald-400">
            {guest.avatar} {guest.name}
          </b>
        </p>
      </Card>

      {error && <p className="text-red-400 md:col-span-2">{error}</p>}
    </div>
  );
}
