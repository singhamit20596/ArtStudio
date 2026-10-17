import { site } from "@/config/site";

/** Thin black bar above the header; four messages rotate with CSS only. */
export function AnnouncementBar() {
  return (
    <div className="bg-ink-2 text-paper">
      <div className="container-x relative h-[34px] text-center text-[11.9px] tracking-[0.04em]">
        <ul aria-label="Store announcements">
          {site.announcements.map((msg, i) => (
            <li
              key={msg}
              className="ann-item absolute inset-0 flex items-center justify-center px-4"
              style={{ "--i": i } as React.CSSProperties}
              aria-hidden={i > 0 ? "true" : undefined}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
