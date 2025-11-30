import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [soundMappings, setSoundMappings] = useState({});

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);

  // Initialize AudioContext
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const gainNode = ctx.createGain();

    gainNode.connect(ctx.destination);

    audioContextRef.current = ctx;
    masterGainRef.current = gainNode;

    return () => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, []);

  const updateMapping = async (padId, file) => {
    if (!audioContextRef.current) return;
    // Resume context if suspended
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      setSoundMappings(prev => ({
        ...prev,
        [padId]: {
          buffer: audioBuffer,
          name: file.name,
          originalFile: file
        }
      }));
    } catch (error) {
      console.error("Error decoding audio file:", file.name, error);
    }
  };

  const playSound = (padId) => {
    const mapping = soundMappings[padId];
    if (mapping?.buffer && audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = mapping.buffer;
      source.connect(masterGainRef.current);
      source.start(0);
    }
  };

  return (
    <SoundContext.Provider value={{
      soundMappings,
      updateMapping,
      playSound
    }}>
      {children}
    </SoundContext.Provider>
  );
};
