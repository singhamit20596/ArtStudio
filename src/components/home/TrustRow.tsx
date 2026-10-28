import { Banknote, HandHeart, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { site } from "@/config/site";
import { formatINR } from "@/lib/format";

export function TrustRow() {
  const items = [
    { icon: HandHeart, title: "Handmade", text: "Poured and finished by hand" },
    { icon: Banknote, title: "Cash on Delivery", text: "Pay when your order arrives" },
    { icon: Truck, title: "Pan India Shipping", text: "Delivered across India" },
    site.payments.razorpayEnabled
      ? { icon: ShieldCheck, title: "Secure Payments", text: "UPI, cards and netbanking" }
      : {
          icon: PackageCheck,
          title: `Free shipping over ${formatINR(site.shipping.freeShippingThreshold)}`,
          text: `Flat ${formatINR(site.shipping.flatFee)} below that`,
        },
  ];

  return (
    <section aria-label="Why shop with us" className="border-b border-line">
      <ul className="container-x grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4 md:py-14">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col items-center gap-3 px-3 text-center">
            <Icon size={28} strokeWidth={1.3} className="text-brown" aria-hidden="true" />
            <p className="nav-label leading-snug">{title}</p>
            <p className="text-[12.5px] text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
