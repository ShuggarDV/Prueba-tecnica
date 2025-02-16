import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Container, Row, Col, Button, Alert } from 'react-bootstrap';
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
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <Container className="text-center my-5 portal-loading">
            <Spinner animation="border" variant="primary" className="portal-spinner" />
            <h3 className="mt-3 text-portal">Escaneando dimensión...</h3>
        </Container>
    );

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
                            className="mt-2"
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
                            className="mt-2"
                        >
                            Volver al Multiverso
                        </Button>
                    </div>
                </div>
            </Alert>
        </Container>
    );

    return (
        <Container className="character-dimension py-5">
            <Button 
                variant="outline-portal" 
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                ← Retroceso Dimensional
            </Button>

            <Row className="g-4 portal-card">
                <Col md={5} className="portal-image-container">
                    <div className="position-relative">
                        <img
                            src={character.image}
                            alt={character.name}
                            className="img-fluid portal-image rounded-4"
                            loading="lazy"
                        />
                        <div className="portal-frame"></div>
                    </div>
                </Col>

                <Col md={7}>
                    <div className="portal-info">
                        <h1 className="display-5 mb-3 text-portal">
                            {character.name}
                        </h1>
                        
                        <div className={`status-indicator ${character.status.toLowerCase()} mb-3`}>
                            <span className="status-dot"></span>
                            <span className="ms-2">
                                {character.status} - {character.species}
                            </span>
                        </div>

                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <div className="portal-info-card p-3">
                                    <h3 className="text-portal-secondary mb-2">Género</h3>
                                    <p className="portal-info-text">{character.gender}</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="portal-info-card p-3">
                                    <h3 className="text-portal-secondary mb-2">Origen</h3>
                                    <p className="portal-info-text">{character.origin.name}</p>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="portal-info-card p-3">
                                    <h3 className="text-portal-secondary mb-2">Ubicación Actual</h3>
                                    <p className="portal-info-text">{character.location.name}</p>
                                </div>
                            </Col>
                        </Row>

                        {episodes.length > 0 && (
                            <div className="portal-episodes p-3">
                                <h2 className="mb-3 text-portal">Últimas Travesías</h2>
                                <Row className="g-2">
                                    {episodes.map((episode, index) => (
                                        <Col key={index} md={6}>
                                            <div className="episode-card p-2">
                                                <span className="episode-number">Episodio {index + 1}</span>
                                                <p className="episode-title">{episode}</p>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CharacterDetail;