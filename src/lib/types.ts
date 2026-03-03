export interface TourCard {
  id: string;
  title: string;
  slug: string;
  image: string;
  location: string;
  category: string;
  originalPrice?: number | null;
  currentPrice: number;
  currency: string;
  discount?: number;
  discountPercentage?: number;
  isRecommended?: boolean;
  isNew?: boolean;
  rPoints?: number;
  rating?: number;
  reviewCount?: number;
  duration?: string;
  highlights?: string[];
  url: string;
}

export interface TourCarousel {
  type: 'tour_carousel';
  title: string;
  subtitle?: string;
  cards: TourCard[];
  totalResults?: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  tourCarousel?: TourCarousel;
}

export interface ChatResponse {
  message: string;
  session_id: string;
  tourCarousel?: TourCarousel;
  metadata?: {
    hasCards: boolean;
    cardCount?: number;
    totalResults?: number;
  };
}

export interface HistoryResponse {
  session_id: string;
  messages: Message[];
}

// New history API types
export interface ConversationSummary {
  session_id: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ConversationDetailResponse {
  session_id: string;
  title: string;
  created_at: string;
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Conversion {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
  timestamp: string;
}

export interface SessionConversionsResponse {
  session_id: string;
  conversions: Conversion[];
}

export interface AllConversionsResponse {
  conversions: (Conversion & { session_id: string })[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  milestone: number;
  timestamp: string;
}

