
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [soundMappings, setSoundMappings] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const destRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Initialize AudioContext
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    const dest = ctx.createMediaStreamDestination();

    gainNode.connect(ctx.destination);
    gainNode.connect(dest);

    audioContextRef.current = ctx;
    masterGainRef.current = gainNode;
    destRef.current = dest;

    return () => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, []);

  const loadSamples = async (files) => {
    if (!audioContextRef.current) return;

    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const newMappings = { ...soundMappings };
    let fileIndex = 0;

    for (let i = 0; i < 16; i++) {
      if (fileIndex >= files.length) break;

      if (!newMappings[i]) {
        const file = files[fileIndex];
        try {
          const arrayBuffer = await file.arrayBuffer();
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

          newMappings[i] = {
            buffer: audioBuffer,
            name: file.name,
            originalFile: file
          };
          fileIndex++;
        } catch (error) {
          console.error("Error decoding audio file:", file.name, error);
        }
      }
    }
    setSoundMappings(newMappings);
  };

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

  const startRecording = async () => {
    if (!destRef.current) return;

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    const recorder = new MediaRecorder(destRef.current.stream, { mimeType });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    if (recordedUrl) {
      window.URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
  };

  return (
    <SoundContext.Provider value={{
      soundMappings,
      updateMapping,
      loadSamples,
      playSound,
      startRecording,
      stopRecording,
      isRecording,
      recordedUrl,
      discardRecording
    }}>
      {children}
    </SoundContext.Provider>
  );
};
