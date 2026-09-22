"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { HeroContent } from "@/content/hero";
import { saveHero, type FormState } from "../actions";
import { keepOnError } from "./keep-on-error";

export function HeroForm({ hero, version, saved, readonly }: { hero: HeroContent; version: string; saved: boolean; readonly: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveHero, {});
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState(hero.imageAlt);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  return <div className="space-y-6">
    <Link href="/admin" className="text-small font-semibold text-muted">← Admin dashboard</Link>
    <h1 className="font-head text-h2 text-ink">Homepage hero image</h1>
    <p className="text-small text-muted">Upload a photo to replace the main banner on desktop and mobile. The trail title appears below the photo.</p>
    {saved && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-900">Hero image saved. The live site now uses your changes.</p>}
    <form onSubmit={keepOnError(action)} className="space-y-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <input type="hidden" name="version" value={version} />
      <label className="block"><span className="text-small font-semibold">Upload hero image</span>
        <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={readonly || pending} className="mt-2 block w-full text-small" onChange={event => {
          const file = event.target.files?.[0]; setError("");
          if (!file) { setPreview(""); return; }
          if (file.size > 4 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"].includes(file.type)) {
            setError("Choose a JPEG, PNG, WebP, AVIF or GIF up to 4 MB."); event.target.value = ""; setPreview(""); return;
          }
          setPreview(URL.createObjectURL(file));
        }} />
        <span className="mt-2 block text-xs text-muted">Up to 4 MB. Choose a wide photo with the subject centered. The hero displays the photo without a darkening filter or overlaid words.</span>
      </label>
      <label className="block text-small font-semibold">Image description
        <input name="imageAlt" value={description} onChange={event => setDescription(event.target.value)} required maxLength={250} className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-body" />
        <span className="mt-1 block text-xs font-normal text-muted">Describe what is in the photo for visitors using a screen reader.</span>
      </label>
      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
        {[{ label: "Desktop preview", ratio: "2.94" }, { label: "Mobile preview", ratio: "2.17" }].map(item => <div key={item.label}>
          <p className="mb-2 text-small font-semibold">{item.label}</p>
          <div className="relative grid place-items-center overflow-hidden bg-ink" style={{ aspectRatio: item.ratio }}>
            <img src={preview || hero.image} alt={description} className="absolute inset-0 h-full w-full object-cover" />

          </div>
        </div>)}
      </div>
      {(error || state.error) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-blue">{error || state.error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button disabled={readonly || pending || !!error} type="submit" className="rounded-pill bg-gold px-6 py-3 text-small font-bold text-ink disabled:opacity-50">{pending ? "Saving…" : "Save hero image"}</button>
        <Link href="/admin" className="text-small font-semibold text-muted">Cancel</Link>
      </div>
    </form>
  </div>;
}
