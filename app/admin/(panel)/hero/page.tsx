import { requireAdmin } from "@/app/lib/admin-auth";
import { readContent, storageMode } from "@/app/lib/content-store";
import { DEFAULT_HERO } from "@/content/hero";
import { HeroForm } from "../../_components/HeroForm";
export default async function HeroEditor({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const content = await readContent();
  const { saved } = await searchParams;
  return <HeroForm key={content.version} hero={content.hero ?? DEFAULT_HERO} version={content.version} saved={saved === "1"} readonly={storageMode() === "readonly"} />;
}
