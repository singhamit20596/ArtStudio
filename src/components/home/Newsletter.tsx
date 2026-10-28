"use client";

import { useState } from "react";
import { isPreview } from "@/lib/preview";

/** Email capture. Sign-ups are stored in the database from Phase 4. */
export function Newsletter() {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

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
          <p className="eyebrow">Join the inner circle</p>
          <h2 id="newsletter-title" className="section-title mt-3">
            New drops and festive offers
          </h2>
          <p className="mt-3 text-muted">Straight to your inbox. No spam.</p>
        </div>

        <div>
          {state === "done" ? (
            <p role="status" className="border-l-2 border-amber py-2 pl-5 text-[15px]">
              {isPreview
                ? "This is the preview, so nothing was saved. Sign-ups will be stored once the database is connected in Phase 4."
                : "You are on the list. We will write when something new is ready."}
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email address"
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
                Subscribe
              </button>
            </form>
          )}
          {state === "error" && (
            <p id="newsletter-error" className="mt-2 text-[13px] text-eyebrow">
              Enter an email address like name@example.com.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
