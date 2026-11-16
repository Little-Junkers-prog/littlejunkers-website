"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type Reply = { reply?: string; options?: string[] };

// Randy turns URLs into <https://...> tokens. Render those as links, and
// nothing else as markup.
function withLinks(text: string) {
  return text.split(/(<https?:\/\/[^>\s]+>|https?:\/\/[^\s<>]+)/g).map((part, index) => {
    const url = part.replace(/^<|>$/g, "");
    if (!/^https?:\/\//.test(url)) return part;
    let label = "Open link";
    try {
      const { hostname, pathname } = new URL(url);
      label = hostname.replace(/^www\./, "") + (pathname.length > 1 ? pathname.split("?")[0] : "");
    } catch {
      return part;
    }
    return (
      <a key={index} href={url} target="_blank" rel="noopener">
        {label.length > 44 ? "Open your booking link" : label}
      </a>
    );
  });
}

// Ask Randy: the sitewide entry to the digital rental assistant. Opens a
// native modal dialog (full screen on phones) so focus is trapped, Escape
// closes it and focus returns to the bubble.
export default function RandyChat() {
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, busy]);

  async function call(body: { messages: Message[]; event?: string }): Promise<Reply> {
    try {
      const res = await fetch("/api/randy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      return (await res.json()) as Reply;
    } catch {
      return { reply: "I can't connect right now. Please call or text Little Junkers at 470-548-4733." };
    }
  }

  async function open() {
    dialog.current?.showModal();
    if (messages.length > 0) return;
    setBusy(true);
    const data = await call({ messages: [], event: "chatOpened" });
    setMessages(data.reply ? [{ role: "assistant", content: data.reply }] : []);
    setOptions(data.options ?? []);
    setBusy(false);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setOptions([]);
    setDraft("");
    setBusy(true);
    const data = await call({ messages: next });
    setMessages([...next, { role: "assistant", content: data.reply ?? "Sorry, I didn't catch that. Could you rephrase it?" }]);
    setOptions(data.options ?? []);
    setBusy(false);
  }

  return (
    <>
      <button className="randy-bubble" type="button" onClick={open} aria-haspopup="dialog">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
        Ask Randy
      </button>

      <dialog ref={dialog} className="randy" aria-labelledby="randy-title">
        <header className="randy__head">
          <div>
            <p id="randy-title" className="randy__title">
              Ask Randy
            </p>
            <p className="randy__sub">Little Junkers&apos; digital rental assistant</p>
          </div>
          <button className="randy__close" type="button" onClick={() => dialog.current?.close()} aria-label="Close chat">
            ×
          </button>
        </header>

        <div className="randy__log" ref={log} aria-live="polite">
          {messages.map((message, index) => (
            <p key={index} className={`randy__msg randy__msg--${message.role}`}>
              {message.role === "assistant" ? withLinks(message.content) : message.content}
            </p>
          ))}
          {busy ? <p className="randy__msg randy__msg--assistant randy__msg--typing">Randy is typing…</p> : null}
          {options.length > 0 && !busy ? (
            <div className="randy__options">
              {options.map((option) => (
                <button className="chip" type="button" key={option} onClick={() => send(option)}>
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <form
          className="randy__form"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <label className="visually-hidden" htmlFor="randy-input">
            Message Randy
          </label>
          <input
            id="randy-input"
            className="zip__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your question"
            maxLength={500}
            autoComplete="off"
          />
          <button className="btn btn--primary" type="submit" disabled={busy || !draft.trim()}>
            Send
          </button>
        </form>
        <p className="randy__fine">
          Randy is an automated assistant. Chats are saved so we can help you. See our <a href="/privacy">Privacy Policy</a>.
        </p>
      </dialog>
    </>
  );
}
