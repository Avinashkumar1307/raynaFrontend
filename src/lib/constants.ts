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
