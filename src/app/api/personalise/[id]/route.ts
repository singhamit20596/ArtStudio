import { needsPersonalising } from "@/lib/checkout";
import { getProduct } from "@/lib/catalog";
import { deliverEmails, personalisationEmail } from "@/lib/orders/emails";
import { getOrderWithToken, saveOrder } from "@/lib/orders/store";
import { fileUrl, validatePersonalise, type PersonaliseInput } from "@/lib/personalise";
import { publicOrigin } from "@/lib/orders/origin";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

/** The order's pieces that need personalising, with anything already filled in. */
export async function GET(request: Request, ctx: RouteContext<"/api/personalise/[id]">) {
  const { id } = await ctx.params;
  const order = await getOrderWithToken(id, new URL(request.url).searchParams.get("t"));
  if (!order) return Response.json({ ok: false, message: "This link doesn't match an order. Please check it, or message us on WhatsApp." }, { status: 404 });
  const token = order.token!;
  return Response.json({
    ok: true,
    order: {
      id: order.id,
      customerName: order.customer.name.split(" ")[0],
      status: order.status,
      items: order.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => needsPersonalising(item))
        .map(({ item, index }) => ({
          index,
          slug: item.slug,
          name: item.name,
          variant: item.variant ?? null,
          image: item.image,
          personalisation: item.personalisation ?? null,
          fileUrls: Object.fromEntries((item.personalisation?.files ?? []).map((k) => [k, fileUrl(k, token)])),
        })),
    },
  });
}

/** Saves the details for one piece (they can be changed again until the studio starts making it). */
export async function POST(request: Request, ctx: RouteContext<"/api/personalise/[id]">) {
  const { id } = await ctx.params;
  const raw = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const order = await getOrderWithToken(id, typeof raw.t === "string" ? raw.t : null);
  if (!order) return Response.json({ ok: false, message: "This link doesn't match an order." }, { status: 404 });

  const index = Number(raw.item);
  const item = Number.isInteger(index) ? order.items[index] : undefined;
  if (!item || !needsPersonalising(item)) return Response.json({ ok: false, message: "That piece doesn't need personalising." }, { status: 400 });

  const prefix = `${order.id}/${index}/`;
  const input: PersonaliseInput = {
    item: index,
    template: clip(raw.template, 40),
    rank: clip(raw.rank, 40),
    name: clip(raw.name, 60),
    unit: clip(raw.unit, 100),
    years: clip(raw.years, 40),
    background: clip(raw.background, 40),
    neededBy: clip(raw.neededBy, 10),
    notes: typeof raw.notes === "string" ? raw.notes.trim().slice(0, 1200) : "",
    // Only photos uploaded for this piece of this order.
    files: Array.isArray(raw.files) ? raw.files.filter((k): k is string => typeof k === "string" && k.startsWith(prefix)).slice(0, 20) : [],
  };
  const errors = validatePersonalise(input, item.slug);
  if (Object.keys(errors).length > 0) return Response.json({ ok: false, message: "Please check the highlighted details.", errors }, { status: 400 });
  if (!getProduct(item.slug)) return Response.json({ ok: false, message: "This tribute is no longer available." }, { status: 409 });

  item.personalisation = {
    template: input.template,
    rank: input.rank,
    name: input.name,
    unit: input.unit || null,
    years: input.years || null,
    background: input.background,
    neededBy: input.neededBy || null,
    notes: input.notes || null,
    files: input.files,
    submittedAt: new Date().toISOString(),
  };
  await saveOrder(order);
  await deliverEmails(`${order.id}-personalised-${index}`, [personalisationEmail(order, index, publicOrigin(request))]);
  return Response.json({ ok: true, personalisation: item.personalisation });
}
