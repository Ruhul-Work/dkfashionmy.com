export function money(value: string | number | null | undefined): string {
  const n = Number(value ?? 0)
  if (!Number.isFinite(n)) return 'RM —'
  return `RM ${Math.round(n).toLocaleString('en-MY')}`
}

export function discountPercent(
  price: string | number | null | undefined,
  mrp: string | number | null | undefined,
): number {
  const p = Number(price ?? 0)
  const m = Number(mrp ?? 0)
  if (!Number.isFinite(p) || !Number.isFinite(m) || m <= p || p <= 0) return 0
  return Math.round((1 - p / m) * 100)
}
