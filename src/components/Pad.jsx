import React, { useEffect, useState, useRef } from 'react';
import { useSound } from '../context/SoundContext';

const Pad = ({ id, keyBind, label, rowIndex, isConfigMode, onDrop }) => {
    const { soundMappings } = useSound();
    const [isActive, setIsActive] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const audioRef = useRef(null);
    const mapping = soundMappings[id];

    const playSound = () => {
        if (mapping?.url) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            }
        }
        setIsActive(true);
        setTimeout(() => setIsActive(false), 150);
    };

    useEffect(() => {
        if (mapping?.url) {
            audioRef.current = new Audio(mapping.url);
        }
    }, [mapping]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === keyBind.toLowerCase() && !isConfigMode) {
                playSound();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [keyBind, isConfigMode, mapping]); // Re-bind if mapping changes to ensure fresh state if needed

    const handleDragOver = (e) => {
        if (!isConfigMode) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        if (!isConfigMode) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        if (!isConfigMode) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(id, e.dataTransfer.files[0]);
            setIsActive(true);
            setTimeout(() => setIsActive(false), 200);
        }
    };

    // Determine color class based on row index or if it has sound
    const colorClass = mapping ? `pad-row-${rowIndex}` : 'empty';

    const getLabel = () => {
        if (isConfigMode && !mapping) return "Drop Audio";
        if (mapping) return mapping.name.substring(0, 10);
        return label;
    };

    return (
        <div
            className={`pad ${colorClass} ${isActive ? 'active' : ''} ${mapping ? 'has-sound' : ''} ${isDragOver ? 'drag-over' : ''}`}
            onClick={playSound}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="pad-label">{getLabel()}</div>
            <div className="pad-key">{keyBind.toUpperCase()}</div>
        </div>
    );
};

export default Pad;
