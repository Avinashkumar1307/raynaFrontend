"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { getSessionId, setSessionId, clearSessionId } from "@/lib/session";
import { processAssistantContent } from "@/lib/tourUtils";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import { cleanTextForTTS, isTextSafeForTTS } from "@/utils/textCleaner";
import type { Message, TourCarousel, ProductCarousel } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [shouldAnimateNewMessage, setShouldAnimateNewMessage] = useState(false);
  const [conversationKey, setConversationKey] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [streamStatus, setStreamStatus] = useState<string | null>(null);

  // Track streaming state across renders
  const streamingRef = useRef<{
    text: string;
    tourCarousel?: TourCarousel;
    productCarousel?: ProductCarousel;
  }>({ text: "" });

  // Throttle token updates to avoid excessive re-renders
  const tokenFlushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFlush = useRef(false);

  const {
    speak,
    isPlaying,
    isLoading: isTTSLoading,
    stop: stopSpeaking,
    error: ttsError,
    isSupported: ttsSupported,
  } = useElevenLabsTTS();

  // On mount: restore chat history if we have a saved session
  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) {
      setCurrentSessionId(sessionId);
      api
        .getConversationDetail(sessionId)
        .then((data) => {
          if (data.messages.length > 0) {
            setMessages(
              data.messages.map((m) => {
                if (m.role === "assistant") {
                  const { content, tourCarousel } = processAssistantContent(
                    m.content,
                    m.tourCarousel
                  );
                  return {
                    role: m.role,
                    content,
                    tourCarousel,
                    productCarousel: m.productCarousel,
                  };
                }
                return { role: m.role as "user", content: m.content };
              })
            );
          }
        })
        .catch(() => {
          clearSessionId();
          setCurrentSessionId(null);
        });
    }
  }, []);

  const loadConversation = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setConversationKey((k) => k + 1);
    try {
      const data = await api.getConversationDetail(sessionId);
      setMessages(
        data.messages.map((m) => {
          if (m.role === "assistant") {
            const { content, tourCarousel } = processAssistantContent(
              m.content,
              m.tourCarousel
            );
            return {
              role: m.role,
              content,
              tourCarousel,
              productCarousel: m.productCarousel,
            };
          }
          return { role: m.role as "user", content: m.content };
        })
      );
      setSessionId(sessionId);
      setCurrentSessionId(sessionId);
      setShouldScrollToBottom(true);
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setStreamStatus(null);

      // Optimistically add user message
      const userMsg: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Reset streaming state
      streamingRef.current = { text: "" };

      // Track the index of the streaming assistant message
      const placeholderIndex = { value: -1 };

      try {
        const sessionId = getSessionId() || undefined;

        await api.sendMessageStream(content, sessionId, {
          onStatus(statusMessage) {
            setStreamStatus(statusMessage);
          },

          onToken(accumulated) {
            streamingRef.current.text = accumulated;
            setStreamStatus(null);

            // First token — add the assistant message immediately
            if (placeholderIndex.value < 0) {
              setMessages((prev) => {
                placeholderIndex.value = prev.length;
                return [
                  ...prev,
                  { role: "assistant" as const, content: accumulated },
                ];
              });
              setShouldScrollToBottom(true);
              return;
            }

            // Subsequent tokens — throttle UI updates to ~50ms
            pendingFlush.current = true;
            if (!tokenFlushTimer.current) {
              tokenFlushTimer.current = setTimeout(() => {
                tokenFlushTimer.current = null;
                if (pendingFlush.current) {
                  pendingFlush.current = false;
                  const latestText = streamingRef.current.text;
                  setMessages((prev) => {
                    const idx = placeholderIndex.value;
                    if (idx >= 0 && prev[idx]) {
                      const updated = [...prev];
                      updated[idx] = { ...updated[idx], content: latestText };
                      return updated;
                    }
                    return prev;
                  });
                  setShouldScrollToBottom(true);
                }
              }, 50);
            }
          },

          onClearTokens() {
            streamingRef.current.text = "";
            if (placeholderIndex.value >= 0) {
              setMessages((prev) => {
                const updated = [...prev];
                if (updated[placeholderIndex.value]) {
                  updated.splice(placeholderIndex.value, 1);
                }
                return updated;
              });
              placeholderIndex.value = -1;
            }
          },

          onCarousel(data) {
            if (data.tourCarousel) {
              streamingRef.current.tourCarousel = data.tourCarousel;
            }
            if (data.productCarousel) {
              streamingRef.current.productCarousel = data.productCarousel;
            }

            setMessages((prev) => {
              const idx = placeholderIndex.value;
              if (idx >= 0 && prev[idx]) {
                const updated = [...prev];
                updated[idx] = {
                  ...updated[idx],
                  tourCarousel: data.tourCarousel || updated[idx].tourCarousel,
                  productCarousel:
                    data.productCarousel || updated[idx].productCarousel,
                };
                return updated;
              }
              // Carousel arrived before any tokens
              placeholderIndex.value = prev.length;
              return [
                ...prev,
                {
                  role: "assistant" as const,
                  content: streamingRef.current.text,
                  tourCarousel: data.tourCarousel,
                  productCarousel: data.productCarousel,
                },
              ];
            });
            setShouldScrollToBottom(true);
          },

          onDone(sid, finalText) {
            // Cancel any pending throttled flush
            if (tokenFlushTimer.current) {
              clearTimeout(tokenFlushTimer.current);
              tokenFlushTimer.current = null;
            }
            pendingFlush.current = false;

            setSessionId(sid);
            setCurrentSessionId(sid);

            const finalContent = finalText || streamingRef.current.text;

            setMessages((prev) => {
              const idx = placeholderIndex.value;
              if (idx >= 0 && prev[idx]) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], content: finalContent };
                return updated;
              }
              // No tokens/carousel were sent — add a final message
              if (finalContent) {
                return [
                  ...prev,
                  {
                    role: "assistant" as const,
                    content: finalContent,
                    tourCarousel: streamingRef.current.tourCarousel,
                    productCarousel: streamingRef.current.productCarousel,
                  },
                ];
              }
              return prev;
            });

            setShouldScrollToBottom(true);
            setShouldAnimateNewMessage(false);
            setStreamStatus(null);
            setIsLoading(false);

            // TTS
            if (voiceEnabled && ttsSupported && finalContent) {
              const speechText = cleanTextForTTS(finalContent);
              if (isTextSafeForTTS(speechText)) {
                setTimeout(() => speak(speechText), 300);
              }
            }
          },

          onError(errorMessage) {
            setStreamStatus(null);
            setIsLoading(false);

            const chatErrorMessage =
              errorMessage ||
              "I encountered an issue. Please try again or visit raynatours.com for assistance.";

            setMessages((prev) => {
              const idx = placeholderIndex.value;
              if (idx >= 0 && prev[idx]) {
                const updated = [...prev];
                updated[idx] = { role: "assistant", content: chatErrorMessage };
                return updated;
              }
              return [
                ...prev,
                { role: "assistant" as const, content: chatErrorMessage },
              ];
            });
            setShouldScrollToBottom(true);
          },
        });
      } catch (err) {
        setStreamStatus(null);
        setIsLoading(false);

        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";

        let chatErrorMessage: string;
        if (errorMessage.includes("Too many")) {
          chatErrorMessage =
            "I'm receiving messages too quickly. Please wait a moment.";
        } else if (
          errorMessage.includes("timeout") ||
          errorMessage.includes("ECONNABORTED")
        ) {
          chatErrorMessage =
            "I'm taking longer than usual to respond. Please try again.";
        } else if (
          errorMessage.includes("Network") ||
          errorMessage.includes("fetch") ||
          errorMessage.includes("Failed")
        ) {
          chatErrorMessage =
            "I'm having trouble connecting. Please check your internet and try again.";
        } else {
          chatErrorMessage =
            "I encountered an issue processing your request. Please try again or visit raynatours.com.";
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant" as const, content: chatErrorMessage },
        ]);
        setShouldScrollToBottom(true);
        setError(null);
      }
    },
    [voiceEnabled, ttsSupported, speak]
  );

  const clearChat = useCallback(async () => {
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await api.clearSession(sessionId);
      } catch {
        // Ignore
      }
    }
    stopSpeaking();
    clearSessionId();
    setMessages([]);
    setError(null);
    setStreamStatus(null);
    setCurrentSessionId(null);
    setConversationKey((k) => k + 1);
  }, [stopSpeaking]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (!prev) return true;
      stopSpeaking();
      return false;
    });
  }, [stopSpeaking]);

  const consumeScrollTrigger = useCallback(() => {
    setShouldScrollToBottom(false);
  }, []);

  const consumeAnimationTrigger = useCallback(() => {
    setShouldAnimateNewMessage(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    streamStatus,
    sendMessage,
    clearChat,
    loadConversation,
    currentSessionId,
    conversationKey,
    shouldScrollToBottom,
    shouldAnimateNewMessage,
    consumeScrollTrigger,
    consumeAnimationTrigger,
    voiceEnabled,
    toggleVoice,
    isPlaying,
    isTTSLoading,
    stopSpeaking,
    ttsError,
    ttsSupported,
  };
}
