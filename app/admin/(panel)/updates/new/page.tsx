import { requireAdmin } from "@/app/lib/admin-auth";
import { readContent } from "@/app/lib/content-store";
import { UpdateForm } from "../../../_components/UpdateForm";

export default async function NewUpdate() {
  await requireAdmin();
  const { version } = await readContent();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date()); // YYYY-MM-DD
  return <UpdateForm version={version} today={today} />;
}
