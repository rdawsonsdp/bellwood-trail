"use client";
import { useState } from "react";

/** A destructive button that asks twice, inline — no browser confirm() dialog. */
export function ConfirmButton({ action, fields, label, confirmLabel }: {
  action: (form: FormData) => Promise<void>; fields: Record<string, string>; label: string; confirmLabel: string;
}) {
  const [armed, setArmed] = useState(false);
  if (!armed) return (
    <button type="button" onClick={() => setArmed(true)} className="rounded-pill border border-line px-4 py-2 text-small font-bold text-warm-gray hover:border-crimson hover:text-crimson">{label}</button>
  );
  return (
    <form action={action} className="flex items-center gap-2">
      {Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <button className="rounded-pill bg-crimson px-4 py-2 text-small font-bold text-paper hover:bg-crimson-dark">{confirmLabel}</button>
      <button type="button" onClick={() => setArmed(false)} className="text-small font-semibold text-warm-gray hover:text-ink">Cancel</button>
    </form>
  );
}
