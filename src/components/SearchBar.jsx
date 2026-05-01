import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [village, setVillage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (village.trim()) {
      onSearch(village.trim());
    }
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter village or town name..."
        value={village}
        onChange={(e) => setVillage(e.target.value)}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="search-button"
        disabled={isLoading || !village.trim()}
      >
        {isLoading ? (
          <span className="spinner">⏳</span>
        ) : (
          <>
            <Search size={20} />
            Explore
          </>
        )}
      </button>
    </form>
  );
};

export default SearchBar;
