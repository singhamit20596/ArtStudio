import { deliverEmails } from "@/lib/orders/emails";
import { buildRequest, readRequestInput, requestEmails } from "@/lib/orders/requests";
import { saveRequest } from "@/lib/orders/store";
import { requestMessage } from "@/lib/requests";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * A tribute-frame request from the form. Saved (locally) or logged (live), emailed to the
 * studio when email is set up, and handed to WhatsApp, where the design and price are agreed.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 400 });
  }

  const input = readRequestInput(raw);
  // Bots fill the hidden "website" field; people never see it.
  if (input.website) return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 400 });

  const result = buildRequest(input, Date.now());
  if (!result.ok) return Response.json(result, { status: result.status });

  const frameRequest = result.request;
  await saveRequest(frameRequest);
  frameRequest.emailsSent = await deliverEmails(frameRequest.id, requestEmails(frameRequest));
  return Response.json({ ok: true, request: frameRequest, whatsappUrl: whatsappLink(requestMessage(frameRequest)) });
}
