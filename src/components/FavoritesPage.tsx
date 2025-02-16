import { useAppSelector } from '../app/hooks';
import CharacterList from './CharacterList';
import { Container} from 'react-bootstrap';
const FavoritesPage = () => {
  const { favorites, items } = useAppSelector((state) => state.characters);
  const favoriteCharacters = items.filter(character => 
    favorites.includes(character.id)
  );

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4 rickmorty-title">
        <span role="img" aria-label="portal">🌟</span> Dimensión Favorita
      </h1>

      {favoriteCharacters.length > 0 ? (
        <CharacterList characters={favoriteCharacters} />
      ) : (
        <div className="loading-text">
          <span role="img" aria-label="portal">🌌</span> No has agregado personajes a favoritos...
        </div>
      )}
    </Container>
  );
};

export default FavoritesPage;