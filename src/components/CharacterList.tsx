import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Character } from '../features/characters/charactersSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleFavorite } from '../features/characters/charactersSlice';
import { useNavigate } from 'react-router-dom';

interface CharacterListProps {
  characters: Character[];
}

const CharacterList = ({ characters }: CharacterListProps) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.characters.favorites);
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: React.CSSProperties } = {
      Alive: {
        backgroundColor: 'var(--portal-green)',
        color: 'var(--citadel)',
        padding: '2px 8px',
        borderRadius: '15px',
        fontSize: '0.8rem'
      },
      Dead: {
        backgroundColor: 'var(--portal-red)',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '15px',
        fontSize: '0.8rem'
      },
      unknown: {
        backgroundColor: 'var(--portal-blue)',
        color: 'var(--citadel)',
        padding: '2px 8px',
        borderRadius: '15px',
        fontSize: '0.8rem'
      }
    };
    return styles[status] || {};
  };

  return (
    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 py-4">
      {characters.map(character => (
        <Col 
          key={character.id} 
          onClick={() => navigate(`/character/${character.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <Card className="h-100 neon-card dimension-card">
            <Card.Img
              variant="top"
              src={character.image}
              className="character-image"
              style={{ borderBottom: '2px solid var(--portal-green)' }}
            />
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <Card.Title className="text-center mb-3 portal-title">
                  {character.name}
                </Card.Title>
                <span 
                  className="favorite-icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleFavorite({ 
                      id: character.id, 
                      name: character.name 
                    }));
                  }}
                  style={{ 
                    color: favorites.includes(character.id) ? '#ff0055' : '#ffffff80',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {favorites.includes(character.id) ? '❤️' : '🤍'}
                </span>
              </div>

              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="species-info">
                    <span className="info-label">Especie:</span>
                    <span className="info-value">{character.species}</span>
                  </div>
                  <span 
                    className="status-badge" 
                    style={getStatusStyle(character.status)}
                  >
                    {character.status}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CharacterList;