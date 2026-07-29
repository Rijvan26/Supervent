import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/inventory': return 'Inventory Management';
      case '/low-stock': return 'Low Stock Alerts';
      case '/locations': return 'Stock Locations';
      case '/settings': return 'System Settings';
      case '/login': return 'Authentication';
      case '/forgot-password': return 'Password Recovery';
      default: return 'AutoParts Inventory';
    }
  };

  const hideShell = ['/login', '/forgot-password'].includes(location.pathname);

  if (hideShell || !user) {
    return <>{children}<Toast /></>;
  }

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen ? <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} /> : null}
      <div className="main-content">
        <Header title={getPageTitle()} />
        <main className="content-wrapper">
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default Layout;
