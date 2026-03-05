import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // ElevenLabs Speech-to-Text might not be publicly available yet
    // Let's try ElevenLabs first, then fallback to OpenAI Whisper
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    // Try ElevenLabs first if API key is available
    if (elevenLabsApiKey) {
      try {
        console.log('Trying ElevenLabs STT...');
        
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBlob = new Blob([arrayBuffer], { type: 'audio/webm' });

        const elevenLabsFormData = new FormData();
        elevenLabsFormData.append('file', audioBlob, 'recording.webm');
        elevenLabsFormData.append('model_id', 'eleven_multilingual_v2');

        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsApiKey,
          },
          body: elevenLabsFormData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('ElevenLabs STT success:', result);
          return NextResponse.json({
            transcript: result.text || '',
            confidence: result.confidence || null,
            detected_language: result.detected_language || null,
            provider: 'elevenlabs'
          });
        } else {
          const errorData = await response.text();
          console.log('ElevenLabs STT failed, trying OpenAI Whisper...', errorData);
        }
      } catch (elevenLabsError) {
        console.log('ElevenLabs STT error, trying OpenAI Whisper...', elevenLabsError);
      }
    }

    // Fallback to OpenAI Whisper
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'Neither ElevenLabs nor OpenAI API key configured' },
        { status: 500 }
      );
    }

    console.log('Using OpenAI Whisper for STT...');
    
    // Create FormData for OpenAI Whisper
    const openaiFormData = new FormData();
    openaiFormData.append('file', audioFile);
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', 'en');
    openaiFormData.append('response_format', 'json');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: openaiFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI Whisper API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('OpenAI Whisper success:', result);
    
    return NextResponse.json({
      transcript: result.text || '',
      confidence: result.confidence || null,
      provider: 'openai-whisper'
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}