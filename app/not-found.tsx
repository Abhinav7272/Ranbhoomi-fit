import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-cream-dim">That page is not on this site.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-plum hover:bg-white"
      >
        Back home
      </Link>
    </main>
  );
}
