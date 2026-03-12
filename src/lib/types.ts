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

export type ProductCardType = 'tour_carousel' | 'holiday_carousel' | 'cruise_carousel' | 'yacht_carousel';

export interface ProductCard {
  id: number | string;
  title: string;
  image: string;
  location: string;
  category: string;
  originalPrice: number;
  currentPrice: number;
  currency: string;
  duration?: string;
  url: string;
  slug?: string;
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
  discount?: number;
  discountPercentage?: number;
  highlights?: string[];
}

export interface ProductCarousel {
  type: ProductCardType;
  title: string;
  cards: ProductCard[];
  totalResults?: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  tourCarousel?: TourCarousel;
  productCarousel?: ProductCarousel;
  suggestions?: string[];
}

export interface ChatResponse {
  message: string;
  session_id: string;
  tourCarousel?: TourCarousel;
  productCarousel?: ProductCarousel;
  metadata?: {
    hasCards: boolean;
    cardType?: ProductCardType;
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

export interface ContextDestination {
  name: string;
  detectedFrom: string;
}

export interface ContextLandmark {
  name: string;
  city: string;
  mapQuery: string;
  emoji: string;
  nearbyLabel: string;
}

export interface CartItem {
  id: string;
  title: string;
  image: string;
  location: string;
  category: string;
  price: number;
  originalPrice?: number;
  currency: string;
  url: string;
  duration?: string;
  type: 'tour' | 'holiday' | 'cruise' | 'yacht';
}

