import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { T } from "@/i18n/T";

/** The main call to action with a sliding arrow; by default it jumps to the tribute choices. */
export function RequestFrameButton({
  label = <T en="Choose your tribute" hi="अपना ट्रिब्यूट चुनें" />,
  href = "/retirement-gifts",
  variant = "dark",
  query,
  className,
}: {
  /** Button text; pass a <T> for both languages. */
  label?: ReactNode;
  href?: string;
  variant?: "dark" | "light";
  query?: Record<string, string>;
  className?: string;
}) {
  const qs = query ? new URLSearchParams(Object.entries(query).filter(([, v]) => v)).toString() : "";
  return (
    <AppLink
      href={qs ? `${href}?${qs}` : href}
      className={clsx("btn btn-press group", variant === "dark" ? "btn-dark" : "btn-light", className)}
    >
      {label}
      <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
    </AppLink>
  );
}
