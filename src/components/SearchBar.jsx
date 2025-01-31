import React from 'react';

function SearchBar({ onSearch }) {
  const onSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search books..."
      onChange={onSearchChange}
    />
  );
}

export default SearchBar;
