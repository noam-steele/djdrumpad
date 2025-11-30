import React, { useRef } from 'react';
import Grid from '../components/Grid';
import { useSound } from '../context/SoundContext';
import { Button } from 'react-bootstrap';

const Config = () => {
    const { loadSamples } = useSound();
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            loadSamples(Array.from(e.target.files));
        }
    };

    return (
        <div className="text-center mt-5">
            <h1 className="mb-4 fw-light" style={{ letterSpacing: '2px' }}>CONFIGURATION</h1>

            <div className="mb-4">
                <input
                    type="file"
                    multiple
                    accept="audio/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                <Button
                    variant="outline-light"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2"
                >
                    Load Samples (Select Multiple)
                </Button>
            </div>

            <Grid isConfigMode={true} />
            <p className="mt-4 text-muted small">Drag and drop audio files onto pads to assign sounds</p>
        </div>
    );
};

export default Config;
