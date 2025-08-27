import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';

const SHEET_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1agbGWFVoz8_zrOi-3DnTZAd6uShJK7u4q3Xs6UTPn8Y/values/Sheet1?key=AIzaSyDN9AywbsWbcSVvZuGvcAPqAUD-vkilU4I';

const BookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
  try {
    const res = await fetch(SHEET_API_URL);
    const data = await res.json();
    const rows = data.values;

    const bookData = rows.slice(1).map(row => {
      const [title, author, genre] = row;
      return { title, author, genre };
    });

    console.log('Fetched books:', bookData); // ✅ Safe to log here
    setBooks(bookData);
  } catch (err) {
    console.error('Error fetching sheet data:', err);
  } finally {
    setLoading(false);
  }
};


    fetchBooks();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">📚 My Home Library</h2>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {books.map((book, index) => (
            <Col key={index}>
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BookLibrary;