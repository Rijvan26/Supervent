import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Button from '../ui/Button';

const RestoreModal = ({ part, onClose }) => {
  const { restorePart } = useInventory();
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const restoreQty = Number(quantity);

    if (!Number.isInteger(restoreQty) || restoreQty <= 0) {
      setError('Please enter a positive quantity.');
      return;
    }

    setLoading(true);
    const success = await restorePart(part._id, restoreQty);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  if (!part) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <p className="text-sm text-slate-400">Product</p>
        <h3 className="text-lg font-semibold">{part.name}</h3>
        <p className="text-sm text-slate-400">Current stock: {part.quantity}</p>
      </div>

      {error ? <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">{error}</div> : null}

      <label className="form-group block">
        <span className="form-label">Quantity to add</span>
        <input className="form-control" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </label>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" isLoading={loading}>Confirm Restore</Button>
      </div>
    </form>
  );
};

export default RestoreModal;
