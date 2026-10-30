import { site } from "@/config/site";
import { T } from "@/i18n/T";
import { tr } from "@/i18n/ui";

/** Thin amber bar above the header; four messages rotate with CSS only. */
export function AnnouncementBar() {
  return (
    <div className="surface-amber">
      <div className="container-x relative h-[34px] text-center text-[11.9px] tracking-[0.04em]">
        <ul aria-label="Store announcements">
          {site.announcements.map((msg, i) => (
            <li
              key={msg}
              className="ann-item absolute inset-0 flex items-center justify-center px-4"
              style={{ "--i": i } as React.CSSProperties}
              aria-hidden={i > 0 ? "true" : undefined}
            >
              <T en={msg} hi={tr(msg)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
