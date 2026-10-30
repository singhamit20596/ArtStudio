"use client";

import clsx from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { site } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { isPreview } from "@/lib/preview";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { T } from "@/i18n/T";

interface CustomRequestButtonProps {
  /** Product or category name used in the WhatsApp message. */
  productName: string;
  /** Path of the page being enquired about, e.g. "/custom/retirement-tribute-frames". */
  path: string;
  /** Button text (a <T> for both languages); defaults to "Request this custom piece". */
  label?: ReactNode;
  variant?: "dark" | "light" | "whatsapp";
  className?: string;
}

/**
 * "Request this custom piece" — opens WhatsApp with:
 *   Hi! I'd like a custom [product name]. Link: [page URL]
 *
 * Kept deliberately self-contained: the full custom-order flow (photo upload,
 * medal selection, live preview) will replace this one component later.
 */
export function CustomRequestButton({
  productName,
  path,
  label = <T en="Request this custom piece" hi="यह कस्टम पीस बनवाएँ" />,
  variant = "dark",
  className,
}: CustomRequestButtonProps) {
  const [origin, setOrigin] = useState<string>(site.url);

  useEffect(() => {
    // Without a configured domain, link to wherever the site is being served from.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!site.url && !isPreview) setOrigin(window.location.origin);
  }, []);

  const href = whatsappLink(messages.custom(productName, origin ? `${origin}${path}` : undefined));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("btn", variant === "dark" && "btn-dark", variant === "light" && "btn-light", variant === "whatsapp" && "btn-whatsapp", className)}
    >
      <WhatsAppIcon size={17} />
      {label}
    </a>
  );
}
