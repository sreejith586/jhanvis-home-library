import { useEffect, useState } from 'react';
import {
  Navbar,
  Container,
  Form,
  Button,
  InputGroup,
  Nav,
} from 'react-bootstrap';
import {
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa';

const Header = ({ searchTerm, setSearchTerm }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounce);
  }, [localSearch, setSearchTerm]);

  const handleClear = () => {
    setLocalSearch('');
    setSearchTerm('');
  };

  return (
    <Navbar bg="light" expand="md" className="shadow-sm mb-3">
      <Container fluid>
        {/* 📚 Logo + App Name */}
        <Navbar.Brand className="d-flex align-items-center gap-2">
          <FaBook className="text-primary fs-4" />
          <span className="fw-bold fs-5 text-dark">My Home Library</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          {/* 🔍 Search Bar */}
          <Form className="d-flex mx-auto" onSubmit={e => e.preventDefault()}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search books..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
              />
              {localSearch && (
                <Button variant="outline-danger" onClick={handleClear}>
                  <FaTimesCircle />
                </Button>
              )}
              <Button variant="outline-secondary" disabled>
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          {/* 🔐 Auth Icons */}
          <Nav className="d-flex align-items-center gap-3 text-secondary">
            <FaSignInAlt title="Login" className="cursor-pointer" />
            <FaSignOutAlt title="Logout" className="cursor-pointer" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;