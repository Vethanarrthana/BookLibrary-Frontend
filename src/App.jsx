import React, { useState, useEffect } from "react";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";
import SearchBar from "./components/SearchBar";
import BookDetails from "./components/BookDetails";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookToEdit, setBookToEdit] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://booklibrary-backend-j3ou.onrender.com/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async (book) => {
    try {
      const response = await fetch('https://booklibrary-backend-j3ou.onrender.com/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(book),
      });
      const newBook = await response.json();
      setBooks([...books, newBook]);
      setPage("bookList");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async (book) => {
    try {
      const response = await fetch(`https://booklibrary-backend-j3ou.onrender.com/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(book),
      });
      const updatedBook = await response.json();
      setBooks(books.map((currentBook) => (currentBook.id === updatedBook.id ? updatedBook : currentBook)));
      setPage("bookList");
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await fetch(`https://booklibrary-backend-j3ou.onrender.com/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      setBooks(books.filter((book) => book.id !== id));
      setSelectedBook(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleAddOrUpdateBook = (book) => {
    if (bookToEdit) {
      updateBook({ ...book, id: bookToEdit.id });
    } else {
      addBook(book);
    }
    setBookToEdit(null);
    setSelectedBook(null);
  };

  const editBook = (index) => {
    setBookToEdit(books[index]);
    setSelectedBook(null);
    setPage("addBook");
  };

  const viewBookDetails = (index) => {
    setSelectedBook(books[index]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogin = async (data) => {
    console.log("Attempted login data:", data);
  
    try {
      const response = await fetch("https://booklibrary-backend-j3ou.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const textResponse = await response.text(); 
      console.log("Raw server response:", textResponse);
  
      try {
        const result = JSON.parse(textResponse); 
        console.log("Parsed server response:", result);
  
        if (response.ok) {
          localStorage.setItem("token", result.token); 
          setToken(result.token);
          setIsAuthenticated(true);
          setPage("bookList");
          console.log("User authenticated:", result);
        } else {
          alert(`Login failed: ${result.message || "Invalid credentials"}`);
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        alert("Unexpected server response. Check console.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleSignup = async (data) => {
    console.log("Signup data:", data);

    try {
      const response = await fetch('https://booklibrary-backend-j3ou.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token); 
        setToken(result.token);
        setIsAuthenticated(true);
        setPage("bookList");
        console.log("User signed up and authenticated:", result);
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setPage("login");
  };
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    return () => {
      localStorage.removeItem("token");
    };
  }, []);
 
  
  return (
    <div className="App">
      <h1 id="booklibrary-heading">BookLibrary</h1>
      {!isAuthenticated ? (
        page === "login" ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setPage("signup")} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={() => setPage("login")} />
        )
      ) : (
        <>
          <Navbar navigate={(page) => {
            setPage(page);
            if (page !== 'addBook') {
              setBookToEdit(null);
              setSelectedBook(null);
            }
          }} onLogout={handleLogout} />
          {page === "addBook" && (
            <AddBook addBook={handleAddOrUpdateBook} bookToEdit={bookToEdit} />
          )}
          {page === "bookList" && (
            <>
              <SearchBar onSearch={handleSearch} />
              <BookList
                books={filteredBooks}
                deleteBook={(index) => deleteBook(books[index].id)}
                editBook={editBook}
                viewBookDetails={viewBookDetails}
              />
              <BookDetails book={selectedBook} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
