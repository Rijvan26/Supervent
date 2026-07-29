export const getStockStatus = (quantity, minimumStock) => {
  const normalizedQuantity = Number(quantity) || 0;
  const normalizedMinimum = Number(minimumStock) || 0;

  if (normalizedQuantity === 0) {
    return { status: 'Out of Stock', color: 'red' };
  }

  if (normalizedQuantity <= normalizedMinimum) {
    return { status: 'Low Stock', color: 'amber' };
  }

  return { status: 'In Stock', color: 'green' };
};
