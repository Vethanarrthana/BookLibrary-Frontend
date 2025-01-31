import React from 'react';

function Navbar({ navigate }) {
  return (
    <nav>
      <button onClick={() => navigate('addBook')}>Add Book</button>
      <button onClick={() => navigate('bookList')}>Book List</button>
    </nav>
  );
}

export default Navbar;
