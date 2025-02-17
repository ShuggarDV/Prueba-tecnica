import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCharacters } from '../features/characters/charactersSlice';

const PaginationControls = () => {
  const dispatch = useAppDispatch();
  const { currentPage, info, activeFilters } = useAppSelector((state) => state.characters);
  
  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage > 0 && newPage <= info.pages) {
      
      dispatch(fetchCharacters({ page: newPage }));
    }
  };

  return (
    <div className="portal-pagination-container">
      <div className="multiverse-navigator">
        <button
          className="portal-nav-button prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!info.prev}
        >
          <div className="portal-effect"></div>
          <span className="flip">🌀</span>
          <span className="label">Dimensión Anterior</span>
        </button>

        <div className="current-portal">
          <div className="portal-animation">
            <div className="portal-core"></div>
          </div>
          <span className="portal-number">{currentPage}</span>
        </div>

        <button
          className="portal-nav-button next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!info.next}
        >
          <div className="portal-effect"></div>
          <span>🌀</span>
          <span className="label">Próxima Dimensión</span>
        </button>
      </div>
      
      <div className="dimension-counter">
        <span className="mr-2">🔮</span>
        Dimensión {currentPage} de {info.pages}
        {activeFilters.length > 0 && (
          <span className="text-green-400 ml-2">
            ({activeFilters.length} filtro{activeFilters.length !== 1 ? 's' : ''} activo{activeFilters.length !== 1 ? 's' : ''})
          </span>
        )}
        <span className="ml-2">🔮</span>
      </div>
    </div>
  );
};

export default PaginationControls;