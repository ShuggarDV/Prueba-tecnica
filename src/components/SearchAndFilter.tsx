import { Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setFilters } from '../features/characters/charactersSlice';

const SearchAndFilter = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.characters);
  const statusOptions = ['Alive', 'Dead', 'unknown'];

  const handleStatusChange = (status: string) => {
    const newStatus = status === filters.status ? '' : status;
    dispatch(setFilters({ status: newStatus }));
  };

  return (
    <div className="mb-4 portal-filter">
      <InputGroup className="mb-4 cosmic-search">
        <Form.Control
          className="portal-input"
          placeholder="🔍 Buscar en todas las dimensiones..."
          value={filters.name}
          onChange={(e) => dispatch(setFilters({ name: e.target.value }))}
          style={{
            border: '2px solid var(--portal-green)',
            borderRadius: '25px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontFamily: '"Roboto Condensed", sans-serif',
            boxShadow: '0 0 10px rgba(0, 255, 157, 0.3)'
          }}
        />
      </InputGroup>

      <Dropdown className="dimension-filter">
        <Dropdown.Toggle 
          variant="outline-primary"
          style={{
            border: '2px solid var(--portal-blue)',
            borderRadius: '25px',
            background: filters.status ? 'rgba(0, 255, 157, 0.1)' : 'rgba(0, 0, 0, 0.5)',
            color: filters.status ? 'var(--portal-green)' : 'white',
            fontWeight: 'bold',
            padding: '0.5rem 1.5rem',
            width: '250px',
            fontFamily: '"Bangers", cursive',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}
        >
          {filters.status || '🌌 Estado del Multiverso'}
        </Dropdown.Toggle>

        <Dropdown.Menu 
          className="portal-menu"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid var(--portal-green)',
            borderRadius: '15px',
            overflow: 'hidden',
            marginTop: '10px'
          }}
        >
          {statusOptions.map(status => (
            <Dropdown.Item 
              key={status}
              onClick={() => handleStatusChange(status)}
              style={{
                color: status === 'Alive' ? 'var(--portal-green)' : 
                       status === 'Dead' ? 'var(--morty-shirt)' : 'white',
                background: 'transparent',
                fontFamily: '"Roboto Condensed", sans-serif',
                padding: '0.75rem 1.5rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              className="portal-menu-item"
            >
              <span style={{ 
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                marginRight: '10px',
                background: status === 'Alive' ? 'var(--portal-green)' : 
                          status === 'Dead' ? 'var(--morty-shirt)' : 'var(--dimension-purple)'
              }}></span>
              {status}
              {status === 'unknown' && <span style={{marginLeft: 'auto'}}>❓</span>}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default SearchAndFilter;