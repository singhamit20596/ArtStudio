import Image from "next/image";
import { T } from "@/i18n/T";

const POINTS = [
  { title: "Poured by hand", text: "Small batches, finished one piece at a time", hi: { title: "हाथ से ढाला गया", text: "थोड़ी-थोड़ी मात्रा में, एक-एक पीस तैयार" } },
  { title: "Made to order", text: "Names, dates, colours and your own keepsakes", hi: { title: "ऑर्डर पर तैयार", text: "नाम, तारीख़ें, रंग और आपकी अपनी यादगार चीज़ें" } },
  { title: "Shipped across India", text: "Packed with care, with Cash on Delivery", hi: { title: "पूरे भारत में डिलीवरी", text: "ध्यान से पैक, कैश ऑन डिलीवरी के साथ" } },
];

export function StoryBlock() {
  return (
    <section aria-labelledby="story-title" className="container-x py-20 md:py-28">
      <div className="reveal mx-auto max-w-2xl text-center">
        <Image src="/brand/logo.png" alt="" width={160} height={160} className="mx-auto h-20 w-20 rounded-full" />
        <p className="eyebrow mt-8">
          <T en="Our studio" hi="हमारा स्टूडियो" />
        </p>
        <h2 id="story-title" className="section-title mt-3">
          <T en="Every piece tells a story" hi="हर पीस एक कहानी कहता है" />
        </h2>
        <p className="mt-6 text-[15px] leading-[1.85] text-ink/80">
          <T
            en="Each piece begins as liquid resin, pigment and a few pressed flowers or keepsakes. We pour, set and finish everything by hand, so no two pieces are ever quite the same."
            hi="हर पीस की शुरुआत होती है तरल रेज़िन, रंग और कुछ दबाए हुए फूलों या यादगार चीज़ों से। हम सब कुछ हाथ से ढालते, जमाते और सजाते हैं, इसलिए कोई भी दो पीस बिल्कुल एक जैसे नहीं होते।"
          />
        </p>
        <p className="mt-4 text-[15px] leading-[1.85] text-ink/80">
          <T
            en="Resin takes its time to cure. That is why every product shows its own making time before it ships."
            hi="रेज़िन को जमने में समय लगता है। इसीलिए हर प्रोडक्ट पर भेजने से पहले बनने का अपना समय लिखा होता है।"
          />
        </p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-4xl gap-px border border-line bg-line sm:grid-cols-3">
        {POINTS.map((p) => (
          <li key={p.title} className="bg-sage px-6 py-7 text-center">
            <p className="nav-label">
              <T en={p.title} hi={p.hi.title} />
            </p>
            <p className="mt-2 text-[13px] text-muted">
              <T en={p.text} hi={p.hi.text} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
