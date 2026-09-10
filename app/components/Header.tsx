"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/content/restaurants";
import { Close, Menu } from "./icons";

const NAV = [
  { label: "The Path", href: "/#path" },
  { label: "Updates", href: "/#updates" },
  { label: "About GCI", href: SITE.orgUrl, external: true },
];

// Sticky, single container — the template's header pattern. Carries GCI's
// own logo lockup and an orange pill CTA with a BLACK label: black on orange
// is 6.83:1 where GCI's own white-on-orange is 3.08:1.
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-50">
      <header className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-6 lg:h-[88px]">
          <a href="/" aria-label={`${SITE.name} — home`} className="flex items-center gap-3">
            <Image src="/images/brand/gci-logo.png" alt="" aria-hidden width={400} height={311} priority className="h-11 w-auto lg:h-12" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-head text-base text-ink">Chatham Culinary Path</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-ink">A Greater Chatham Initiative project</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} target={n.external ? "_blank" : undefined} rel={n.external ? "noopener noreferrer" : undefined}
                 aria-current={!n.external && n.href === pathname ? "page" : undefined}
                 className={`text-small font-semibold text-ink transition-colors hover:text-crimson ${!n.external && n.href === pathname ? "squiggle text-crimson" : ""}`}>
                {n.label}
              </a>
            ))}
            <a href="/#path" className="rounded-pill bg-orange px-5 py-2.5 text-small font-bold text-ink transition-colors hover:bg-crimson hover:text-paper">Find a kitchen</a>
          </nav>
          <button onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
                  className="flex h-10 w-10 items-center justify-center text-ink md:hidden">
            {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col border-t border-line bg-paper px-5 py-3 md:hidden">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="border-b border-line py-3 text-base font-semibold text-ink">{n.label}</a>
            ))}
            <a href="/#path" onClick={() => setOpen(false)} className="mt-4 rounded-pill bg-orange py-3 text-center text-small font-bold text-ink">Find a kitchen</a>
          </nav>
        )}
      </header>
    </div>
  );
}
