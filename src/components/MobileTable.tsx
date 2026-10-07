"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFan } from "@/components/CardFan";
import { CenterTrick } from "@/components/CenterTrick";
import { TrixCenter } from "@/components/TrixCenter";
import { PlayerPod } from "@/components/PlayerPod";
import { PlayingCard } from "@/components/PlayingCard";
import { MobileChat } from "@/components/MobileChat";
import { MobileScoreboard } from "@/components/MobileScoreboard";
import { RoundSummaryModal } from "@/components/RoundSummaryModal";
import { FinalResultsModal } from "@/components/FinalResultsModal";
import { ObjectiveBanner } from "@/components/ObjectiveBanner";
import { SwitchRevealOverlay } from "@/components/SwitchRevealOverlay";
import { SwitchSwapAnimation } from "@/components/SwitchSwapAnimation";
import { ScoreResetOverlay } from "@/components/ScoreResetOverlay";
import type { LastTrickItem } from "@/components/LastPlayPanel";
import type { TableProps } from "@/components/Table";
import type { CardData, ModeId, Move } from "@/types";

export function MobileTable({
  room,
  lastTrick,
  roundFinished,
  roundBanner,
  onRoundDismissed,
  chat,
  act,
  gameId,
  trixExtraTurnSeat,
  onTrixPass,
  switchCountdown,
  switchSwapAnimating = false,
  scoreResets = [],
}: TableProps) {
  const me = room.you ?? 0;
  const round = room.round;
  const name = (seat: number) => room.seats[seat]?.name ?? `Seat ${seat + 1}`;
  const [aceFor, setAceFor] = useState<CardData | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentLastTrick, setCurrentLastTrick] = useState<LastTrickItem | null>(null);
  const currentMode = round?.mode ?? room.history[room.history.length - 1]?.mode ?? "";
  const modalOpen = (room.gameType !== "quick" && roundFinished !== null) || roundBanner !== null;
  const myTurn = !modalOpen && room.you !== null && room.actor === room.you;
  const isSelector =
    !modalOpen &&
    ["selecting", "star_sub", "switch_sub", "switch_target"].includes(room.phase) &&
    room.selector === room.you;
  const canPass =
    myTurn &&
    round?.mode === "Trix" &&
    onTrixPass !== undefined &&
    (room.legal.length === 0 || room.legal.every((move) => move.card.rank === "A"));

  useEffect(() => {
    setCurrentLastTrick(null);
  }, [currentMode]);

  useEffect(() => {
    if (!lastTrick) return;
    setCurrentLastTrick({
      winner: lastTrick.winner,
      winnerName: name(lastTrick.winner),
      plays: lastTrick.plays.map((play) => ({
        seat: play.seat,
        card: play.card,
        name: name(play.seat),
      })),
    });
  }, [lastTrick]);

  useEffect(() => {
    if (!lastTrick) {
      setIsCollecting(false);
      return;
    }
    setIsCollecting(false);
    const timer = setTimeout(() => setIsCollecting(true), 1050);
    return () => clearTimeout(timer);
  }, [lastTrick]);

  const legalFor = (card: CardData): Move[] =>
    room.legal.filter((move) => move.card.suit === card.suit && move.card.rank === card.rank);

  const [lastPlayedCard, setLastPlayedCard] = useState<CardData | null>(null);

  function handleCardClick(card: CardData) {
    if (modalOpen || !myTurn) return;
    const moves = legalFor(card);
    if (!moves.length) return;
    setSelectedCard(card);
    if (moves.length > 1) {
      setAceFor(card);
      return;
    }
    setAceFor(null);
    if (round?.mode === "Trix") setLastPlayedCard(card);
    void act("play_card", moves[0]);
    setTimeout(() => setSelectedCard(null), 350);
  }

  const centerPlays =
    lastTrick && (!round || round.trick.length === 0) ? lastTrick.plays : round?.trick ?? [];
  const winningSeat = lastTrick ? lastTrick.winner : null;
  const winningPlayerName = lastTrick ? name(lastTrick.winner) : null;

  function seatFor(relative: number) {
    return (me + relative) % 4;
  }

  function renderCompactSeat(seat: number, position: "top" | "left" | "right" | "bottom") {
    const player = room.seats[seat];
    if (!player) return null;
    return (
      <PlayerPod
        seat={seat}
        name={player.name}
        avatar={player.avatar}
        totalScore={room.totals[seat]}
        isBot={player.isBot}
        connected={player.connected}
        isCurrentTurn={!modalOpen && room.actor === seat && room.phase !== "finished"}
        isThinking={(room.thinkingSeats ?? []).includes(seat)}
        isDealer={room.dealer === seat}
        isSelector={room.selector === seat}
        cardCount={room.handCounts[seat] ?? 0}
        position={position}
      />
    );
  }

  return (
    <div className="mobile-table-screen">
      <div className="mobile-table-felt" aria-hidden />

      <MobileScoreboard
        roundNumber={Math.min(room.roundNumber + (room.phase === "selecting" ? 1 : 0), room.totalRounds)}
        totalRounds={room.totalRounds}
        mode={currentMode}
        selectorName={room.selector !== null ? name(room.selector) : "—"}
        lastModeBonus={room.lastModeBonus}
        liveScores={round?.scores}
        seats={[0, 1, 2, 3].map((seat) => ({
          seat,
          name: name(seat),
          avatar: room.seats[seat]?.avatar ?? "🙂",
          total: room.totals[seat],
          isYou: seat === me,
        }))}
      />
      <MobileChat
        chat={chat ?? room.chat ?? []}
        onSend={(content) => void act("chat_message", { content })}
        onlineCount={room.seats.filter((seat) => seat && seat.connected).length}
      />

      <div className="mobile-player mobile-player-left">{renderCompactSeat(seatFor(1), "left")}</div>
      <div className="mobile-player mobile-player-top">{renderCompactSeat(seatFor(2), "top")}</div>
      <div className="mobile-player mobile-player-right">{renderCompactSeat(seatFor(3), "right")}</div>

      <div className="mobile-center-zone">
        <CenterTrick
          isSelectingMode={!modalOpen && (room.phase === "selecting" || room.phase === "star_sub")}
          isCurrentUserSelector={isSelector}
          isLastModePick={room.gameType !== "quick" && isSelector && room.phase === "selecting" && room.remaining.length === 1}
          selectorName={room.selector !== null ? name(room.selector) : ""}
          remainingModes={(room.remaining as ModeId[]) ?? []}
          onSelectMode={(mode) => void act("select_mode", { mode })}
          starPhase={room.phase === "star_sub" ? "sub_select" : null}
          starCompletedModes={(room.starState?.completedModes ?? []) as ModeId[]}
          onSelectStarSubMode={(mode) => void act("star_sub_mode", { subMode: mode })}
          starSubMode={room.starState?.subMode ?? null}
          switchPhase={room.switchState?.phase}
          completedModes={(room.completedModes ?? []) as ModeId[]}
          onSelectSwitchSubMode={(mode) => void act("switch_sub_mode", { subMode: mode })}
          switchSubMode={room.switchState?.subMode}
          onSelectSwitchTarget={(target) => void act("switch_target", { target })}
          seatNames={[0, 1, 2, 3].map((seat) => name(seat))}
          seatAvatars={[0, 1, 2, 3].map((seat) => room.seats[seat]?.avatar ?? "🙂")}
          youSeatForSwitch={me}
          plays={currentMode === "Trix" ? [] : centerPlays}
          youSeat={me}
          winnerSeat={winningSeat}
          winnerName={winningPlayerName}
          mode={currentMode}
          fiftyTotal={round?.mode === "FiftyOne" ? round.total : undefined}
          fiftyDirection={round?.direction}
          isCollecting={isCollecting}
          fiftyMoves={round?.mode === "FiftyOne" ? round.fiftyMoves ?? [] : undefined}
          names={[0, 1, 2, 3].map((seat) => name(seat))}
          avatars={[0, 1, 2, 3].map((seat) => room.seats[seat]?.avatar ?? "🙂")}
          thinkingSeats={room.thinkingSeats ?? []}
          selectorSeat={room.selector}
          turnOrder={(() => {
            const direction = round?.direction ?? 1;
            const actor = room.actor ?? 0;
            return [0, 1, 2, 3].map((index) => (actor + index * direction + 16) % 4);
          })()}
          trickCounts={round?.mode === "Turns" ? [0, 1, 2, 3].map((seat) => round.tricks.filter((trick) => trick.winner === seat).length) : undefined}
        />
        {currentMode === "Trix" && round?.trixTable && (
          <TrixCenter
            table={round.trixTable}
            extraTurnSeat={trixExtraTurnSeat ?? null}
            names={[0, 1, 2, 3].map((seat) => name(seat))}
            finishOrder={round.trixFinishOrder ?? []}
            yourSeat={me}
            lastPlayedCard={lastPlayedCard}
            legalMoves={room.legal}
          />
        )}
      </div>

      {currentLastTrick && currentMode !== "FiftyOne" && currentMode !== "Trix" && (
        <div className="mobile-last-trick">
          <span>🏆 {currentLastTrick.winnerName}</span>
          <div>
            {currentLastTrick.plays.map((play, index) => (
              <PlayingCard key={`${play.seat}-${index}`} card={play.card} small />
            ))}
          </div>
        </div>
      )}

      <div className="mobile-bottom-zone">
        {aceFor && myTurn && (
          <div className="mobile-ace-picker">
            <span>Play Ace as:</span>
            {legalFor(aceFor).map((move) => (
              <Button
                key={move.aceValue}
                size="sm"
                onClick={() => {
                  setAceFor(null);
                  setSelectedCard(null);
                  void act("play_card", move);
                }}
              >
                +{move.aceValue}
              </Button>
            ))}
          </div>
        )}
        <div className="mobile-turn-row">
          {renderCompactSeat(me, "bottom")}
          <span className={myTurn ? "mobile-turn-pill active" : "mobile-turn-pill"}>
            {myTurn
              ? room.phase === "selecting"
                ? "Choose a mode"
                : round?.mode === "Trix"
                ? "Your turn · play or pass"
                : "Your turn · play a card"
              : room.actor !== null
              ? `Waiting for ${name(room.actor)}`
              : ""}
          </span>
          {canPass && onTrixPass && (
            <button type="button" onClick={onTrixPass} className="mobile-pass-button">
              PASS
            </button>
          )}
        </div>
        {room.you !== null && room.phase !== "finished" ? (
          <div className="mobile-hand">
            <CardFan
              cards={room.hand}
              legalMoves={room.legal}
              isMyTurn={myTurn}
              selectedCard={selectedCard}
              onCardClick={handleCardClick}
              disabled={!myTurn}
              isSelectingMode={room.phase === "selecting"}
            />
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400">You are spectating this match.</p>
        )}
      </div>

      {currentMode !== "FiftyOne" && (
        <ObjectiveBanner banner={roundBanner} names={[0, 1, 2, 3].map((seat) => name(seat))} selectorSeat={room.selector} />
      )}

      {room.phase === "switch_reveal" && room.switchState && room.switchState.swapTarget !== null && room.switchState.otherPair !== null && room.you !== null && room.switchState.currentHand && (
        <SwitchRevealOverlay
          countdown={switchCountdown ?? room.switchState.revealCountdown}
          selectorSeat={room.selector ?? 0}
          swapTarget={room.switchState.swapTarget}
          otherPair={room.switchState.otherPair}
          currentHand={room.switchState.currentHand as CardData[]}
          seatNames={[0, 1, 2, 3].map((seat) => name(seat))}
          seatAvatars={[0, 1, 2, 3].map((seat) => room.seats[seat]?.avatar ?? "🙂")}
          youSeat={me}
        />
      )}
      {switchSwapAnimating && room.lastRoundResult?.mode === "Switch" && room.lastRoundResult.switchSwaps && (
        <SwitchSwapAnimation
          selectorSeat={room.selector ?? 0}
          swapTarget={room.lastRoundResult.switchSwaps[0][1]}
          otherPair={room.lastRoundResult.switchSwaps[1]}
          seatNames={[0, 1, 2, 3].map((seat) => name(seat))}
          seatAvatars={[0, 1, 2, 3].map((seat) => room.seats[seat]?.avatar ?? "🙂")}
          subMode={room.lastRoundResult.switchSubMode ?? ""}
        />
      )}
      {roundFinished && room.gameType !== "quick" && (
        <RoundSummaryModal
          roundNumber={roundFinished.roundNumber}
          mode={roundFinished.mode}
          endReason={roundFinished.endReason}
          selectorSeat={roundFinished.selector}
          players={room.seats.map((seat, index) => ({ seat: index, name: seat?.name ?? `Seat ${index + 1}`, avatar: seat?.avatar ?? "🙂" }))}
          baseScores={roundFinished.base}
          multipliers={roundFinished.multipliers}
          finalScores={roundFinished.scores}
          generalBreakdown={roundFinished.generalBreakdown}
          starSubMode={roundFinished.starSubMode}
          switchSubMode={roundFinished.switchSubMode}
          switchSwaps={roundFinished.switchSwaps}
          lastModeBonus={roundFinished.lastModeBonus}
          onContinue={onRoundDismissed}
        />
      )}
      <ScoreResetOverlay resets={scoreResets} names={[0, 1, 2, 3].map((seat) => name(seat))} />
      {room.phase === "finished" && (!roundFinished || room.gameType === "quick") && (
        <FinalResultsModal
          players={room.seats.map((seat, index) => ({ seat: index, name: seat?.name ?? `Seat ${index + 1}`, avatar: seat?.avatar ?? "🙂" }))}
          totals={room.totals}
          stats={room.stats}
          replayId={gameId}
          isQuickTest={room.gameType === "quick"}
          onPlayAgain={() => (window.location.href = "/")}
        />
      )}
    </div>
  );
}
