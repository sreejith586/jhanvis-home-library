import './RecommendedReads.css';

const recommendedBooks = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://covers.openlibrary.org/b/id/10523354-L.jpg'
  },
  // Add 3 more
];

export default function RecommendedReads() {
  return (
    <div className="recommended-container">
      <h2>✨ Recommended Reads</h2>
      <div className="scroll-wrapper">
        {recommendedBooks.map((book, index) => (
          <div className="book-card" key={index}>
            <img src={book.cover} alt={book.title} />
            <p className="title">{book.title}</p>
            <p className="author">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}