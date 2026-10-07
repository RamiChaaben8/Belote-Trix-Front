"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ChatEntry } from "@/hooks/useRoom";

export function MobileChat({
  chat,
  onSend,
  onlineCount,
}: {
  chat: ChatEntry[];
  onSend: (text: string) => void;
  onlineCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);
  const previousLength = useRef(chat.length);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat.length > previousLength.current && !open) {
      setUnread((value) => value + chat.length - previousLength.current);
    }
    previousLength.current = chat.length;
  }, [chat.length, open]);

  useEffect(() => {
    if (open && logRef.current) {
      setUnread(0);
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [chat, open]);

  function send(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mobile-chat-button" aria-label="Open chat">
        💬
        {unread > 0 && <span className="mobile-unread">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)}>
          <section
            className="mobile-chat-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Table chat"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div>
                <h2>💬 Chat</h2>
                <p>{onlineCount} online</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
            </div>
            <div ref={logRef} className="mobile-chat-log">
              {chat.length === 0 ? (
                <p className="text-slate-500 italic">No messages yet. Say hello!</p>
              ) : (
                chat.map((message, index) => (
                  <p key={index}><b>{message.author}:</b> {message.content}</p>
                ))
              )}
            </div>
            <form onSubmit={send} className="mobile-chat-form">
              <input value={text} onChange={(event) => setText(event.target.value)} maxLength={300} placeholder="Message…" />
              <Button type="submit" size="sm">Send</Button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
