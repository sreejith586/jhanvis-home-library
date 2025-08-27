import React, { useState, useEffect, useMemo } from 'react';
import BookCard from '../components/BookCard';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { fetchSheetData } from '../utils/sheetFetcher';
import { enrichBooksWithGenres } from '../utils/bookMapper';
import logo from '../assets/Lebiblotheque.png'; 
import RecommendedReads from '../components/RecommendedReads';

const Dashboard = ({ searchTerm, onSheetData }) => {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortAZ, setSortAZ] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      const sheetRows = await fetchSheetData();
console.log("📄 Raw sheet rows:", sheetRows);

      const enriched = await enrichBooksWithGenres(sheetRows);
      setBooks(enriched);
console.log("✅ Enriched books:", enriched);


      if (onSheetData) onSheetData(sheetRows);
    };

    loadBooks();
  }, [onSheetData]);

  const genres = useMemo(() => [...new Set(books.flatMap(book => book.genres || []))], [books]);
  const authors = useMemo(() => [...new Set(books.map(book => book.author))], [books]);

  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    if (genreFilter) {
      filtered = filtered.filter(book => book.genres.includes(genreFilter));
    }

    if (authorFilter) {
      filtered = filtered.filter(book => book.author === authorFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortAZ) {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [books, genreFilter, authorFilter, sortAZ, searchTerm]);

  return (
    <Container fluid className="bg-light min-vh-100">
      <Row className="flex-nowrap">
        {/* Sidebar */}
        <Col xs={12} md={3} className="sidebar p-4 border-end sticky-top" style={{ top: 0, height: '100vh', overflowY: 'auto' }}>
	 {/* Logo at the top */}
          <div className="text-center mb-4">
            <img src={logo} alt="Jhanvi's Library Logo" style={{ maxWidth: '150px', height: 'auto' }} />
          </div>

          <h5 className="mb-4">📚 Filter Books</h5>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <Form.Select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
              <option value="">All</option>
              {genres.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Select value={authorFilter} onChange={e => setAuthorFilter(e.target.value)}>
              <option value="">All</option>
              {authors.map((a, i) => (
                <option key={i} value={a}>{a}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="outline-primary" onClick={() => setSortAZ(!sortAZ)} className="w-100">
            {sortAZ ? 'Unsort' : 'Sort A–Z'}
          </Button>
        </Col>

       {/* Main Content */}
<Col xs={12} md={9} className="p-0 d-flex flex-column">
  {/* Sticky Header */}
  <div className="topbar p-4 border-bottom sticky-top" style={{ top: 0, zIndex: 1020 }}>
    {/* You can move your search bar, sort button, or any header content here */}
    <h4 className="mb-0">📖 Jhanvi’s Library</h4>
  </div>
  {/* Book Count */}
  <div className="px-4 pt-3 text-muted" style={{ fontSize: '1rem' }}>
     Showing {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
  </div>
  {/* Scrollable Grid */}
  <RecommendedReads books={books} />
  <div className="flex-grow-1 overflow-auto p-4" style={{ height: 'calc(100vh - 80px)' }}>
    <Row xs={1} sm={2} md={3} className="g-4">
      {filteredBooks.map((book, index) => (
        <Col key={index}>
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  </div>
</Col>      </Row>
    </Container>
  );
};

export default Dashboard;