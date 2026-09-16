import { requireAdmin } from "@/app/lib/admin-auth";
import { readContent } from "@/app/lib/content-store";
import { StopForm } from "../../../_components/StopForm";
import { toDraft } from "../../../stop-draft";

export default async function NewStop() {
  await requireAdmin();
  const { version } = await readContent();
  return <StopForm slug="" initial={toDraft()} version={version} imageSrc={null} />;
}
