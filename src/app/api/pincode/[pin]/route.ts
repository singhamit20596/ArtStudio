import { cacheLife } from "next/cache";
import { isPincode, matchState } from "@/lib/india";

interface PostOffice {
  District: string;
  State: string;
  Block?: string;
}

/** India Post's public lookup. Cached for a month; a failure throws so it is never cached. */
async function lookup(pin: string) {
  "use cache";
  cacheLife("weeks");
  const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`India Post ${res.status}`);
  const [result] = (await res.json()) as { Status: string; PostOffice: PostOffice[] | null }[];
  const office = result?.Status === "Success" ? result.PostOffice?.[0] : undefined;
  return office ? { city: office.District, state: matchState(office.State) } : null;
}

/** GET /api/pincode/110001 → { city: "Central Delhi", state: "Delhi" }, for the checkout address form. */
export async function GET(_request: Request, ctx: RouteContext<"/api/pincode/[pin]">) {
  const { pin } = await ctx.params;
  if (!isPincode(pin)) return Response.json({ ok: false }, { status: 400 });
  try {
    const place = await lookup(pin);
    return place ? Response.json({ ok: true, ...place }) : Response.json({ ok: false }, { status: 404 });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
