import React from "react";

function BookList({ books, deleteBook, viewBookDetails, editBook }) {
  return (
    <ul>
      {books.length === 0 && <p className="no-books">No books available.</p>}
      {books.map((book, index) => (
        <li key={book.id}>
          <span
            onClick={() => viewBookDetails(index)} 
            style={{ cursor: "pointer" }}
          >
            {book.title} by {book.author}
          </span>
          <div className="buttons">
            <button onClick={() => deleteBook(index)}>Delete</button>
            <button onClick={() => editBook(index)}>Edit</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default BookList;
