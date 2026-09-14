"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Close } from "./icons";
export function DiscoveryDialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previous; };
  }, [open]);
  return <dialog ref={ref} className="discovery-dialog" aria-labelledby={titleId} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="dialog-inner"><div className="dialog-heading"><h2 id={titleId}>{title}</h2><button autoFocus type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><Close /></button></div>{children}</div>
  </dialog>;
}
