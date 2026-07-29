import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Button from '../ui/Button';

const RestockModal = ({ part, onClose }) => {
  const { restockPart } = useInventory();
  const [addQty, setAddQty] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addQty || isNaN(addQty) || Number(addQty) <= 0) return;
    
    setLoading(true);
    const success = await restockPart(part._id, Number(addQty));
    setLoading(false);
    if (success) onClose();
  };

  const newTotal = part.quantity + (Number(addQty) || 0);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Restocking</p>
        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{part.partNumber} - {part.name}</h4>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Current Stock</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{part.quantity}</p>
        </div>
        <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>+</div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Add Quantity</p>
          <input 
            type="number" 
            autoFocus
            min="1" 
            value={addQty} 
            onChange={e => setAddQty(e.target.value)} 
            className="form-control" 
            style={{ width: '100px', fontSize: '1.25rem', textAlign: 'center' }} 
          />
        </div>
        <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>=</div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>New Total</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-success)' }}>{newTotal}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" isLoading={loading} disabled={!addQty || Number(addQty) <= 0}>Confirm Restock</Button>
      </div>
    </form>
  );
};

export default RestockModal;
