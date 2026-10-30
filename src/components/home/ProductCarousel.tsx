import { Children, type ReactNode } from "react";

interface ProductCarouselProps {
  /** Accessible name for the list. */
  label: string;
  /** Heading block rendered on the left of the header row. */
  header: ReactNode;
  /** Usually a "View all" link, shown on the right of the header row. */
  action?: ReactNode;
  /** The product cards, one per item. */
  children: ReactNode;
}

/**
 * A titled block of product cards (New Arrivals, "You may also like"). It used to be a swipe
 * carousel; now every card shows at once (owner, 30 Oct 2026): two columns on phones and small
 * tablets, four from 768px, so eight pieces are 2×4 on a phone and 4×2 on a desktop. The grid
 * rises as one on wider screens (`.cards-reveal`), never card by card.
 */
export function ProductCarousel({ label, header, action, children }: ProductCarouselProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="min-w-0 max-w-2xl">{header}</div>
        {action}
      </div>
      <ul aria-label={label} className="cards-reveal mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-9 md:grid-cols-4 md:gap-x-6 md:gap-y-10">
        {Children.map(children, (child) => (
          <li className="min-w-0">{child}</li>
        ))}
      </ul>
    </div>
  );
}
