"use client";

import clsx from "clsx";
import { useState } from "react";
import { services, type ServiceId } from "@/config/tribute";
import { FramePreview } from "./FramePreview";
import { RequestFrameButton } from "./RequestFrameButton";

/** "Make it theirs": pick the service, type the rank and name, watch the frame update. */
export function PreviewSection() {
  const [service, setService] = useState<ServiceId>("army");
  const [rank, setRank] = useState("");
  const [name, setName] = useState("");

  const field = "h-12 w-full border border-line bg-transparent px-3 text-[14px] outline-none transition-colors placeholder:text-muted focus:border-ink";

  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14">
      <div className="reveal-left">
        <p className="eyebrow">Try it</p>
        <h2 id="preview-title" className="section-title mt-3">
          Make it theirs
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Choose the service and type the rank and name. After you order, you pick the design, upload their photos and choose the background colour.
        </p>

        <fieldset className="mt-8">
          <legend className="text-[12px] font-semibold uppercase tracking-[0.16em]">Service</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={service === s.id}
                onClick={() => setService(s.id)}
                className={clsx(
                  "btn-press border px-4 py-2.5 text-[13px] transition-colors",
                  service === s.id ? "border-brown bg-brown text-white" : "border-line hover:border-ink",
                )}
              >
                {s.short}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium">Rank</span>
            <input value={rank} onChange={(e) => setRank(e.target.value.slice(0, 30))} placeholder="e.g. Col" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value.slice(0, 40))} placeholder="As it should appear" className={field} />
          </label>
        </div>

        <RequestFrameButton label="Start with a box frame" href="/product/box-frame" className="mt-8" />
      </div>

      <div className="reveal-right">
        <div className="mx-auto max-w-[620px] shadow-[0_30px_60px_-30px_rgb(90_62_43/0.9)]">
          <FramePreview service={service} rank={rank} name={name} detail={services.find((s) => s.id === service)?.label} className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
