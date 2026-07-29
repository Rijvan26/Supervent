import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Button from '../components/ui/Button';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi2';

const Settings = () => {
  const { categories, suppliers, addCategory, deleteCategory, addSupplier, deleteSupplier } = useInventory();
  const [activeTab, setActiveTab] = useState('categories');
  
  // Category state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Supplier state
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    await addCategory({ name: newCategoryName, description: newCategoryDesc });
    setNewCategoryName(''); setNewCategoryDesc('');
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!newSupplierName) return;
    await addSupplier({ 
      name: newSupplierName, 
      contactPerson: newSupplierContact,
      email: newSupplierEmail,
      phone: newSupplierPhone
    });
    setNewSupplierName(''); setNewSupplierContact(''); setNewSupplierEmail(''); setNewSupplierPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'categories' ? '2px solid var(--accent-primary)' : '2px solid transparent', color: activeTab === 'categories' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'suppliers' ? '2px solid var(--accent-primary)' : '2px solid transparent', color: activeTab === 'suppliers' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Suppliers
        </button>
      </div>

      <div className="grid-cols-2 gap-6" style={{ display: 'grid' }}>
        {activeTab === 'categories' && (
          <>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Add Category</h3>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input required type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input type="text" value={newCategoryDesc} onChange={e => setNewCategoryDesc(e.target.value)} className="form-control" />
                </div>
                <Button type="submit" style={{ alignSelf: 'flex-start' }}>Add Category</Button>
              </form>
            </div>
            
            <div className="glass-card table-container">
              <table className="table">
                <thead><tr><th>Name</th><th>Description</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.description}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => { if(window.confirm('Delete category?')) deleteCategory(c._id); }} className="btn-icon btn-ghost"><HiOutlineTrash className="text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'suppliers' && (
          <>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Add Supplier</h3>
              <form onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Supplier Name *</label>
                  <input required type="text" value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input type="text" value={newSupplierContact} onChange={e => setNewSupplierContact(e.target.value)} className="form-control" />
                </div>
                <div className="grid-cols-2 gap-4" style={{ display: 'grid' }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" value={newSupplierEmail} onChange={e => setNewSupplierEmail(e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" value={newSupplierPhone} onChange={e => setNewSupplierPhone(e.target.value)} className="form-control" />
                  </div>
                </div>
                <Button type="submit" style={{ alignSelf: 'flex-start' }}>Add Supplier</Button>
              </form>
            </div>
            
            <div className="glass-card table-container">
              <table className="table">
                <thead><tr><th>Supplier</th><th>Contact Info</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s._id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.contactPerson}</div>
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>
                        <div>{s.email}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{s.phone}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => { if(window.confirm('Delete supplier?')) deleteSupplier(s._id); }} className="btn-icon btn-ghost"><HiOutlineTrash className="text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
