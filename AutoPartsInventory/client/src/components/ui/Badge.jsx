import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    primary: 'badge-primary'
  };

  return (
    <span className={`badge ${variantClasses[variant] || 'badge-primary'} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
