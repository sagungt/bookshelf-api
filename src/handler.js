/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const { nanoid } = require('nanoid');
const books = require('./books.js');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (parseInt(readPage, 10) > parseInt(pageCount, 10)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year: parseInt(year, 10),
    author,
    summary,
    publisher,
    pageCount: parseInt(pageCount, 10),
    readPage: parseInt(readPage, 10),
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  let result = books;
  if (request.query) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(request.query)) {
      if (key === 'name') {
        result = result.filter((b) => b.name.toLowerCase().includes(value.toLowerCase()));
      }
      if (key === 'reading') {
        result = result.filter((b) => b.reading === Boolean(parseInt(value, 10)));
      }
      if (key === 'finished') {
        result = result.filter((b) => b.finished === Boolean(parseInt(value, 10)));
      }
    }
  }
  const selectedResult = [];
  result.forEach((item) => {
    const { id, name, publisher } = item;
    selectedResult.push({
      id,
      name,
      publisher,
    });
  });
  const response = h.response({
    status: 'success',
    data: {
      books: selectedResult,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId);

  if (book.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        book: book[0],
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (parseInt(readPage, 10) > parseInt(pageCount, 10)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year: parseInt(year, 10),
      author,
      summary,
      publisher,
      pageCount: parseInt(pageCount, 10),
      readPage: parseInt(readPage, 10),
      finished: parseInt(pageCount, 10) === parseInt(readPage, 10),
      reading: Boolean(parseInt(reading, 10)) || books[index].reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editNoteByIdHandler,
  deleteBookByIdHandler,
};
