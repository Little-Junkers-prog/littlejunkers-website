import { NextResponse } from "next/server";
import { bookingOrigin } from "@/lib/company";

// Thin pass-through to the existing Randy backend in the booking app
// (api/randy-chat.js). The website adds no AI logic, pricing or lead handling
// of its own: Randy's rules, guardrails and logging stay in one place.
// The conversation id cookie the backend issues is kept first-party here.

const UPSTREAM = `${process.env.RANDY_API_ORIGIN ?? bookingOrigin}/api/randy-chat`;
const CONVERSATION_COOKIE = "rc_sid";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FALLBACK = {
  reply: "I can't connect right now. Please call or text Little Junkers at 470-548-4733, or use the Book button.",
  degraded: true,
};

type Message = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let body: { messages?: unknown; event?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Bad request." }, { status: 400 });
  }

  const messages: Message[] = Array.isArray(body.messages)
    ? body.messages.slice(-24).map((m: any) => ({
        role: m?.role === "assistant" ? "assistant" : "user",
        content: String(m?.content ?? "").slice(0, 2000),
      }))
    : [];
  const event = body.event === "chatOpened" || body.event === "chatClosed" ? body.event : "";

  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)rc_sid=([^;]+)/)?.[1];
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookie && UUID.test(cookie)) headers.Cookie = `${CONVERSATION_COOKIE}=${cookie}`;
  if (process.env.RANDY_SITE_TOKEN) headers["x-site-token"] = process.env.RANDY_SITE_TOKEN;

  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages, event }),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });
    if (!upstream.ok) return NextResponse.json(FALLBACK);
    const data = await upstream.json();
    const response = NextResponse.json({
      reply: typeof data.reply === "string" ? data.reply : undefined,
      options: Array.isArray(data.options) ? data.options.slice(0, 6).map(String) : undefined,
      bookingUrl: typeof data.bookingUrl === "string" ? data.bookingUrl : undefined,
    });
    const issued = upstream.headers.get("set-cookie")?.match(/rc_sid=([^;]+)/)?.[1];
    if (issued && UUID.test(issued)) {
      response.cookies.set(CONVERSATION_COOKIE, issued, { httpOnly: true, secure: true, sameSite: "lax", path: "/api/randy" });
    }
    return response;
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
