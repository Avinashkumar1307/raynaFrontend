"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  voiceEnabled?: boolean;
  isPlaying?: boolean;
  isTTSLoading?: boolean;
}

export default function ChatInput({
  onSend,
  disabled,
  voiceEnabled = false,
  isPlaying = false,
  isTTSLoading = false
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    isListening,
    isSupported: isSpeechSupportedRaw,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError
  } = useSpeechToText({
    continuous: false,
    interimResults: true,
    language: 'en-US'
  });

  // Defer speech support check to avoid hydration mismatch
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  useEffect(() => {
    setIsSpeechSupported(isSpeechSupportedRaw);
  }, [isSpeechSupportedRaw]);

  const isRecording = isListening;
  const startRecording = startListening;
  const stopRecording = stopListening;

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    clearTranscript();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, disabled, onSend, clearTranscript]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setInput(value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
      }
    }
  }, [transcript]);

  const handleMicClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      clearTranscript();
      setInput("");
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording, clearTranscript]);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 p-3 sm:p-4 md:px-6 bg-[var(--bg-primary)] pb-[max(env(safe-area-inset-bottom),8px)]">
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <div className="flex-1 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] focus-within:border-[var(--text-tertiary)] transition-all relative px-4 py-3">
          <div className="flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Ask about tours, activities, travel plans..."}
              disabled={disabled || isRecording}
              rows={1}
              className="w-full resize-none bg-transparent p-0 pr-10
                         text-sm sm:text-base
                         text-[var(--text-primary)]
                         placeholder-[var(--text-tertiary)]
                         focus:outline-none disabled:opacity-40 transition-colors"
            />
            {isSpeechSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={disabled}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                } disabled:opacity-40`}
                aria-label={isRecording ? "Stop listening" : "Start voice input"}
                title={isRecording ? "Stop listening" : "Click to speak"}
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
            )}
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="rounded-xl bg-[var(--accent)] p-3 text-[var(--bg-primary)] hover:opacity-80 disabled:opacity-20 transition-all shrink-0 tappable"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </button>
      </div>
      <div className="max-w-2xl mx-auto mt-1.5">
        {speechError && (
          <p className="text-xs text-red-500 text-center">
            Speech error: {speechError}
          </p>
        )}
        {isRecording && (
          <p className="text-xs text-red-500 text-center animate-pulse">
            Listening... tap microphone to stop
          </p>
        )}
        {transcript && !isRecording && (
          <p className="text-xs text-emerald-500 text-center">
            Voice input ready - press Enter or tap Send
          </p>
        )}
        {voiceEnabled && (isPlaying || isTTSLoading) && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            {isTTSLoading ? 'Generating speech...' : 'Playing response...'}
          </p>
        )}
        {input.length > 900 && (
          <p className="text-xs text-[var(--text-tertiary)] text-right">
            {input.length}/{MAX_MESSAGE_LENGTH}
          </p>
        )}
      </div>
    </div>
  );
}
