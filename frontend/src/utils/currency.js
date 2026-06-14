export const formatRupiah = (price) => {
  if (price === undefined || price === null) return 'Rp 0';
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return price; // fallback to original if not a number
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice);
};
