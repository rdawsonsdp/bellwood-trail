import Image from "next/image";
import { SITE } from "@/content/restaurants";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-paper p-1.5"><Image src="/images/brand/gci-logo.png" alt="Greater Chatham Initiative" width={400} height={311} className="h-10 w-auto" /></span>
            <p className="font-head text-h4">{SITE.name}</p>
          </div>
          <p className="mt-4 max-w-md text-small text-paper/75">{SITE.description}</p>
        </div>
        <div className="text-small text-paper/75">
          <p className="font-head text-base text-paper">Greater Chatham Initiative</p>
          <p className="mt-2">A nonprofit revitalizing Chatham, Greater Grand Crossing, Avalon Park and Auburn Gresham through business, housing, culture and sustainability.</p>
          <p className="mt-3"><a href={SITE.orgUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-orange hover:underline">gci2016.org →</a></p>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">© {new Date().getFullYear()} Greater Chatham Initiative · Each kitchen's hours are read live from its own website.</div>
    </footer>
  );
}
