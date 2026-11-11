"use client";
import type { ReactNode } from "react";

/** Google Maps driving directions, starting turn-by-turn navigation. */
export function drivingUrl(name: string, address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${name}, ${address}`)}&travelmode=driving&dir_action=navigate`;
}

/** A link that hands the trip to the Google Maps app. On phones it navigates in
 *  the same tab, which is what lets Android and iOS open the installed app
 *  (a new tab keeps it in the browser); with a mouse it opens a new tab so the
 *  trail stays open. */
export function DirectionsLink({ name, address, className, label, children }: { name: string; address: string; className?: string; label?: string; children: ReactNode }) {
  const url = drivingUrl(name, address);
  return <a className={className} href={url} rel="noopener noreferrer" aria-label={label ?? `Drive to ${name} with Google Maps`}
    onClick={e => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      e.preventDefault();
      window.open(url, "_blank", "noopener");
    }}>{children}</a>;
}
