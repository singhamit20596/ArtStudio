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
  image: "/products/iaf-retirement-tribute-frame/1.jpg",
  alt: "Indian Air Force retirement shadow box with medals, wings, crests, rank stripes, a photograph and a name plate",
  caption: "An Indian Air Force retirement frame",
  instagramUrl: "https://www.instagram.com/reel/DeRz5G_CBu0/",
};

/** Points on the example photo (percent of the image) for the "What goes inside" explorer. */
export const hotspots: { id: FrameItemId; x: number; y: number; title: string; text: string }[] = [
  { id: "crests", x: 81, y: 42, title: "Unit crests and patches", text: "Squadron, regiment or ship crests, given pride of place." },
  { id: "badges", x: 53, y: 42, title: "Wings and badges", text: "Wings, qualification badges and service emblems." },
  { id: "photo", x: 50, y: 53, title: "A photograph", text: "A portrait from their years in service, at the heart of the frame." },
  { id: "medals", x: 75, y: 57, title: "Medals", text: "Their own medals, mounted with the ribbons." },
  { id: "plate", x: 47, y: 62, title: "Engraved name plate", text: "Rank and name, engraved on a metal plate." },
  { id: "insignia", x: 74, y: 67, title: "Rank insignia", text: "Rank stripes or stars from the uniform." },
];

/** How an order works, step by step. {making} is replaced with the making time. */
export const processSteps = [
  { title: "Send a request", text: "Tell us the service, rank and name, and what should go inside. It takes about two minutes." },
  { title: "Plan it together on WhatsApp", text: "We reply with the layout and the final price. Share photos of the medals and the photograph in the chat." },
  { title: "Made by hand", text: "Every piece is placed and mounted by hand. Making takes about {making}." },
  { title: "Delivered across India", text: "Packed with care and shipped to your door, anywhere in India." },
];

/** Frequently asked questions. {price} and {making} are filled in from the catalogue. */
export const faqs = [
  { q: "Which services do you make frames for?", a: "Retirements from the Indian Army, Navy and Air Force. For another service, send a request and tell us about it." },
  {
    q: "What goes into a frame?",
    a: "Usually the officer's medals, wings or badges, unit crests, rank insignia, a photograph and an engraved name plate. Tell us what you have and we plan the layout around it.",
  },
  { q: "How much does a frame cost?", a: "Frames start at {price}. The final price depends on the size and what goes inside, and we confirm it on WhatsApp before we start." },
  { q: "How long does it take?", a: "About {making} to make, then it ships anywhere in India." },
  { q: "Can you have it ready for a farewell date?", a: "Add the date you need it by in your request and we will tell you straight away whether we can make it in time." },
  { q: "Do you deliver across India?", a: "Yes. We ship across India, and orders of {freeShipping} or more ship free." },
];
