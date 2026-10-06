"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
const InstallContext = createContext<{ install: () => void; installed: boolean; busy: boolean } | null>(null);

export function PhoneInstallProvider({ children }: { children: ReactNode }) {
  const pending = useRef<InstallPrompt | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apple, setApple] = useState(false);
  const titleId = useId();
  useEffect(() => {
    const display = window.matchMedia("(display-mode: standalone)");
    const checkInstalled = () => setInstalled(display.matches || !!(navigator as Navigator & { standalone?: boolean }).standalone);
    checkInstalled();
    setApple(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const capture = (event: Event) => { event.preventDefault(); pending.current = event as InstallPrompt; };
    const complete = () => { pending.current = null; setInstalled(true); setOpen(false); };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", complete);
    display.addEventListener("change", checkInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", complete);
      display.removeEventListener("change", checkInstalled);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, [open]);
  const install = async () => {
    if (installed || busy) return;
    const prompt = pending.current;
    if (!prompt) { setOpen(true); return; }
    pending.current = null; // A browser install event can only be used once.
    setBusy(true);
    try {
      await prompt.prompt();
      await prompt.userChoice; // Only appinstalled confirms completion.
    } catch { setOpen(true); }
    finally { setBusy(false); }
  };
  return <InstallContext.Provider value={{ install, installed, busy }}>
    {children}
    <dialog ref={dialog} className="phone-install-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); setOpen(false); }}>
      <Image src="/icons/dine-bellwood-180.png" alt="" width={64} height={64} />
      <p className="phone-install-eyebrow">Dine Bellwood, one tap away</p>
      <h2 id={titleId}>Save to your phone</h2>
      <p>Add the Dine Bellwood icon to your home screen for quick access to local kitchens.</p>
      {apple ? <ol>
        <li>Open this page in <strong>Safari</strong>.</li>
        <li>Tap <strong>Share</strong> (the square with an upward arrow). You may need to open the browser’s menu first.</li>
        <li>Choose <strong>Add to Home Screen</strong>. Keep <strong>Open as Web App</strong> on if shown, then tap <strong>Add</strong>.</li>
      </ol> : <ol>
        <li>Open this page in <strong>Chrome</strong> on your Android phone.</li>
        <li>Tap the <strong>⋮ menu</strong> in the browser.</li>
        <li>Choose <strong>Add to Home screen</strong> or <strong>Install app</strong>, then confirm.</li>
      </ol>}
      <p className="phone-install-note">If you opened this page inside another app, first open it in {apple ? "Safari" : "your phone’s browser"}.</p>
      <button type="button" className="primary-button" autoFocus onClick={() => setOpen(false)}>Got it</button>
    </dialog>
  </InstallContext.Provider>;
}

export function SaveToPhoneButton() {
  const context = useContext(InstallContext);
  if (!context) throw new Error("PhoneInstallProvider is required");
  return <button type="button" className="save-to-phone-button" onClick={context.install} disabled={context.installed || context.busy} aria-haspopup="dialog">
    <span className="mobile-nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="1" /><path d="M10 5h4M11 19h2m-1-11v7m-3-3 3 3 3-3" /></svg></span>
    <span>{context.installed ? "On your phone" : context.busy ? "Opening…" : "Save to phone"}</span>
  </button>;
}
