import type {
  ChatResponse,
  HistoryResponse,
  HealthResponse,
  ConversationListResponse,
  ConversationDetailResponse,
  SessionConversionsResponse,
  AllConversionsResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error || "Request failed", data.details);
  }

  return data as T;
}

export interface StreamCallbacks {
  onStatus?: (message: string) => void;
  onToken?: (accumulated: string, delta: string) => void;
  onClearTokens?: () => void;
  onCarousel?: (data: { tourCarousel?: ChatResponse["tourCarousel"]; productCarousel?: ChatResponse["productCarousel"]; metadata?: ChatResponse["metadata"] }) => void;
  onDone?: (sessionId: string, text: string, metadata?: ChatResponse["metadata"], suggestions?: string[]) => void;
  onError?: (message: string) => void;
}

export const api = {
  sendMessage(message: string, sessionId?: string) {
    return request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId }),
    });
  },

  async sendMessageStream(
    message: string,
    sessionId: string | undefined,
    callbacks: StreamCallbacks
  ) {
    const { onStatus, onToken, onClearTokens, onCarousel, onDone, onError } = callbacks;

    const res = await fetch(`${API_URL}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Stream request failed" }));
      throw new ApiError(res.status, data.error || "Stream request failed", data.details);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let currentEvent = "";
      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          try {
            const data = JSON.parse(line.slice(5).trim());
            const eventType = currentEvent || data.type;

            switch (eventType) {
              case "status":
                onStatus?.(data.message);
                break;
              case "token":
                accumulatedText += data.content;
                onToken?.(accumulatedText, data.content);
                break;
              case "clear_tokens":
                accumulatedText = "";
                onClearTokens?.();
                break;
              case "carousel":
                onCarousel?.(data);
                break;
              case "done":
                onDone?.(data.session_id, accumulatedText, data.metadata, data.suggestions);
                break;
              case "error":
                onError?.(data.message);
                break;
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    }
  },

  getHistory(sessionId: string, limit = 50) {
    return request<HistoryResponse>(
      `/api/chat/history/${sessionId}?limit=${limit}`
    );
  },

  clearSession(sessionId: string) {
    return request<{ success: boolean }>(
      `/api/chat/session/${sessionId}`,
      { method: "DELETE" }
    );
  },

  healthCheck() {
    return request<HealthResponse>("/api/chat/health");
  },

  // History API
  getConversations(page = 1, limit = 20) {
    return request<ConversationListResponse>(`/api/history?page=${page}&limit=${limit}`);
  },

  getConversationDetail(sessionId: string, page = 1, limit = 50) {
    return request<ConversationDetailResponse>(`/api/history/${sessionId}?page=${page}&limit=${limit}`);
  },

  deleteConversation(sessionId: string) {
    return request<{ success: boolean; message: string }>(`/api/history/${sessionId}`, {
      method: "DELETE",
    });
  },

  getSessionConversions(sessionId: string) {
    return request<SessionConversionsResponse>(`/api/history/${sessionId}/conversions`);
  },

  getAllConversions(page = 1, limit = 20) {
    return request<AllConversionsResponse>(`/api/history/conversions/all?page=${page}&limit=${limit}`);
  },
};
