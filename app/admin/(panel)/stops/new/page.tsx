import { readContent } from "@/app/lib/content-store";
import { StopForm } from "../../../_components/StopForm";
import { toDraft } from "../../../stop-draft";

export default async function NewStop() {
  const { version } = await readContent();
  return <StopForm slug="" initial={toDraft()} version={version} imageSrc={null} />;
}
