/** States and union territories, for the address form. */
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/** Matches India Post's state names ("Chattisgarh", "Pondicherry"…) to the list above. */
export function matchState(name: string) {
  const n = name.toLowerCase().replace(/[^a-z]/g, "");
  const aliases: Record<string, string> = {
    chattisgarh: "Chhattisgarh",
    pondicherry: "Puducherry",
    orissa: "Odisha",
    newdelhi: "Delhi",
    dadranagarhaveli: "Dadra and Nagar Haveli and Daman and Diu",
    damandiu: "Dadra and Nagar Haveli and Daman and Diu",
  };
  return aliases[n] ?? INDIAN_STATES.find((s) => s.toLowerCase().replace(/[^a-z]/g, "") === n) ?? null;
}

/** "+91 98765 43210" / "098765 43210" → "9876543210", or null if not a valid Indian mobile. */
export function normaliseMobile(input: string) {
  const digits = input.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const isPincode = (v: string) => /^[1-9]\d{5}$/.test(v);
