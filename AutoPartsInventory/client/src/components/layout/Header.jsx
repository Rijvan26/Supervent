import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

const Header = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }} className="gradient-text">{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--accent-primary-transparent)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'Admin User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || 'Store Manager'}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={logout} title="Logout">
          <HiOutlineArrowRightOnRectangle size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
