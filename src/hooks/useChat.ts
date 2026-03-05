"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { getSessionId, setSessionId, clearSessionId } from "@/lib/session";
import { parseTourDataFromText, createMockTourCarousel, parseJsonTourData, processAssistantContent } from "@/lib/tourUtils";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import { cleanTextForTTS, isTextSafeForTTS } from "@/utils/textCleaner";
import type { Message } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  // Only true when a brand-new assistant reply arrives via sendMessage (not history loads)
  const [shouldAnimateNewMessage, setShouldAnimateNewMessage] = useState(false);
  // Increments every time the active conversation changes so ChatPanel can reset animatingIndex
  const [conversationKey, setConversationKey] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Voice response setting

  // Text-to-Speech for AI responses
  const {
    speak,
    isPlaying,
    isLoading: isTTSLoading,
    stop: stopSpeaking,
    error: ttsError,
    isSupported: ttsSupported
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
            setMessages(data.messages.map((m) => {
              if (m.role === "assistant") {
                const { content, tourCarousel } = processAssistantContent(m.content, m.tourCarousel);
                return { role: m.role, content, tourCarousel };
              }
              return { role: m.role as "user", content: m.content };
            }));
          }
        })
        .catch(() => {
          // Session expired server-side, clear stale ID
          clearSessionId();
          setCurrentSessionId(null);
        });
    }
  }, []);

  const loadConversation = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setConversationKey((k) => k + 1); // signal ChatPanel to reset animatingIndex
    try {
      const data = await api.getConversationDetail(sessionId);
      setMessages(data.messages.map((m) => {
        if (m.role === "assistant") {
          const { content, tourCarousel } = processAssistantContent(m.content, m.tourCarousel);
          return { role: m.role, content, tourCarousel };
        }
        return { role: m.role as "user", content: m.content };
      }));
      setSessionId(sessionId);
      setCurrentSessionId(sessionId);
      setShouldScrollToBottom(true);
    } catch {
      // Silently fail — conversation may be deleted or DB unavailable
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    setError(null);

    // Optimistically add user message
    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const sessionId = getSessionId() || undefined;
      const response = await api.sendMessage(content, sessionId);

      // Persist session ID
      setSessionId(response.session_id);
      setCurrentSessionId(response.session_id);

      // Process the response to extract or create tour carousel
      let tourCarousel = response.tourCarousel;
      let processedContent = response.message;

      // Enhanced tour detection - show carousel for both actual data AND tour questions
      const hasRealTourData = !tourCarousel && response.message && (
        // Backend <tour-carousel> tag format (highest priority)
        response.message.includes('<tour-carousel') ||
        // {{CAROUSEL: {...}}} format
        response.message.includes('{{CAROUSEL:') ||
        // JSON tour data detection (when backend returns structured data)
        response.message.includes('"type":"tour_carousel"') ||
        response.message.includes('"cards":[') ||
        response.message.includes('```json') ||
        (response.message.includes('"title"') && response.message.includes('"image"') && response.message.includes('"url"')) ||

        // Emoji-structured format detection (Singapore/other destinations)
        (response.message.includes('⭐') && response.message.includes('💰') && response.message.includes('🔗') && response.message.includes('---')) ||

        // Table format detection with actual tour data
        (response.message.includes('|---|') && (
          response.message.includes('AED ') ||
          response.message.includes('USD ') ||
          response.message.includes('SGD ') ||
          response.message.includes('INR ')
        )) ||

        // Structured tour listings with prices and ratings
        (response.message.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/) && (
          response.message.includes('⭐') || response.message.includes('★')
        ))
      );

      // Also check if user is asking about tours (even without structured data)
      const isTourQuestion = !tourCarousel && !hasRealTourData && content.toLowerCase().includes('tour') && (
        content.toLowerCase().includes('dubai') ||
        content.toLowerCase().includes('singapore') ||
        content.toLowerCase().includes('thailand') ||
        content.toLowerCase().includes('malaysia')
      ) && (
        content.toLowerCase().includes('plan') ||
        content.toLowerCase().includes('available') ||
        content.toLowerCase().includes('show me') ||
        content.toLowerCase().includes('any') ||
        content.toLowerCase().includes('what') ||
        content.toLowerCase().includes('which')
      );

      if (hasRealTourData || isTourQuestion) {
        // First try to parse JSON tour data (priority)
        tourCarousel = parseJsonTourData(response.message) || undefined;

        // If no JSON found, try to parse table format
        if (!tourCarousel) {
          tourCarousel = parseTourDataFromText(response.message) || undefined;
        }

        // If still no data but user asked a tour question, show relevant tours
        if (!tourCarousel && isTourQuestion) {
          let carouselTitle = 'Featured Tours';

          if (content.toLowerCase().includes('dubai')) {
            carouselTitle = 'Dubai Tours';
            if (content.toLowerCase().includes('desert')) {
              carouselTitle = 'Desert Safari Tours';
            } else if (content.toLowerCase().includes('city')) {
              carouselTitle = 'Dubai City Tours';
            } else if (content.toLowerCase().includes('water')) {
              carouselTitle = 'Water Activities in Dubai';
            }
          } else if (content.toLowerCase().includes('singapore')) {
            carouselTitle = 'Singapore Tours';
          } else if (content.toLowerCase().includes('thailand')) {
            carouselTitle = 'Thailand Tours';
          } else if (content.toLowerCase().includes('malaysia')) {
            carouselTitle = 'Malaysia Tours';
          }

          tourCarousel = createMockTourCarousel(carouselTitle);

          // Add helpful message for tour questions
          if (!processedContent.toLowerCase().includes('here are')) {
            processedContent = `Yes! Here are some popular ${carouselTitle.toLowerCase()} available:\n\n${processedContent}`;
          }
        }

        // Clean up the message content when we have tour data
        if (tourCarousel) {
          // Remove various tour data formats from the text
          processedContent = response.message
            .replace(/<tour-carousel[\s\S]*?<\/tour-carousel>/g, '') // Remove backend tag
            .replace(/\{\{CAROUSEL:[\s\S]*?\}\}\}/g, '')             // Remove {{CAROUSEL: ...}}} block
            .replace(/```json[\s\S]*?```/g, '') // Remove JSON code blocks
            .replace(/\{[\s\S]*?"type"\s*:\s*"tour_carousel"[\s\S]*?\}/g, '') // Remove raw JSON
            .replace(/---[\s\S]*?(?=\n\n|Would you like|$)/g, '') // Remove emoji-structured tour data
            .replace(/🏙️[\s\S]*?🔗\s*https?:\/\/[^\s\n]+/g, '') // Remove individual tour entries
            .replace(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/g, '') // Remove table rows
            .replace(/\|---|/g, '') // Remove table separators
            .replace(/-{3,}/g, '') // Remove separator lines
            .replace(/#{1,3}\s*[^\n]+/g, '') // Remove markdown headers
            .replace(/^\*{0,2}\d+\..*$/gm, '')  // Remove numbered list items (1. or **1.)
            .replace(/^[^\n]*(?:💰|🔗|⏱️)\s*.+$/gm, '')  // Remove price/link/duration emoji lines
            .replace(/^[^\n]*⭐[^\n]*\|[^\n]*$/gm, '')    // Remove rating|separator lines
            .replace(/^https?:\/\/\S+\s*$/gm, '')         // Remove standalone URL lines
            .replace(/Would you like to:[\s\S]*$/g, '') // Remove follow-up questions
            .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
            .replace(/\s*\n\s*\n\s*/g, '\n\n') // Normalize spacing
            .trim();

          // If content is mostly empty after cleaning, provide a better message
          if (!processedContent || processedContent.length < 80) {
            const location = tourCarousel.cards[0]?.location || 'your destination';
            processedContent = `Here are ${tourCarousel.cards.length} amazing tours in ${location}! 🎆✨\n\nBrowse through these exciting experiences and click any card to book:`;
          }
        }
      }

            // Add assistant response
      const assistantMsg: Message = {
        role: "assistant",
        content: processedContent,
        tourCarousel: tourCarousel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setShouldScrollToBottom(true);
      setShouldAnimateNewMessage(true); // only real-time replies animate

                  // Speak the assistant's response if voice is enabled
      if (voiceEnabled && ttsSupported && processedContent) {
        const speechText = cleanTextForTTS(processedContent);
        console.log('Original text:', processedContent.substring(0, 100));
        console.log('Cleaned text for speech:', speechText.substring(0, 100));
        
        if (isTextSafeForTTS(speechText)) {
          // Add a small delay to let the message render first
          setTimeout(() => {
            speak(speechText);
          }, 300);
        } else {
          console.log('Text not safe for TTS:', { 
            length: speechText.length, 
            isEmpty: speechText.length === 0 
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";

      let chatErrorMessage: string;

      if (errorMessage.includes("Too many")) {
        chatErrorMessage = "I'm receiving messages too quickly. Please wait a moment before sending another message. 🕐";
      } else if (errorMessage.includes("timeout") || errorMessage.includes("ECONNABORTED")) {
        chatErrorMessage = "I'm taking longer than usual to respond. This might be due to high demand. Please try asking again. ⏱️";
      } else if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        chatErrorMessage = "I'm having trouble connecting right now. Please check your internet connection and try again. 🌐";
      } else if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
        chatErrorMessage = "I'm experiencing some technical difficulties. Please try again in a moment, or visit raynatours.com for assistance. 🔧";
      } else {
        chatErrorMessage = "I encountered an issue processing your request. Please try rephrasing your question or visit raynatours.com for assistance. 💫";
      }

            // Add error as assistant message instead of showing error banner
      const errorMsg: Message = {
        role: "assistant",
        content: chatErrorMessage,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setShouldScrollToBottom(true);

            // Speak error message if voice is enabled
      if (voiceEnabled && ttsSupported) {
        const speechText = cleanTextForTTS(chatErrorMessage);
        if (isTextSafeForTTS(speechText)) {
          setTimeout(() => {
            speak(speechText);
          }, 300);
        }
      }

      // Clear any existing error state
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

    const clearChat = useCallback(async () => {
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await api.clearSession(sessionId);
      } catch {
        // Ignore — session may already be expired
      }
    }
    stopSpeaking(); // Stop any current speech
    clearSessionId();
    setMessages([]);
    setError(null);
    setCurrentSessionId(null);
    setConversationKey((k) => k + 1); // signal ChatPanel to reset animatingIndex
  }, [stopSpeaking]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (!prev) {
        // Voice was just enabled, don't interrupt current speech
        return true;
      } else {
        // Voice was just disabled, stop current speech
        stopSpeaking();
        return false;
      }
    });
  }, [stopSpeaking]);

  // Reset scroll trigger after it's been consumed
  const consumeScrollTrigger = useCallback(() => {
    setShouldScrollToBottom(false);
  }, []);

  // Reset animation trigger after ChatPanel consumes it
  const consumeAnimationTrigger = useCallback(() => {
    setShouldAnimateNewMessage(false);
  }, []);

    return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    loadConversation,
    currentSessionId,
    conversationKey,
    shouldScrollToBottom,
    shouldAnimateNewMessage,
    consumeScrollTrigger,
    consumeAnimationTrigger,
    // Voice functionality
    voiceEnabled,
    toggleVoice,
    isPlaying,
    isTTSLoading,
    stopSpeaking,
    ttsError,
    ttsSupported,
  };
}
