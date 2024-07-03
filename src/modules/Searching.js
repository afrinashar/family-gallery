// Searching.js
import React, { useState } from 'react';

const Searching = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearchChange(searchTerm);
  };

  return (
    <div>
      <h2>Search</h2>
      {/* Search UI */}
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Searching;
