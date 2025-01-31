import React from 'react';

function BookDetails({ book }) {
  if (!book) return <div className="select-book-info">Select a book to see details</div>;

  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>Year: {book.year}</p>
    </div>
  );
}

export default BookDetails;
