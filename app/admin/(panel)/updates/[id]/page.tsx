import { notFound } from "next/navigation";
import { readContent } from "@/app/lib/content-store";
import { UpdateForm } from "../../../_components/UpdateForm";

export default async function EditUpdate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { updates, version } = await readContent();
  const update = updates.find((u) => u.id === id);
  if (!update) notFound();
  return <UpdateForm key={version} update={update} version={version} today={update.date} />;
}
