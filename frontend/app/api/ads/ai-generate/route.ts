import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { product, target, tone } = await req.json();
    
    // AI-powered ad variations
    const tones: Record<string, { title: string; desc: string; colors: string[] }> = {
      professional: {
        title: product + ' — Professional Solution',
        desc: 'Trusted by thousands. Get ' + product + ' today and transform your workflow.',
        colors: ['#1e40af', '#3b82f6', '#ffffff'],
      },
      urgent: {
        title: '⚡ Limited Offer: ' + product,
        desc: 'Don\'t miss out! Grab ' + product + ' now before it\'s too late.',
        colors: ['#dc2626', '#ef4444', '#ffffff'],
      },
      friendly: {
        title: 'Hey! Check out ' + product + ' 👋',
        desc: 'We made ' + product + ' just for you. Simple, fast, and loved by everyone.',
        colors: ['#059669', '#10b981', '#ffffff'],
      },
      luxury: {
        title: product + ' — Premium Experience',
        desc: 'Experience excellence with ' + product + '. The choice of professionals.',
        colors: ['#1e1e1e', '#d4af37', '#ffffff'],
      },
    };

    const result = tones[tone] || tones.professional;
    
    return NextResponse.json({
      success: true,
      variations: [
        { title: result.title, description: result.desc, bgColor: result.colors[0], accentColor: result.colors[1], textColor: result.colors[2] },
        { title: 'Try ' + product + ' Free', description: 'No credit card required. Start using ' + product + ' in seconds.', bgColor: '#7c3aed', accentColor: '#8b5cf6', textColor: '#ffffff' },
        { title: product + ' — #1 Choice', description: 'Trusted by thousands of happy users. ' + product + ' makes it easy.', bgColor: '#0f172a', accentColor: '#f59e0b', textColor: '#ffffff' },
      ]
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
