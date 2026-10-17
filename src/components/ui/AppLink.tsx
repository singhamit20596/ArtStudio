import Link from "next/link";
import type { ComponentProps } from "react";
import { isPreview } from "@/lib/preview";

/**
 * next/link with prefetching switched off in the static design preview,
 * where most routes do not exist yet.
 */
export function AppLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} prefetch={isPreview ? false : props.prefetch} />;
}
