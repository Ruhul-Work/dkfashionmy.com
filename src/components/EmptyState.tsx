export default function EmptyState({
  title = 'Nothing here yet',
  hint,
  actionLabel,
  onAction,
}: {
  title?: string
  hint?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 h-24 w-40 rounded-[1.4rem] img-fallback shadow-soft" aria-hidden />
      <p className="font-display text-2xl text-moss">{title}</p>
      {hint && <p className="mt-2 max-w-sm text-sm leading-relaxed text-olive">{hint}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          data-cursor="hover"
          className="mt-6 rounded-full border border-hairline bg-ivory px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-moss transition-colors hover:border-caramel hover:text-caramel-deep"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
