import React, { useState, useEffect } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '', inputClassName = '', clearButtonClassName = '' }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onChange(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onChange]);

  return (
    <div className={`inventory-search-shell ${className}`.trim()}>
      <div className="inventory-search-icon">
        <HiMagnifyingGlass size={18} />
      </div>
      <input
        type="text"
        className={`inventory-search-input ${inputClassName}`.trim()}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm ? (
        <button type="button" className={`inventory-search-clear ${clearButtonClassName}`.trim()} onClick={() => setSearchTerm('')}>
          <HiXMark size={18} />
        </button>
      ) : null}
    </div>
  );
};

export default SearchBar;
