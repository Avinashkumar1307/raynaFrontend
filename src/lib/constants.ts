export const MAX_MESSAGE_LENGTH = 1000;
export const HISTORY_LIMIT = 50;
export const BRAND_NAME = "Rayna Tours";

export const SUPPORTED_DESTINATIONS = [
  { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", emoji: "🏙️" },
  { name: "Abu Dhabi", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop", emoji: "🕌" },
  { name: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop", emoji: "🇸🇬" },
  { name: "Thailand", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop", emoji: "🏝️" },
  { name: "Bangkok", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop", emoji: "🛕" },
  { name: "Phuket", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop", emoji: "🌊" },
  { name: "Malaysia", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop", emoji: "🏗️" },
  { name: "Turkey", image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop", emoji: "🕌" },
  { name: "Istanbul", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop", emoji: "🌉" },
  { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", emoji: "🌴" },
  { name: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop", emoji: "🏖️" },
  { name: "Georgia", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop", emoji: "⛰️" },
  { name: "Azerbaijan", image: "https://images.unsplash.com/photo-1600019248002-f4c4898f0635?w=400&h=300&fit=crop", emoji: "🔥" },
  { name: "Oman", image: "https://images.unsplash.com/photo-1597220869811-9eb894044aa5?w=400&h=300&fit=crop", emoji: "🏜️" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop", emoji: "🌿" },
  { name: "Munnar", image: "https://images.unsplash.com/photo-1564574662330-aecab4145680?w=400&h=300&fit=crop", emoji: "🍃" },
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop", emoji: "🏖️" },
  { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop", emoji: "🏛️" },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop", emoji: "🏰" },
  { name: "Rajasthan", image: "https://images.unsplash.com/photo-1524309827855-19e0e4381e5f?w=400&h=300&fit=crop", emoji: "🐪" },
  { name: "India", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop", emoji: "🇮🇳" },
  { name: "Muscat", image: "https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=400&h=300&fit=crop", emoji: "🕌" },
  { name: "Riyadh", image: "https://images.unsplash.com/photo-1586724237569-9c5e0e5b3a1a?w=400&h=300&fit=crop", emoji: "🏙️" },
  { name: "Jeddah", image: "https://images.unsplash.com/photo-1578681040585-38249c8b2e9a?w=400&h=300&fit=crop", emoji: "🌊" },
  { name: "Egypt", image: "https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=400&h=300&fit=crop", emoji: "🏛️" },
  { name: "Cairo", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=300&fit=crop", emoji: "🏛️" },
  { name: "Sharjah", image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400&h=300&fit=crop", emoji: "🏙️" },
  { name: "Mauritius", image: "https://images.unsplash.com/photo-1589979481223-deb893043163?w=400&h=300&fit=crop", emoji: "🏝️" },
  { name: "Sri Lanka", image: "https://images.unsplash.com/photo-1586364246539-943baca9c58e?w=400&h=300&fit=crop", emoji: "🌴" },
  { name: "Nepal", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", emoji: "🏔️" },
  { name: "Vietnam", image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=400&h=300&fit=crop", emoji: "🏮" },
  { name: "Japan", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop", emoji: "🗾" },
  { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", emoji: "🗼" },
  { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop", emoji: "🎡" },
  { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop", emoji: "🗽" },
];

export const DESTINATION_NAMES = SUPPORTED_DESTINATIONS.map((d) => d.name.toLowerCase());

export const FEATURED_DESTINATIONS = SUPPORTED_DESTINATIONS.slice(0, 6);

// Specific landmarks/attractions — used for precise map pinning
export interface Landmark {
  name: string;
  city: string;          // parent destination for fallback
  mapQuery: string;      // exact query sent to map embed (city-qualified)
  emoji: string;
  nearbyLabel: string;   // label for "nearby" quick action
}

export const LANDMARKS: Landmark[] = [
  // Dubai
  { name: "Burj Khalifa", city: "Dubai", mapQuery: "Burj Khalifa, Dubai, UAE", emoji: "🏙️", nearbyLabel: "Viewpoints near Burj Khalifa" },
  { name: "Burj Al Arab", city: "Dubai", mapQuery: "Burj Al Arab, Dubai, UAE", emoji: "⛵", nearbyLabel: "Beach resorts near Burj Al Arab" },
  { name: "Palm Jumeirah", city: "Dubai", mapQuery: "Palm Jumeirah, Dubai, UAE", emoji: "🌴", nearbyLabel: "Attractions on Palm Jumeirah" },
  { name: "Dubai Mall", city: "Dubai", mapQuery: "Dubai Mall, Dubai, UAE", emoji: "🛍️", nearbyLabel: "Activities near Dubai Mall" },
  { name: "Dubai Frame", city: "Dubai", mapQuery: "Dubai Frame, UAE", emoji: "🖼️", nearbyLabel: "Sights near Dubai Frame" },
  { name: "Dubai Creek", city: "Dubai", mapQuery: "Dubai Creek, Dubai, UAE", emoji: "🚤", nearbyLabel: "Experiences at Dubai Creek" },
  { name: "Dubai Marina", city: "Dubai", mapQuery: "Dubai Marina, UAE", emoji: "⛵", nearbyLabel: "Activities in Dubai Marina" },
  { name: "Gold Souk", city: "Dubai", mapQuery: "Gold Souk, Deira, Dubai", emoji: "💛", nearbyLabel: "Souks near Gold Souk Dubai" },
  { name: "Spice Souk", city: "Dubai", mapQuery: "Spice Souk, Deira, Dubai", emoji: "🌶️", nearbyLabel: "Markets near Spice Souk" },
  { name: "Global Village", city: "Dubai", mapQuery: "Global Village Dubai, UAE", emoji: "🌍", nearbyLabel: "Events near Global Village" },
  { name: "Dubai Miracle Garden", city: "Dubai", mapQuery: "Dubai Miracle Garden, UAE", emoji: "🌸", nearbyLabel: "Parks near Miracle Garden" },
  { name: "Atlantis", city: "Dubai", mapQuery: "Atlantis The Palm, Dubai, UAE", emoji: "🌊", nearbyLabel: "Water parks near Atlantis Dubai" },
  { name: "Dubai Aquarium", city: "Dubai", mapQuery: "Dubai Aquarium and Underwater Zoo", emoji: "🐠", nearbyLabel: "Family attractions near Dubai Aquarium" },
  { name: "Desert Safari", city: "Dubai", mapQuery: "Dubai Desert Safari Camp, UAE", emoji: "🐪", nearbyLabel: "Desert experiences near Dubai" },
  // Abu Dhabi
  { name: "Sheikh Zayed Mosque", city: "Abu Dhabi", mapQuery: "Sheikh Zayed Grand Mosque, Abu Dhabi", emoji: "🕌", nearbyLabel: "Cultural sites near Sheikh Zayed Mosque" },
  { name: "Louvre Abu Dhabi", city: "Abu Dhabi", mapQuery: "Louvre Abu Dhabi, UAE", emoji: "🎨", nearbyLabel: "Museums near Louvre Abu Dhabi" },
  { name: "Ferrari World", city: "Abu Dhabi", mapQuery: "Ferrari World Abu Dhabi, Yas Island", emoji: "🏎️", nearbyLabel: "Theme parks on Yas Island" },
  { name: "Yas Island", city: "Abu Dhabi", mapQuery: "Yas Island, Abu Dhabi, UAE", emoji: "🎢", nearbyLabel: "Attractions on Yas Island" },
  { name: "Warner Bros World", city: "Abu Dhabi", mapQuery: "Warner Bros. World Abu Dhabi", emoji: "🦸", nearbyLabel: "Theme parks on Yas Island" },
  // Singapore
  { name: "Marina Bay Sands", city: "Singapore", mapQuery: "Marina Bay Sands, Singapore", emoji: "🏨", nearbyLabel: "Viewpoints near Marina Bay Sands" },
  { name: "Gardens by the Bay", city: "Singapore", mapQuery: "Gardens by the Bay, Singapore", emoji: "🌿", nearbyLabel: "Parks near Gardens by the Bay" },
  { name: "Sentosa Island", city: "Singapore", mapQuery: "Sentosa Island, Singapore", emoji: "🏖️", nearbyLabel: "Attractions on Sentosa Island" },
  { name: "Universal Studios Singapore", city: "Singapore", mapQuery: "Universal Studios Singapore", emoji: "🎬", nearbyLabel: "Theme parks near Universal Studios Singapore" },
  { name: "Merlion", city: "Singapore", mapQuery: "Merlion Park, Singapore", emoji: "🦁", nearbyLabel: "Sights near Merlion Park" },
  // Bangkok
  { name: "Grand Palace", city: "Bangkok", mapQuery: "Grand Palace, Bangkok, Thailand", emoji: "🏯", nearbyLabel: "Temples near Grand Palace Bangkok" },
  { name: "Wat Pho", city: "Bangkok", mapQuery: "Wat Pho, Bangkok, Thailand", emoji: "🛕", nearbyLabel: "Temples near Wat Pho Bangkok" },
  { name: "Chatuchak Market", city: "Bangkok", mapQuery: "Chatuchak Weekend Market, Bangkok", emoji: "🛒", nearbyLabel: "Markets near Chatuchak Bangkok" },
  // Bali
  { name: "Uluwatu Temple", city: "Bali", mapQuery: "Uluwatu Temple, Bali, Indonesia", emoji: "🛕", nearbyLabel: "Temples near Uluwatu Bali" },
  { name: "Tanah Lot", city: "Bali", mapQuery: "Tanah Lot Temple, Bali, Indonesia", emoji: "🌊", nearbyLabel: "Sights near Tanah Lot Bali" },
  { name: "Ubud", city: "Bali", mapQuery: "Ubud, Bali, Indonesia", emoji: "🌿", nearbyLabel: "Experiences in Ubud Bali" },
  // Istanbul
  { name: "Hagia Sophia", city: "Istanbul", mapQuery: "Hagia Sophia, Istanbul, Turkey", emoji: "🕌", nearbyLabel: "Sights near Hagia Sophia Istanbul" },
  { name: "Blue Mosque", city: "Istanbul", mapQuery: "Blue Mosque, Istanbul, Turkey", emoji: "🕌", nearbyLabel: "Mosques near Blue Mosque Istanbul" },
  { name: "Grand Bazaar", city: "Istanbul", mapQuery: "Grand Bazaar, Istanbul, Turkey", emoji: "🛍️", nearbyLabel: "Bazaars near Grand Bazaar Istanbul" },
  // Cairo
  { name: "Pyramids of Giza", city: "Cairo", mapQuery: "Pyramids of Giza, Egypt", emoji: "🏛️", nearbyLabel: "Ancient sites near Pyramids of Giza" },
  { name: "Sphinx", city: "Cairo", mapQuery: "Great Sphinx of Giza, Egypt", emoji: "🦁", nearbyLabel: "Sights near the Sphinx Egypt" },
  // Paris
  { name: "Eiffel Tower", city: "Paris", mapQuery: "Eiffel Tower, Paris, France", emoji: "🗼", nearbyLabel: "Viewpoints near Eiffel Tower" },
  { name: "Louvre", city: "Paris", mapQuery: "Louvre Museum, Paris, France", emoji: "🎨", nearbyLabel: "Museums near Louvre Paris" },
  // London
  { name: "Big Ben", city: "London", mapQuery: "Big Ben, Westminster, London, UK", emoji: "🕰️", nearbyLabel: "Sights near Big Ben London" },
  { name: "Tower of London", city: "London", mapQuery: "Tower of London, UK", emoji: "🏰", nearbyLabel: "Historic sites near Tower of London" },
  // New York
  { name: "Statue of Liberty", city: "New York", mapQuery: "Statue of Liberty, New York, USA", emoji: "🗽", nearbyLabel: "Sights near Statue of Liberty" },
  { name: "Times Square", city: "New York", mapQuery: "Times Square, New York, USA", emoji: "🌆", nearbyLabel: "Attractions near Times Square" },
];

export const LANDMARK_NAMES = LANDMARKS.map((l) => l.name.toLowerCase());
