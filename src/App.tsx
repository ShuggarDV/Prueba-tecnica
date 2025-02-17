import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Alert, Navbar, Nav, Row, Col } from 'react-bootstrap';
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
    info,
    favorites,
    activeFilters
  } = useAppSelector((state) => state.characters);


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(fetchCharacters({ page: 1 }));
    }, 700);

    return () => clearTimeout(debounceTimer);
  }, [dispatch, activeFilters]);

  return (
    <Router>
      <div className="rick-morty-app">
        <Navbar bg="dark" variant="dark" expand="lg" className="rickmorty-nav">
          <Container fluid className="px-md-4 px-lg-5">
            <Navbar.Brand as={Link} to="/" className="portal-brand">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg"
                alt="Logo"
                height="50"
                className="navbar-logo"
              />
            </Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/favorites" className="nav-portal-link">
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
                    Bienvenido a la dimensión C-137
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
                  <div className="dimensional-loader">
                    <div className="portal-vortex">
                      <div className="quantum-ring"></div>
                      <div className="particle-field">
                        {[...Array(30)].map((_, i) => (
                          <div key={i} className="quantum-particle"></div>
                        ))}
                      </div>
                      <div className="portal-core"></div>
                    </div>
                    <p className="scanning-text">
                      <span className="flicker">🌀</span>
                      Escaneando dimensiones paralelas...
                      <span className="flicker-delay">🔭</span>
                    </p>
                  </div>
                )}

                {items.length > 0 ? (
                  <>
                    {activeFilters.length > 0 && (
                      <div className="filter-summary mb-4 text-center">
                        <span className="filter-badge px-3 py-1 rounded" style={{ background: 'rgba(0, 200, 100, 0.2)', border: '1px solid var(--portal-green)' }}>
                          🔍 Mostrando {items.length} de {info.count} personajes con {activeFilters.length} filtro{activeFilters.length !== 1 ? 's' : ''} activo{activeFilters.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    <CharacterList characters={items} />
                    {info.pages > 1 && (
                      <footer className="pagination-footer w-100 mt-4 py-3">
                        <Container fluid>
                          <PaginationControls />
                        </Container>
                      </footer>
                    )}
                  </>
                ) : (
                  !loading && (
                    <div className="empty-state">
                      {activeFilters.length > 0 ? (
                        <>
                          <span className="portal-icon">🛸</span>
                          <p>No se encontraron personajes con los filtros seleccionados</p>
                          <button
                            className="reset-dimension-btn mt-3"
                            onClick={() => dispatch(fetchCharacters({ page: 1 }))}
                          >
                            Reintentar búsqueda
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="portal-icon">🌌</span>
                          <p>No hay personajes en esta dimensión...</p>
                        </>
                      )}
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