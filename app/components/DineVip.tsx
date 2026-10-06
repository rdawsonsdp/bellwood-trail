"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Close } from "./icons";

const SEEN_KEY = "bellwood-dine-vip-seen-v1";
const VipContext = createContext<(() => void) | null>(null);

export function DineVipProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [previewComplete, setPreviewComplete] = useState(false);
  const shown = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const show = () => {
    shown.current = true;
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* Once per page if storage is unavailable. */ }
    setPreviewComplete(false);
    setOpen(true);
  };
  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    try { shown.current = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* In-memory fallback. */ }
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        if (!shown.current && distance > 0 && window.scrollY / distance >= 2 / 3 && !document.querySelector("dialog[open]")) showRef.current();
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    document.addEventListener("close", check, true);
    const observer = new ResizeObserver(check);
    observer.observe(document.body);
    check();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      document.removeEventListener("close", check, true);
    };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  return <VipContext.Provider value={show}>
    {children}
    <dialog ref={dialog} className="dine-vip-dialog" aria-labelledby="vip-title" aria-describedby="vip-description" onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if (e.target === dialog.current) setOpen(false); }}>
      {open && <div className="dine-vip-inner">
        <button autoFocus type="button" className="vip-close icon-button" aria-label="Close Bellwood Dine VIP" onClick={() => setOpen(false)}><Close /></button>
        <div className="vip-banner"><span className="vip-seal" aria-hidden="true">VIP</span><p>GOOD FOOD. GREAT COMPANY.</p></div>
        <div className="vip-content"><p className="vip-eyebrow">YOUR INVITATION TO EXPLORE</p><h2 id="vip-title">Bellwood Dine <em>VIP.</em></h2>
          <p id="vip-description">A little more Bellwood in your inbox. Restaurant Week news, local dining discoveries, and reasons to come hungry.</p>
          {previewComplete ? <div className="vip-preview-result" role="status"><h3>Thanks for trying the preview!</h3><p>This signup is a placeholder. Your name and email have not been saved, and you have not been subscribed.</p><button className="primary-button" type="button" onClick={() => setOpen(false)}>Keep exploring</button></div> :
            <form className="vip-form" onSubmit={e => { e.preventDefault(); e.currentTarget.reset(); setPreviewComplete(true); }}>
              <label htmlFor="vip-name">Your name<input id="vip-name" name="name" autoComplete="name" placeholder="First and last name" required maxLength={120} pattern=".*\S.*" /></label>
              <label htmlFor="vip-email">Email address<input id="vip-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
              <p className="vip-placeholder-note" id="vip-placeholder-note">Preview only — signup is coming soon. Details entered here are not sent or stored.</p>
              <button type="submit" className="primary-button" aria-describedby="vip-placeholder-note">Join Bellwood Dine VIP <span aria-hidden="true">→</span></button>
              <button type="button" className="vip-not-now" onClick={() => setOpen(false)}>Maybe later</button>
            </form>}
        </div>
      </div>}
    </dialog>
  </VipContext.Provider>;
}

export function BellwoodPromotion() {
  const openVip = useContext(VipContext);
  return <section className="bellwood-promotion" aria-labelledby="coming-soon-title">
    <Image className="promotion-background" src="/images/promotions/varis-coming-soon.jpg" alt="" fill sizes="100vw" />
    <div className="site-container promotion-inner">
      <div className="promotion-intro"><p className="vip-eyebrow">COMING SOON TO BELLWOOD</p><h2 id="coming-soon-title">VARI’S <em>Southern Cuisine</em></h2><p>A new home for Southern comfort food on St. Charles Road. Get ready to pull up a chair.</p></div>
      <div className="promotion-ticket"><div className="promotion-ticket-copy"><span className="promotion-tag">A NEW NEIGHBORHOOD KITCHEN</span><Image className="promotion-varis-logo" src="/images/promotions/varis-southern-cuisine-logo.png" alt="VARI’S Southern Cuisine" width={1638} height={722} sizes="(max-width: 540px) 220px, 320px" /><p>Fried ribs, catfish, and Southern favorites.<br /><strong>2712 St Charles Rd, Bellwood, IL 60104</strong><br />Opening date to be announced.</p><button className="primary-button" type="button" aria-haspopup="dialog" onClick={() => openVip?.()}>Explore Bellwood Dine VIP <span aria-hidden="true">↗</span></button></div><div className="promotion-ticket-date"><span>VARI’S<br />SOUTHERN CUISINE</span><strong>Coming<br />soon</strong><span>BELLWOOD, IL</span></div></div>
    </div>
  </section>;
}
