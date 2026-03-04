import type { TourCard, TourCarousel } from './types';

// Strip markdown bold/italic markers from a string (e.g. **Title** → Title)
function stripMd(s: string): string {
  return s.replace(/\*\*/g, '').replace(/\*/g, '').trim();
}

// Parse JSON tour data from response text
export function parseJsonTourData(text: string): TourCarousel | null {
  try {
    // Method 0: Parse <tour-carousel data='...'></tour-carousel> tag (backend's preferred format)
    const tourTagMatch =
      text.match(/<tour-carousel\s+data='([\s\S]*?)'>\s*<\/tour-carousel>/) ||
      text.match(/<tour-carousel\s+data="([\s\S]*?)">\s*<\/tour-carousel>/);
    if (tourTagMatch) {
      const jsonData = JSON.parse(tourTagMatch[1]);
      if (jsonData.cards && Array.isArray(jsonData.cards)) {
        return {
          type: 'tour_carousel',
          title: jsonData.title || 'Featured Tours',
          subtitle: jsonData.subtitle,
          totalResults: jsonData.cards.length,
          cards: jsonData.cards.map((card: Record<string, unknown>, i: number) => ({
            id: String(card.id ?? `card-${i}`),
            title: String(card.title ?? ''),
            slug: String(card.id ?? String(card.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
            image: String(card.image ?? ''),
            location: String(card.location ?? ''),
            category: String(card.category ?? 'Tours'),
            originalPrice: (card.originalPrice as number) ?? null,
            currentPrice: (card.currentPrice as number) ?? 0,
            currency: String(card.currency ?? 'AED'),
            discountPercentage: card.discountPercentage as number | undefined,
            isRecommended: card.isRecommended as boolean | undefined,
            isNew: card.isNew as boolean | undefined,
            rating: card.rating as number | undefined,
            reviewCount: card.reviewCount as number | undefined,
            duration: card.duration as string | undefined,
            highlights: (card.highlights as string[]) ?? [],
            url: String(card.url ?? ''),
          })),
        };
      }
    }

    // Method 0b: Parse {{CAROUSEL: {...}}} format
    const carouselMarker = '{{CAROUSEL:';
    const markerIdx = text.indexOf(carouselMarker);
    if (markerIdx !== -1) {
      const jsonStart = text.indexOf('{', markerIdx + carouselMarker.length);
      if (jsonStart !== -1) {
        let braceCount = 0;
        let endIdx = jsonStart;
        let inStr = false;
        let esc = false;
        for (let i = jsonStart; i < text.length; i++) {
          const ch = text[i];
          if (esc) { esc = false; continue; }
          if (ch === '\\') { esc = true; continue; }
          if (ch === '"') { inStr = !inStr; continue; }
          if (!inStr) {
            if (ch === '{') braceCount++;
            else if (ch === '}') {
              braceCount--;
              if (braceCount === 0) { endIdx = i + 1; break; }
            }
          }
        }
        if (braceCount === 0 && endIdx > jsonStart) {
          const jsonStr = text.substring(jsonStart, endIdx);
          const jsonData = JSON.parse(jsonStr);
          if (jsonData.cards && Array.isArray(jsonData.cards)) {
            return {
              type: 'tour_carousel',
              title: jsonData.title || 'Featured Tours',
              subtitle: jsonData.subtitle,
              totalResults: jsonData.cards.length,
              cards: jsonData.cards.map((card: Record<string, unknown>, i: number) => ({
                id: String(card.id ?? `card-${i}`),
                title: String(card.title ?? ''),
                slug: String(card.id ?? String(card.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
                image: String(card.image ?? ''),
                location: String(card.location ?? ''),
                category: String(card.category ?? 'Tours'),
                originalPrice: (card.originalPrice as number) ?? null,
                currentPrice: (card.currentPrice as number) ?? 0,
                currency: String(card.currency ?? 'AED'),
                discountPercentage: card.discountPercentage as number | undefined,
                isRecommended: card.isRecommended as boolean | undefined,
                isNew: card.isNew as boolean | undefined,
                rating: card.rating as number | undefined,
                reviewCount: card.reviewCount as number | undefined,
                duration: card.duration as string | undefined,
                highlights: (card.highlights as string[]) ?? [],
                url: String(card.url ?? ''),
              })),
            };
          }
        }
      }
    }

    // Method 1: Look for JSON in code blocks (```json)
    const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      const jsonStr = codeBlockMatch[1].trim();
      const jsonData = JSON.parse(jsonStr);
      if (jsonData.type === 'tour_carousel' && jsonData.cards) {
        return jsonData as TourCarousel;
      }
    }
    
    // Method 2: Look for raw JSON structure
    const jsonMatch = text.match(/\{[\s\S]*?"type"\s*:\s*"tour_carousel"[\s\S]*?\}/);
    if (jsonMatch) {
      // Find the complete JSON object by counting braces
      const startIndex = text.indexOf(jsonMatch[0]);
      let braceCount = 0;
      let endIndex = startIndex;
      let inString = false;
      let escaped = false;
      
      for (let i = startIndex; i < text.length; i++) {
        const char = text[i];
        
        if (escaped) {
          escaped = false;
          continue;
        }
        
        if (char === '\\') {
          escaped = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }
      }
      
      if (braceCount === 0 && endIndex > startIndex) {
        const jsonStr = text.substring(startIndex, endIndex);
        const jsonData = JSON.parse(jsonStr);
        if (jsonData.type === 'tour_carousel' && jsonData.cards) {
          return jsonData as TourCarousel;
        }
      }
    }
    
    // Method 3: Look for tour_carousel type specifically
    const typeIndex = text.indexOf('"type": "tour_carousel"');
    if (typeIndex === -1) {
      const altTypeIndex = text.indexOf('"type":"tour_carousel"');
      if (altTypeIndex !== -1) {
        // Find the start of the JSON object
        let startIndex = altTypeIndex;
        while (startIndex > 0 && text[startIndex] !== '{') {
          startIndex--;
        }
        
        if (text[startIndex] === '{') {
          // Count braces to find the end
          let braceCount = 0;
          let endIndex = startIndex;
          
          for (let i = startIndex; i < text.length; i++) {
            if (text[i] === '{') braceCount++;
            else if (text[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
          }
          
          if (braceCount === 0) {
            const jsonStr = text.substring(startIndex, endIndex);
            const jsonData = JSON.parse(jsonStr);
            if (jsonData.type === 'tour_carousel' && jsonData.cards) {
              return jsonData as TourCarousel;
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to parse JSON tour data:', error);
    return null;
  }
}

// Utility to generate a placeholder image URL or use a fallback
export function getImageUrl(image: string | null | undefined, fallback?: string): string {
  if (image && image.trim()) {
    return image.trim();
  }
  return fallback || '';
}

// Extract tour data from text response and convert to carousel format
export function parseTourDataFromText(text: string): TourCarousel | null {
  const tours: TourCard[] = [];
  
  // Method 1: Parse table format tours
  const tableMatch = text.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/g);
  
  if (tableMatch && tableMatch.length > 1) {
    const lines = tableMatch.slice(1); // Skip header row

    lines.forEach((line, index) => {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length >= 6) {
        const [id, tourInfo, price, rating, duration, link] = cells;
        
        // Parse image and title from tour info
        const imageMatch = tourInfo.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        const titleMatch = tourInfo.replace(/!\[([^\]]*)\]\([^)]+\)/, '').trim();
        
        // Parse price
        const originalPriceMatch = price.match(/~~AED (\d+(?:,\d+)?(?:\.\d+)?)~~/);
        const currentPriceMatch = price.match(/AED (\d+(?:,\d+)?(?:\.\d+)?)(?!.*~~)/);
        
        // Parse rating
        const ratingMatch = rating.match(/(\d+\.?\d*) ⭐/);
        const reviewMatch = rating.match(/\((\d+)\)/);
        
        // Parse link
        const urlMatch = link.match(/https?:\/\/[^\s)]+/);
        
        if (titleMatch && urlMatch) {
          const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(/,/g, '')) : null;
          const currentPrice = currentPriceMatch ? parseFloat(currentPriceMatch[1].replace(/,/g, '')) : 0;
          
          const discountPercentage = originalPrice && currentPrice ? 
            Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : undefined;
          
          const tour: TourCard = {
            id: `tour-${index + 1}`,
            title: titleMatch.replace(/⭐ Recommended|🔥 \d+% OFF/g, '').trim(),
            slug: titleMatch.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            image: imageMatch ? imageMatch[2] : '',
            location: 'Dubai',
            category: 'Tour',
            originalPrice: originalPrice,
            currentPrice: currentPrice,
            currency: 'AED',
            discountPercentage: discountPercentage,
            isRecommended: titleMatch.includes('⭐ Recommended'),
            isNew: titleMatch.includes('🆕'),
            rating: ratingMatch ? parseFloat(ratingMatch[1]) : undefined,
            reviewCount: reviewMatch ? parseInt(reviewMatch[1]) : undefined,
            duration: duration.replace(/\|/g, '').trim(),
            url: urlMatch[0],
            highlights: []
          };
          
          tours.push(tour);
        }
      }
    });
  }
  
  // Method 2: Parse emoji-structured format (Singapore style)
  if (tours.length === 0) {
    // Look for emoji-based tour entries with --- separators
    const emojiTours = text.split(/---+/).filter(section => {
      return section.includes('⭐') || section.includes('💰') || section.includes('🔗');
    });
    
    if (emojiTours.length > 0) {
      emojiTours.forEach((section, index) => {
        // Extract title (first line with emoji)
        const titleMatch = section.match(/[🏙️🦁🌿🎡🎢🐘🗼🐪🌙🚗🕌🎪🎭🏖️🏰🎨🎯]\s*([^⭐\n]+?)(?=⭐|\n|$)/);
        
        // Extract rating and reviews
        const ratingMatch = section.match(/⭐\s*(\d+\.\d+)\s*\((\d+)\s*reviews?\)/);
        
        // Extract duration
        const durationMatch = section.match(/⏱️\s*([^💰\n]+?)(?=💰|\n|$)/);
        
        // Extract pricing
        const priceMatch = section.match(/💰\s*AED\s*([\d,]+\.?\d*)/);
        const originalPriceMatch = section.match(/~~AED\s*([\d,]+\.?\d*)~~/);
        
        // Extract URL
        const urlMatch = section.match(/🔗\s*(https?:\/\/[^\s\n]+)/);
        
        if (titleMatch && urlMatch) {
          const title = titleMatch[1].trim();
          const currentPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
          const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(/,/g, '')) : null;
          const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;
          const reviewCount = ratingMatch ? parseInt(ratingMatch[2]) : undefined;
          const duration = durationMatch ? durationMatch[1].trim() : '3 hours';
          
          // Determine location from URL or context
          let location = 'Singapore';
          if (urlMatch[1].includes('/dubai/')) location = 'Dubai';
          else if (urlMatch[1].includes('/thailand/')) location = 'Thailand';
          else if (urlMatch[1].includes('/malaysia/')) location = 'Malaysia';
          
          const tour: TourCard = {
            id: `emoji-tour-${index + 1}`,
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            image: getImageFromTitle(title), // Helper function to get images
            location: location,
            category: getCategoryFromTitle(title),
            originalPrice: originalPrice,
            currentPrice: currentPrice,
            currency: 'AED',
            discountPercentage: originalPrice && currentPrice ? 
              Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : undefined,
            rating: rating,
            reviewCount: reviewCount,
            duration: duration,
            url: urlMatch[1],
            highlights: getHighlightsFromTitle(title)
          };
          
          tours.push(tour);
        }
      });
    }
  }
  
  // Method 3: Parse bullet point format tours
  if (tours.length === 0) {
    const bulletPoints = text.match(/- [🏙️🗼🐪🌙🚗🕌].*?(?=\n- |\n\n|$)/g);
    
    if (bulletPoints && bulletPoints.length > 0) {
      bulletPoints.forEach((bullet, index) => {
        const titleMatch = bullet.match(/- [🏙️🗼🐪🌙🚗🕌]\s*([^—]+)/);
        const priceMatch = bullet.match(/AED (\d+(?:,\d+)?(?:\.\d+)?)/);
        const originalPriceMatch = bullet.match(/was AED (\d+(?:,\d+)?(?:\.\d+)?)/);
        const ratingMatch = bullet.match(/(\d+\.\d+) ⭐/);
        const reviewMatch = bullet.match(/(\d+)\+?\s*travelers?/);
        
        if (titleMatch) {
          const title = titleMatch[1].trim();
          const currentPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 99;
          const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(/,/g, '')) : null;
          
          const tour: TourCard = {
            id: `bullet-tour-${index + 1}`,
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            image: '', // Will show placeholder
            location: 'Dubai',
            category: getDynamicCategory(title),
            originalPrice: originalPrice,
            currentPrice: currentPrice,
            currency: 'AED',
            discountPercentage: originalPrice && currentPrice ? 
              Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : undefined,
            rating: ratingMatch ? parseFloat(ratingMatch[1]) : 4.5 + Math.random() * 0.4,
            reviewCount: reviewMatch ? parseInt(reviewMatch[1]) : Math.floor(Math.random() * 500) + 50,
            duration: getDynamicDuration(title),
            url: `https://www.raynatours.com/dubai/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            highlights: getDynamicHighlights(title)
          };
          
          tours.push(tour);
        }
      });
    }
  }

  if (tours.length === 0) {
    return null;
  }

  return {
    type: 'tour_carousel',
    title: 'Featured Tours',
    subtitle: `${tours.length} amazing experiences`,
    cards: tours,
    totalResults: tours.length
  };
}

// Helper functions for bullet point parsing
function getDynamicCategory(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('city')) return 'City Tours';
  if (titleLower.includes('desert') || titleLower.includes('safari') || titleLower.includes('camel')) return 'Desert Safari';
  if (titleLower.includes('burj') || titleLower.includes('khalifa')) return 'Attractions';
  if (titleLower.includes('cruise') || titleLower.includes('yacht') || titleLower.includes('water')) return 'Water Activities';
  if (titleLower.includes('shopping')) return 'Shopping Tours';
  if (titleLower.includes('emirates')) return 'Multi-City Tours';
  return 'Tours';
}

function getDynamicDuration(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('day') || titleLower.includes('emirates')) return '8 hrs';
  if (titleLower.includes('dinner') || titleLower.includes('desert')) return '6 hrs';
  if (titleLower.includes('city')) return '4 hrs';
  if (titleLower.includes('burj')) return '1.5 hrs';
  return '3 hrs';
}

function getDynamicHighlights(title: string): string[] {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('city')) return ['Hotel Pickup', 'Multiple Stops', 'Photo Opportunities'];
  if (titleLower.includes('desert')) return ['Dune Bashing', 'BBQ Dinner', 'Live Shows'];
  if (titleLower.includes('burj')) return ['Skip the Line', '124th Floor', 'City Views'];
  if (titleLower.includes('camel')) return ['Camel Ride', 'Desert Experience', 'Traditional'];
  if (titleLower.includes('shopping')) return ['Mall Visits', 'Local Markets', 'Shopping Guide'];
  if (titleLower.includes('emirates')) return ['Multi-City', 'Full Day', 'Guided Tour'];
  return ['Great Experience', 'Professional Guide', 'Memorable'];
}

// Helper function to get image URLs based on tour title
function getImageFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('night safari')) return 'https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Night-Safari-Singapore-4683/1760696168117_3_2.jpg';
  if (titleLower.includes('gardens by the bay')) return 'https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Gardens-by-the-Bay-4684/1760687052897_3_2.jpg';
  if (titleLower.includes('singapore city tour')) return 'https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Singapore-City-Tour-With-Guide-4679/1761128271016_3_2.jpg';
  if (titleLower.includes('universal studios')) return 'https://via.placeholder.com/400x240/0070f3/ffffff?text=Universal+Studios';
  if (titleLower.includes('singapore flyer')) return 'https://via.placeholder.com/400x240/00d9ff/ffffff?text=Singapore+Flyer';
  if (titleLower.includes('singapore zoo')) return 'https://via.placeholder.com/400x240/00c851/ffffff?text=Singapore+Zoo';
  if (titleLower.includes('burj khalifa')) return 'https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Burj-Khalifa-At-The-Top-Tickets-18/1759833985818_3_2.jpg';
  if (titleLower.includes('dubai city')) return 'https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Dubai-City-Tour-33/1760084181121_3_2.jpg';
  return ''; // Will show placeholder
}

// Helper function to get category based on title
function getCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('city tour')) return 'City Tours';
  if (titleLower.includes('safari') || titleLower.includes('zoo') || titleLower.includes('gardens')) return 'Nature & Wildlife';
  if (titleLower.includes('universal') || titleLower.includes('theme')) return 'Theme Parks';
  if (titleLower.includes('flyer') || titleLower.includes('wheel')) return 'Attractions';
  if (titleLower.includes('desert')) return 'Desert Safari';
  if (titleLower.includes('burj') || titleLower.includes('tower')) return 'Attractions';
  return 'Tours';
}

// Helper function to get highlights based on title
function getHighlightsFromTitle(title: string): string[] {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('night safari')) return ['Night Experience', 'Wildlife', 'Tram Ride'];
  if (titleLower.includes('gardens by the bay')) return ['Supertrees', 'Cloud Forest', 'Flower Dome'];
  if (titleLower.includes('city tour')) return ['Hotel Pickup', 'Multiple Stops', 'Guided Tour'];
  if (titleLower.includes('universal studios')) return ['Theme Park', 'Rides', 'Shows'];
  if (titleLower.includes('singapore flyer')) return ['Giant Wheel', 'City Views', '30 Minutes'];
  if (titleLower.includes('zoo')) return ['Wildlife', 'Tram Ride', 'Family Fun'];
  return ['Great Experience', 'Professional Guide', 'Memorable'];
}

// Shared helper: extract carousel from raw assistant message content and clean the text.
// Used by both sendMessage (live) and loadConversation (history restore).
export function processAssistantContent(
  rawContent: string,
  existingCarousel?: TourCarousel | null
): { content: string; tourCarousel: TourCarousel | undefined } {
  // If the backend already provided a carousel, just return as-is
  if (existingCarousel) {
    return { content: rawContent, tourCarousel: existingCarousel };
  }

  const hasRealTourData =
    rawContent.includes('<tour-carousel') ||           // backend tag format
    rawContent.includes('{{CAROUSEL:') ||              // {{CAROUSEL: {...}}} format
    rawContent.includes('"type":"tour_carousel"') ||
    rawContent.includes('"cards":[') ||
    rawContent.includes('```json') ||
    (rawContent.includes('"title"') && rawContent.includes('"image"') && rawContent.includes('"url"')) ||
    (rawContent.includes('⭐') && rawContent.includes('💰') && rawContent.includes('🔗') && rawContent.includes('---')) ||
    (rawContent.includes('|---|') &&
      (rawContent.includes('AED ') || rawContent.includes('USD ') || rawContent.includes('SGD ') || rawContent.includes('INR '))) ||
    (!!rawContent.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/) &&
      (rawContent.includes('⭐') || rawContent.includes('★')));

  if (!hasRealTourData) {
    return { content: rawContent, tourCarousel: undefined };
  }

  const tourCarousel =
    parseJsonTourData(rawContent) || parseTourDataFromText(rawContent) || undefined;

  if (!tourCarousel) {
    return { content: rawContent, tourCarousel: undefined };
  }

  let cleaned = rawContent
    .replace(/<tour-carousel[\s\S]*?<\/tour-carousel>/g, '') // remove backend tag
    .replace(/\{\{CAROUSEL:[\s\S]*?\}\}\}/g, '')             // remove {{CAROUSEL: ...}}} block
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/\{[\s\S]*?"type"\s*:\s*"tour_carousel"[\s\S]*?\}/g, '')
    .replace(/---[\s\S]*?(?=\n\n|Would you like|$)/g, '')
    .replace(/🏙️[\s\S]*?🔗\s*https?:\/\/[^\s\n]+/g, '')
    .replace(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/g, '')
    .replace(/\|---|/g, '')
    .replace(/-{3,}/g, '')
    .replace(/#{1,3}\s*[^\n]+/g, '')
    .replace(/^\*{0,2}\d+\..*$/gm, '')                       // remove numbered list items (1. or **1.)
    .replace(/^[^\n]*(?:💰|🔗|⏱️)\s*.+$/gm, '')              // remove price/link/duration emoji lines
    .replace(/^[^\n]*⭐[^\n]*\|[^\n]*$/gm, '')                // remove rating|separator lines
    .replace(/^https?:\/\/\S+\s*$/gm, '')                    // remove standalone URL lines
    .replace(/Would you like to:[\s\S]*$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s*\n\s*\n\s*/g, '\n\n')
    .trim();

  if (!cleaned || cleaned.length < 80) {
    const location = tourCarousel.cards[0]?.location || 'your destination';
    cleaned = `Here are ${tourCarousel.cards.length} amazing tours in ${location}! 🎆✨\n\nBrowse through these exciting experiences and click any card to book:`;
  }

  return { content: cleaned, tourCarousel };
}

// Create a comprehensive tour database based on common Dubai tours
export function createMockTourCarousel(title: string = "Popular Tours"): TourCarousel {
  const allTours: TourCard[] = [
    // Dubai City Tours
    {
      id: "dubai-city-tour",
      title: "Dubai City Tour",
      slug: "dubai-city-tour", 
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Dubai-City-Tour-33/1760084181121_3_2.jpg",
      location: "Dubai",
      category: "City Tours",
      originalPrice: 125,
      currentPrice: 75,
      currency: "AED",
      discountPercentage: 40,
      rating: 4.9,
      reviewCount: 732,
      duration: "4 hrs",
      url: "https://www.raynatours.com/dubai/city-tours/dubai-city-tour-e-33",
      highlights: ["Hotel Pickup", "Burj Al Arab", "Dubai Mall"]
    },
    {
      id: "burj-khalifa-top",
      title: "Burj Khalifa At The Top",
      slug: "burj-khalifa-at-the-top",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Burj-Khalifa-At-The-Top-Tickets-18/1759833985818_3_2.jpg",
      location: "Downtown Dubai",
      category: "Attractions",
      originalPrice: null,
      currentPrice: 159,
      currency: "AED",
      isRecommended: true,
      rating: 4.9,
      reviewCount: 175,
      duration: "1.5 hrs",
      url: "https://www.raynatours.com/dubai/burj-khalifa-tickets/burj-khalifa-at-the-top-tickets-e-18",
      highlights: ["Skip the Line", "124th Floor", "City Views"]
    },
    {
      id: "camel-riding",
      title: "Camel Riding",
      slug: "camel-riding",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Camel-Riding-37/1760181155414_3_2.jpg",
      location: "Dubai Desert",
      category: "Desert Experience", 
      originalPrice: null,
      currentPrice: 529.99,
      currency: "AED",
      rating: 5.0,
      reviewCount: 5,
      duration: "1 hr",
      url: "https://www.raynatours.com/dubai/camel-and-horse-riding/camel-riding-e-37",
      highlights: ["Desert Camel Ride", "Traditional Experience", "Photo Opportunities"]
    },
    {
      id: "dinner-in-desert",
      title: "Dinner In Desert",
      slug: "dinner-in-desert",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Dinner-In-Desert-39/1760005786489_3_2.jpg",
      location: "Dubai Desert",
      category: "Desert Safari",
      originalPrice: null,
      currentPrice: 802.02,
      currency: "AED",
      rating: 4.9,
      reviewCount: 35,
      duration: "6 hrs",
      url: "https://www.raynatours.com/dubai/desert-safari-tours/dinner-in-desert-e-39",
      highlights: ["Desert Safari", "BBQ Dinner", "Entertainment"]
    },
    {
      id: "six-emirates-tour",
      title: "6 Emirates In A Day Tour",
      slug: "6-emirates-in-a-day-tour",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/6-Emirates-In-A-Day-Tour-40/1760085458582_3_2.jpg",
      location: "UAE",
      category: "Multi-City Tours",
      originalPrice: null,
      currentPrice: 984.98,
      currency: "AED",
      rating: 5.0,
      reviewCount: 19,
      duration: "8 hrs",
      url: "https://www.raynatours.com/dubai/city-tours/6-emirates-in-a-day-tour-e-40",
      highlights: ["6 Emirates", "Full Day", "Guided Tour"]
    },
    {
      id: "sharjah-city-tour",
      title: "Sharjah City Tour",
      slug: "sharjah-city-tour-from-dubai",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Sharjah-City-Tour-from-Dubai-44/1760087658809_3_2.jpg",
      location: "Sharjah",
      category: "City Tours",
      originalPrice: null,
      currentPrice: 1117.02,
      currency: "AED",
      rating: 5.0,
      reviewCount: 25,
      duration: "8 hrs",
      url: "https://www.raynatours.com/dubai/city-tours/sharjah-city-tour-from-dubai-e-44",
      highlights: ["Cultural Sites", "Heritage", "Guided Tour"]
    },
    {
      id: "abu-dhabi-city-tour",
      title: "Abu Dhabi City Tour",
      slug: "abu-dhabi-city-tour",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Abu-Dhabi-City-Tour-49/1760092545059_3_2.jpg",
      location: "Abu Dhabi",
      category: "City Tours",
      originalPrice: 257,
      currentPrice: 125,
      currency: "AED",
      discountPercentage: 51,
      rating: 5.0,
      reviewCount: 222,
      duration: "8 hrs",
      url: "https://www.raynatours.com/dubai/city-tours/abu-dhabi-city-tour-e-49",
      highlights: ["Sheikh Zayed Mosque", "Louvre Museum", "Emirates Palace"]
    },
    {
      id: "deep-sea-fishing",
      title: "Deep Sea Fishing",
      slug: "deep-sea-fishing",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Deep-Sea-Fishing-47/1760343098667_3_2.jpg",
      location: "Dubai",
      category: "Water Activities",
      originalPrice: 3500,
      currentPrice: 1800,
      currency: "AED",
      discountPercentage: 49,
      rating: 5.0,
      reviewCount: 53,
      duration: "4 hrs",
      url: "https://www.raynatours.com/dubai/water-activities/deep-sea-fishing-e-47",
      highlights: ["Professional Crew", "Equipment Included", "Fishing Experience"]
    }
  ];
  
  // Add Singapore tours to the database
  const singaporeTours: TourCard[] = [
    {
      id: "singapore-city-tour",
      title: "Singapore City Tour With Guide",
      slug: "singapore-city-tour-with-guide",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Singapore-City-Tour-With-Guide-4679/1761128271016_3_2.jpg",
      location: "Singapore",
      category: "City Tours",
      originalPrice: 101.72,
      currentPrice: 58.13,
      currency: "AED",
      discountPercentage: 43,
      isRecommended: true,
      rating: 5.0,
      reviewCount: 21,
      duration: "4 Hours",
      url: "https://www.raynatours.com/singapore/city-tours/singapore-city-tour-with-guide-e-4679",
      highlights: ["Hotel Pickup", "Multiple Stops", "Guided Tour"]
    },
    {
      id: "night-safari-singapore",
      title: "Night Safari Singapore",
      slug: "night-safari-singapore",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Night-Safari-Singapore-4683/1760696168117_3_2.jpg",
      location: "Singapore",
      category: "Nature & Wildlife",
      originalPrice: 90.10,
      currentPrice: 51.14,
      currency: "AED",
      discountPercentage: 43,
      rating: 5.0,
      reviewCount: 17,
      duration: "1 Hour",
      url: "https://www.raynatours.com/singapore/nature-and-wildlife/night-safari-singapore-e-4683",
      highlights: ["Night Experience", "Wildlife", "Tram Ride"]
    },
    {
      id: "gardens-by-the-bay",
      title: "Gardens by the Bay",
      slug: "gardens-by-the-bay",
      image: "https://d31sl6cu4pqx6g.cloudfront.net/Tour-Images/Final/Gardens-by-the-Bay-4684/1760687052897_3_2.jpg",
      location: "Singapore",
      category: "Nature & Wildlife",
      originalPrice: 133.69,
      currentPrice: 94.25,
      currency: "AED",
      discountPercentage: 30,
      rating: 5.0,
      reviewCount: 15,
      duration: "3 Hours",
      url: "https://www.raynatours.com/singapore/nature-and-wildlife/gardens-by-the-bay-e-4684",
      highlights: ["Supertrees", "Cloud Forest", "Flower Dome"]
    }
  ];
  
  // Combine all tours
  const allToursExpanded = [...allTours, ...singaporeTours];
  
  // Select tours based on the title/category requested
  let selectedTours = allToursExpanded;
  
  if (title.toLowerCase().includes('singapore')) {
    selectedTours = singaporeTours;
  } else if (title.toLowerCase().includes('dubai')) {
    selectedTours = allTours;
    if (title.toLowerCase().includes('city')) {
      selectedTours = allTours.filter(tour => 
        tour.category.toLowerCase().includes('city') || 
        tour.title.toLowerCase().includes('city')
      );
    } else if (title.toLowerCase().includes('desert')) {
      selectedTours = allTours.filter(tour => 
        tour.category.toLowerCase().includes('desert') || 
        tour.title.toLowerCase().includes('desert') ||
        tour.title.toLowerCase().includes('camel')
      );
    } else if (title.toLowerCase().includes('water')) {
      selectedTours = allTours.filter(tour => 
        tour.category.toLowerCase().includes('water') ||
        tour.title.toLowerCase().includes('fishing')
      );
    } else {
      // Show a good mix of Dubai tours
      selectedTours = allTours.slice(0, 6);
    }
  } else {
    // Default: show a mix from different destinations
    selectedTours = [...allTours.slice(0, 3), ...singaporeTours.slice(0, 3)];
  }
  
  // If no specific matches, show popular tours
  if (selectedTours.length === 0) {
    selectedTours = allToursExpanded.slice(0, 6);
  }

  return {
    type: 'tour_carousel',
    title: title,
    subtitle: `${selectedTours.length} amazing experiences`,
    cards: selectedTours,
    totalResults: selectedTours.length
  };
}