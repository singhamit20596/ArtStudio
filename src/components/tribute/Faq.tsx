import { Plus } from "lucide-react";
import { faqs } from "@/config/tribute";

/** Questions and answers with a smooth open/close. Placeholders like {price} are filled in by the page. */
export function Faq({ values }: { values: Record<string, string> }) {
  const fill = (text: string) => text.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f, i) => (
        <details key={f.q} className="smooth group reveal" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-semibold md:text-[18px] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-colors group-open:border-brown group-open:bg-brown group-open:text-white">
              <Plus size={15} strokeWidth={2} className="transition-transform duration-300 group-open:rotate-45" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-[14.5px] leading-relaxed text-muted">{fill(f.a)}</p>
        </details>
      ))}
    </div>
  );
}
