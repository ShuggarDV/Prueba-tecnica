import { Form, InputGroup, Dropdown, Button, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setFilter, resetFilters } from '../features/characters/charactersSlice';
import { useEffect } from 'react';

const statusOptions = ['Alive', 'Dead', 'unknown'];
const genderOptions = ['Female', 'Male', 'Genderless', 'unknown'];
const speciesOptions = ['Human', 'Alien', 'Humanoid', 'Robot', 'Animal', 'Mythological Creature'];

const SearchAndFilter = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.characters);

 
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch({ type: 'characters/fetchCharacters', payload: { page: 1 } });
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [dispatch, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilter({ key, value }));
  };

  return (
    <div className="multiverse-filter">
      <Row className="g-3 mb-4">
       
        <Col md={6} lg={3}>
          <InputGroup className="cosmic-filter">
            <Form.Control
              placeholder="Nombre..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="portal-input"
            />
          </InputGroup>
        </Col>

       
        <Col md={6} lg={3}>
          <Dropdown className="dimension-filter">
            <Dropdown.Toggle className="portal-dropdown">
              {filters.status || 'Estado'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="portal-menu">
              {statusOptions.map(option => (
                <Dropdown.Item
                  key={option}
                  onClick={() => handleFilterChange('status', option)}
                  active={filters.status === option}
                >
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        
        <Col md={6} lg={3}>
          <Dropdown className="dimension-filter">
            <Dropdown.Toggle className="portal-dropdown">
              {filters.species || 'Especie'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="portal-menu">
              {speciesOptions.map(option => (
                <Dropdown.Item
                  key={option}
                  onClick={() => handleFilterChange('species', option)}
                  active={filters.species === option}
                >
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        
        <Col md={6} lg={3}>
          <Dropdown className="dimension-filter">
            <Dropdown.Toggle className="portal-dropdown">
              {filters.gender || 'Género'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="portal-menu">
              {genderOptions.map(option => (
                <Dropdown.Item
                  key={option}
                  onClick={() => handleFilterChange('gender', option)}
                  active={filters.gender === option}
                >
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <InputGroup className="cosmic-filter">
            <Form.Control
              placeholder="Tipo..."
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="portal-input"
            />
          </InputGroup>
        </Col>

        <Col md={4}>
          <InputGroup className="cosmic-filter">
            <Form.Control
              placeholder="Origen..."
              value={filters.origin}
              onChange={(e) => handleFilterChange('origin', e.target.value)}
              className="portal-input"
            />
          </InputGroup>
        </Col>

        <Col md={4}>
          <InputGroup className="cosmic-filter">
            <Form.Control
              placeholder="Ubicación..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="portal-input"
            />
          </InputGroup>
        </Col>
      </Row>

      <div className="text-center">
        <Button 
          variant="portal" 
          onClick={() => dispatch(resetFilters())}
          className="mx-2"
        >
          Limpiar Filtros
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilter;