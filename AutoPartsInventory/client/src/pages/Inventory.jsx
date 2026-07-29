import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import StockBadge from '../components/inventory/StockBadge';
import Modal from '../components/ui/Modal';
import PartForm from '../components/inventory/PartForm';
import SellModal from '../components/inventory/SellModal';
import PartDetail from '../components/inventory/PartDetail';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCube, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { getStockStatus } from '../utils/stock';

const Inventory = () => {
  const { parts, categories, loading, fetchParts, deletePart } = useInventory();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const quantityParam = params.get('quantity');
    const statusParam = params.get('status');

    if (quantityParam === '0') {
      setStatusFilter('Out of Stock');
    } else if (statusParam) {
      setStatusFilter(statusParam);
    }

    fetchParts({
      search: searchTerm,
      category: categoryFilter,
      status: quantityParam === '0' ? 'Out of Stock' : (statusParam || statusFilter)
    });
  }, [searchTerm, categoryFilter, location.search]);

  const handleEdit = (part, e) => {
    e.stopPropagation();
    setSelectedPart(part);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this part?')) {
      await deletePart(id);
    }
  };

  const handleSell = (part, e) => {
    e.stopPropagation();
    setSelectedPart(part);
    setIsSellOpen(true);
  };

  const handleRowClick = (part) => {
    setSelectedPart(part);
    setIsDetailOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Inventory List</h2>
        <Button onClick={() => { setSelectedPart(null); setIsFormOpen(true); }}>
          <HiOutlinePlus size={20} /> Add Part
        </Button>
      </div>

      <div className="glass-card inventory-toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by part #, name..." />
        <select className="form-control inventory-filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select className="form-control inventory-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <Loader />
        ) : parts.length === 0 ? (
          <EmptyState icon={HiOutlineCube} title="No parts found" message="Try adjusting your filters or add a new part." />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(part => {
                const stockStatus = getStockStatus(part.quantity, part.minStockLevel);
                return (
                  <tr key={part._id} onClick={() => handleRowClick(part)} style={{ cursor: 'pointer' }}>
                    <td><span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{part.partNumber}</span></td>
                    <td style={{ fontWeight: 500 }}>{part.name}</td>
                    <td>{part.category?.name || '-'}</td>
                    <td>{part.location ? `${part.location.warehouse} ${part.location.shelf}` : '-'}</td>
                    <td>₨{part.sellingPrice?.toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>{part.quantity}</td>
                    <td><StockBadge quantity={part.quantity} minStock={part.minStockLevel} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'nowrap', alignItems: 'center' }}>
                        <button className="btn-icon btn-ghost" title="Edit" onClick={(e) => handleEdit(part, e)}><HiOutlinePencil size={18} className="text-blue-500" /></button>
                        <button className="btn-icon btn-ghost" title="Sell" onClick={(e) => handleSell(part, e)}><HiOutlineCurrencyDollar size={18} className="text-emerald-500" /></button>
                        <button className="btn-icon btn-ghost" title="Delete" onClick={(e) => handleDelete(part._id, e)}><HiOutlineTrash size={18} className="text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedPart ? 'Edit Part' : 'Add New Part'}>
        <PartForm part={selectedPart} onClose={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Part Details">
        <PartDetail part={selectedPart} />
      </Modal>

      <Modal isOpen={isSellOpen} onClose={() => setIsSellOpen(false)} title="Sell Part">
        <SellModal part={selectedPart} onClose={() => setIsSellOpen(false)} />
      </Modal>
    </div>
  );
};

export default Inventory;
