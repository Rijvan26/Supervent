import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Page <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{currentPage}</span> of <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{totalPages}</span>
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          <HiChevronLeft size={16} /> Prev
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next <HiChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
