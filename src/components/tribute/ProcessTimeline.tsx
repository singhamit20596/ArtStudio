import { processSteps } from "@/config/tribute";

/** "How it works": four steps on a line that fills in as the section scrolls by. */
export function ProcessTimeline({ making }: { making: string }) {
  return (
    <ol className="timeline relative mt-12 space-y-10 md:space-y-12">
      {/* Track and its animated fill */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-line" />
      <span aria-hidden="true" className="timeline-fill absolute top-2 bottom-2 left-[19px] w-0.5 bg-amber" />
      {processSteps.map((step, i) => (
        <li key={step.title} className="reveal-left relative grid grid-cols-[40px_minmax(0,1fr)] gap-5 md:gap-8">
          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-amber text-[14px] font-semibold text-[#1e140d] tabular-nums">{i + 1}</span>
          <div className="pt-1.5">
            <h3 className="text-[19px] font-semibold leading-snug md:text-[22px]">{step.title}</h3>
            <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed text-muted">{step.text.replace("{making}", making)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
