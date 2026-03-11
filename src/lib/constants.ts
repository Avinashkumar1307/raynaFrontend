export const MAX_MESSAGE_LENGTH = 1000;
export const HISTORY_LIMIT = 50;
export const BRAND_NAME = "Rayna Tours";

export const SUPPORTED_DESTINATIONS = [
  { name: "Dubai", image: "/destinations/dubai.jpg", emoji: "🏙️" },
  { name: "Abu Dhabi", image: "/destinations/abudhabi.jpg", emoji: "🕌" },
  { name: "Singapore", image: "/destinations/singapore.jpg", emoji: "🇸🇬" },
  { name: "Thailand", image: "/destinations/thailand.jpg", emoji: "🏝️" },
  { name: "Bangkok", image: "/destinations/bangkok.jpg", emoji: "🛕" },
  { name: "Phuket", image: "/destinations/phuket.jpg", emoji: "🌊" },
  { name: "Malaysia", image: "/destinations/malaysia.jpg", emoji: "🏗️" },
  { name: "Turkey", image: "/destinations/turkey.jpg", emoji: "🕌" },
  { name: "Istanbul", image: "/destinations/istanbul.jpg", emoji: "🌉" },
  { name: "Bali", image: "/destinations/bali.jpg", emoji: "🌴" },
  { name: "Maldives", image: "/destinations/maldives.jpg", emoji: "🏖️" },
  { name: "Georgia", image: "/destinations/georgia.jpg", emoji: "⛰️" },
  { name: "Azerbaijan", image: "/destinations/azerbaijan.jpg", emoji: "🔥" },
  { name: "Oman", image: "/destinations/oman.jpg", emoji: "🏜️" },
];

export const DESTINATION_NAMES = SUPPORTED_DESTINATIONS.map((d) => d.name.toLowerCase());

export const FEATURED_DESTINATIONS = SUPPORTED_DESTINATIONS.slice(0, 6);
