import React from 'react';
import { Card } from 'react-bootstrap';
import '../BookCard.css';

const BookCard = ({ book }) => {
  const { title, author, genre, coverUrl, genres, status, read, rating } = book;

  const placeholder =
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=150&q=80';

  const validCover = coverUrl && coverUrl !== 'No cover found' && coverUrl !== 'Error fetching cover';

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i}>{i < rating ? '★' : '☆'}</span>
    ));
  };

  return (
    <Card className="h-100 shadow-sm book-card position-relative">
      {/* ✅ Read Badge */}
      {read && (
        <div className="read-badge" title="Jhanvi has finished reading this book!">
          ✅ Read
        </div>
      )}
      <Card.Img
        variant="top"
        src={validCover ? coverUrl : placeholder}
        alt={`${title} cover`}
        style={{ height: '220px', objectFit: 'cover' }}
        loading="lazy"
      />
      <Card.Body>
        <Card.Title className="fs-6 fw-bold">{title}</Card.Title>
        <Card.Text className="mb-1 text-muted">
          <small>by {author}</small>
        </Card.Text>

        {genre && (
          <Card.Text>
            <span className="badge bg-secondary">{genre}</span>
          </Card.Text>
        )}

        {/* ⭐ Star Rating */}
        {rating && (
          <Card.Text className="rating-stars d-flex align-items-center gap-2">
            <span>{renderStars(rating)}</span>
    	    <span className="text-muted small">by Jhanvi</span>
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookCard;