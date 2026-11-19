// Server-side only, never imported by a client component or exposed as NEXT_PUBLIC keys.
import "server-only";
type HttpMethod = "GET" | "POST";
function config(): { origin: string; key: string } | null {
  const raw = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!raw || !key) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    return { origin: url.origin, key };
  } catch { return null; }
}
export function comparisonWriteConfigured(): boolean { return config() !== null; }
export async function comparisonRest<T>(
  path: string, method: HttpMethod, body?: unknown
): Promise<T> {
  const c = config();
  if (!c) throw new Error("Comparison write connection is not configured");
  const headers: Record<string,string> = { apikey: c.key, Accept:"application/json" };
  if (!c.key.startsWith("sb_secret_")) headers.Authorization = "Bearer " + c.key;
  if (method === "POST") headers["Content-Type"] = "application/json";
  const res = await fetch(c.origin + "/rest/v1/" + path, {
    method, headers, body: method === "POST" ? JSON.stringify(body) : undefined,
    cache:"no-store", signal:AbortSignal.timeout(7000)
  });
  if (!res.ok) throw new Error("Supabase comparison write failed with HTTP " + res.status);
  return await res.json() as T;
}
