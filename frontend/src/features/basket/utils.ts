export function formatPrice(price: number) {
  const parts = price.toFixed(2).split('.');
  return `€${parts[0]}-${parts[1]}`;
}
