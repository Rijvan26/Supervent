import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiXCircle, HiXMark } from 'react-icons/hi2';

const Toast = () => {
  const { toasts, removeToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = HiInformationCircle;
        if (toast.type === 'success') Icon = HiCheckCircle;
        if (toast.type === 'error') Icon = HiXCircle;
        if (toast.type === 'warning') Icon = HiExclamationCircle;

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={20} className={
              toast.type === 'success' ? 'text-emerald-500' :
              toast.type === 'error' ? 'text-red-500' :
              toast.type === 'warning' ? 'text-amber-500' :
              'text-blue-500'
            } />
            <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <HiXMark size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
