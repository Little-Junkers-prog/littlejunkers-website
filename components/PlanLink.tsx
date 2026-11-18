"use client";
import { useSavedArea } from "./ZipContext";
import type { SizeYards } from "@/lib/pricing";

export function PlanLink({size,zip,className,children}:{size: SizeYards;zip?:string;className?:string;children:React.ReactNode}) {
  const area = useSavedArea();
  const selectedZip = zip && /^\d{5}$/.test(zip) ? zip : area?.zip;
  const params = new URLSearchParams({size: String(size)});
  if (selectedZip) params.set("zip",selectedZip);
  return <a href={"/plan?" + params.toString()} className={className}>{children}</a>;
}
