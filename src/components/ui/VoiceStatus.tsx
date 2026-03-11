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
    <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--text-tertiary)] px-4 py-1.5">
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${speechSupported ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        <span>Voice Input: {speechSupported ? 'Ready' : 'N/A'}</span>
      </div>

      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${
          !ttsSupported ? 'bg-gray-400' :
          !voiceEnabled ? 'bg-yellow-400' :
          isPlaying ? 'bg-blue-400 animate-pulse' :
          isTTSLoading ? 'bg-blue-400' :
          'bg-green-400'
        }`}></div>
        <span>
          Voice Output: {
            !ttsSupported ? 'N/A' :
            !voiceEnabled ? 'Off' :
            isPlaying ? 'Playing...' :
            isTTSLoading ? 'Generating...' :
            'Ready'
          }
        </span>
      </div>
    </div>
  );
}
