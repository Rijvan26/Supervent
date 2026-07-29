import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Button from '../ui/Button';

const PartForm = ({ part = null, onClose }) => {
  const { categories, suppliers, addPart, updatePart } = useInventory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    partNumber: '', name: '', description: '', category: '', supplier: '',
    costPrice: '', sellingPrice: '', quantity: '', minStockLevel: '',
    location: { warehouse: '', shelf: '', bin: '' },
    compatibleVehicles: '', notes: ''
  });

  useEffect(() => {
    if (part) {
      setFormData({
        ...part,
        compatibleVehicles: part.compatibleVehicles?.join(', ') || '',
        location: part.location || { warehouse: '', shelf: '', bin: '' }
      });
    } else if (categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [part, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('loc_')) {
      const field = name.split('_')[1];
      setFormData(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = {
      ...formData,
      compatibleVehicles: formData.compatibleVehicles.split(',').map(v => v.trim()).filter(Boolean),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      minStockLevel: Number(formData.minStockLevel)
    };

    let success;
    if (part) {
      success = await updatePart(part._id, submitData);
    } else {
      success = await addPart(submitData);
    }

    setLoading(false);
    if (success) onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid-cols-2 gap-4" style={{ display: 'grid' }}>
        <div className="form-group">
          <label className="form-label">Part Number *</label>
          <input required type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Part Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="grid-cols-2 gap-4" style={{ display: 'grid' }}>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="form-control">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Supplier</label>
          <select name="supplier" value={formData.supplier} onChange={handleChange} className="form-control">
            <option value="">Select Supplier</option>
            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="2"></textarea>
      </div>

      <div className="grid-cols-4 gap-4" style={{ display: 'grid' }}>
        <div className="form-group">
          <label className="form-label">Cost Price (₨)</label>
          <input type="number" min="0" step="0.01" name="costPrice" value={formData.costPrice} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Selling Price (₨)</label>
          <input type="number" min="0" step="0.01" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Min Stock</label>
          <input required type="number" min="0" name="minStockLevel" value={formData.minStockLevel} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div>
        <label className="form-label">Location</label>
        <div className="grid-cols-3 gap-4" style={{ display: 'grid' }}>
          <input type="text" name="loc_warehouse" placeholder="Warehouse" value={formData.location.warehouse} onChange={handleChange} className="form-control" />
          <input type="text" name="loc_shelf" placeholder="Shelf" value={formData.location.shelf} onChange={handleChange} className="form-control" />
          <input type="text" name="loc_bin" placeholder="Bin" value={formData.location.bin} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Compatible Vehicles (comma separated)</label>
        <input type="text" name="compatibleVehicles" value={formData.compatibleVehicles} onChange={handleChange} className="form-control" placeholder="e.g. Toyota Corolla 2020, Honda Civic 2019" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" isLoading={loading}>{part ? 'Update Part' : 'Add Part'}</Button>
      </div>
    </form>
  );
};

export default PartForm;
