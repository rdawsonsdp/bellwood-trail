import { UPDATES } from "@/content/updates";

const TAG: Record<string, string> = { "New on the path": "bg-orange text-ink", Event: "bg-crimson text-paper", FoodLab: "bg-gold text-ink", Announcement: "bg-ink text-paper" };

export function Updates() {
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <section id="updates" className="scroll-mt-28 bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-ink">Updates</p>
        <h2 className="font-display mt-2 text-h1 text-crimson">What's new <span className="text-orange">on the path</span></h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {UPDATES.map((u) => (
            <li key={u.date + u.title} className="flex flex-col rounded-2xl border border-line bg-paper p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-pill px-2.5 py-1 text-xs font-bold ${TAG[u.tag]}`}>{u.tag}</span>
                <time dateTime={u.date} className="text-xs font-semibold text-warm-gray">{fmt(u.date)}</time>
              </div>
              <h3 className="font-head mt-4 text-h4 leading-tight text-ink">{u.title}</h3>
              <p className="mt-2 flex-1 text-small leading-relaxed text-warm-gray">{u.body}</p>
              {u.href && <a href={u.href} target="_blank" rel="noopener noreferrer" className="mt-4 text-small font-bold text-crimson hover:text-orange-ink">Read more →</a>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
