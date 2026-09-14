import type { Update } from "@/content/updates";
import { Arrow } from "./icons";
export function Updates({ updates }: { updates: Update[] }) {
  if (!updates.length) return null;
  const sorted = [...updates].sort((a, b) => b.date.localeCompare(a.date));
  const fmt = (date: string) => new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return <section id="updates" className="site-container updates-section" aria-labelledby="updates-heading">
    <div className="section-heading"><div><h2 id="updates-heading">Fresh from the neighborhood.</h2><p>New arrivals, good news, and the people behind the path.</p></div></div>
    <ol className="update-grid">{sorted.map(u => <li key={u.id} className="update-card"><div className="update-meta"><span>{u.tag}</span><time dateTime={u.date}>{fmt(u.date)}</time></div><h3>{u.title}</h3><p>{u.body}</p>{u.href && <a href={u.href} target="_blank" rel="noopener noreferrer">Read the story<Arrow /><span className="sr-only"> — {u.title}, opens in a new tab</span></a>}</li>)}</ol>
  </section>;
}
