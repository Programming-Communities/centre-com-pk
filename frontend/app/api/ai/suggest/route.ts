import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider, apiKey } = body;
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

    // If user provided API key, use their provider
    if (apiKey && provider) {
      let text = '';
      if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
        });
        const data = await res.json();
        text = data.choices?.[0]?.message?.content || '';
      } else if (provider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        const data = await res.json();
        text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
      return NextResponse.json({ success: true, text });
    }

    // Fallback: return template suggestion
    return NextResponse.json({ success: true, text: `Professional summary generated based on your input.\n\n${prompt.substring(0, 200)}...` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
