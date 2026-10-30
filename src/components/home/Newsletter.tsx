"use client";

import { useState } from "react";
import { isPreview } from "@/lib/preview";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

/** Email capture. Sign-ups are stored in the database from Phase 4. */
export function Newsletter() {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  const hi = useLang() === "hi";

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      return;
    }
    // Phase 4: POST to /api/newsletter (Supabase). Nothing is stored yet.
    setState("done");
  };

  return (
    <section aria-labelledby="newsletter-title" className="surface-brown">
      <div className="container-x grid items-center gap-8 py-16 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <p className="eyebrow">
            <T en="Join the inner circle" hi="हमारे ख़ास लोगों में शामिल हों" />
          </p>
          <h2 id="newsletter-title" className="section-title mt-3">
            <T en="New drops and festive offers" hi="नए पीस और त्योहारों के ऑफ़र" />
          </h2>
          <p className="mt-3 text-muted">
            <T en="Straight to your inbox. No spam." hi="सीधे आपके इनबॉक्स में। कोई फ़ालतू ईमेल नहीं।" />
          </p>
        </div>

        <div>
          {state === "done" ? (
            <p role="status" className="border-l-2 border-amber py-2 pl-5 text-[15px]">
              {isPreview ? (
                <T
                  en="This is the preview, so nothing was saved. Sign-ups will be stored once the database is connected in Phase 4."
                  hi="यह प्रीव्यू है, इसलिए कुछ सेव नहीं हुआ। डेटाबेस जुड़ने के बाद साइन-अप सेव होंगे।"
                />
              ) : (
                <T en="You are on the list. We will write when something new is ready." hi="आप लिस्ट में शामिल हो गए। कुछ नया तैयार होते ही हम आपको लिखेंगे।" />
              )}
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                <T en="Email address" hi="ईमेल पता" />
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={hi ? "आपका ईमेल पता" : "Your email address"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                aria-invalid={state === "error"}
                aria-describedby={state === "error" ? "newsletter-error" : undefined}
                className="h-12 min-w-0 flex-1 border border-line bg-transparent px-4 text-[14px] outline-none transition-colors placeholder:text-muted focus:border-amber"
              />
              <button type="submit" className="btn btn-light">
                <T en="Subscribe" hi="जुड़ें" />
              </button>
            </form>
          )}
          {state === "error" && (
            <p id="newsletter-error" className="mt-2 text-[13px] text-eyebrow">
              <T en="Enter an email address like name@example.com." hi="name@example.com जैसा ईमेल पता लिखें।" />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
