import { NextResponse } from 'next/server';
import { getSettings, saveChatLog } from '@/lib/store';

export const runtime = 'nodejs';

function getFallbackReply(query: string, authorName: string): string {
  const q = query.toLowerCase();

  // 1. Greetings & Openers
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|what is this)\b/.test(q)) {
    return `Hello. I represent ${authorName} for AI SEO, Google Ads, Meta Ads, and performance marketing strategy. What growth channel are you looking to scale?`;
  }

  // 2. SEO, AEO, GEO, AI Search & Organic Rankings
  if (q.includes('seo') || q.includes('aeo') || q.includes('geo') || q.includes('search') || q.includes('rank') || q.includes('organic') || q.includes('chatgpt') || q.includes('perplexity')) {
    return `${authorName} implements technical AI SEO and Generative Engine Optimization (GEO) to rank brands across Google Search, ChatGPT, and Perplexity. Share your target domain or connect on WhatsApp to evaluate an organic audit.`;
  }

  // 3. Google Ads, PPC, Paid Search
  if (q.includes('google ad') || q.includes('ppc') || q.includes('search ad') || q.includes('adwords') || q.includes('cpa') || q.includes('cpc') || q.includes('ad spend')) {
    return `Google Ads campaigns are engineered with strict negative keyword trees, high-intent match types, and CPA-capped bidding to maximize qualified lead volume. What is your current monthly ad budget?`;
  }

  // 4. Meta Ads, Facebook Ads, Instagram Ads, ROAS
  if (q.includes('meta ad') || q.includes('facebook') || q.includes('instagram') || q.includes('roas') || q.includes('social ad') || q.includes('retargeting') || q.includes('funnel')) {
    return `Meta Ads campaigns use structured creative testing matrices and warm-audience retargeting funnels (case study verified at 4.2x ROAS). Are you targeting direct e-commerce sales or B2B lead acquisition?`;
  }

  // 5. General Ads
  if (q.includes('ad') || q.includes('ads') || q.includes('campaign')) {
    return `${authorName} manages intent-driven Google Search campaigns and structured Meta testing funnels designed to lower customer acquisition cost. What product or service are you promoting?`;
  }

  // 6. Pricing, Cost, Rates, Retainer
  if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('rate') || q.includes('rates') || q.includes('how much') || q.includes('quote') || q.includes('budget') || q.includes('fee') || q.includes('fees') || q.includes('retainer')) {
    return `Engagements are structured on monthly performance retainers or milestone-based contracts tailored to your scope. Connect directly with ${authorName} on WhatsApp (+8801576624428) with your target goals for an immediate estimate.`;
  }

  // 7. Hiring, Contracts, Availability, Upwork
  if (q.includes('hire') || q.includes('start') || q.includes('available') || q.includes('contract') || q.includes('work with') || q.includes('onboard') || q.includes('freelance') || q.includes('upwork')) {
    return `${authorName} accepts contracts through his Top Rated Upwork profile or direct enterprise agreements. He responds fastest on WhatsApp at +8801576624428 to confirm availability and project timelines.`;
  }

  // 8. Results, Proof, Metrics, Case Studies
  if (q.includes('result') || q.includes('case') || q.includes('proof') || q.includes('track record') || q.includes('portfolio') || q.includes('metric') || q.includes('roi')) {
    return `Verified client outcomes include +300% organic growth in AI SEO, a 34% reduction in Google Ads CPA, and 4.2x ROAS in Meta paid funnels. Check the Case Studies section or message ${authorName} for niche-specific data.`;
  }

  // 9. Audits & Strategy Reviews
  if (q.includes('audit') || q.includes('review') || q.includes('consult') || q.includes('consultation') || q.includes('call') || q.includes('meeting') || q.includes('check my site')) {
    return `${authorName} provides actionable audits covering search engine intent, ad budget waste, and conversion funnels. Share your website URL or connect on WhatsApp (+8801576624428) to schedule a strategy review.`;
  }

  // 10. WordPress, Development, Technical Speed
  if (q.includes('wordpress') || q.includes('website') || q.includes('speed') || q.includes('dev') || q.includes('core web vitals') || q.includes('landing page')) {
    return `WordPress development is provided as a technical foundation focused on sub-second loading speeds, clean schema markup, and high-converting landing page layouts. What improvements does your site need?`;
  }

  // 11. Contact, WhatsApp, Email, Phone
  if (q.includes('contact') || q.includes('whatsapp') || q.includes('talk') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('message')) {
    return `You can reach ${authorName} directly on WhatsApp at +8801576624428 or by email at muyeedsifatt@gmail.com for the fastest response.`;
  }

  // 12. LinkedIn
  if (q.includes('linkedin')) {
    return `${authorName} is active on LinkedIn at https://www.linkedin.com/in/muyeedsifat/. Feel free to connect there or message directly on WhatsApp for commercial inquiries.`;
  }

  // 13. Default
  return `${authorName} drives revenue acquisition across AI SEO, Google Ads, and Meta Ads. What growth channel or target metric are you focused on?`;
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

    let reply = '';

    if (apiKey) {
      try {
        const systemInstruction = `You are the executive AI strategist representing ${authorName}, a Senior Digital Marketer specializing in AI SEO (AEO/GEO), Google Ads, Meta Ads, and performance conversion strategy.
Verified contact links: WhatsApp +8801576624428, Upwork https://www.upwork.com/freelancers/~01ceafed69d95ddfae, LinkedIn https://www.linkedin.com/in/muyeedsifat/, Email muyeedsifatt@gmail.com.

STRICT CONSTRAINTS:
1. TONE: Mature, direct, authoritative, and strategic. Speak as a trusted growth consultant to founders and marketing directors.
2. LENGTH: Exactly 1 to 2 sentences per response. Never write long paragraphs, pleasantries, or bulleted lists.
3. INTENT FOCUS: Address the client's commercial intent immediately without conversational filler ("Sure!", "Great question!").
4. CALL TO ACTION: When the user asks about hiring, pricing, audits, or project scopes, direct them to message Muyeed on WhatsApp (+8801576624428) or Upwork.
5. ZERO EMOJIS: Absolutely never include emojis in any response.`;

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
                maxOutputTokens: 100,
                temperature: 0.3
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
      reply: 'Muyeed is available for strategy discussions. You can reach him directly on WhatsApp at +8801576624428.',
      ok: true
    });
  }
}
