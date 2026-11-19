"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { VARIANTS, randyAvatarSrc, randyVariantFor, todayInEastern, type RandyVariant } from "@/lib/randy-season";
import { company } from "@/lib/company";

// Today's Randy (holiday guide). The server renders the default; the browser
// switches to the seasonal look for today's Eastern date. `?randy=<variant>`
// previews a variant for review.
function currentVariant(): RandyVariant {
  const preview = new URLSearchParams(window.location.search).get("randy") as RandyVariant | null;
  if (preview && VARIANTS.includes(preview)) return preview;
  return randyVariantFor(todayInEastern());
}
const noop = () => () => {};
function useRandyAvatar() {
  return randyAvatarSrc(useSyncExternalStore(noop, currentVariant, () => "default"));
}
const FALLBACK = `Randy is unavailable right now. Call ${company.phoneDisplay} or use the Text button.`;

type Message = { role: "user" | "assistant"; content: string };
type Reply = { reply?: string; options?: string[]; degraded?: boolean };

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
  const AVATAR = useRandyAvatar();
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, busy]);

  // Tell the Randy backend when a conversation ends, as the Odoo widget did,
  // so the conversation is summarized and logged.
  const history = useRef<Message[]>([]);
  history.current = messages;
  const closedSent = useRef(false);
  useEffect(() => {
    const notifyClosed = () => {
      if (closedSent.current || !history.current.some((m) => m.role === "user")) return;
      closedSent.current = true;
      fetch("/api/randy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.current, event: "chatClosed" }),
        keepalive: true,
      }).catch(() => {});
    };
    const node = dialog.current;
    node?.addEventListener("close", notifyClosed);
    window.addEventListener("pagehide", notifyClosed);
    return () => {
      node?.removeEventListener("close", notifyClosed);
      window.removeEventListener("pagehide", notifyClosed);
    };
  }, []);

  async function call(body: { messages: Message[]; event?: string }): Promise<Reply> {
    try {
      const res = await fetch("/api/randy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      return (await res.json()) as Reply;
    } catch {
      return { reply: FALLBACK, degraded: true };
    }
  }

  async function open() {
    dialog.current?.showModal();
    if (messages.length > 0) return;
    setBusy(true);
    const data = await call({ messages: [], event: "chatOpened" });
    setMessages([{ role: "assistant", content: data.reply ?? "Hi, I'm Randy, Little Junkers' digital rental assistant. What are you working on?" }]);
    setOptions(data.degraded ? [] : (data.options?.length ? data.options : ["Help me pick a dumpster", "Check availability", "Existing rental question"]));
    setBusy(false);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    closedSent.current = false;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setOptions([]);
    setDraft("");
    setBusy(true);
    const data = await call({ messages: next });
    setMessages([...next, { role: "assistant", content: data.reply ?? "Sorry, I didn't catch that. Could you rephrase it?" }]);
    setOptions(data.degraded ? [] : (data.options ?? []));
    setBusy(false);
  }

  return (
    <>
      <button className="randy-bubble" type="button" onClick={open} aria-haspopup="dialog">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="randy-bubble__avatar" src={AVATAR} alt="" width={44} height={44} />
        Ask Randy
      </button>

      <dialog ref={dialog} className="randy" aria-labelledby="randy-title">
        <header className="randy__head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="randy__avatar" src={AVATAR} alt="" width={52} height={52} />
          <div style={{ flex: 1 }}>
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
            <div key={index} className={`randy__row randy__row--${message.role}`}>
              {message.role === "assistant" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="randy__mini" src={AVATAR} alt="" width={28} height={28} />
              ) : null}
              <p className={`randy__msg randy__msg--${message.role}`}>
                {message.role === "assistant" ? withLinks(message.content) : message.content}
              </p>
            </div>
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
