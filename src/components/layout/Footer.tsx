import { footerNav } from "@/config/nav";
import { site } from "@/config/site";
import { AppLink } from "@/components/ui/AppLink";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-[1.1fr_2fr]">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-6 text-[13.5px] leading-relaxed text-white/70">{site.bio} Pan India shipping from our studio.</p>

          <dl className="mt-8 grid gap-4 text-[13.5px]">
            <div>
              <dt className="eyebrow !text-gold">WhatsApp orders</dt>
              <dd className="mt-1">
                <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="link-grow inline-flex items-center gap-2">
                  <WhatsAppIcon size={15} /> {site.contact.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow !text-gold">Email</dt>
              <dd className="mt-1 select-all break-all">
                <a href={`mailto:${site.contact.email}`} className="link-grow">
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow !text-gold">Hours</dt>
              <dd className="mt-1 text-white/70">{site.contact.hours ?? "Message us on WhatsApp any time; we reply as soon as we can."}</dd>
            </div>
          </dl>

          <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-[13px] text-white/85 hover:text-white">
            <InstagramIcon size={18} /> {site.social.instagramHandle}
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {footerNav.map((col) => (
            <div key={col.title}>
              <p className="nav-label text-white">{col.title}</p>
              <ul className="mt-5 grid gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <AppLink href={l.href} className="link-grow text-[13.5px] text-white/70 transition-colors hover:text-white">
                      {l.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/12">
        <div className="container-x flex flex-col gap-3 py-6 text-[12px] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {site.name} · {site.tagline}. Handmade in India.
          </p>
          <p>
            Cash on Delivery · {site.payments.razorpayEnabled ? "UPI, cards & netbanking" : site.payments.onlineComingSoonLabel} · Prices include taxes
          </p>
        </div>
      </div>
    </footer>
  );
}
