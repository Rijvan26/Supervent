import React from 'react';
import StockBadge from './StockBadge';

const PartDetail = ({ part }) => {
  if (!part) return null;

  const DetailRow = ({ label, value }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value || '-'}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{part.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>#{part.partNumber}</p>
        </div>
        <StockBadge quantity={part.quantity} minStock={part.minStockLevel} />
      </div>

      <div className="grid-cols-2 gap-6" style={{ display: 'grid' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Quantity in Stock</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{part.quantity}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Min Stock Level</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{part.minStockLevel}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Cost Price</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>₨{part.costPrice?.toFixed(2)}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Selling Price</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>₨{part.sellingPrice?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</h4>
          {part.location ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <DetailRow label="Warehouse" value={part.location.warehouse} />
              <DetailRow label="Shelf" value={part.location.shelf} />
              <DetailRow label="Bin" value={part.location.bin} />
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No location set</p>
          )}
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Details</h4>
        <DetailRow label="Description" value={part.description} />
        <DetailRow label="Category" value={part.category?.name || 'Uncategorized'} />
        <DetailRow label="Supplier" value={part.supplier?.name || 'Unknown'} />
        <DetailRow label="Compatible Vehicles" value={part.compatibleVehicles?.join(', ')} />
        {part.notes && <DetailRow label="Notes" value={part.notes} />}
      </div>
    </div>
  );
};

export default PartDetail;
