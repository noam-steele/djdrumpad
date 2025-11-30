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

  const loadSamples = (files) => {
    setSoundMappings(prev => {
      const newMappings = { ...prev };
      let fileIndex = 0;
      // We have 16 pads, IDs are usually 'pad-0' to 'pad-15' or similar. 
      // Let's assume the IDs are passed or we iterate through standard IDs.
      // Actually, Pad IDs are likely passed from Grid. Let's look at Grid.jsx to be sure of ID format.
      // But wait, I don't have access to Grid.jsx right now in this context.
      // Let's assume standard 0-15 index for now and we can fix if IDs are different.
      // Based on Pad.jsx, it receives `id`.
      // Let's just fill empty slots first, then overwrite if needed?
      // User said "add multiple audio samples at once".

      // Let's iterate 0 to 15.
      for (let i = 0; i < 16; i++) {
        if (fileIndex >= files.length) break;

        // If this pad is empty, fill it.
        // If we want to just fill sequentially from the start or fill empty ones?
        // "add multiple audio samples" implies filling empty or just populating.
        // Let's fill empty slots first.
        if (!newMappings[i]) {
          const file = files[fileIndex];
          newMappings[i] = {
            url: URL.createObjectURL(file),
            name: file.name,
            originalFile: file
          };
          fileIndex++;
        }
      }
      return newMappings;
    });
  };

  return (
    <SoundContext.Provider value={{ soundMappings, updateMapping, loadSamples }}>
      {children}
    </SoundContext.Provider>
  );
};
