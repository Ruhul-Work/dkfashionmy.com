export function SkeletonCard({ variant = 'grid' }: { variant?: 'grid' | 'tile' | 'wide' }) {
  const height = variant === 'tile' ? 'h-56 sm:h-64' : variant === 'wide' ? 'h-64 sm:h-72' : 'aspect-[3/3.8]'
  return (
    <div className="overflow-hidden rounded-[1.6rem] img-fallback shadow-soft">
      <div className={`${height} w-full animate-pulse bg-sand/80`} />
    </div>
  )
}

export function SkeletonSearchRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-sand" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-sand" />
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-sand/90" />
      </div>
      <div className="h-3 w-14 animate-pulse rounded bg-sand" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 animate-pulse rounded bg-sand ${i === lines - 1 ? 'w-1/2' : 'w-full'}`}
        />
      ))}
    </div>
  )
}
