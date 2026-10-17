import Image from "next/image";

const POINTS = [
  { title: "Poured by hand", text: "Small batches, finished one piece at a time" },
  { title: "Made to order", text: "Names, dates, colours and your own keepsakes" },
  { title: "Shipped across India", text: "Packed with care, with Cash on Delivery" },
];

export function StoryBlock() {
  return (
    <section aria-labelledby="story-title" className="container-x py-20 md:py-28">
      <div className="reveal mx-auto max-w-2xl text-center">
        <Image src="/brand/logo.png" alt="" width={160} height={160} className="mx-auto h-20 w-20 rounded-full" />
        <p className="eyebrow mt-8">Our studio</p>
        <h2 id="story-title" className="section-title mt-3">
          Every piece tells a story
        </h2>
        <p className="mt-6 text-[15px] leading-[1.85] text-ink/80">
          Each piece begins as liquid resin, pigment and a few pressed flowers or keepsakes. We pour, set and finish everything by hand, so no two pieces are
          ever quite the same.
        </p>
        <p className="mt-4 text-[15px] leading-[1.85] text-ink/80">
          Resin takes its time to cure. That is why every product shows its own making time before it ships.
        </p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-4xl gap-px border border-line bg-line sm:grid-cols-3">
        {POINTS.map((p) => (
          <li key={p.title} className="bg-paper px-6 py-7 text-center">
            <p className="nav-label">{p.title}</p>
            <p className="mt-2 text-[13px] text-muted">{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
