import React from 'react';
import Pad from './Pad';
import { useSound } from '../context/SoundContext';

const Grid = ({ isConfigMode = false }) => {
    const { updateMapping } = useSound();

    const rows = [
        ['1', '2', '3', '4'],
        ['q', 'w', 'e', 'r'],
        ['a', 's', 'd', 'f'],
        ['z', 'x', 'c', 'v']
    ];

    const handlePadDrop = (padId, file) => {
        updateMapping(padId, file);
    };

    return (
        <div className="midiboard-grid">
            {rows.map((row, rowIndex) => (
                row.map((keyBind, colIndex) => {
                    const padId = `pad-${rowIndex}-${colIndex}`;
                    // Calculate a linear index 1-16 for display if needed, or just use key
                    return (
                        <Pad
                            key={padId}
                            id={padId}
                            keyBind={keyBind}
                            label={`Pad ${keyBind.toUpperCase()}`}
                            rowIndex={rowIndex}
                            isConfigMode={isConfigMode}
                            onDrop={handlePadDrop}
                        />
                    );
                })
            ))}
        </div>
    );
};

export default Grid;
