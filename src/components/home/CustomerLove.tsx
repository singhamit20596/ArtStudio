import { site } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Review cards. Real reviews and customer photos come from the Instagram
 * "Order+review" highlight; until they are added these slots stay clearly marked
 * as placeholders (no invented reviews).
 */
const reviews: { name: string; city: string; product: string; text: string; photo: string | null }[] = [];

const PLACEHOLDER_SLOTS = 3;

export function CustomerLove() {
  return (
    <section aria-labelledby="love-title" className="bg-blush-soft">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          id="love-title"
          eyebrow="Customer love"
          title="From our customers"
          subtitle="Real orders and reviews, shared on our Instagram."
          action={
            <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="nav-label link-line">
              See reviews on Instagram
            </a>
          }
        />

        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {reviews.length > 0
            ? reviews.map((r) => (
                <li key={r.name} className="reveal bg-paper p-7">
                  <p className="text-[15px] leading-relaxed">“{r.text}”</p>
                  <p className="mt-5 text-[13px] font-medium">
                    {r.name}, {r.city}
                  </p>
                  <p className="text-[12px] text-muted">{r.product}</p>
                </li>
              ))
            : Array.from({ length: PLACEHOLDER_SLOTS }, (_, i) => (
                <li key={i} className="reveal flex flex-col border border-dashed border-gold-ink/40 bg-paper/70 p-7">
                  <div className="flex items-center gap-4">
                    <span className="mount block h-[72px] w-[60px] shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">Customer name, city</p>
                      <p className="text-[12px] text-muted">Product they ordered</p>
                    </div>
                  </div>
                  <p className="mt-6 flex-1 text-[14px] leading-relaxed text-muted">
                    A real review and customer photo from the Order+review highlight on Instagram goes here.
                  </p>
                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-ink">Review slot {i + 1} · to be added</p>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
