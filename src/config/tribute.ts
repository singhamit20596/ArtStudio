/**
 * Content for the defence retirement tribute frame: the homepage, the preview and the
 * request form all read from here. Copy marked in TODO.md still needs the owner's check.
 */

export const services = [
  { id: "army", label: "Indian Army", short: "Army" },
  { id: "navy", label: "Indian Navy", short: "Navy" },
  { id: "air-force", label: "Indian Air Force", short: "Air Force" },
  { id: "other", label: "Another service", short: "Other" },
] as const;

export type ServiceId = (typeof services)[number]["id"];

export const serviceLabel = (id: string) => services.find((s) => s.id === id)?.label ?? "";

/** What can go into a frame. The request form offers these as checkboxes. */
export const frameItems = [
  { id: "medals", label: "Medals with ribbons" },
  { id: "badges", label: "Wings or badges" },
  { id: "insignia", label: "Rank insignia" },
  { id: "crests", label: "Unit crests or patches" },
  { id: "photo", label: "A photograph" },
  { id: "plate", label: "Engraved name plate" },
] as const;

export type FrameItemId = (typeof frameItems)[number]["id"];

/** The example frame shown on the homepage (an Indian Air Force retirement). */
export const exampleFrame = {
  image: "/products/box-frame/frame.jpg",
  /** A tighter landscape crop of the same photo for the "What goes inside" explorer. The hotspots below are placed on it. */
  detail: { image: "/products/box-frame/frame.jpg", ratio: "4 / 3" },
  alt: "Indian Air Force retirement shadow box on a sky-blue mount with medals, wings, crests, rank stripes, a photograph and a name plate",
  caption: "An Indian Air Force retirement frame",
  instagramUrl: "https://www.instagram.com/reel/DeRz5G_CBu0/",
};

/** Points on the explorer photo (`exampleFrame.detail`, percent of the image) for the "What goes inside" explorer. */
export const hotspots: { id: FrameItemId; x: number; y: number; title: string; text: string }[] = [
  { id: "crests", x: 79, y: 25, title: "Unit crests and patches", text: "Squadron, regiment or ship crests, given pride of place." },
  { id: "badges", x: 50, y: 44, title: "Wings and badges", text: "Wings, qualification badges and service emblems." },
  { id: "photo", x: 50, y: 61, title: "A photograph", text: "A portrait from their years in service, at the heart of the frame." },
  { id: "medals", x: 78, y: 54, title: "Medals", text: "Their own medals, mounted with the ribbons." },
  { id: "plate", x: 50, y: 77, title: "Engraved name plate", text: "Rank and name, engraved on a metal plate." },
  { id: "insignia", x: 78, y: 75, title: "Rank insignia", text: "Rank stripes or stars from the uniform." },
];

/** How an order works, step by step. {making} is replaced with the making time. */
export const processSteps = [
  { title: "Choose your tribute", text: "Pick the shadow box, newspaper or resin tribute, the size, and whether you'd like LED lights." },
  { title: "Pay securely", text: "Pay by UPI, or choose Cash on Delivery. Questions first? Ask us on WhatsApp and we reply right away." },
  { title: "Personalise it", text: "Choose a design, add the name and rank, upload photos of the officer and the medals, and pick the background colour." },
  { title: "Made by hand", text: "Every piece is placed and mounted by hand. Making takes about {making}." },
  { title: "Delivered across India", text: "Packed with care and shipped to your door, anywhere in India." },
];

/** Frequently asked questions. {price}, {making} and {freeShipping} are filled in by the page. */
export const faqs = [
  { q: "Which services do you make tributes for?", a: "Retirements from the Indian Army, Navy and Air Force. For another service, ask us on WhatsApp." },
  { q: "How do I order?", a: "Choose the tribute, its size and lights, and pay. Then we send you a link to personalise it: the design, name and rank, photos and background colour." },
  { q: "What does a tribute cost?", a: "Tributes start at {price}. The price depends on the type, the size and whether you add LED lights, and is shown before you pay." },
  { q: "How long does it take?", a: "About {making} to make once you have personalised it, then it ships anywhere in India." },
  { q: "Can you have it ready for a farewell date?", a: "Tell us the date when you personalise your tribute, or ask on WhatsApp before you order, and we will tell you straight away whether we can make it in time." },
  { q: "Do you deliver across India?", a: "Yes. We ship across India, and orders of {freeShipping} or more ship free." },
];

/**
 * Designs to choose from when personalising, per tribute (product slug). A design with an
 * `image` shows that photo; the others show a sketch drawn by TemplateThumb.
 */
export interface TributeTemplate {
  id: string;
  name: string;
  text: string;
  image?: string;
}

export const templates: Record<string, TributeTemplate[]> = {
  "box-frame": [
    { id: "sky-blue", name: "Sky blue", text: "Black frame on a sky-blue mount. Crests along the top, the photograph in the middle, medals and rank on the right.", image: "/products/box-frame/frame.jpg" },
    { id: "happy-retirement", name: "Happy Retirement", text: "Cream mount with a \"Happy Retirement\" title, the service name in an arch, patches all round and medals in a row.", image: "/products/box-frame/design-happy-retirement.jpg" },
    { id: "velvet-gold", name: "Velvet and gold", text: "Gold frame on red velvet. The name runs around the photograph, with wings and badges on each side.", image: "/products/box-frame/design-velvet-gold.jpg" },
  ],
  "newspaper-tribute": [
    { id: "front-page", name: "Front page", text: "A big headline, one large photograph and the story in columns.", image: "/products/newspaper-tribute/frame.jpg" },
    { id: "photo-story", name: "Photo story", text: "Up to six photographs from their career, each with a caption." },
    { id: "broadsheet", name: "Broadsheet", text: "A traditional broadsheet with a masthead and a framed portrait." },
  ],
  "resin-frame": [
    { id: "rectangle", name: "Rectangle", text: "A clear block with the photograph and keepsakes side by side." },
    { id: "arch", name: "Arch", text: "An arched top framing the portrait, keepsakes below." },
    { id: "round", name: "Round", text: "A round piece with a broken-edge rim, the portrait in a circle and the crest beside it.", image: "/products/resin-frame/frame.jpg" },
  ],
};

/** Background (mount) colours customers can choose. These are product colours, not site colours. */
export const backgrounds = [
  { id: "army-green", label: "Army green", swatch: "#4b5320" },
  { id: "navy-blue", label: "Navy blue", swatch: "#1f2a44" },
  { id: "air-force-blue", label: "Air Force blue", swatch: "#5d8aa8" },
  { id: "maroon", label: "Maroon", swatch: "#6b1e2e" },
  { id: "black", label: "Black", swatch: "#141414" },
  { id: "ivory", label: "Ivory", swatch: "#efe7d4" },
] as const;

/** Short line under each tribute on the homepage cards. */
export const tributeTaglines: Record<string, string> = {
  "newspaper-tribute": "Their career as a front page, with their photograph and story.",
  "box-frame": "Their medals, badges and photograph, with an engraved name plate.",
  "resin-frame": "Their photograph and crest, set by hand in resin.",
};
