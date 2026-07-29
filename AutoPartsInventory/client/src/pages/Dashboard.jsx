import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import PageTransition from '../components/ui/PageTransition';
import { HiOutlineCube, HiOutlineCurrencyRupee, HiOutlineExclamationTriangle, HiOutlineXCircle } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import StockBadge from '../components/inventory/StockBadge';
import { getStockStatus } from '../utils/stock';

const Dashboard = () => {
  const { stats, parts, fetchParts } = useInventory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchParts({ limit: 5, sortBy: 'quantity', sortOrder: 'asc' });
  }, []);

  const statCards = [
    { title: 'Total Parts', value: stats.totalParts || 0, icon: HiOutlineCube, color: '#3b82f6', bg: 'var(--accent-primary-transparent)', path: '/inventory' },
    { title: 'Total Stock Value', value: `₨${(stats.totalValue || 0).toLocaleString()}`, icon: HiOutlineCurrencyRupee, color: '#10b981', bg: 'var(--accent-success-transparent)', path: '/inventory' },
    { title: 'Low Stock Alerts', value: stats.lowStockCount || 0, icon: HiOutlineExclamationTriangle, color: '#f59e0b', bg: 'var(--accent-warning-transparent)', path: '/low-stock' },
    { title: 'Out of Stock', value: stats.outOfStockCount || 0, icon: HiOutlineXCircle, color: '#ef4444', bg: 'var(--accent-danger-transparent)', path: '/inventory?quantity=0' },
  ];

  // Dummy data for chart if API doesn't provide category distribution
  const chartData = [
    { name: 'Engine', count: 45 },
    { name: 'Brakes', count: 32 },
    { name: 'Suspension', count: 28 },
    { name: 'Electrical', count: 56 },
    { name: 'Body', count: 18 }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <PageTransition>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="grid-cols-4 gap-6" style={{ display: 'grid' }}>
        {statCards.map((stat, i) => (
          <button key={i} className="glass-card stat-card animate-slide-up text-left" style={{ animationDelay: `${i * 100}ms`, cursor: 'pointer' }} onClick={() => navigate(stat.path)}>
            <div className="stat-header">
              <div>
                <p className="stat-label">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid-cols-2 gap-6" style={{ display: 'grid' }}>
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Category Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-primary)" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-primary)" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-hover)' }} contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="count" position="top" fill="var(--text-primary)" fontSize={12} />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '500ms', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600 }}>Items Needing Attention</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {parts.slice(0, 5).map(part => {
              const stockStatus = getStockStatus(part.quantity, part.minStockLevel);
              return (
                <div key={part._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${stockStatus.color === 'red' ? 'var(--accent-danger)' : stockStatus.color === 'amber' ? 'var(--accent-warning)' : 'var(--accent-success)'}` }}>
                  <div>
                    <h4 style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{part.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{part.partNumber} • Min: {part.minStockLevel}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: stockStatus.color === 'red' ? 'var(--accent-danger)' : 'var(--text-primary)' }}>{part.quantity}</span>
                    <StockBadge quantity={part.quantity} minStock={part.minStockLevel} />
                  </div>
                </div>
              );
            })}
            {parts.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>All stock levels are optimal.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Dashboard;
