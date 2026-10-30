/*
 * Hindi copy for the themed lines (src/config/diwali.ts, christmas.ts, cars.ts), keyed by the
 * line's category, in the same shape as ThemedLine. A line or field missing here shows in English.
 */

export interface LineCopy {
  eyebrow: string;
  title: readonly [string, string];
  intro: string;
  note: string;
  bandLine: string;
  samplePhotoNote: string;
  noPhoto: string;
  taglines: Record<string, string>;
}

const SAMPLE_NOTE = "हर पीस ऑर्डर पर हाथ से बनता है, इसलिए आपका पीस फ़ोटो से थोड़ा अलग हो सकता है।";
const NO_PHOTO = "फ़ोटो जल्द आएगी";

export const lineCopy: Record<string, LineCopy> = {
  "diwali-decor-gifts": {
    eyebrow: "दिवाली सजावट और तोहफ़े",
    title: ["दिवाली को रोशन करें,", "हाथ से बनी चीज़ों से।"],
    intro:
      "लक्ष्मी पूजा के लिए पूजा थाली, दरवाज़े के लिए शुभ लाभ, हर कोने के लिए कमल दीये और अपनों के लिए गिफ़्ट बॉक्स। हर पीस हमारे स्टूडियो में रेज़िन से ढालकर हाथ से तैयार किया जाता है।",
    note: "हर पीस ऑर्डर पर बनता है। जल्दी ऑर्डर करें, ताकि दिवाली से पहले आप तक पहुँच जाए।",
    bandLine: "पूजा थाली, शुभ लाभ, कमल टी-लाइट होल्डर और गिफ़्ट बॉक्स, रेज़िन में, त्योहार के लिए ऑर्डर पर बने।",
    samplePhotoNote: SAMPLE_NOTE,
    noPhoto: NO_PHOTO,
    taglines: {
      "ganesh-lakshmi-gift-box": "कमल दीयों के साथ गणेश और लक्ष्मी प्लाक।",
      "shubh-labh-candle-gift-box": "शुभ लाभ, लड्डू कैंडल और एक फूल वाली कैंडल।",
      "pink-shubh-labh-gift-box": "शुभ लाभ, गणेश प्लाक और दो दीये।",
      "pink-lotus-pooja-set": "गुलाबी कमल थाली, दीये और शुभ लाभ।",
      "lotus-pearl-pooja-thali": "पेंट किए कमल, सुनहरी पत्तियाँ और मोती।",
      "peacock-feather-pooja-thali": "फ़िरोज़ी रंग, सुनहरे फ़्लेक्स और मोरपंख।",
      "namokar-mantra-thali": "सुनहरे अक्षरों में णमोकार मंत्र।",
      "shubh-labh-hangings": "सफ़ेद और सुनहरा, चेन के लटकन के साथ।",
      "ganesh-lakshmi-shubh-labh": "फूलों के साथ गणेश जी और लक्ष्मी जी।",
      "lotus-tealight-holder": "आपकी टी-लाइट के लिए रेज़िन का कमल।",
      "krishna-mantra-led-plaque": "LED से जगमगाता कृष्ण मंत्र।",
      "ganesha-rose-petal-plaque": "असली गुलाब की पंखुड़ियों के साथ गणेश जी।",
      "radha-krishna-frame": "सुनहरे फ़्लेक्स वाले फ़्रेम में राधा कृष्ण।",
    },
  },
  "christmas-decor-gifts": {
    eyebrow: "क्रिसमस सजावट और तोहफ़े",
    title: ["क्रिसमस,", "हाथों से सजा।"],
    intro:
      "पेड़ के लिए ऑर्नामेंट, हॉट चॉकलेट के लिए कोस्टर और आपकी लिस्ट में सबके लिए छोटे-छोटे तोहफ़े। हर पीस हमारे स्टूडियो में रेज़िन से ढालकर हाथ से तैयार किया जाता है।",
    note: "हर पीस ऑर्डर पर बनता है। जल्दी ऑर्डर करें, ताकि क्रिसमस से काफ़ी पहले आप तक पहुँच जाए।",
    bandLine: "रेज़िन में ऑर्नामेंट, कोस्टर और छोटे तोहफ़े, इस मौसम के लिए ऑर्डर पर बने।",
    samplePhotoNote: SAMPLE_NOTE,
    noPhoto: NO_PHOTO,
    taglines: {
      "holo-christmas-tree": "सुनहरे फ़्लेक्स और छोटे-छोटे इंद्रधनुष।",
      "marble-reindeer-ornament": "लाल मार्बल डिज़ाइन, सुनहरे सींग।",
      "candy-cane-christmas-coaster": "आसमानी नीले पर कैंडी केन और पिपरमिंट।",
      "stocking-keychain": "सुनहरे सितारों से भरा लाल मोज़ा।",
      "santa-reindeer-plaque": "स्टैंड पर सांता और उनके रेनडियर।",
      "christmas-dome-magnet": "फ़्रिज के लिए क्रिसमस का छोटा-सा दृश्य।",
      "snowflake-coaster": "बर्फ़ीले नीले स्नोफ़्लेक्स और एक छोटा पेड़।",
      "christmas-disc-ornament": "ग्लिटर, चार्म और Christmas लिखा हुआ।",
      "merry-christmas-coaster": "मोती जैसा सफ़ेद, सुनहरा और त्योहार की चमक।",
      "glitter-tree-canvas": "क्रिसमस के लिए सजा ग्लिटर ट्री।",
      "melted-snowman-coaster": "आपके मग के नीचे पिघलता स्नोमैन।",
      "candy-cane-hexagon-coaster": "बर्फ़ में खड़े कैंडी केन।",
      "sea-glass-tree-ornament": "साफ़ रेज़िन में काँच के टुकड़ों का पेड़।",
    },
  },
  "car-gifts": {
    eyebrow: "रेज़िन कार गिफ़्ट्स",
    title: ["कार के दीवानों के लिए,", "हाथ से बने।"],
    intro:
      "उनकी सपनों की कार, रेज़िन के धुएँ से ड्रिफ़्ट करती, टायर ट्रैक पर दौड़ती या कैनवस पर गरजती हुई। हर पीस में एक डायकास्ट मॉडल लगाकर उसे हमारे स्टूडियो में हाथ से तैयार किया जाता है।",
    note: "हर पीस दिखाई गई कार के डायकास्ट मॉडल के साथ ऑर्डर पर बनता है; कोई और कार चाहिए तो WhatsApp पर पूछें। ब्रांड के नाम और लोगो उनके मालिकों के हैं: ये हाथ से बने फ़ैन पीस हैं, आधिकारिक प्रोडक्ट नहीं।",
    bandLine: "रेज़िन के धुएँ, छींटों और रेसिंग धारियों में डायकास्ट कारें: फ़्रेम, कैनवस और डिस्प्ले, ऑर्डर पर बने।",
    samplePhotoNote: SAMPLE_NOTE,
    noPhoto: NO_PHOTO,
    taglines: {
      "hot-wheels-smoke-frame": "काले रेज़िन धुएँ से निकलती हुई।",
      "bmw-m-smoke-frame": "काले पर सफ़ेद धुएँ का ड्रिफ़्ट।",
      "hot-wheels-tyre-track-frame": "छींटों वाले टायर ट्रैक पर दौड़ती हुई।",
      "hot-wheels-twin-drift-frame": "साथ-साथ ड्रिफ़्ट करती दो कारें।",
      "three-cars-spotlight-frame": "रंगीन हेडलाइट में तीन कारें।",
      "ferrari-flame-burnout-frame": "कार्बन फ़ाइबर पर लाल और पीली लपटें।",
      "ferrari-racing-stripe-canvas": "चमकदार सफ़ेद पर दो लाल धारियाँ।",
      "bmw-drift-smoke-canvas": "सफ़ेद धुएँ में एक बड़ा ड्रिफ़्ट।",
      "pagani-ocean-wave-canvas": "लहरों से निकलती हुई।",
      "emerald-splash-car-board": "पन्ना-हरा, सुनहरा और सफ़ेद छींटे।",
      "vintage-car-wheat-canvas": "गेहूँ की बालियों के बीच लाल क्लासिक।",
      "harley-davidson-plaque": "चमकदार काले पर एक Harley।",
      "tyre-display-shelf": "उनके कलेक्शन के लिए असली टायर।",
    },
  },
};

export const hiLine = (category: string): LineCopy | undefined => lineCopy[category];
