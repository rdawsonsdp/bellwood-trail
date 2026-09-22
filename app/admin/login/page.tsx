import Image from "next/image";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/app/lib/admin-auth";
import { LoginForm } from "../_components/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 shadow-card">
        <Image src="/images/brand/bellwood-logo.png" alt="" aria-hidden width={400} height={170} className="h-12 w-auto" />
        <h1 className="font-head mt-5 text-h3 text-ink">Culinary Trail admin</h1>
        <p className="mt-1 text-small text-muted">Edit the stops on the trail and the updates feed.</p>
        {adminConfigured()
          ? <LoginForm />
          : <p className="mt-6 rounded-xl bg-mist p-4 text-small text-ink">Admin is switched off: set <code className="font-semibold">ADMIN_PASSWORD</code> in this project&apos;s environment variables.</p>}
      </div>
    </div>
  );
}
