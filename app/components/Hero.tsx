import Image from "next/image";
import { SITE } from "@/content/restaurants";
import { Arrow } from "./icons";

// Full-bleed hero on GCI's own aerial of the corridor, headline set in the
// two-tone crimson/orange Figtree Black that gci2016.org leads with. The scrim
// runs near-solid ink behind the copy and opens to the right, so the street
// stays visible — and so the copy contrast does not depend on the photograph.
export function Hero({ count }: { count: number }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image src="/images/brand/hero-corridor-aerial.jpg" alt="Aerial view of the 79th Street corridor in Greater Chatham" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/92 via-ink/70 to-ink/25" />
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-20 sm:px-6 md:py-28 lg:py-36">
        <p className="w-fit rounded-pill border border-gold/60 bg-ink/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
          Chicago's South Side · {count} kitchens · one path
        </p>
        <h1 className="font-display max-w-4xl text-hero text-paper">
          <span className="block text-orange">Taste the</span>
          <span className="block">Culinary Path</span>
          <span className="block text-orange">of Greater Chatham</span>
        </h1>
        <p className="max-w-xl text-h4 leading-snug text-paper/90">
          Fried chicken and jerk, barbecue and vegan soul food, donuts at dawn and caramel cake by afternoon — all within a few blocks of 75th and 79th. This is where Chicago's South Side eats.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="#path" className="inline-flex items-center gap-2 rounded-pill bg-orange px-7 py-3.5 text-small font-bold uppercase tracking-wider text-ink shadow-float transition-colors hover:bg-paper">
            Start the path <Arrow className="h-4 w-4" />
          </a>
          <a href="#updates" className="inline-flex items-center gap-2 rounded-pill border border-paper/60 px-7 py-3.5 text-small font-bold uppercase tracking-wider text-paper transition-colors hover:border-orange hover:text-orange">
            What's new
          </a>
        </div>
        <p className="text-small text-paper/70">Curated by the <a href={SITE.orgUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-orange">Greater Chatham Initiative</a> · an Illinois State-Designated Cultural District</p>
      </div>
    </section>
  );
}
