import type { ProductSort } from '../lib/types'

const options: { value: ProductSort; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
]

export default function SortSelect({
  value,
  onChange,
}: {
  value: ProductSort
  onChange: (next: ProductSort) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sort products">
      <span className="text-[10px] uppercase tracking-[0.2em] text-olive">Sort</span>
      <div className="flex flex-wrap gap-1.5 rounded-full border border-hairline bg-ivory p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            data-cursor="hover"
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wide transition-colors ${
              value === o.value ? 'bg-moss text-ivory' : 'text-olive hover:text-moss'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
