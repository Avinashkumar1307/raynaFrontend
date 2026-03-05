// Utility function to clean text for TTS
export function cleanTextForTTS(text: string): string {
  if (!text) return '';
  
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Code
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    
    // Clean up line breaks
    .replace(/\n\s*\n/g, '. ') // Double line breaks
    .replace(/\n/g, ' ') // Single line breaks
    
    // Remove ALL Unicode emojis and symbols
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Regional indicators
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Extended symbols
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation selectors
    .replace(/[\u{200D}]/gu, '') // Zero width joiner
    .replace(/[\u{20E3}]/gu, '') // Combining enclosing keycap
    
    // Remove specific problematic characters
    .replace(/[⭐⚡🎆✨🔗💰🎵🔊📍🏙️🎯🌟💫🎊🎉🤔]/g, '')
    
    // Keep only safe characters (ASCII + common Latin extensions)
    .replace(/[^\x00-\x7F\u00A0-\u017F\u0100-\u024F\s.,!?;:()\[\]"'-]/g, '')
    
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Test function to check if text is safe for TTS
export function isTextSafeForTTS(text: string): boolean {
  const cleaned = cleanTextForTTS(text);
  return cleaned.length > 0 && cleaned.length <= 2500;
}