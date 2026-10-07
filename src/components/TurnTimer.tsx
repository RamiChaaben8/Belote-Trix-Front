"use client";

import { useEffect, useState } from "react";

export function TurnTimer({ deadline }: { deadline: number | null }) {
  const [remaining, setRemaining] = useState(() => getRemaining(deadline));

  useEffect(() => {
    setRemaining(getRemaining(deadline));
    if (deadline === null) return;
    const interval = window.setInterval(() => {
      setRemaining(getRemaining(deadline));
    }, 250);
    return () => window.clearInterval(interval);
  }, [deadline]);

  if (deadline === null || remaining <= 0) return null;

  return (
    <span className={`turn-timer ${remaining <= 3 ? "turn-timer-urgent" : ""}`} aria-label={`${remaining} seconds remaining`}>
      ⏱ {remaining}s
    </span>
  );
}

function getRemaining(deadline: number | null): number {
  if (deadline === null) return 0;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}
