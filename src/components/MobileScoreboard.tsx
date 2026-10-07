"use client";

import { useState } from "react";
import { MODE_LABEL } from "@/lib/utils";

interface MobileScoreboardProps {
  roundNumber: number;
  totalRounds: number;
  mode: string;
  selectorName: string;
  lastModeBonus?: boolean;
  liveScores?: number[];
  seats: {
    seat: number;
    name: string;
    avatar: string;
    total: number;
    isYou: boolean;
  }[];
}

export function MobileScoreboard({
  roundNumber,
  totalRounds,
  mode,
  selectorName,
  lastModeBonus = false,
  liveScores,
  seats,
}: MobileScoreboardProps) {
  const [open, setOpen] = useState(false);
  const sorted = [...seats].sort((a, b) => a.total - b.total);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mobile-score-button"
        aria-label="Open scoreboard"
      >
        🏆
      </button>

      {open && (
        <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)}>
          <section
            className="mobile-score-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Scoreboard"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div>
                <h2>🏆 Score</h2>
                <p>Round {roundNumber}/{totalRounds}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close scoreboard">
                ✕
              </button>
            </div>

            <div className="mobile-score-meta">
              <div><span>Mode</span><b>{MODE_LABEL[mode] || mode || "Selecting…"}</b></div>
              <div><span>Selector</span><b>{selectorName || "—"}</b></div>
            </div>

            {lastModeBonus && <div className="mobile-score-bonus">🔥 Last mode bonus ×2</div>}

            <div className="mobile-ranking">
              {sorted.map((item, index) => (
                <div key={item.seat} className={index === 0 ? "mobile-rank winner" : "mobile-rank"}>
                  <span>#{index + 1} {item.avatar} {item.name}{item.isYou ? " (You)" : ""}</span>
                  <b>{item.total}</b>
                </div>
              ))}
            </div>

            {liveScores && (
              <div className="mobile-live-score">
                <h3>Live round score</h3>
                {seats.map((item) => (
                  <div key={item.seat} className="mobile-rank">
                    <span>{item.avatar} {item.name}</span>
                    <b>{(liveScores[item.seat] ?? 0) > 0 ? "+" : ""}{liveScores[item.seat] ?? 0}</b>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
