"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Users, DollarSign } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  voiceEnabled?: boolean;
  isPlaying?: boolean;
  isTTSLoading?: boolean;
}

const FILTER_CHIPS = [
  { label: "Where", icon: MapPin, template: "I want to travel to " },
  { label: "When", icon: Calendar, template: "I want to travel on " },
  { label: "Travelers", icon: Users, template: "I'm traveling with " },
  { label: "Budget", icon: DollarSign, template: "My budget is " },
];

export default function ChatInput({
  onSend,
  disabled,
  voiceEnabled = false,
  isPlaying = false,
  isTTSLoading = false,
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
    error: speechError,
  } = useSpeechToText({
    continuous: false,
    interimResults: true,
    language: "en-US",
  });

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

  const handleChipClick = (template: string) => {
    setInput(template);
    textareaRef.current?.focus();
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 p-3 sm:p-4 md:px-6 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent pb-[max(env(safe-area-inset-bottom),8px)]">
      <div className="max-w-2xl mx-auto">
        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {FILTER_CHIPS.map(({ label, icon: Icon, template }) => (
            <button
              key={label}
              onClick={() => handleChipClick(template)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="text-[var(--text-tertiary)]">+</span>
              <Icon className="size-3" />
              {label}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "relative rounded-2xl border backdrop-blur-xl",
            "transition-all duration-300",
            "bg-[var(--bg-card)]/80 border-[var(--border-color)]",
            "shadow-sm",
            "focus-within:border-[var(--text-tertiary)]",
            "focus-within:shadow-lg focus-within:shadow-black/5",
            "dark:focus-within:shadow-white/5",
            "glow-border"
          )}
        >
          <div className="flex items-end gap-2 p-2">
            {/* Red record button */}
            {isSpeechSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleMicClick}
                disabled={disabled}
                className={cn(
                  "shrink-0 rounded-full transition-all",
                  isRecording
                    ? "bg-[var(--record-btn)] text-white hover:bg-red-600 animate-pulse"
                    : "bg-[var(--record-btn)]/10 text-[var(--record-btn)] hover:bg-[var(--record-btn)]/20"
                )}
                aria-label={isRecording ? "Stop listening" : "Start voice input"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                </svg>
              </Button>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Type '/' for commands"}
              disabled={disabled || isRecording}
              rows={1}
              className="flex-1 resize-none bg-transparent p-1.5 px-2 text-sm sm:text-base leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none disabled:opacity-40 transition-colors"
            />

            {/* Waveform / mic toggle button */}
            {isSpeechSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleMicClick}
                disabled={disabled}
                className="shrink-0 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Voice input"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </Button>
            )}

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              size="icon-sm"
              className={cn(
                "shrink-0 rounded-xl transition-all duration-200",
                input.trim()
                  ? "bg-[var(--brand-accent)] text-[var(--bg-primary)] hover:opacity-80 scale-100"
                  : "bg-muted text-muted-foreground scale-95 opacity-50"
              )}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Status messages */}
        <div className="mt-1.5 min-h-[18px]">
          {speechError && (
            <p className="text-xs text-destructive text-center animate-fade-in">Speech error: {speechError}</p>
          )}
          {isRecording && (
            <p className="text-xs text-red-500 text-center animate-pulse">Listening... tap microphone to stop</p>
          )}
          {transcript && !isRecording && (
            <p className="text-xs text-emerald-500 text-center animate-fade-in">Voice input ready - press Enter or tap Send</p>
          )}
          {voiceEnabled && (isPlaying || isTTSLoading) && (
            <p className="text-xs text-muted-foreground text-center animate-fade-in">
              {isTTSLoading ? "Generating speech..." : "Playing response..."}
            </p>
          )}
          {input.length > 900 && (
            <p className="text-xs text-muted-foreground text-right">{input.length}/{MAX_MESSAGE_LENGTH}</p>
          )}
        </div>
      </div>
    </div>
  );
}
