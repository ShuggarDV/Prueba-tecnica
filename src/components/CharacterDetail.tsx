import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container,Button, Alert } from 'react-bootstrap';
import axios from 'axios';


interface CharacterDetails {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image: string;
    episode: string[];
}

const CharacterDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [character, setCharacter] = useState<CharacterDetails | null>(null);
    const [error, setError] = useState('');
    const [episodes, setEpisodes] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const charResponse = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
                setCharacter(charResponse.data);

                const episodeUrls = charResponse.data.episode.slice(0, 5);
                const episodesData = await Promise.allSettled(
                    episodeUrls.map((url: string) => axios.get(url))
                );

                const successfulEpisodes = episodesData
                    .filter(result => result.status === 'fulfilled')
                    .map((result: any) => result.value.data.name);

                setEpisodes(successfulEpisodes);

            } catch (err) {
                setError(`Error dimensional: ${(err as Error).message}`);
            } 
        };

        fetchData();
    }, [id]);

    if (error) return (
        <Container className="my-5">
            <Alert variant="danger" className="portal-alert">
                <div className="d-flex align-items-center">
                    <span className="alert-icon">⚠️</span>
                    <div className="ms-3">
                        <h2>Falla en el Portal!</h2>
                        <p>{error}</p>
                        <Button 
                            variant="portal" 
                            onClick={() => navigate('/')}
                            className="mt-2 btn-portal"
                        >
                            Reiniciar Portal
                        </Button>
                    </div>
                </div>
            </Alert>
        </Container>
    );

    if (!character) return (
        <Container className="my-5">
            <Alert variant="warning" className="portal-alert">
                <div className="d-flex align-items-center">
                    <span className="alert-icon">🌀</span>
                    <div className="ms-3">
                        <h2>Dimensión no encontrada</h2>
                        <p>El personaje no existe en esta realidad</p>
                        <Button 
                            variant="portal" 
                            onClick={() => navigate('/')}
                            className="mt-2 btn-portal"
                        >
                            Volver al Multiverso
                        </Button>
                    </div>
                </div>
            </Alert>
        </Container>
    );

    return (
        <div className="character-dimension py-5">
            <Container>
                <Button 
                    variant="outline-portal" 
                    onClick={() => navigate(-1)}
                    className="mb-4 btn-portal"
                >
                    ← RETROCESO DIMENSIONAL
                </Button>

                <div className="character-card">
                    <div className="character-header">
                        <div className="portal-image-container">
                            <img
                                src={character.image}
                                alt={character.name}
                                className="portal-image"
                                loading="lazy"
                            />
                            <div className="portal-frame"></div>
                        </div>
                        
                        <div className="character-title">
                            <h1 className="neon-title">{character.name}</h1>
                            <div className={`status-indicator ${character.status}`}>
                                <span className="status-dot"></span>
                                <span>{character.status} - {character.species}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="character-info-grid">
                        <div className="portal-info-card">
                            <h2 className="info-title neon-text">GÉNERO</h2>
                            <p className="info-content">{character.gender}</p>
                        </div>
                        
                        <div className="portal-info-card">
                            <h2 className="info-title neon-text">ORIGEN</h2>
                            <p className="info-content">{character.origin.name}</p>
                        </div>
                        
                        <div className="portal-info-card full-width">
                            <h2 className="info-title neon-text">UBICACIÓN ACTUAL</h2>
                            <p className="info-content">{character.location.name}</p>
                        </div>
                    </div>
                    
                    {episodes.length > 0 && (
                        <div className="character-episodes">
                            <h2 className="episodes-title neon-title">ÚLTIMAS TRAVESÍAS</h2>
                            <div className="episodes-grid">
                                {episodes.map((episode, index) => (
                                    <div className="episode-card" key={index}>
                                        <p className="episode-number">Episodio {index + 1}</p>
                                        <p className="episode-title">{episode}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default CharacterDetail;