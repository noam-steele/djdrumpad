import React from 'react';
import Grid from '../components/Grid';

const Config = () => {
    return (
        <div className="text-center mt-5">
            <h1 className="mb-4 fw-light" style={{ letterSpacing: '2px' }}>CONFIGURATION</h1>

            <Grid isConfigMode={true} />
            <p className="mt-4 text-muted small">Drag and drop audio files onto pads to assign sounds</p>
        </div>
    );
};

export default Config;
