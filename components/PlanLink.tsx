"use client";
import { useSavedArea, useSavedLocationQuery } from "./ZipContext";
import type { SizeYards } from "@/lib/pricing";

export function PlanLink({size,zip,className,children}:{size: SizeYards;zip?:string;className?:string;children:React.ReactNode}) {
  const area = useSavedArea();
  const savedQuery = useSavedLocationQuery();
  const selected = zip && /^\d{5}$/.test(zip) ? zip : savedQuery || area?.zip;
  const params = new URLSearchParams({size: String(size)});
  if (selected) params.set(/^\d{5}$/.test(selected) ? "zip" : "location", selected);
  return <a href={"/plan?" + params.toString()} className={className}>{children}</a>;
}
