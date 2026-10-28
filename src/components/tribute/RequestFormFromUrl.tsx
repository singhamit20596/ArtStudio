"use client";

import { useSearchParams } from "next/navigation";
import { services, type ServiceId } from "@/config/tribute";
import { RequestForm } from "./RequestForm";

/** Starts the form with ?service=…&rank=…&name=… from the homepage preview. */
export function RequestFormFromUrl() {
  const params = useSearchParams();
  const service = params.get("service");
  const initial = {
    ...(services.some((s) => s.id === service) ? { service: service as ServiceId } : {}),
    rank: (params.get("rank") ?? "").slice(0, 40),
    name: (params.get("name") ?? "").slice(0, 60),
  };
  return <RequestForm key={params.toString()} initial={initial} />;
}
