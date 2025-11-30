import React from 'react';
import Grid from '../components/Grid';
import { useSound } from '../context/SoundContext';
import { Button } from 'react-bootstrap';

const Board = () => {
    const { startRecording, stopRecording, isRecording, recordedUrl, discardRecording } = useSound();

    const handleRecordToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleDownload = () => {
        if (recordedUrl) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = recordedUrl;
            a.download = `dj-session-${new Date().toISOString()}.webm`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                discardRecording();
            }, 100);
        }
    };

    return (
        <div className="text-center mt-5">
            <h1 className="mb-4 fw-light" style={{ letterSpacing: '2px' }}>DJ BOARD</h1>

            <div className="mb-4 d-flex justify-content-center align-items-center gap-3" style={{ minHeight: '40px' }}>
                {!recordedUrl ? (
                    <Button
                        variant={isRecording ? "danger" : "outline-danger"}
                        onClick={handleRecordToggle}
                        className="d-flex align-items-center gap-2 px-4"
                    >
                        <div
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: isRecording ? 'white' : 'currentColor',
                                animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                            }}
                        />
                        {isRecording ? "Stop Recording" : "Record Session"}
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outline-light"
                            onClick={handleDownload}
                            className="d-flex align-items-center gap-2 px-4"
                            title="Download Recording"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                            </svg>
                            Download
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={discardRecording}
                            className="d-flex align-items-center gap-2 px-3"
                            title="Discard Recording"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                            </svg>
                        </Button>
                    </>
                )}
            </div>

            <Grid isConfigMode={false} />
            <p className="mt-4 text-muted small">Press keys to play sounds</p>

            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(1.2); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                `}
            </style>
        </div>
    );
};

export default Board;
