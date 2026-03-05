"use client";

interface VoiceStatusProps {
  voiceEnabled: boolean;
  isPlaying: boolean;
  isTTSLoading: boolean;
  ttsSupported: boolean;
  speechSupported: boolean;
}

export default function VoiceStatus({
  voiceEnabled,
  isPlaying,
  isTTSLoading,
  ttsSupported,
  speechSupported
}: VoiceStatusProps) {
  if (!ttsSupported && !speechSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      {/* Voice Input Status */}
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${speechSupported ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        <span>Voice Input: {speechSupported ? 'Ready' : 'Not Available'}</span>
      </div>

      {/* Voice Output Status */}
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${
          !ttsSupported ? 'bg-gray-400' : 
          !voiceEnabled ? 'bg-yellow-400' :
          isPlaying ? 'bg-blue-400 animate-pulse' :
          isTTSLoading ? 'bg-blue-400' : 
          'bg-green-400'
        }`}></div>
        <span>
          Voice Output: {
            !ttsSupported ? 'Not Available' :
            !voiceEnabled ? 'Disabled' :
            isPlaying ? 'Playing...' :
            isTTSLoading ? 'Generating...' :
            'Ready'
          }
        </span>
      </div>

      {/* Powered by ElevenLabs */}
      {/* {ttsSupported && (
        <div className="ml-auto text-xs opacity-60">
          🎵 Powered by ElevenLabs
        </div>
      )} */}
    </div>
  );
}