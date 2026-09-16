import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/app/lib/admin-auth";
import { storageMode } from "@/app/lib/content-store";
import { logout } from "../actions";

const STORAGE_NOTE = {
  blob: null,
  local: "Local mode: saves go to .content/ on this computer, not to the live site.",
  readonly: "Storage isn't connected, so nothing can be saved. Connect a Vercel Blob store to this project.",
} as const;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const note = STORAGE_NOTE[storageMode()];
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/images/brand/gci-logo.png" alt="" aria-hidden width={400} height={311} className="h-9 w-auto" />
            <span className="font-head text-base text-ink">Culinary Trail admin</span>
          </Link>
          <nav className="flex shrink-0 items-center gap-3 whitespace-nowrap text-xs font-semibold sm:gap-5 sm:text-small">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-ink">View site ↗</a>
            <form action={logout}><button className="text-crimson hover:underline">Log out</button></form>
          </nav>
        </div>
      </header>
      {note && <p className="border-b border-gold/40 bg-gold/15 px-5 py-2 text-center text-small text-ink">{note}</p>}
      <main className="mx-auto max-w-[1100px] px-5 py-8 md:py-10">{children}</main>
    </>
  );
}
