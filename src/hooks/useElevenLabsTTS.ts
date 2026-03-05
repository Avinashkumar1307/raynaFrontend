"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseElevenLabsTTSReturn {
  speak: (text: string, voiceId?: string) => Promise<void>;
  isPlaying: boolean;
  isLoading: boolean;
  stop: () => void;
  error: string | null;
  isSupported: boolean;
}

export function useElevenLabsTTS(): UseElevenLabsTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentControllerRef = useRef<AbortController | null>(null);

  const isSupported = typeof window !== 'undefined' && typeof Audio !== 'undefined';

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentControllerRef.current) {
      currentControllerRef.current.abort();
      currentControllerRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(async (text: string, voiceId?: string) => {
    if (!isSupported) {
      setError('Audio playback is not supported in this browser');
      return;
    }

    if (!text.trim()) {
      setError('No text provided');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      
      // Stop any current playback
      stop();

      // Create new abort controller for this request
      const controller = new AbortController();
      currentControllerRef.current = controller;

      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: voiceId || 'EXAVITQu4vr4xnSDxMaL', // Default voice (Bella)
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setError('Failed to play audio');
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't show error
        return;
      }
      setError(`Failed to generate speech: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isSupported, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    speak,
    isPlaying,
    isLoading,
    stop,
    error,
    isSupported
  };
}