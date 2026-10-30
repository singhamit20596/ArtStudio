/*
 * Hindi for the Retirement Gifts (tribute) copy in src/config/tribute.ts and the step titles in
 * src/lib/personalise.ts and requests.ts, keyed by id (or by the English step title).
 * Text written in the tribute components sits next to its English there: <T en="…" hi="…" />.
 * `{making}`, `{price}` and `{freeShipping}` are filled in by the component, as in the English.
 */

/** src/config/tribute.ts, by id. */
export const servicesHi: Record<string, { label: string; short: string }> = {
  army: { label: "भारतीय थल सेना", short: "थल सेना" },
  navy: { label: "भारतीय नौसेना", short: "नौसेना" },
  "air-force": { label: "भारतीय वायु सेना", short: "वायु सेना" },
  other: { label: "कोई और सेवा", short: "अन्य" },
};

export const frameItemsHi: Record<string, string> = {
  medals: "रिबन के साथ मेडल",
  badges: "विंग्स या बैज",
  insignia: "रैंक इंसिग्निया",
  crests: "यूनिट क्रेस्ट या पैच",
  photo: "एक तस्वीर",
  plate: "खुदी हुई नेम प्लेट",
};

export const hotspotsHi: Record<string, { title: string; text: string }> = {
  crests: { title: "यूनिट क्रेस्ट और पैच", text: "स्क्वाड्रन, रेजिमेंट या जहाज़ के क्रेस्ट, सबसे ख़ास जगह पर।" },
  badges: { title: "विंग्स और बैज", text: "विंग्स, योग्यता बैज और सेवा के प्रतीक।" },
  photo: { title: "एक तस्वीर", text: "सेवा के दिनों की एक तस्वीर, फ़्रेम के बीचोंबीच।" },
  medals: { title: "मेडल", text: "उनके अपने मेडल, रिबन के साथ लगाए गए।" },
  plate: { title: "खुदी हुई नेम प्लेट", text: "रैंक और नाम, धातु की प्लेट पर खुदे हुए।" },
  insignia: { title: "रैंक इंसिग्निया", text: "वर्दी से रैंक की पट्टियाँ या सितारे।" },
};

/** processSteps, in the same order. */
export const processStepsHi: { title: string; text: string }[] = [
  { title: "अपना ट्रिब्यूट चुनें", text: "शैडो बॉक्स, न्यूज़पेपर या रेज़िन ट्रिब्यूट और उसका साइज़ चुनें, और बताएँ कि LED लाइटें चाहिए या नहीं।" },
  { title: "सुरक्षित भुगतान करें", text: "UPI से भुगतान करें या कैश ऑन डिलीवरी चुनें। पहले कुछ पूछना है? WhatsApp पर पूछें, हम तुरंत जवाब देते हैं।" },
  { title: "अपने हिसाब से सजाएँ", text: "डिज़ाइन चुनें, नाम और रैंक लिखें, अफ़सर और मेडल की फ़ोटो अपलोड करें, और बैकग्राउंड का रंग चुनें।" },
  { title: "हाथ से तैयार", text: "हर चीज़ हाथ से सजाई और लगाई जाती है। बनने में लगभग {making} लगते हैं।" },
  { title: "पूरे भारत में डिलीवरी", text: "ध्यान से पैक करके भारत में कहीं भी आपके दरवाज़े तक भेजा जाता है।" },
];

/** faqs, in the same order. */
export const faqsHi: { q: string; a: string }[] = [
  { q: "आप किन सेवाओं के लिए ट्रिब्यूट बनाते हैं?", a: "भारतीय थल सेना, नौसेना और वायु सेना के सैन्य कर्मियों के रिटायरमेंट के लिए। किसी और सेवा के लिए WhatsApp पर पूछें।" },
  { q: "ऑर्डर कैसे करूँ?", a: "ट्रिब्यूट, उसका साइज़ और लाइटें चुनें, और भुगतान करें। फिर हम आपको उसे पर्सनलाइज़ करने का लिंक भेजते हैं: डिज़ाइन, नाम और रैंक, फ़ोटो और बैकग्राउंड का रंग।" },
  { q: "ट्रिब्यूट की कीमत क्या है?", a: "ट्रिब्यूट {price} से शुरू होते हैं। कीमत प्रकार, साइज़ और LED लाइटों पर निर्भर करती है, और भुगतान से पहले दिखाई जाती है।" },
  { q: "बनने में कितना समय लगता है?", a: "पर्सनलाइज़ करने के बाद बनने में लगभग {making} लगते हैं, फिर इसे भारत में कहीं भी भेजा जाता है।" },
  { q: "क्या यह विदाई समारोह की तारीख़ तक तैयार हो सकता है?", a: "पर्सनलाइज़ करते समय तारीख़ बताएँ, या ऑर्डर से पहले WhatsApp पर पूछें, हम तुरंत बता देंगे कि समय पर बना पाएँगे या नहीं।" },
  { q: "क्या आप पूरे भारत में डिलीवरी करते हैं?", a: "हाँ। हम पूरे भारत में भेजते हैं, और {freeShipping} या उससे ज़्यादा के ऑर्डर पर डिलीवरी मुफ़्त है।" },
];

/** templates, by product slug and template id. */
export const templatesHi: Record<string, Record<string, { name: string; text: string }>> = {
  "box-frame": {
    "sky-blue": { name: "आसमानी नीला", text: "आसमानी नीले माउंट पर काला फ़्रेम। ऊपर क्रेस्ट, बीच में तस्वीर, दाईं ओर मेडल और रैंक।" },
    "happy-retirement": { name: "हैप्पी रिटायरमेंट", text: "क्रीम माउंट, ऊपर \"Happy Retirement\" शीर्षक, मेहराब में सेवा का नाम, चारों ओर पैच और एक कतार में मेडल।" },
    "velvet-gold": { name: "वेलवेट और सुनहरा", text: "लाल वेलवेट पर सुनहरा फ़्रेम। तस्वीर के चारों ओर नाम, दोनों तरफ़ विंग्स और बैज।" },
  },
  "newspaper-tribute": {
    "front-page": { name: "पहला पन्ना", text: "बड़ी हेडलाइन, एक बड़ी तस्वीर और कॉलम में कहानी।" },
    "photo-story": { name: "फ़ोटो स्टोरी", text: "उनके करियर की छह तक तस्वीरें, हर एक के साथ कैप्शन।" },
    broadsheet: { name: "ब्रॉडशीट", text: "मास्टहेड और फ़्रेम की हुई तस्वीर के साथ पुराने अंदाज़ का बड़ा अख़बार।" },
  },
  "resin-frame": {
    rectangle: { name: "आयताकार", text: "तस्वीर और यादगार चीज़ें साथ-साथ, एक साफ़ ब्लॉक में।" },
    arch: { name: "मेहराब", text: "ऊपर मेहराब के आकार में तस्वीर, नीचे यादगार चीज़ें।" },
    round: { name: "गोल", text: "टूटे किनारे वाली गोल रिम, गोले में तस्वीर और पास में क्रेस्ट।" },
  },
};

export const backgroundsHi: Record<string, string> = {
  "army-green": "आर्मी ग्रीन",
  "navy-blue": "नेवी ब्लू",
  "air-force-blue": "एयर फ़ोर्स ब्लू",
  maroon: "मैरून",
  black: "काला",
  ivory: "आइवरी",
};

export const tributeTaglinesHi: Record<string, string> = {
  "newspaper-tribute": "उनका करियर अख़बार के पहले पन्ने पर, उनकी तस्वीर और कहानी के साथ।",
  "box-frame": "उनके मेडल, बैज और तस्वीर, खुदी हुई नेम प्लेट के साथ।",
  "resin-frame": "उनकी तस्वीर और क्रेस्ट, हाथ से रेज़िन में सजाए गए।",
};

/** Step titles: PERSONALISE_STEPS (src/lib/personalise.ts) and REQUEST_STEPS (src/lib/requests.ts). */
export const stepTitlesHi: Record<string, string> = {
  Design: "डिज़ाइन",
  "Name plate": "नेम प्लेट",
  Photos: "फ़ोटो",
  Colour: "रंग",
  "Anything else": "कुछ और",
  Service: "सेवा",
  "The officer": "अफ़सर",
  "The frame": "फ़्रेम",
  "Your details": "आपकी जानकारी",
};
