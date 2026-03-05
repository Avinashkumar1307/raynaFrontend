import { NextRequest, NextResponse } from 'next/server';
import { cleanTextForTTS, isTextSafeForTTS } from '@/utils/textCleaner';

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id = 'EXAVITQu4vr4xnSDxMaL' } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Clean and validate the text for ElevenLabs
    const cleanText = cleanTextForTTS(text);

    console.log('Original text length:', text.length);
    console.log('Cleaned text length:', cleanText.length);
    console.log('Cleaned text sample:', cleanText.substring(0, 100));
    
    if (!isTextSafeForTTS(cleanText)) {
      return NextResponse.json(
        { error: 'Text not suitable for TTS after cleaning' },
        { status: 400 }
      );
    }

    // Check if ElevenLabs API key is configured
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsApiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Call ElevenLabs Text-to-Speech API directly
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs TTS API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate speech with ElevenLabs' },
        { status: response.status }
      );
    }

    // Get audio buffer from response
    const audioBuffer = await response.arrayBuffer();

    // Return audio as response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('ElevenLabs text-to-speech error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}