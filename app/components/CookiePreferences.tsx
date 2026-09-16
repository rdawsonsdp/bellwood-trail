"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, readConsent, saveConsent } from "@/app/lib/cookie-consent";

export function CookiePreferences() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  useEffect(() => {
    const choice = readConsent(document.cookie);
    setHasChoice(!!choice); setFavorites(choice?.favorites ?? false); setOpen(!choice && pathname !== "/cookie-information");
    const sync = () => {
      const next = readConsent(document.cookie);
      if (next) { setFavorites(next.favorites); setHasChoice(true); }
    };
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, [open]);
  const choose = (remember: boolean) => { saveConsent(remember); setHasChoice(true); setOpen(false); };
  return <>
    <button className="cookie-settings-link" type="button" onClick={() => { setCustomize(true); setOpen(true); }}>Cookie settings</button>
    <dialog ref={dialog} className="cookie-dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description" onCancel={event => { event.preventDefault(); if (hasChoice) setOpen(false); else choose(false); }}>
      <h2 id="cookie-title">Your cookie choices</h2>
      <p id="cookie-description">We use a cookie to remember your choice. Optional storage keeps your favorite restaurants on this device between visits.</p>
      <p className="cookie-info"><a href="/cookie-information" target="_blank" rel="noopener noreferrer">About cookies and storage<span className="sr-only"> (opens in a new tab)</span></a></p>
      {customize && <div className="cookie-options">
        <div><strong>Necessary</strong><span>Always on</span><p>Remembers your cookie choice. Admin sign-in uses a separate session cookie.</p></div>
        <label><span><strong>Remember favorites</strong><small>Save your restaurant list in this browser. Off means favorites last for this visit only.</small></span><input type="checkbox" checked={favorites} onChange={event => setFavorites(event.target.checked)} /></label>
        <p>No analytics or advertising cookies are used.</p>
      </div>}
      <div className="cookie-actions">
        <button autoFocus type="button" onClick={() => choose(true)}>Accept all</button>
        <button type="button" onClick={() => choose(false)}>Only necessary</button>
        {customize ? <button type="button" onClick={() => choose(favorites)}>Save my choices</button> : <button type="button" onClick={() => setCustomize(true)}>Customize</button>}
      </div>
      {hasChoice && <button className="cookie-close" type="button" onClick={() => setOpen(false)}>Cancel</button>}
    </dialog>
  </>;
}
