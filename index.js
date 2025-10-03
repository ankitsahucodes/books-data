const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect")
const Book = require("./models/books.models")

app.use(express.json());

initializeDatabase();


// 1. & 2. create books

async function createBook(newBook) {
  try {
    const book = new Book(newBook);
    const saveBook = await book.save();
    return saveBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res
      .status(201)
      .json({ message: "Book added successfully.", book: savedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

// 3. get all books in the DB

async function readAllBooks() {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    console.log(error);
  }
}


// readAllBooks

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No book found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});


// 4. get a book's detail by its title.


async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    throw error;
  }
}


app.get("/books/:title", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.title);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

// 5. get details of all the books by an author.

async function readBookByAuthor(authorName) {
  try {
    const bookByAuthor = await Book.find({ author: authorName });
    return bookByAuthor;
  } catch (error) {
    console.log(error);
  }
}


app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await readBookByAuthor(req.params.authorName);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No book found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 6. get all the books which are of "Business" genre.


async function readBooksByGenre(genreName) {
  try {
    const bookByGenre = await Book.find({ genre: genreName });
    return bookByGenre;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const books = await readBooksByGenre(req.params.genreName);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 7. get all the books which was released in the year 2012.

async function readBooksByPublishedYear(year) {
  try {
    const bookByPublishedYear = await Book.find({ publishedYear: year });
    return bookByPublishedYear;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const books = await readBooksByPublishedYear(req.params.year);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 8. Update

async function updateBook(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log("Error in updating Book details", error);
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBook(req.params.bookId, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update book." });
  }
});

// 9. Update by title

async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update book." });
  }
});


// 10. delete

async function deleteBook(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    throw error
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);
    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

// port
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

