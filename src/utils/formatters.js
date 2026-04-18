export const formatCurrency = (value) => {
  if (value === undefined || value === null) return "$0.00";
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatCompactCurrency = (value) => {
  if (value === undefined || value === null) return "$0.00";
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
};