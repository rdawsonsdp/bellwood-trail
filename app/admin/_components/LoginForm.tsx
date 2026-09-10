"use client";
import { useActionState } from "react";
import { login, type FormState } from "../actions";
// The login form keeps React's reset on purpose: a wrong password should clear.

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-small font-semibold text-ink">Password</span>
        <input name="password" type="password" required autoFocus autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-body focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40" />
      </label>
      {state.error && <p role="alert" className="text-small font-semibold text-crimson">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-pill bg-orange py-3 text-small font-bold text-ink transition-colors hover:bg-crimson hover:text-paper disabled:opacity-60">
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
