import React from 'react';
import Badge from '../ui/Badge';

const StockBadge = ({ quantity, minStock }) => {
  if (quantity === 0) {
    return (
      <Badge variant="danger" className="gap-1">
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
        Out of Stock
      </Badge>
    );
  }
  
  if (quantity <= minStock) {
    return (
      <Badge variant="warning" className="gap-1">
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge variant="success" className="gap-1">
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      In Stock
    </Badge>
  );
};

export default StockBadge;
