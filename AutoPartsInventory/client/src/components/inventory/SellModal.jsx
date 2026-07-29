import React, { useEffect, useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Button from '../ui/Button';

const SellModal = ({ part, onClose }) => {
  const { sellPart } = useInventory();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setError('');
  }, [part]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const saleQuantity = Number(quantity);

    if (!Number.isInteger(saleQuantity) || saleQuantity <= 0) {
      setError('Please enter a positive quantity.');
      return;
    }

    if (saleQuantity > (part?.quantity || 0)) {
      setError('Cannot sell more than current stock.');
      return;
    }

    setLoading(true);
    const success = await sellPart(part._id, saleQuantity);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  if (!part) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
        <p className="text-sm text-slate-400">Product</p>
        <h3 className="text-lg font-semibold">{part.name}</h3>
        <p className="text-sm text-slate-400">Current stock: {part.quantity}</p>
      </div>

      {error ? <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div> : null}

      <label className="form-group block">
        <span className="form-label">Quantity to sell</span>
        <input className="form-control" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </label>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" isLoading={loading}>Confirm Sale</Button>
      </div>
    </form>
  );
};

export default SellModal;
