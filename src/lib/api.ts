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

export const api = {
  sendMessage(message: string, sessionId?: string) {
    return request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId }),
    });
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
