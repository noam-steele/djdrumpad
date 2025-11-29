import React from 'react';
import Grid from '../components/Grid';

const Board = () => {
    return (
        <div className="text-center mt-5">
            <h1 className="mb-4 fw-light" style={{ letterSpacing: '2px' }}>DJ BOARD</h1>
            <Grid isConfigMode={false} />
            <p className="mt-4 text-muted small">Press keys to play sounds</p>
        </div>
    );
};

export default Board;
