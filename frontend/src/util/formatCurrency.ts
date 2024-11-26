export function formatCurrency(number: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number)
}

export function formatDistance(distance: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "unit",
    unit: "kilometer",
    maximumSignificantDigits: 2,
    roundingMode: "ceil",
  }).format(distance)
}
