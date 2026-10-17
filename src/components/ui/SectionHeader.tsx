import clsx from "clsx";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, action, id, align = "left", className }: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        "flex gap-x-10 gap-y-5",
        align === "center" ? "flex-col items-center text-center" : "flex-wrap items-end justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {subtitle && <div className="mt-3 text-[14.5px] text-muted">{subtitle}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-4">{action}</div>}
    </div>
  );
}
