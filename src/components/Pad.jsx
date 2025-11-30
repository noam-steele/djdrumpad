import React, { useEffect, useState, useRef } from 'react';
import { useSound } from '../context/SoundContext';

const Pad = ({ id, keyBind, label, rowIndex, isConfigMode, onDrop }) => {
    const { soundMappings, playSound: playContextSound } = useSound();
    const [isActive, setIsActive] = useState(false);
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const mapping = soundMappings[id];

    const playSound = () => {
        if (mapping) {
            playContextSound(id);
            setIsActive(true);
            setTimeout(() => setIsActive(false), 150);
        }
    };

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
    // Removed row-based coloring as per request for unique colors
    const colorClass = mapping ? '' : 'empty';

    const getLabel = () => {
        if (isConfigMode && !mapping) return "Drop Audio";
        if (mapping) return mapping.name.substring(0, 10);
        return label;
    };

    // Generate a unique color based on the ID (fallback if no mapping color)
    const getPadColor = (id) => {
        // Simple hash to get a hue value 0-360
        let hash = 0;
        for (let i = 0; i < id.toString().length; i++) {
            hash = id.toString().charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 60%)`;
    };

    // Use mapped color if available, otherwise fallback to ID-based color
    const activeColor = mapping?.color || getPadColor(id);

    // Added functions for file upload
    const handleUploadClick = (e) => {
        e.stopPropagation(); // Prevent pad click from firing
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onDrop(id, file);
        }
        // Clear the input value so the same file can be selected again
        e.target.value = null;
    };

    // Determine background color
    const getBackgroundColor = () => {
        if (isActive) return activeColor; // Pressed (Play or Config)
        if (isConfigMode && mapping) return activeColor; // Config Mapped
        return undefined; // Default CSS (neutral)
    };

    // Determine glow/border (Play mode gets glow ONLY when pressed, Config mode gets flat)
    const showGlow = !isConfigMode && isActive && mapping;

    return (
        <div
            className={`pad ${colorClass} ${isActive ? 'active' : ''} ${mapping ? 'has-sound' : ''} ${isDragOver ? 'drag-over' : ''}`}
            style={{
                backgroundColor: getBackgroundColor(),
                boxShadow: showGlow ? `0 0 20px ${activeColor}, 0 0 40px ${activeColor}` : 'none',
                borderColor: showGlow ? activeColor : 'transparent',
                transform: isActive ? 'scale(0.98)' : 'scale(1)',
                position: 'relative'
            }}
            onClick={!isConfigMode ? playSound : undefined} // Only play sound if not in config mode
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="pad-label">{getLabel()}</div>
            <div className="pad-key">{keyBind.toUpperCase()}</div>

            {isConfigMode && (
                <>
                    <input
                        type="file"
                        accept="audio/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <div
                        className="upload-icon"
                        onClick={handleUploadClick}
                        title="Upload Sound"
                        style={{
                            position: 'absolute',
                            bottom: '8px', // Matched to pad padding
                            left: '8px',   // Matched to pad padding
                            cursor: 'pointer',
                            opacity: 0.7,
                            transition: 'opacity 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.7}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
};

export default Pad;
