import { slugify } from "@/lib/product";

/*
 * Hindi names for the catalogue, small enough for the browser (cards, cart, search, filters).
 * Keyed by slug, so English edits in seed.json do not break them; a new product or category
 * without an entry here simply shows its English name in Hindi mode.
 * Longer catalogue copy (descriptions, highlights, care) is in catalogue.ts, used on the server.
 *
 * Product names keep the English "Name | Material | Size" shape so shortName() works on them.
 */

export const productNames: Record<string, string> = {
  // Pooja & festive, trays, keychains, wall décor
  "shubh-labh-toran": "शुभ लाभ तोरण | रेज़िन डोर हैंगिंग | जोड़ी",
  "blush-agate-resin-tray": "ब्लश अगेट | रेज़िन सर्विंग ट्रे",
  "rose-marble-resin-tray": "रोज़ मार्बल | रेज़िन सर्विंग ट्रे",
  "karwa-chauth-chalni-thali-set": "करवा चौथ छलनी और थाली सेट | रेज़िन",
  "lal-pooja-thali": "लाल पूजा थाली | सुनहरी पत्तियों वाली रेज़िन",
  "resin-alphabet-letters": "रेज़िन अक्षर (A–Z) | रेज़िन | एक अक्षर या सेट",
  "botanical-initial-keychain": "फूलों वाला अक्षर कीचेन | रेज़िन",
  "marble-noir-wall-clock": "मार्बल नोयर | रेज़िन दीवार घड़ी",

  // Retirement gifts
  "newspaper-tribute": "न्यूज़पेपर ट्रिब्यूट | फ़्रेम में अख़बार का पहला पन्ना",
  "box-frame": "बॉक्स फ़्रेम | मेडल, फ़ोटो और नेम प्लेट",
  "resin-frame": "रेज़िन फ़्रेम | रेज़िन में फ़ोटो और क्रेस्ट",

  // Custom pieces
  "birthday-shadow-box-led": "जन्मदिन शैडो बॉक्स | LED लाइट वाला",
  "memory-photo-frame-easel": "मेमोरी फ़ोटो फ़्रेम | स्टैंड के साथ रेज़िन",
  "resin-photo-blocks-magnets": "फ़ोटो ब्लॉक और फ़्रिज मैग्नेट | रेज़िन",

  // Christmas
  "holo-christmas-tree": "होलोग्राफ़िक क्रिसमस ट्री | रेज़िन",
  "marble-reindeer-ornament": "मार्बल रेनडियर ऑर्नामेंट | रेज़िन",
  "candy-cane-christmas-coaster": "कैंडी केन क्रिसमस कोस्टर | रेज़िन",
  "stocking-keychain": "क्रिसमस मोज़ा कीचेन | रेज़िन",
  "santa-reindeer-plaque": "सांता और रेनडियर प्लाक | स्टैंड के साथ रेज़िन",
  "christmas-dome-magnet": "क्रिसमस डोम मैग्नेट | रेज़िन",
  "snowflake-coaster": "स्नोफ़्लेक कोस्टर | रेज़िन",
  "christmas-disc-ornament": "क्रिसमस डिस्क ऑर्नामेंट | रेज़िन",
  "merry-christmas-coaster": "मेरी क्रिसमस कोस्टर | रेज़िन",
  "glitter-tree-canvas": "ग्लिटर क्रिसमस ट्री कैनवस | रेज़िन",
  "melted-snowman-coaster": "पिघलता स्नोमैन कोस्टर | रेज़िन",
  "candy-cane-hexagon-coaster": "कैंडी केन हेक्सागन कोस्टर | रेज़िन",
  "sea-glass-tree-ornament": "ग्लिटर ट्री ऑर्नामेंट | रेज़िन",

  // Diwali
  "ganesh-lakshmi-gift-box": "गणेश लक्ष्मी गिफ़्ट बॉक्स | रेज़िन",
  "shubh-labh-candle-gift-box": "शुभ लाभ और कैंडल गिफ़्ट बॉक्स",
  "pink-shubh-labh-gift-box": "गुलाबी शुभ लाभ गिफ़्ट बॉक्स | रेज़िन",
  "pink-lotus-pooja-set": "गुलाबी कमल पूजा सेट | रेज़िन",
  "lotus-pearl-pooja-thali": "कमल मोती पूजा थाली | रेज़िन",
  "peacock-feather-pooja-thali": "मोरपंख पूजा थाली | रेज़िन",
  "namokar-mantra-thali": "णमोकार मंत्र पूजा थाली | रेज़िन",
  "shubh-labh-hangings": "शुभ लाभ हैंगिंग | रेज़िन | जोड़ी",
  "ganesh-lakshmi-shubh-labh": "गणेश लक्ष्मी शुभ लाभ | रेज़िन | जोड़ी",
  "lotus-tealight-holder": "कमल टी-लाइट होल्डर | रेज़िन",
  "krishna-mantra-led-plaque": "कृष्ण मंत्र LED प्लाक | स्टैंड के साथ रेज़िन",
  "ganesha-rose-petal-plaque": "गणेश गुलाब पंखुड़ी प्लाक | स्टैंड के साथ रेज़िन",
  "radha-krishna-frame": "राधा कृष्ण फ़्रेम | स्टैंड के साथ रेज़िन",

  // Car gifts
  "hot-wheels-smoke-frame": "Hot Wheels स्मोक फ़्रेम | रेज़िन",
  "bmw-m-smoke-frame": "BMW M स्मोक फ़्रेम | रेज़िन",
  "hot-wheels-tyre-track-frame": "Hot Wheels टायर ट्रैक फ़्रेम | रेज़िन",
  "hot-wheels-twin-drift-frame": "Hot Wheels ट्विन ड्रिफ़्ट शैडो बॉक्स | रेज़िन",
  "three-cars-spotlight-frame": "तीन कारें स्पॉटलाइट फ़्रेम | रेज़िन",
  "ferrari-flame-burnout-frame": "Ferrari फ़्लेम बर्नआउट फ़्रेम | रेज़िन",
  "ferrari-racing-stripe-canvas": "Ferrari रेसिंग स्ट्राइप कैनवस | रेज़िन",
  "bmw-drift-smoke-canvas": "BMW M760Li ड्रिफ़्ट कैनवस | रेज़िन",
  "pagani-ocean-wave-canvas": "Pagani ओशन वेव कैनवस | रेज़िन",
  "emerald-splash-car-board": "एमराल्ड स्प्लैश कार बोर्ड | रेज़िन",
  "vintage-car-wheat-canvas": "Zaporozhets विंटेज कार कैनवस | रेज़िन",
  "harley-davidson-plaque": "Harley-Davidson मोटरबाइक प्लाक | रेज़िन",
  "tyre-display-shelf": "LED वाली टायर डिस्प्ले शेल्फ़",
};

export const categoryNames: Record<string, string> = {
  "trays-coasters": "ट्रे और कोस्टर",
  "pooja-festive": "पूजा और त्योहार",
  "wall-decor": "दीवार की सजावट",
  "keychains-accessories": "कीचेन और एक्सेसरीज़",
  "diwali-decor-gifts": "दिवाली सजावट और तोहफ़े",
  "christmas-decor-gifts": "क्रिसमस सजावट और तोहफ़े",
  "car-gifts": "रेज़िन कार गिफ़्ट्स",
  "retirement-tribute-frames": "रिटायरमेंट गिफ़्ट्स",
  "resin-trays": "रेज़िन ट्रे",
  "fridge-magnets": "फ़्रिज मैग्नेट",
  "phone-covers": "फ़ोन कवर",
  "shadow-boxes": "पर्सनलाइज़्ड शैडो बॉक्स",
  "resin-photo-frames": "रेज़िन फ़ोटो फ़्रेम",
  "name-plates": "नेम प्लेट",
  "flower-preservation": "फूलों को सहेजना",
  "initial-keychains": "अक्षर और नाम वाले कीचेन",
  "wall-clocks": "दीवार घड़ियाँ",
  "resin-jewellery": "रेज़िन ज्वेलरी",
  "pet-memorials": "पालतू की यादगार",
  "rakhi-festive-customs": "राखी और त्योहारों के लिए कस्टम",
  "resin-rangoli": "रेज़िन रंगोली",
  "bookmarks-coasters-desk": "बुकमार्क, कोस्टर सेट और डेस्क ऑर्गनाइज़र",
};

export const occasionNames: Record<string, string> = {
  retirement: "रिटायरमेंट",
  birthday: "जन्मदिन",
  anniversary: "सालगिरह",
  wedding: "शादी",
  housewarming: "गृह प्रवेश",
  diwali: "दिवाली",
  "karwa-chauth": "करवा चौथ",
  "raksha-bandhan": "रक्षा बंधन",
  "corporate-gifting": "कॉर्पोरेट गिफ़्टिंग",
};

/** Sub-categories, keyed by slugify(subcategory) as the listing filter does. */
export const subcategoryNames: Record<string, string> = {
  "torans-door-hangings": "तोरण और डोर हैंगिंग",
  trays: "ट्रे",
  "newspaper-frames": "न्यूज़पेपर फ़्रेम",
  "box-frames": "बॉक्स फ़्रेम",
  "resin-frames": "रेज़िन फ़्रेम",
  "karwa-chauth": "करवा चौथ",
  "pooja-thalis": "पूजा थाली",
  birthday: "जन्मदिन",
  letters: "अक्षर",
  keychains: "कीचेन",
  "wall-clocks": "दीवार घड़ियाँ",
  ornaments: "ऑर्नामेंट",
  coasters: "कोस्टर",
  "gifts-decor": "तोहफ़े और सजावट",
  "gift-boxes-sets": "गिफ़्ट बॉक्स और सेट",
  "shubh-labh-hangings": "शुभ लाभ हैंगिंग",
  "tealight-holders": "टी-लाइट होल्डर",
  "plaques-frames": "प्लाक और फ़्रेम",
  frames: "फ़्रेम",
  canvases: "कैनवस",
  "plaques-displays": "प्लाक और डिस्प्ले",
};

/** Variant names and choices as shown on buttons and cart lines (the stored values stay English). */
export const variantNames: Record<string, string> = {
  Letter: "अक्षर",
  Style: "स्टाइल",
  Design: "डिज़ाइन",
  Colour: "रंग",
  Size: "साइज़",
};

export const variantOptions: Record<string, string> = {
  "Photo block": "फ़ोटो ब्लॉक",
  "Fridge magnet": "फ़्रिज मैग्नेट",
  Santa: "सांता",
  Snowman: "स्नोमैन",
  "Christmas tree": "क्रिसमस ट्री",
  "Red house": "लाल घर",
  Red: "लाल",
  Green: "हरा",
  Blue: "नीला",
  Gold: "सुनहरा",
  Silver: "सिल्वर",
  Purple: "बैंगनी",
  Pink: "गुलाबी",
  "With LED lights": "LED लाइटों के साथ",
  "Without lights": "बिना लाइट",
};

/** Full Hindi product name ("Name | Material | Size"), or undefined if there is none yet. */
export const hiProductName = (slug: string): string | undefined => productNames[slug];

/** "शुभ लाभ तोरण | रेज़िन डोर हैंगिंग | जोड़ी" → "शुभ लाभ तोरण" */
export const hiShortName = (slug: string): string | undefined => productNames[slug]?.split(" | ")[0];

export const hiCategory = (slug: string): string | undefined => categoryNames[slug];
export const hiOccasion = (slug: string): string | undefined => occasionNames[slug];
export const hiSubcategory = (name: string | null | undefined): string | undefined => (name ? subcategoryNames[slugify(name)] : undefined);

/** A listing filter slug (category, occasion or sub-category) in Hindi. */
export const hiListingLabel = (slug: string): string | undefined => categoryNames[slug] ?? occasionNames[slug] ?? subcategoryNames[slug];

/**
 * A cart line's chosen options in Hindi: "Letter: M, Colour: Red" → "अक्षर: M, रंग: लाल";
 * "16 × 20 in · With LED lights" → "16 × 20 इंच · LED लाइटों के साथ". Unknown words stay English.
 */
export function hiVariant(text: string | null | undefined): string | undefined {
  if (!text) return undefined;
  const part = (p: string) => {
    const [name, choice] = p.split(": ");
    if (choice != null) return `${variantNames[name] ?? name}: ${variantOptions[choice] ?? choice}`;
    return variantOptions[p] ?? p.replace(/(\d)\s*in$/, "$1 इंच");
  };
  return text
    .split(" · ")
    .map((seg) => seg.split(", ").map(part).join(", "))
    .join(" · ");
}

/** Indian states and union territories (the form keeps the English value). */
export const stateNames: Record<string, string> = {
  "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीपसमूह",
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  Assam: "असम",
  Bihar: "बिहार",
  Chandigarh: "चंडीगढ़",
  Chhattisgarh: "छत्तीसगढ़",
  "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली और दमन और दीव",
  Delhi: "दिल्ली",
  Goa: "गोवा",
  Gujarat: "गुजरात",
  Haryana: "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  "Jammu and Kashmir": "जम्मू और कश्मीर",
  Jharkhand: "झारखंड",
  Karnataka: "कर्नाटक",
  Kerala: "केरल",
  Ladakh: "लद्दाख",
  Lakshadweep: "लक्षद्वीप",
  "Madhya Pradesh": "मध्य प्रदेश",
  Maharashtra: "महाराष्ट्र",
  Manipur: "मणिपुर",
  Meghalaya: "मेघालय",
  Mizoram: "मिज़ोरम",
  Nagaland: "नागालैंड",
  Odisha: "ओडिशा",
  Puducherry: "पुडुचेरी",
  Punjab: "पंजाब",
  Rajasthan: "राजस्थान",
  Sikkim: "सिक्किम",
  "Tamil Nadu": "तमिलनाडु",
  Telangana: "तेलंगाना",
  Tripura: "त्रिपुरा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  Uttarakhand: "उत्तराखंड",
  "West Bengal": "पश्चिम बंगाल",
};

/** How an order is paid (PAYMENT_LABELS in src/lib/checkout.ts). */
export const paymentNames: Record<string, string> = {
  cod: "कैश ऑन डिलीवरी",
  online: "ऑनलाइन भुगतान (Razorpay)",
  whatsapp: "WhatsApp पर ऑर्डर",
  upi: "UPI",
};

/** Search overlay items and links with their Hindi names added on the server (src/i18n/server.ts). */
export interface SearchHindi {
  nameHi?: string;
  categoryHi?: string;
}
export interface LinkHindi {
  hi?: string;
}

/** "Category", "Custom", "Occasion" (SearchLink.kind) in Hindi. */
export const linkKinds: Record<string, string> = { Category: "कैटेगरी", Custom: "कस्टम", Occasion: "मौक़ा" };

/** POPULAR_SEARCHES (src/lib/search.ts) in Hindi; in Hindi mode a tap searches the Hindi words. */
export const popularSearches: Record<string, string> = {
  "Tribute frame": "ट्रिब्यूट फ़्रेम",
  "Pooja thali": "पूजा थाली",
  "Wall clock": "दीवार घड़ी",
  Keychain: "कीचेन",
  "Karwa Chauth": "करवा चौथ",
  "Shadow box": "शैडो बॉक्स",
};

/* Listing filters and sorting (src/lib/listing.ts, components/listing). */
export const sortLabels: Record<string, string> = {
  featured: "ख़ास चीज़ें पहले",
  newest: "सबसे नए",
  "price-asc": "कीमत: कम से ज़्यादा",
  "price-desc": "कीमत: ज़्यादा से कम",
  bestselling: "सबसे ज़्यादा बिकने वाले",
  // defaultSortLabel on the search page
  "Best match": "सबसे सही नतीजे",
};
export const typeLabels: Record<string, string> = { ready: "भेजने के लिए तैयार", custom: "ऑर्डर पर तैयार" };
export const colourLabels: Record<string, string> = {
  red: "लाल",
  pink: "गुलाबी",
  gold: "सुनहरा",
  green: "हरा",
  teal: "टील",
  blue: "नीला",
  white: "सफ़ेद",
  black: "काला",
  clear: "पारदर्शी",
  multicolour: "रंग-बिरंगा",
};
export const facetLegends: Record<string, string> = {
  category: "कैटेगरी",
  sub: "कैटेगरी",
  type: "तैयार या ऑर्डर पर",
  occasion: "मौक़ा",
  price: "कीमत",
  colour: "रंग",
  stock: "उपलब्धता",
};
