"use client";
import { useEffect, useRef, useState } from "react";
import { readConsent, saveConsent } from "@/app/lib/cookie-consent";

export function CookiePreferences() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState(true);
  useEffect(() => {
    if (!open) return;
    setFavorites(readConsent(document.cookie)?.favorites !== false);
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, [open]);
  return <>
    <button className="cookie-settings-link" type="button" onClick={() => setOpen(true)}>Browser storage settings</button>
    <dialog ref={dialog} className="cookie-dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description" onCancel={event => { event.preventDefault(); setOpen(false); }}>
      <h2 id="cookie-title">Your saved favorites</h2>
      <p id="cookie-description">Tap a restaurant’s heart to save it. Your favorites stay in this browser between visits, without an account.</p>
      <div className="cookie-options">
        <label><span><strong>Remember favorites</strong><small>Save your restaurant list on this device. Turn off for this visit only.</small></span><input type="checkbox" checked={favorites} onChange={event => setFavorites(event.target.checked)} /></label>
        <p>No analytics or advertising cookies are used.</p>
      </div>
      <p className="cookie-info"><a href="/cookie-information">About cookies and storage</a></p>
      <div className="cookie-actions">
        <button autoFocus type="button" onClick={() => { saveConsent(favorites); setOpen(false); }}>Save preference</button>
        <button type="button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </dialog>
  </>;
}
