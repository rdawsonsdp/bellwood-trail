import { notFound } from "next/navigation";
import { readContent } from "@/app/lib/content-store";
import { resolveStops } from "@/app/lib/live-status";
import { StopForm } from "../../../_components/StopForm";
import { toDraft } from "../../../stop-draft";

export default async function EditStop({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { restaurants, version } = await readContent();
  const stop = restaurants.find((r) => r.slug === slug);
  if (!stop) notFound();
  // Resolve the photo the way the card does, for the preview.
  const [card] = await resolveStops([{ ...stop, hidden: false, builtByGci: false }]);
  return <StopForm key={version} slug={slug} initial={toDraft(stop)} version={version} imageSrc={card.imageSrc} />;
}
