import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Samples = () => {
    const samplePacks = [
        {
            title: "Cymatics Free Downloads",
            description: "High-quality sample packs for various genres including Hip Hop, EDM, and Lofi.",
            link: "https://cymatics.fm/pages/free-download-vault",
            tags: ["Hip Hop", "EDM", "Trap"]
        },
        {
            title: "99Sounds Drum Samples",
            description: "A collection of royalty-free drum samples, including acoustic and electronic kits.",
            link: "https://99sounds.org/drum-samples/",
            tags: ["Acoustic", "Electronic", "Royalty-Free"]
        },
        {
            title: "Bedroom Producers Blog",
            description: "A massive list of the best free drum kits available online, updated regularly.",
            link: "https://bedroomproducersblog.com/2014/09/04/free-drum-kits/",
            tags: ["Various", "Curated List"]
        },
        {
            title: "SampleSwap",
            description: "A community-driven library of free loops and samples. Requires registration.",
            link: "https://sampleswap.org/filebrowser-new.php?d=DRUMS+and+SINGLE+HITS%2F",
            tags: ["Community", "Loops", "Hits"]
        },
        {
            title: "SoundPacks.com",
            description: "Free sound packs and drum kits from various producers and sound designers.",
            link: "https://soundpacks.com/category/free-sound-packs/drum-kits/",
            tags: ["Producer Kits", "Sound Design"]
        }
    ];

    return (
        <Container className="mt-5 text-center">
            <h1 className="mb-4 fw-light" style={{ letterSpacing: '2px' }}>FREE SAMPLES</h1>
            <p className="text-muted mb-5">Download free drum kits and samples to use with your board.</p>

            <Row xs={1} md={2} lg={3} className="g-4">
                {samplePacks.map((pack, index) => (
                    <Col key={index}>
                        <Card className="h-100 bg-dark text-white border-secondary" style={{ background: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(20px)' }}>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{pack.title}</Card.Title>
                                <Card.Text className="text-muted small flex-grow-1">
                                    {pack.description}
                                </Card.Text>
                                <div className="mb-3">
                                    {pack.tags.map((tag, i) => (
                                        <span key={i} className="badge bg-secondary me-1" style={{ fontSize: '0.7em', opacity: 0.7 }}>{tag}</span>
                                    ))}
                                </div>
                                <Button
                                    variant="outline-light"
                                    href={pack.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-100 mt-auto"
                                >
                                    Visit Website
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Samples;
