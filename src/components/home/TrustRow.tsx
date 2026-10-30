import { Banknote, HandHeart, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { site } from "@/config/site";
import { formatINR } from "@/lib/format";
import { T } from "@/i18n/T";

export function TrustRow() {
  const items = [
    { icon: HandHeart, title: "Handmade", text: "Poured and finished by hand", hi: { title: "हाथ से बना", text: "हाथ से ढाला और सजाया गया" } },
    { icon: Banknote, title: "Cash on Delivery", text: "Pay when your order arrives", hi: { title: "कैश ऑन डिलीवरी", text: "ऑर्डर पहुँचने पर भुगतान करें" } },
    { icon: Truck, title: "Pan India Shipping", text: "Delivered across India", hi: { title: "पूरे भारत में डिलीवरी", text: "भारत में कहीं भी पहुँचाते हैं" } },
    site.payments.razorpayEnabled
      ? { icon: ShieldCheck, title: "Secure Payments", text: "UPI, cards and netbanking", hi: { title: "सुरक्षित भुगतान", text: "UPI, कार्ड और नेटबैंकिंग" } }
      : {
          icon: PackageCheck,
          title: `Free shipping over ${formatINR(site.shipping.freeShippingThreshold)}`,
          text: `Flat ${formatINR(site.shipping.flatFee)} below that`,
          hi: {
            title: `${formatINR(site.shipping.freeShippingThreshold)} से ऊपर डिलीवरी मुफ़्त`,
            text: `उससे कम पर सिर्फ़ ${formatINR(site.shipping.flatFee)}`,
          },
        },
  ];

  return (
    <section aria-label="Why shop with us" className="border-b border-line">
      <ul className="container-x grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4 md:py-14">
        {items.map(({ icon: Icon, title, text, hi }) => (
          <li key={title} className="flex flex-col items-center gap-3 px-3 text-center">
            <Icon size={28} strokeWidth={1.3} className="text-brown" aria-hidden="true" />
            <p className="nav-label leading-snug">
              <T en={title} hi={hi.title} />
            </p>
            <p className="text-[12.5px] text-muted">
              <T en={text} hi={hi.text} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
