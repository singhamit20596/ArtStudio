import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";

/** The main call to action: opens the request form, optionally pre-filled. */
export function RequestFrameButton({
  label = "Request a frame",
  variant = "dark",
  query,
  className,
}: {
  label?: string;
  variant?: "dark" | "light";
  query?: Record<string, string>;
  className?: string;
}) {
  const qs = query ? new URLSearchParams(Object.entries(query).filter(([, v]) => v)).toString() : "";
  return (
    <AppLink
      href={qs ? `/request?${qs}` : "/request"}
      className={clsx("btn btn-press group", variant === "dark" ? "btn-dark" : "btn-light", className)}
    >
      {label}
      <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
    </AppLink>
  );
}
