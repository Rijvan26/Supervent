import React, { useEffect, useState } from 'react';
import { inventoryApi } from '../services/api';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import StockBadge from '../components/inventory/StockBadge';
import { HiOutlineMapPin, HiChevronDown, HiChevronRight, HiMagnifyingGlass } from 'react-icons/hi2';

const formatLocationTitle = (locationId) => {
  if (!locationId) return 'Unassigned Location';
  if (typeof locationId === 'object' && locationId !== null) {
    const warehouseName = locationId.warehouse || 'Warehouse';
    const shelf = locationId.shelf ? `Shelf ${locationId.shelf}` : '';
    const bin = locationId.bin ? `Bin ${locationId.bin}` : '';
    return [warehouseName, shelf, bin].filter(Boolean).join(' • ');
  }
  return String(locationId);
};

const normalizeLocationId = (locationId, fallbackIndex) => {
  if (!locationId) return `unassigned-${fallbackIndex}`;
  if (typeof locationId === 'object' && locationId !== null) {
    return formatLocationTitle(locationId);
  }
  return String(locationId);
};

const StockLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWarehouses, setExpandedWarehouses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await inventoryApi.getLocations();
        const fetched = res.data?.data ?? res.data;
        const normalized = Array.isArray(fetched) ? fetched : [];
        setLocations(normalized);
        // Expand first by default
        if (normalized.length > 0) {
          setExpandedWarehouses({ [normalized[0]._id]: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const toggleWarehouse = (warehouse) => {
    setExpandedWarehouses(prev => ({ ...prev, [warehouse]: !prev[warehouse] }));
  };

  const filteredLocations = locations.filter((warehouse) => {
    const query = searchTerm.toLowerCase();
    const parts = Array.isArray(warehouse.parts) ? warehouse.parts : [];
    if (!query) return true;

    return parts.some((part) => {
      const searchable = [
        part.name,
        part.brand,
        part.category?.name,
        part.partNumber,
        part.location?.warehouse,
        part.location?.shelf,
        part.location?.bin,
      ].filter(Boolean).join(' ').toLowerCase();
      return searchable.includes(query);
    });
  });

  if (loading) return <Loader />;

  if (locations.length === 0) {
    return <EmptyState icon={HiOutlineMapPin} title="No locations configured" message="Assign locations to parts to see them organized here." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HiOutlineMapPin className="text-blue-500" /> Warehouse Organization
        </h2>
      </div>

      <div className="glass-card" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '540px' }}>
          <div style={{ position: 'absolute', insetY: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <HiMagnifyingGlass size={18} />
          </div>
          <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Search by part name, brand, category, location code, rack, shelf" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredLocations.map((warehouse, index) => {
          const warehouseId = normalizeLocationId(warehouse._id, index);
          const isExpanded = expandedWarehouses[warehouseId];
          const parts = Array.isArray(warehouse.parts) ? warehouse.parts : [];
          const totalParts = parts.reduce((sum, part) => sum + (part.quantity || 0), 0);
          
          return (
            <div key={warehouseId} className="glass-card" style={{ overflow: 'hidden' }}>
              <div 
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: isExpanded ? 'var(--bg-hover)' : 'transparent', transition: 'background-color 0.2s' }}
                onClick={() => toggleWarehouse(warehouseId)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isExpanded ? <HiChevronDown size={24} className="text-blue-500" /> : <HiChevronRight size={24} className="text-blue-500" />}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{formatLocationTitle(warehouse._id)}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{warehouse.count || parts.length} distinct items • {totalParts} total units</p>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-light)' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Shelf / Bin</th>
                        <th>Part</th>
                        <th>Part #</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map(part => (
                        <tr key={part._id || `${warehouseId}-${part.partNumber}`}> 
                          <td style={{ fontWeight: 500 }}>
                            {part.location?.shelf || '-'} {part.location?.bin ? `/ ${part.location.bin}` : ''}
                          </td>
                          <td>{part.name}</td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{part.partNumber}</td>
                          <td style={{ fontWeight: 600 }}>{part.quantity}</td>
                          <td><StockBadge quantity={part.quantity} minStock={part.minStockLevel} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        {filteredLocations.length === 0 ? <EmptyState icon={HiOutlineMapPin} title="No matching locations" message="Try a different search term." /> : null}
      </div>
    </div>
  );
};

export default StockLocations;
