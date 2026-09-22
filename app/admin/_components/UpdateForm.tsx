"use client";
import Link from "next/link";
import { useActionState } from "react";
import { UPDATE_TAGS, type Update } from "@/content/updates";
import { saveUpdate, type FormState } from "../actions";
import { keepOnError } from "./keep-on-error";

const input = "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-body text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

export function UpdateForm({ update, version, today }: { update?: Update; version: string; today: string }) {
  const [state, action, saving] = useActionState<FormState, FormData>(saveUpdate, {});
  return (
    <div className="space-y-6">
      <Link href="/admin#updates" className="text-small font-semibold text-muted hover:text-ink">← All updates</Link>
      <h1 className="font-head text-h2 text-ink">{update ? "Edit update" : "Add an update"}</h1>
      <form onSubmit={keepOnError(action)} className="space-y-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <input type="hidden" name="id" value={update?.id ?? ""} />
        <input type="hidden" name="version" value={version} />
        <label className="block">
          <span className="text-small font-semibold">Headline</span>
          <input name="title" className={input} defaultValue={update?.title} required maxLength={120} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-small font-semibold">Date</span>
            <input name="date" type="date" className={input} defaultValue={update?.date ?? today} required />
          </label>
          <label className="block">
            <span className="text-small font-semibold">Label</span>
            <select name="tag" className={input} defaultValue={update?.tag ?? "New on the path"}>
              {UPDATE_TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-small font-semibold">Text</span>
          <textarea name="body" rows={4} className={input} defaultValue={update?.body} required maxLength={600} />
          <span className="mt-1 block text-xs text-muted">A sentence or two. Shown in full on the card.</span>
        </label>
        <label className="block">
          <span className="text-small font-semibold">Link</span>
          <input name="href" type="url" className={input} defaultValue={update?.href} placeholder="https:// — optional" />
          <span className="mt-1 block text-xs text-muted">Adds a “Read more” link to the card.</span>
        </label>
        {state.error && <p role="alert" className="rounded-xl border border-blue/30 bg-blue/5 px-4 py-3 text-small font-semibold text-blue">{state.error}</p>}
        <div className="flex items-center gap-3">
          <button disabled={saving} className="rounded-pill bg-gold px-6 py-3 text-small font-bold text-ink hover:bg-blue hover:text-paper disabled:opacity-60">
            {saving ? "Saving…" : update ? "Save changes" : "Publish update"}
          </button>
          <Link href="/admin#updates" className="text-small font-semibold text-muted hover:text-ink">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
