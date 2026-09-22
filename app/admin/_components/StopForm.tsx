"use client";
// Previews use plain <img>: they show arbitrary site URLs and local files.
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { CORRIDORS } from "@/content/restaurants";
import type { SiteSnapshot } from "@/app/lib/site-data";
import { formatRange } from "@/app/lib/hours";
import { deleteStop, loadSite, locateStop, saveStop, type FormState } from "../actions";
import { CORRIDOR_KEYS, DAY_NAMES, MEAL_OPTIONS, rowsFromSchedule, scheduleFromRows, type StopDraft } from "../stop-draft";
import { ConfirmButton } from "./ConfirmButton";
import { keepOnError } from "./keep-on-error";

const input = "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-body text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

export function StopForm({ slug, initial, version, imageSrc }: {
  /** Empty for a new stop. */
  slug: string; initial: StopDraft; version: string; imageSrc: string | null;
}) {
  const [d, setD] = useState(initial);
  const set = <K extends keyof StopDraft>(k: K, v: StopDraft[K]) => setD((p) => ({ ...p, [k]: v }));
  const [state, action, saving] = useActionState<FormState, FormData>(saveStop, {});

  // Card photo: an uploaded file beats a photo picked from the site beats the current one.
  const fileRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [copyFrom, setCopyFrom] = useState("");
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const preview = filePreview ?? (copyFrom || imageSrc);

  const [snap, setSnap] = useState<SiteSnapshot | null>(null);
  const [checking, startCheck] = useTransition();
  const check = () => startCheck(async () => setSnap(await loadSite(d.site, d.address)));
  const [locating, startLocating] = useTransition();
  const [locationMessage, setLocationMessage] = useState("");
  const locate = () => startLocating(async () => {
    const result = await locateStop(d.address);
    if ("error" in result) setLocationMessage(result.error);
    else {
      setD(previous => ({ ...previous, lat: String(result.lat), lng: String(result.lng) }));
      setLocationMessage(`Location found: ${result.matchedAddress}. Save changes to publish it on the map.`);
    }
  });

  const liveHours = snap?.schedule;
  const applySite = () => {
    if (!snap) return;
    setD((p) => ({
      ...p,
      ...(snap.phone ? { phone: snap.phone } : {}),
      ...(snap.address ? { address: snap.address } : {}),
      ...(liveHours ? { hours: rowsFromSchedule(liveHours) } : {}),
    }));
  };
  let formHours: string[] = [];
  try { formHours = scheduleFromRows(d.hours).map(formatRange); } catch { /* shown as typed */ }

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-small font-semibold text-muted hover:text-ink">← All stops</Link>
      <h1 className="font-head text-h2 text-ink">{slug ? `Edit ${initial.name}` : "Add a restaurant"}</h1>

      <form onSubmit={keepOnError(action)} className="space-y-6">
        <input type="hidden" name="data" value={JSON.stringify(d)} />
        <input type="hidden" name="originalSlug" value={slug} />
        <input type="hidden" name="version" value={version} />
        <input type="hidden" name="copyFrom" value={filePreview ? "" : copyFrom} />

        <Panel title="The basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input className={input} value={d.name} onChange={(e) => set("name", e.target.value)} required maxLength={80} /></Field>
            <Field label="Tagline" hint="One line under the name on the card."><input className={input} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={120} /></Field>
            <Field label="Website" hint="Where the card's Visit link goes.">
              <input className={input} type="url" value={d.site} onChange={(e) => set("site", e.target.value)} placeholder="https:// — leave blank if it has none" />
            </Field>
            <Field label="Since" hint="Year it opened, shown as a badge. Optional."><input className={input} value={d.since} onChange={(e) => set("since", e.target.value)} maxLength={12} /></Field>
          </div>
          <label className="mt-4 flex items-start gap-3 text-small text-ink">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-gold" checked={d.liveDetails} onChange={(e) => set("liveDetails", e.target.checked)} />
            <span><b>Read hours, phone and address live from this website.</b> Turn on once the site publishes schema.org hours (a JSON-LD Restaurant block). When the site publishes them, they replace the values below on the card.</span>
          </label>
        </Panel>

        <Panel title="Check the site" aside={
          <button type="button" onClick={check} disabled={checking || !d.site} className="rounded-pill border border-line bg-paper px-4 py-2 text-small font-bold text-ink hover:border-gold disabled:opacity-50">
            {checking ? "Reading the site…" : snap ? "Check again" : "Check the site now"}
          </button>}>
          {!snap && <p className="text-small text-muted">Reads the restaurant&apos;s home page right now: what it publishes, and the photos on it you can use for the card.</p>}
          {snap && !snap.ok && <p className="text-small font-semibold text-blue">⚠ {snap.error}</p>}
          {snap?.ok && (
            <div className="space-y-3 text-small">
              {!snap.phone && !snap.address && !liveHours
                ? <p className="text-gold-ink">The site is up, but it publishes no hours, phone or address in a form the card can read. Enter them below.</p>
                : <>
                    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
                      <dt className="font-semibold">Phone</dt><dd>{snap.phone ?? <i className="text-muted">not published</i>}</dd>
                      <dt className="font-semibold">Address</dt><dd>{snap.address ?? <i className="text-muted">not published</i>}</dd>
                      <dt className="font-semibold">Hours</dt>
                      <dd>{liveHours ? DAY_NAMES.map((n, i) => {
                        const differs = formatRange(liveHours[i]) !== formHours[i];
                        return <span key={n} className={`mr-3 inline-block ${differs ? "font-semibold text-blue" : ""}`}>{n.slice(0, 3)} {formatRange(liveHours[i])}</span>;
                      }) : <i className="text-muted">not published</i>}</dd>
                    </dl>
                    <button type="button" onClick={applySite} className="rounded-pill bg-ink px-4 py-2 text-small font-bold text-paper hover:bg-blue">Copy these into the form</button>
                  </>}
            </div>
          )}
        </Panel>

        <Panel title="Restaurant image">
          <div className="grid gap-5 sm:grid-cols-[260px_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-mist">
              {preview ? <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-small text-muted">No photo yet</span>}
            </div>
            <div className="space-y-4">
              <Field label="Upload an image or homepage screenshot" hint="JPEG, PNG or WebP, under 4 MB. About 1600 px wide is plenty. Preview the card crop here before saving.">
                <input ref={fileRef} name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={(e) => { const f = e.target.files?.[0]; setFilePreview(f ? URL.createObjectURL(f) : null); }}
                  className="mt-1.5 block w-full text-small file:mr-3 file:rounded-pill file:border-0 file:bg-ink file:px-4 file:py-2 file:text-small file:font-bold file:text-paper" />
              </Field>
              {(filePreview || copyFrom) && (
                <button type="button" className="text-small font-semibold text-blue hover:underline"
                  onClick={() => { setCopyFrom(""); setFilePreview(null); if (fileRef.current) fileRef.current.value = ""; }}>
                  Keep the current photo instead
                </button>
              )}
              <Field label="What the photo shows" hint="Read aloud by screen readers, e.g. “The dining room — yellow walls and black booths”.">
                <input className={input} value={d.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} maxLength={160} />
              </Field>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-small font-semibold text-ink">Or pick a photo from the restaurant&apos;s home page</p>
            {!snap && <p className="mt-1 text-small text-muted">Use <b>Check the site now</b> above to load them.</p>}
            {snap?.ok && snap.images.length === 0 && <p className="mt-1 text-small text-muted">No photos found on that page.</p>}
            {snap?.ok && snap.images.length > 0 && (
              <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                {snap.images.map((im) => (
                  <li key={im.src}>
                    <button type="button" title={im.alt || im.src}
                      onClick={() => { setCopyFrom(im.src); setFilePreview(null); if (fileRef.current) fileRef.current.value = ""; if (im.alt && !/^Link-preview|^Image listed/.test(im.alt)) set("imageAlt", im.alt); }}
                      className={`relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-mist ${copyFrom === im.src ? "border-gold ring-2 ring-gold/40" : "border-transparent hover:border-line"}`}>
                      <img src={im.src} alt={im.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <Panel title="Location & contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Street address"><input className={input} value={d.address} onChange={(e) => set("address", e.target.value)} placeholder="5201 St Charles Rd, Bellwood, IL 60104" /></Field>
            <Field label="Phone" hint="Leave blank if the business doesn't list one."><input className={input} type="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(773) 555-0100" /></Field>
            <Field label="Neighborhood"><input className={input} value={d.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} /></Field>
            <Field label="Corridor" hint="Which group it sits in on the trail.">
              <select className={input} value={d.corridor} onChange={(e) => set("corridor", e.target.value as StopDraft["corridor"])}>
                {CORRIDOR_KEYS.map((k) => <option key={k} value={k}>{CORRIDORS[k].label}</option>)}
              </select>
            </Field>
          </div>
        </Panel>

        <Panel title="Map location" aside={<button type="button" onClick={locate} disabled={locating || !d.address.trim()} className="min-h-11 rounded-pill border border-line px-4 py-2 text-small font-bold disabled:opacity-50">{locating ? "Finding location…" : "Find from address"}</button>}>
          <p className="mb-4 text-small text-muted">Find the restaurant using its street address above. If you leave both coordinates blank, it still appears in the directory but has no map pin.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude"><input className={input} type="number" step="any" min="-85" max="85" value={d.lat} onChange={e => set("lat", e.target.value)} /></Field>
            <Field label="Longitude"><input className={input} type="number" step="any" min="-180" max="180" value={d.lng} onChange={e => set("lng", e.target.value)} /></Field>
          </div>
          {locationMessage && <p role="status" className="mt-3 text-small">{locationMessage}</p>}
        </Panel>

        <Panel title="Food & filters">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cuisine tags" hint="Comma-separated. These drive the Food pills — e.g. Barbecue, Soul Food, Caribbean, Bakery.">
              <input className={input} value={d.cuisine} onChange={(e) => set("cuisine", e.target.value)} />
            </Field>
            <Field label="Signature dishes" hint="Comma-separated. Searchable on the trail.">
              <input className={input} value={d.signature} onChange={(e) => set("signature", e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
            <fieldset>
              <legend className="text-small font-semibold text-ink">Dining</legend>
              <div className="mt-2 flex flex-wrap gap-4 text-small">
                {([["yes", "Dine in"], ["no", "Carryout only"], ["unknown", "Not confirmed"]] as const).map(([v, l]) => (
                  <label key={v} className="flex items-center gap-2"><input type="radio" className="accent-gold" checked={d.dineIn === v} onChange={() => set("dineIn", v)} />{l}</label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-small font-semibold text-ink">Meals</legend>
              <div className="mt-2 flex flex-wrap gap-4 text-small">
                {MEAL_OPTIONS.map((m) => (
                  <label key={m} className="flex items-center gap-2 capitalize">
                    <input type="checkbox" className="accent-gold" checked={d.meals.includes(m)}
                      onChange={(e) => set("meals", e.target.checked ? [...d.meals, m] : d.meals.filter((x) => x !== m))} />{m}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </Panel>

        <Panel title="Hours" aside={d.liveDetails ? <span className="text-xs text-muted">Used only when the site doesn&apos;t publish hours</span> : undefined}>
          <p className="mb-3 text-small text-muted">A closing time earlier than the opening time means it runs past midnight (open 11:00 AM, close 1:00 AM).</p>
          <div className="space-y-2">
            {d.hours.map((row, i) => {
              const upd = (patch: Partial<typeof row>) => set("hours", d.hours.map((r, j) => (j === i ? { ...r, ...patch } : r)));
              return (
                <div key={DAY_NAMES[i]} className="flex flex-wrap items-center gap-3 text-small">
                  <span className="w-24 font-semibold">{DAY_NAMES[i]}</span>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-gold" checked={row.closed} onChange={(e) => upd({ closed: e.target.checked })} />Closed</label>
                  {!row.closed && <>
                    <input type="time" aria-label={`${DAY_NAMES[i]} opens`} className="rounded-lg border border-line px-2 py-1.5" value={row.open} onChange={(e) => upd({ open: e.target.value })} required />
                    <span className="text-muted">to</span>
                    <input type="time" aria-label={`${DAY_NAMES[i]} closes`} className="rounded-lg border border-line px-2 py-1.5" value={row.close} onChange={(e) => upd({ close: e.target.value })} required />
                  </>}
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Visibility">
          <label className="flex items-start gap-3 text-small text-ink">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-gold" checked={d.hidden} onChange={(e) => set("hidden", e.target.checked)} />
            <span><b>Hide this stop from the trail.</b> It stays here so you can bring it back.</span>
          </label>
        </Panel>

        {state.error && <p role="alert" className="rounded-xl border border-blue/30 bg-blue/5 px-4 py-3 text-small font-semibold text-blue">{state.error}</p>}
        <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-line bg-mist/95 px-5 py-4 backdrop-blur">
          <button disabled={saving} className="rounded-pill bg-gold px-6 py-3 text-small font-bold text-ink hover:bg-blue hover:text-paper disabled:opacity-60">
            {saving ? "Saving…" : slug ? "Save changes" : "Add to the path"}
          </button>
          <Link href="/admin" className="text-small font-semibold text-muted hover:text-ink">Cancel</Link>
        </div>
      </form>

      {slug && (
        <div className="flex items-center justify-between rounded-2xl border border-line bg-paper px-5 py-4">
          <p className="text-small text-muted">Delete removes the stop for good. To take it off the trail for now, use <b>Hide</b> above.</p>
          <ConfirmButton action={deleteStop} fields={{ slug, version }} label="Delete stop" confirmLabel="Yes, delete it" />
        </div>
      )}
    </div>
  );
}

function Panel({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-head text-h4 text-ink">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-small font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
