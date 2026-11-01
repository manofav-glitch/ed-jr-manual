export function Placeholder({ title }: { title: string }) {
  return (
    <main className="pt-safe px-safe mx-auto max-w-3xl py-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted">Coming in the next build step.</p>
    </main>
  );
}
