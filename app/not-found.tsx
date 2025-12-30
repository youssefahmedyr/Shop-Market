export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-400 mb-2">
          404 error
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          Page not found
        </h1>
        <p className="text-sm md:text-base text-slate-600 mb-4">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>+
      </div>
    </main>
  )
}
