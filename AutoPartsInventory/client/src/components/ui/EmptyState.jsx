import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
      {Icon && (
        <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <Icon size={32} />
        </div>
      )}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
