import React, { useEffect, useState } from 'react';
import { inventoryApi } from '../services/api';
import { useInventory } from '../context/InventoryContext';
import StockBadge from '../components/inventory/StockBadge';
import RestoreModal from '../components/inventory/RestoreModal';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { HiOutlineExclamationTriangle, HiOutlineArrowUpTray, HiOutlineEye, HiOutlinePencil } from 'react-icons/hi2';
import { getStockStatus } from '../utils/stock';

const LowStock = () => {
  const [lowStockParts, setLowStockParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  const { fetchStats, fetchParts } = useInventory();

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getLowStock();
      const fetched = res.data?.data ?? res.data;
      setLowStockParts(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const handleRestoreClose = () => {
    setIsRestoreOpen(false);
    fetchLowStock();
    fetchStats();
    fetchParts();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--accent-warning-transparent)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <HiOutlineExclamationTriangle size={32} className="text-amber-500" />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Low Stock Alerts</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Items that are below their minimum stock level or out of stock.</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : lowStockParts.length === 0 ? (
        <EmptyState icon={HiOutlineExclamationTriangle} title="All Good!" message="You have no low stock alerts at the moment." />
      ) : (
        <div className="grid-cols-3 gap-6" style={{ display: 'grid' }}>
          {lowStockParts.map(part => {
            const stockStatus = getStockStatus(part.quantity, part.minStockLevel);
            return (
            <div key={part._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: `4px solid ${stockStatus.color === 'red' ? 'var(--accent-danger)' : stockStatus.color === 'amber' ? 'var(--accent-warning)' : 'var(--accent-success)'}` }}>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <StockBadge quantity={part.quantity} minStock={part.minStockLevel} />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{part.partNumber}</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{part.name}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Qty</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: part.quantity === 0 ? 'var(--accent-danger)' : 'var(--text-primary)' }}>{part.quantity}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Min Level</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>{part.minStockLevel}</p>
                  </div>
                </div>
                
                {part.location && (
                  <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HiOutlineExclamationTriangle size={16} /> {part.location.warehouse} - {part.location.shelf}
                  </p>
                )}
              </div>
              <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => { setSelectedPart(part); setIsRestoreOpen(true); }}
                >
                  <HiOutlineArrowUpTray size={18} /> Restore Stock
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isRestoreOpen} onClose={() => setIsRestoreOpen(false)} title="Restore Stock">
        {selectedPart && <RestoreModal part={selectedPart} onClose={handleRestoreClose} />}
      </Modal>
    </div>
  );
};

export default LowStock;
