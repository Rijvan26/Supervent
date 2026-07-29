import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineSquares2X2, HiOutlineCube, HiOutlineExclamationCircle, HiOutlineMapPin, HiOutlineCog6Tooth, HiChevronLeft, HiChevronRight, HiCog, HiOutlineBars3 } from 'react-icons/hi2';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: HiOutlineSquares2X2 },
    { name: 'Inventory', path: '/inventory', icon: HiOutlineCube },
    { name: 'Low Stock', path: '/low-stock', icon: HiOutlineExclamationCircle },
    { name: 'Stock Locations', path: '/locations', icon: HiOutlineMapPin },
    { name: 'Settings', path: '/settings', icon: HiOutlineCog6Tooth },
  ];

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
        <HiOutlineBars3 size={24} />
      </button>
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', padding: collapsed ? '0' : '0 1.5rem', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <HiCog size={28} className="text-blue-500" />
            {!collapsed && <span style={{ fontSize: '1.25rem', fontWeight: 700, whiteSpace: 'nowrap' }} className="gradient-text">AutoParts</span>}
          </div>
        </div>

        <nav style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                gap: '1rem'
              })}
              title={collapsed ? item.name : ''}
            >
              <item.icon size={20} style={{ minWidth: '20px' }} />
              {!collapsed && <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
          <button className="btn-ghost btn-icon" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <HiChevronRight size={20} /> : <HiChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
