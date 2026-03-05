"use client";

import { useCallback, useEffect } from 'react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useElevenLabsSTT } from '@/hooks/useElevenLabsSTT';

interface SpeechButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  mode?: 'browser' | 'elevenlabs';
}

export default function SpeechButton({ 
  onTranscript, 
  disabled = false,
  mode = 'browser' 
}: SpeechButtonProps) {
  
  // Browser Web Speech API (Free)
  const {
    transcript: browserTranscript,
    isListening: isBrowserListening,
    isSupported: isBrowserSupported,
    startListening: startBrowserListening,
    stopListening: stopBrowserListening,
    clearTranscript: clearBrowserTranscript,
    error: browserError
  } = useSpeechToText({
    continuous: false,
    interimResults: true,
    language: 'en-US'
  });

    // ElevenLabs API (Premium)
  const {
    transcript: elevenLabsTranscript,
    isRecording: isElevenLabsRecording,
    isProcessing: isElevenLabsProcessing,
    startRecording: startElevenLabsRecording,
    stopRecording: stopElevenLabsRecording,
    clearTranscript: clearElevenLabsTranscript,
    error: elevenLabsError,
    isSupported: isElevenLabsSupported
  } = useElevenLabsSTT();

    const isActive = mode === 'browser' ? isBrowserListening : (isElevenLabsRecording || isElevenLabsProcessing);
  const currentTranscript = mode === 'browser' ? browserTranscript : elevenLabsTranscript;
  const currentError = mode === 'browser' ? browserError : elevenLabsError;
  const isSupported = mode === 'browser' ? isBrowserSupported : isElevenLabsSupported;

  const handleClick = useCallback(() => {
    if (disabled || !isSupported) return;

    if (mode === 'browser') {
      if (isBrowserListening) {
        stopBrowserListening();
        if (browserTranscript) {
          onTranscript(browserTranscript);
        }
      } else {
        clearBrowserTranscript();
        startBrowserListening();
      }
        } else {
      if (isElevenLabsRecording) {
        stopElevenLabsRecording();
      } else {
        clearElevenLabsTranscript();
        startElevenLabsRecording();
      }
    }
    }, [mode, disabled, isSupported, isBrowserListening, isElevenLabsRecording, 
      startBrowserListening, stopBrowserListening, clearBrowserTranscript,
      startElevenLabsRecording, stopElevenLabsRecording, clearElevenLabsTranscript,
      browserTranscript, onTranscript]);

    // Auto-send transcript when ready (for ElevenLabs)
  useEffect(() => {
    if (mode === 'elevenlabs' && elevenLabsTranscript && !isElevenLabsRecording && !isElevenLabsProcessing) {
      onTranscript(elevenLabsTranscript);
      clearElevenLabsTranscript();
    }
  }, [mode, elevenLabsTranscript, isElevenLabsRecording, isElevenLabsProcessing, onTranscript, clearElevenLabsTranscript]);

  if (!isSupported) {
    return null;
  }

  const getButtonState = () => {
    if (mode === 'browser') {
      return isBrowserListening ? 'listening' : 'idle';
        } else {
      if (isElevenLabsProcessing) return 'processing';
      if (isElevenLabsRecording) return 'recording';
      return 'idle';
    }
  };

  const buttonState = getButtonState();

  const getButtonStyle = () => {
    switch (buttonState) {
      case 'listening':
      case 'recording':
        return 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30';
      case 'processing':
        return 'bg-blue-500 text-white animate-spin';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800';
    }
  };

  const getTooltip = () => {
    switch (buttonState) {
      case 'listening':
        return 'Click to stop listening';
      case 'recording':
        return 'Click to stop recording';
      case 'processing':
        return 'Processing audio...';
      default:
        return `Click to start ${mode === 'browser' ? 'voice input' : 'recording'}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || buttonState === 'processing'}
      className={`p-2 rounded-full transition-all ${getButtonStyle()} disabled:opacity-40`}
      aria-label={getTooltip()}
      title={getTooltip()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
        />
      </svg>
    </button>
  );
}