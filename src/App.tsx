import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Alert, Spinner, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { fetchCharacters } from './features/characters/charactersSlice';
import SearchAndFilter from './components/SearchAndFilter';
import CharacterList from './components/CharacterList';
import PaginationControls from './components/PaginationControls';
import FavoritesPage from './components/FavoritesPage';
import CharacterDetail from './components/CharacterDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const dispatch = useAppDispatch();
  const { 
    items, 
    loading, 
    error, 
    filters, 
    info,
    favorites 
  } = useAppSelector((state) => state.characters);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(fetchCharacters(1));
    }, 700);

    return () => clearTimeout(debounceTimer);
  }, [dispatch, filters.name, filters.status]);

  return (
    <Router>
      <div className="rick-morty-app">
        <Navbar bg="dark" variant="dark" expand="lg" className="portal-navbar">
          <Container fluid className="px-md-4 px-lg-5">
            <Navbar.Brand as={Link} to="/" className="navbar-brand-portal">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg"
                alt="Logo"
                height="50"
                className="navbar-logo"
              />
            </Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/favorites" className="nav-link-portal">
                <span className="nav-icon">🌟</span> 
                <span className="nav-text">Favoritos</span>
                <span className="badge-portal">{favorites.length}</span>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={
            <Container fluid className="main-container">
              <Row className="justify-content-center header-row">
                <Col xs={12} md={10} lg={8} xl={6}>
                  <h1 className="main-title">
                    <span className="portal-icon">🌀</span> 
                    Personajes del Multiverso
                  </h1>
                  <SearchAndFilter />
                  {error && (
                    <Alert variant="danger" className="error-alert">
                      ⚠️ Error dimensional: {error}
                    </Alert>
                  )}
                </Col>
              </Row>
              
              <div className="content-wrapper">
                {loading && (
                  <div className="loading-overlay">
                    <Spinner animation="border" className="portal-spinner" />
                    <p className="loading-text">Escaneando dimensiones...</p>
                  </div>
                )}
                
                {items.length > 0 ? (
                  <>
                    <CharacterList characters={items} />
                    {info.pages > 1 && (
                      <Row className="pagination-row">
                        <Col xs={12} md={10} lg={8} xl={6}>
                          <PaginationControls />
                        </Col>
                      </Row>
                    )}
                  </>
                ) : (
                  !loading && (
                    <div className="empty-state">
                      <span className="portal-icon">🌌</span> 
                      <p>No hay personajes en esta dimensión...</p>
                    </div>
                  )
                )}
              </div>
            </Container>
          } />

          <Route path="/character/:id" element={<CharacterDetail />} />
          
          <Route path="/favorites" element={
            <Container fluid className="favorites-container">
              <FavoritesPage />
            </Container>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;