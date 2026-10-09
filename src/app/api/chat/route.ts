import { NextResponse } from 'next/server';
import { getSettings, saveChatLog } from '@/lib/store';

export const runtime = 'nodejs';

function getFallbackReply(query: string, authorName: string): string {
  const q = query.toLowerCase();

  if (q.includes('seo') || q.includes('aeo') || q.includes('geo') || q.includes('search') || q.includes('rank')) {
    return `${authorName} specializes in AI SEO, AEO, and GEO, ranking brands on Google and AI answer engines like ChatGPT and Perplexity. Would you like to review an SEO audit?`;
  }

  if (q.includes('google ad') || q.includes('meta ad') || q.includes('ppc') || q.includes('facebook') || q.includes('ads') || q.includes('campaign')) {
    return `${authorName} builds intent-driven Google Search campaigns and structured Meta Ads testing funnels to lower CPA and maximize ROAS. Would you like to discuss your ad strategy?`;
  }

  if (q.includes('wordpress') || q.includes('website') || q.includes('speed') || q.includes('dev')) {
    return `${authorName} develops fast, conversion-focused WordPress websites optimized for Core Web Vitals and organic search. Are you looking to rebuild or optimize?`;
  }

  if (q.includes('result') || q.includes('case') || q.includes('proof') || q.includes('portfolio') || q.includes('metric')) {
    return `Verified results include +300% organic growth in AI SEO, 4.2x ROAS in Meta retargeting, and a 34% reduction in Google Ads CPA. Check out the Projects page to explore case studies!`;
  }

  if (q.includes('hire') || q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('contact') || q.includes('talk') || q.includes('whatsapp')) {
    return `You can hire ${authorName} directly on Upwork, connect on LinkedIn, or message him directly on WhatsApp via the button above for the fastest reply!`;
  }

  if (q.includes('upwork') || q.includes('linkedin')) {
    return `${authorName} is available for contracts on Upwork (Top Rated profile) and networking on LinkedIn. Click the profile links at the bottom of the chat to connect!`;
  }

  return `Hi! ${authorName} helps companies scale with AI SEO, Google Ads, and Meta Ads. Feel free to ask about services, or message directly on WhatsApp to get started!`;
}

export async function POST(request: Request) {
  try {
    const { message, sessionId, history } = await request.json();
    const userMessage = String(message || '').trim();

    if (!userMessage) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const settings = await getSettings();
    const apiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey || '';
    const authorName = settings.authorName || 'Muyeed Sifat';
    const whatsappPrompt = settings.whatsappPrompt || 'Direct WhatsApp contact';

    let reply = '';

    if (apiKey) {
      try {
        const systemInstruction = `You are the official AI representative for ${authorName}, an expert Digital Marketer specializing in AI SEO, Google Ads, and Meta Ads, with WordPress development as a supporting skill.
His Upwork profile is https://www.upwork.com/freelancers/~01ceafed69d95ddfae and LinkedIn is https://www.linkedin.com/in/muyeedsifat/.
CRITICAL REQUIREMENT: Keep every answer FRIENDLY, EXTREMELY SHORT, AND TO THE POINT (maximum 1 to 3 sentences only).
Never write long bulleted lists or fluff.
If the client wants to hire, book, or discuss a project, encourage them to use the WhatsApp button or Contact page.`;

        const formattedContents = [
          ...(Array.isArray(history)
            ? history.slice(-4).map((h: { role: string; content: string }) => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
              }))
            : []),
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ];

        const model = settings.geminiModel || 'gemini-1.5-flash';
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: formattedContents,
              generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.6
              }
            })
          }
        );

        if (res.ok) {
          const geminiData = await res.json();
          const candidateText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            reply = candidateText.trim();
          }
        } else {
          console.warn('[Gemini API] Request returned non-200, using fallback response.');
        }
      } catch (geminiErr) {
        console.warn('[Gemini API] Error contacting Gemini:', geminiErr);
      }
    }

    if (!reply) {
      reply = getFallbackReply(userMessage, authorName);
    }

    // Record chat conversation into Supabase / store
    try {
      await saveChatLog({
        sessionId: String(sessionId || `anon-${Date.now()}`),
        userMessage,
        botReply: reply,
        timestamp: new Date().toISOString(),
        source: 'website_chatbot'
      });
    } catch (saveErr) {
      console.warn('[Store] Failed to save chat log:', saveErr);
    }

    return NextResponse.json({ reply, ok: true });
  } catch (error) {
    console.error('[Chat API Error]', error);
    return NextResponse.json({
      reply: "I am ready to help with digital marketing strategy! You can also reach Muyeed directly on WhatsApp.",
      ok: true
    });
  }
}
