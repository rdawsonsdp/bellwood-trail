import Link from "next/link";
import { Suspense } from "react";
import { CORRIDORS } from "@/content/restaurants";
import { readContent } from "@/app/lib/content-store";
import { SiteHealth } from "../_components/SiteHealth";
import { ConfirmButton } from "../_components/ConfirmButton";
import { deleteUpdate, refreshSites } from "../actions";

const NOTICES: Record<string, string> = {
  refreshed: "Done — every card re-reads its restaurant's site on the next visit.",
  deleted: "Deleted.",
  conflict: "Someone else saved changes first, so nothing was deleted. The list below is current — try again.",
};

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const { restaurants, updates, version } = await readContent();
  const notice = q.saved ? `Saved${q.saved === "update" ? " the update" : ` ${q.saved}`}. The trail shows it now.`
    : Object.keys(NOTICES).map((k) => (q[k] ? NOTICES[k] : "")).find(Boolean);
  const corridors = Object.keys(CORRIDORS) as (keyof typeof CORRIDORS)[];

  return (
    <div className="space-y-12">
      {/* Floats, because a save lands back here wherever the list was scrolled. */}
      {notice && <p role="status" className="fixed inset-x-5 bottom-5 z-50 mx-auto max-w-xl rounded-xl bg-ink px-5 py-3 text-center text-small font-semibold text-paper shadow-float">{notice}</p>}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-head text-h2 text-ink">Stops on the path</h1>
            <p className="mt-1 max-w-2xl text-small text-warm-gray">
              Hours, phone and address on a card come live from the restaurant&apos;s own site when it publishes them. Everything else — name, photo, tagline, tags — is set here.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <form action={refreshSites}>
              <button className="rounded-pill border border-line bg-paper px-4 py-2.5 text-small font-bold text-ink hover:border-orange">Refresh all sites now</button>
            </form>
            <Link href="/admin/stops/new" className="rounded-pill bg-orange px-5 py-2.5 text-small font-bold text-ink hover:bg-crimson hover:text-paper">+ Add a stop</Link>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {corridors.map((c) => {
            const list = restaurants.filter((r) => r.corridor === c);
            if (!list.length) return null;
            return (
              <div key={c}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-ink">{CORRIDORS[c].label}</h2>
                <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
                  {list.map((r) => (
                    <li key={r.slug} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">
                          {r.name}
                          {r.hidden && <span className="ml-2 rounded-pill bg-ink/80 px-2 py-0.5 text-xs font-bold text-paper">Hidden</span>}
                        </p>
                        <p className="truncate text-xs text-warm-gray"><a href={r.site} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.site.replace(/^https?:\/\//, "")}</a></p>
                        <p className="mt-0.5 text-xs">
                          <Suspense fallback={<span className="text-warm-gray">Checking the site…</span>}>
                            <SiteHealth site={r.site} address={r.address} live={r.builtByGci} />
                          </Suspense>
                        </p>
                      </div>
                      <Link href={`/admin/stops/${r.slug}`} className="shrink-0 self-start rounded-pill border border-line px-4 py-2 text-small font-bold text-crimson hover:border-orange sm:self-center">Edit</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section id="updates" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-head text-h2 text-ink">Updates feed</h2>
            <p className="mt-1 text-small text-warm-gray">The &ldquo;What&apos;s new on the path&rdquo; cards, newest first.</p>
          </div>
          <Link href="/admin/updates/new" className="rounded-pill bg-orange px-5 py-2.5 text-small font-bold text-ink hover:bg-crimson hover:text-paper">+ Add an update</Link>
        </div>
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {[...updates].sort((a, b) => b.date.localeCompare(a.date)).map((u) => (
            <li key={u.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{u.title}</p>
                <p className="text-xs text-warm-gray">{u.date} · {u.tag}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/admin/updates/${u.id}`} className="rounded-pill border border-line px-4 py-2 text-small font-bold text-crimson hover:border-orange">Edit</Link>
                <ConfirmButton action={deleteUpdate} fields={{ id: u.id, version }} label="Delete" confirmLabel="Yes, delete" />
              </div>
            </li>
          ))}
          {updates.length === 0 && <li className="px-5 py-6 text-small text-warm-gray">No updates yet — the section is hidden on the site until you add one.</li>}
        </ul>
      </section>
    </div>
  );
}
