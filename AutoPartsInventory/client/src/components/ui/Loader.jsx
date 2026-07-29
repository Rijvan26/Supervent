import React from 'react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid var(--border-light)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid var(--accent-primary)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full">
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          <div className="skeleton" style={{ height: '24px', width: '20%' }}></div>
          <div className="skeleton" style={{ height: '24px', width: '40%' }}></div>
          <div className="skeleton" style={{ height: '24px', width: '15%' }}></div>
          <div className="skeleton" style={{ height: '24px', width: '25%' }}></div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
