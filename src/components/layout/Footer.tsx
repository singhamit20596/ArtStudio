import { launch } from "@/config/launch";
import { footerNav, launchFooterNav } from "@/config/nav";
import { site } from "@/config/site";
import { AppLink } from "@/components/ui/AppLink";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="surface-brown">
      <div className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-[1.1fr_2fr]">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-6 text-[13.5px] leading-relaxed text-muted">{site.bio} Pan India shipping from our studio.</p>

          <dl className="mt-8 grid gap-4 text-[13.5px]">
            <div>
              <dt className="eyebrow">WhatsApp orders</dt>
              <dd className="mt-1">
                <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="link-grow inline-flex items-center gap-2">
                  <WhatsAppIcon size={15} /> {site.contact.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1 select-all break-all">
                <a href={`mailto:${site.contact.email}`} className="link-grow">
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-1 text-muted">{site.contact.hours ?? "Message us on WhatsApp any time; we reply as soon as we can."}</dd>
            </div>
          </dl>

          <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-[13px] text-ink hover:underline">
            <InstagramIcon size={18} /> {site.social.instagramHandle}
          </a>
        </div>

        <nav aria-label="Footer" className={launch.shop ? "grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4" : "grid grid-cols-2 gap-x-8 gap-y-10 lg:justify-self-end lg:gap-x-20"}>
          {(launch.shop ? footerNav : launchFooterNav).map((col) => (
            <div key={col.title}>
              <p className="nav-label text-ink">{col.title}</p>
              <ul className="mt-5 grid gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <AppLink href={l.href} className="link-grow text-[13.5px] text-muted transition-colors hover:text-ink">
                      {l.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-[12px] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {site.name} · {site.tagline}. Handmade in India.
          </p>
          <p>
            {launch.shop
              ? `Cash on Delivery · ${site.payments.razorpayEnabled ? "UPI, cards & netbanking" : site.payments.onlineComingSoonLabel} · Prices include taxes`
              : "Made to order · Pan India delivery · Prices include taxes"}
          </p>
        </div>
      </div>
    </footer>
  );
}
