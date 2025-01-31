import React, { useState, useEffect } from "react";

const AddBook = ({ addBook, bookToEdit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  const authorRef = React.createRef();
  const genreRef = React.createRef();
  const yearRef = React.createRef();

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setGenre(bookToEdit.genre);
      setYear(bookToEdit.year);
    }
  }, [bookToEdit]);

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const onGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const onYearChange = (event) => {
    setYear(event.target.value);
  };

  const onKeyPress = (event, nextFieldRef) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextFieldRef) nextFieldRef.current.focus();
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!title || !author || !genre || !year) {
      alert("All fields are required!");
      return;
    }
    const book = { title, author, genre, year };
    addBook(book); 
    setTitle("");
    setAuthor("");
    setGenre("");
    setYear("");
  };
  

  return (
    <div>
      <h3>{bookToEdit ? "Edit Book" : "Add New Book"}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter book title..."
            value={title}
            onChange={onTitleChange}
            onKeyPress={(e) => onKeyPress(e, authorRef)}
            required
          />
        </div>
        <div className="form-control">
          <label>Author</label>
          <input
            type="text"
            placeholder="Enter author name..."
            value={author}
            onChange={onAuthorChange}
            ref={authorRef}
            onKeyPress={(e) => onKeyPress(e, genreRef)}
            required
          />
        </div>
        <div className="form-control">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Enter genre..."
            value={genre}
            onChange={onGenreChange}
            ref={genreRef}
            onKeyPress={(e) => onKeyPress(e, yearRef)}
            required
          />
        </div>
        <div className="form-control">
          <label>Year</label>
          <input
            type="number"
            placeholder="Enter publication year..."
            value={year}
            onChange={onYearChange}
            ref={yearRef}
            required
          />
        </div>
        <button type="submit">{bookToEdit ? "Save Changes" : "Add Book"}</button>
      </form>
    </div>
  );
};

export default AddBook;
