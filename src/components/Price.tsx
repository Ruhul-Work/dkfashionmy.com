import { discountPercent, money } from '../lib/pricing'

export default function Price({
  price,
  mrp,
  size = 'md',
  className = '',
}: {
  price: string | number | null | undefined
  mrp?: string | number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const off = discountPercent(price, mrp)
  const sizes = {
    sm: 'text-[12px]',
    md: 'text-[13px] sm:text-sm',
    lg: 'text-2xl sm:text-3xl',
  } as const
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`font-semibold ${off ? 'text-caramel-deep' : 'text-moss'} ${sizes[size]}`}>{money(price)}</span>
      {off > 0 && (
        <span className={`text-olive line-through ${size === 'lg' ? 'text-base' : 'text-[11px]'}`}>{money(mrp)}</span>
      )}
      {off > 0 && (
        <span className="rounded-full bg-eucalyptus px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-moss">
          −{off}%
        </span>
      )}
    </span>
  )
}
