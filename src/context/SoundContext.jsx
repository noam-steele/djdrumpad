import React, { createContext, useState, useContext } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  // Initial state: empty mappings or default sounds if we had them
  // Structure: { 'pad-1': { url: '...', name: '...' }, ... }
  const [soundMappings, setSoundMappings] = useState({});

  const updateMapping = (padId, file) => {
    const url = URL.createObjectURL(file);
    setSoundMappings(prev => ({
      ...prev,
      [padId]: {
        url,
        name: file.name,
        originalFile: file
      }
    }));
  };

  return (
    <SoundContext.Provider value={{ soundMappings, updateMapping }}>
      {children}
    </SoundContext.Provider>
  );
};
