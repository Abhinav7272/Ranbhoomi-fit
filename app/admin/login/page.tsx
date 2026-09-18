"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Wrong password.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="text-sm text-cream-dim">Ranbhoomi</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Admin</h1>
        <label className="mt-8 block text-sm text-cream-dim" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3 text-cream placeholder:text-cream/40"
          autoComplete="current-password"
          required
        />
        {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-cream px-6 py-3 text-sm font-semibold text-plum hover:bg-white disabled:opacity-60"
        >
          {pending ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}
