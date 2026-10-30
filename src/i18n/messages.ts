/*
 * Hindi for form errors and order messages. They are made in shared code and on the server
 * (src/lib/checkout.ts, coupons.ts, personalise.ts, requests.ts, orders/build.ts, the API routes)
 * and arrive in English, so the browser looks them up here by their English text.
 * Unknown messages show in English.
 */

const exact: Record<string, string> = {
  // Checkout form (src/lib/checkout.ts)
  "Please enter your full name.": "कृपया अपना पूरा नाम लिखें।",
  "Please enter a 10-digit mobile number.": "कृपया 10 अंकों का मोबाइल नंबर लिखें।",
  "Please check your email address.": "कृपया अपना ईमेल पता जाँच लें।",
  "Please enter a valid 6-digit pincode.": "कृपया सही 6 अंकों का पिनकोड लिखें।",
  "Please enter your house or flat number and building.": "कृपया अपना मकान या फ़्लैट नंबर और बिल्डिंग लिखें।",
  "Please enter the street or area.": "कृपया गली या इलाका लिखें।",
  "Please enter your city or town.": "कृपया अपना शहर या कस्बा लिखें।",
  "Please choose your state.": "कृपया अपना राज्य चुनें।",
  "Please choose how to pay.": "कृपया भुगतान का तरीक़ा चुनें।",
  "Your cart is empty.": "आपका कार्ट ख़ाली है।",

  // Orders (src/lib/orders/build.ts, /api/orders)
  "Please check the highlighted fields.": "कृपया लाल निशान वाली जानकारी जाँच लें।",
  "Cash on Delivery is not available.": "कैश ऑन डिलीवरी उपलब्ध नहीं है।",
  "Ordering on WhatsApp is not available.": "WhatsApp पर ऑर्डर करने की सुविधा उपलब्ध नहीं है।",
  "Online payments coming soon.": "ऑनलाइन भुगतान जल्द शुरू होगा।",
  "UPI payment is not available yet. Please choose another way to pay.": "UPI से भुगतान अभी उपलब्ध नहीं है। कृपया भुगतान का कोई और तरीक़ा चुनें।",
  "A piece in your cart is no longer available. Please check your cart.": "आपके कार्ट का एक पीस अब उपलब्ध नहीं है। कृपया अपना कार्ट देखें।",
  "We couldn't place your order. Please try again.": "आपका ऑर्डर नहीं हो सका। कृपया फिर से कोशिश करें।",
  "We couldn't place your order. Please check your connection and try again, or order on WhatsApp.":
    "आपका ऑर्डर नहीं हो सका। कृपया इंटरनेट कनेक्शन देखकर फिर से कोशिश करें, या WhatsApp पर ऑर्डर करें।",
  "Something went wrong. Please try again.": "कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।",
  "Online ordering isn't switched on yet. Please choose “Order on WhatsApp” instead.": "ऑनलाइन ऑर्डर अभी शुरू नहीं हुआ है। कृपया “WhatsApp पर ऑर्डर करें” चुनें।",
  "Online payment couldn't start. Please try again or choose Cash on Delivery.": "ऑनलाइन भुगतान शुरू नहीं हो सका। कृपया फिर से कोशिश करें या कैश ऑन डिलीवरी चुनें।",
  "Online payment couldn't load. Please try again or choose Cash on Delivery.": "ऑनलाइन भुगतान खुल नहीं सका। कृपया फिर से कोशिश करें या कैश ऑन डिलीवरी चुनें।",
  "We couldn't confirm the payment. If money was taken, message us with your order number.":
    "भुगतान की पुष्टि नहीं हो सकी। अगर पैसे कट गए हों, तो अपने ऑर्डर नंबर के साथ हमें मैसेज करें।",
  "Payment was cancelled. You can try again or choose another way to pay.": "भुगतान रद्द हो गया। आप फिर से कोशिश कर सकते हैं या भुगतान का कोई और तरीक़ा चुन सकते हैं।",
  "The payment didn't go through. Please try again or choose Cash on Delivery.": "भुगतान नहीं हो पाया। कृपया फिर से कोशिश करें या कैश ऑन डिलीवरी चुनें।",
  "This piece is no longer available.": "यह पीस अब उपलब्ध नहीं है।",

  // Coupons (src/lib/coupons.ts)
  "This code isn't valid.": "यह कोड सही नहीं है।",
  "This code has expired.": "इस कोड की तारीख़ निकल चुकी है।",

  // UPI (UpiPayPanel, /api/orders/[id]/paid)
  "The UPI reference is the 12-digit number in your app's payment details. Leave it empty if you can't find it.":
    "UPI रेफ़रेंस (UTR) आपके ऐप में भुगतान की जानकारी में दिया 12 अंकों का नंबर है। न मिले तो ख़ाली छोड़ दें।",
  "The UPI reference is the 12-digit number in your app's payment details.": "UPI रेफ़रेंस (UTR) आपके ऐप में भुगतान की जानकारी में दिया 12 अंकों का नंबर है।",
  "We couldn't reach the studio. Please check your connection and try again.": "स्टूडियो से संपर्क नहीं हो सका। कृपया इंटरनेट कनेक्शन देखकर फिर से कोशिश करें।",
  "We couldn't find that order.": "वह ऑर्डर नहीं मिला।",
  "This order isn't paid by UPI.": "इस ऑर्डर का भुगतान UPI से नहीं हो रहा है।",

  // Personalising a tribute (src/lib/personalise.ts, /api/personalise)
  "This link doesn't match an order.": "यह लिंक किसी ऑर्डर से मेल नहीं खाता।",
  "This link doesn't match an order. Please check it, or message us on WhatsApp.": "यह लिंक किसी ऑर्डर से मेल नहीं खाता। कृपया लिंक जाँचें, या WhatsApp पर हमें मैसेज करें।",
  "That piece doesn't need photos.": "इस पीस के लिए फ़ोटो की ज़रूरत नहीं है।",
  "No photo was sent.": "कोई फ़ोटो नहीं भेजी गई।",
  "Please upload a JPG, PNG, WebP or HEIC photo.": "कृपया JPG, PNG, WebP या HEIC फ़ोटो अपलोड करें।",
  "That photo is too large (5 MB at most).": "यह फ़ोटो बहुत बड़ी है (ज़्यादा से ज़्यादा 5 MB)।",
  "That piece doesn't need personalising.": "इस पीस को पर्सनलाइज़ करने की ज़रूरत नहीं है।",
  "Please check the highlighted details.": "कृपया लाल निशान वाली जानकारी जाँच लें।",
  "This tribute is no longer available.": "यह ट्रिब्यूट अब उपलब्ध नहीं है।",
  "Please choose a design.": "कृपया एक डिज़ाइन चुनें।",
  "Please enter the rank.": "कृपया रैंक लिखें।",
  "Please enter the name as it should appear.": "कृपया नाम ठीक वैसे लिखें जैसे दिखना चाहिए।",
  "Please keep this under 80 characters.": "कृपया इसे 80 अक्षरों से कम रखें।",
  "Please keep this short, e.g. 1994–2026.": "कृपया इसे छोटा रखें, जैसे 1994–2026।",
  "Please add at least one photo.": "कृपया कम से कम एक फ़ोटो जोड़ें।",
  "Please choose a background colour.": "कृपया बैकग्राउंड का रंग चुनें।",
  "Please choose a date.": "कृपया एक तारीख़ चुनें।",
  "Please keep this under 1,000 characters.": "कृपया इसे 1,000 अक्षरों से कम रखें।",
  "We couldn't open this link.": "यह लिंक खुल नहीं सका।",
  "We couldn't load your order. Please check your connection and try again.": "आपका ऑर्डर खुल नहीं सका। कृपया इंटरनेट कनेक्शन देखकर फिर से कोशिश करें।",
  "Upload failed. Please try again.": "अपलोड नहीं हुआ। कृपया फिर से कोशिश करें।",
  "Please wait for the photos to finish uploading.": "कृपया फ़ोटो अपलोड होने तक रुकें।",
  "We couldn't save your details. Please try again.": "आपकी जानकारी सेव नहीं हो सकी। कृपया फिर से कोशिश करें।",

  // Frame requests (src/lib/requests.ts, /api/requests)
  "Please choose the service.": "कृपया सेवा चुनें।",
  "Please tell us which service.": "कृपया बताएँ कि कौन-सी सेवा।",
  "Please choose at least one thing to include.": "कृपया शामिल करने के लिए कम से कम एक चीज़ चुनें।",
  "Please keep notes under 600 characters.": "कृपया नोट्स 600 अक्षरों से कम रखें।",
  "Please enter your name.": "कृपया अपना नाम लिखें।",
  "Please keep this under 60 characters.": "कृपया इसे 60 अक्षरों से कम रखें।",
  "We couldn't send your request. Please try again.": "आपका अनुरोध नहीं भेजा जा सका। कृपया फिर से कोशिश करें।",
  "We couldn't send your request. Please check your connection and try again, or message us on WhatsApp.":
    "आपका अनुरोध नहीं भेजा जा सका। कृपया इंटरनेट कनेक्शन देखकर फिर से कोशिश करें, या WhatsApp पर मैसेज करें।",
};

/** Messages with a name, number or code in them. */
const patterns: [RegExp, (...m: string[]) => string][] = [
  [/^Please keep the message under (\d+) characters\.$/, (n) => `कृपया संदेश ${n} अक्षरों से कम रखें।`],
  [/^Please choose the size for (.+) again\.$/, (name) => `कृपया ${name} का साइज़ फिर से चुनें।`],
  [/^Please choose the options for (.+) again\.$/, (name) => `कृपया ${name} के विकल्प फिर से चुनें।`],
  [/^Only (\d+) of (.+) left\. Please lower the quantity\.$/, (n, name) => `${name} के सिर्फ़ ${n} पीस बचे हैं। कृपया मात्रा कम करें।`],
  [/^(.+) has just sold out\.$/, (name) => `${name} अभी-अभी बिक गया।`],
  [/^Add (₹[\d,]+) more to use (.+)\.$/, (amount, code) => `${code} लगाने के लिए ${amount} का सामान और जोड़ें।`],
  [/^(.+) applied\. You save (₹[\d,]+)\.$/, (code, amount) => `${code} लग गया। आपकी ${amount} की बचत हुई।`],
  [/^We couldn't confirm the payment\. If money was taken, message us with order (.+)\.$/, (id) => `भुगतान की पुष्टि नहीं हो सकी। अगर पैसे कट गए हों, तो ऑर्डर ${id} के साथ हमें मैसेज करें।`],
  [/^Please add up to (\d+) photos\.$/, (n) => `कृपया ज़्यादा से ज़्यादा ${n} फ़ोटो जोड़ें।`],
];

/** The Hindi for an English form or order message, if known. */
export function hiMessage(en: string | null | undefined): string | undefined {
  if (!en) return undefined;
  if (exact[en]) return exact[en];
  for (const [re, make] of patterns) {
    const m = en.match(re);
    if (m) return make(...m.slice(1));
  }
  return undefined;
}
