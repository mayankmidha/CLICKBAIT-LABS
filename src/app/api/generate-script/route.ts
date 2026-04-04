import { NextRequest, NextResponse } from 'next/server'

// Quality fallback scripts per niche — always works even if AI is down
const FALLBACKS: Record<string, string> = {
  'AI & Tech': `The AI tool that replaced 10 employees just went FREE.

Here's what billion-dollar companies are using before everyone else finds out...

OpenAI just dropped something that changes everything. Your competitors are already inside.

But here's what they're NOT telling you — the free version does 90% of what the $20/month plan does.

The window closes in 72 hours. Link in bio. Don't sleep on this.`,

  'Finance': `I went from $0 to $50,000 saved in 18 months on a $60k salary.

Banks spend millions making sure you never learn this one rule.

The wealthy don't save money — they redirect it. Three accounts, one strategy, automated.

While you're paying 24% credit card interest, they're earning 5% on the same cash.

Comment "SYSTEM" and I'll send you the exact setup. Free. No catch.`,

  'Luxury': `This $12 product is identical to the $400 version. I compared them.

The luxury industry's dirtiest secret — 80% of what you're paying for is the logo.

I spent 6 months testing dupes against the originals. The results destroyed me.

Your style doesn't have to cost a fortune. It has to look like it does.

Save this. Your wardrobe is about to change.`,

  'Fitness': `I gained 8kg of muscle in 90 days without touching a gym.

The fitness industry lied to you about what actually builds your body.

Protein timing, progressive overload, sleep quality — three variables. That's it.

Every supplement ad you've ever seen? Designed to distract you from the free stuff that works.

Follow for the protocol. Posted tomorrow.`,

  'Gaming': `This setting makes your aim 40% better instantly. No one talks about it.

Top 0.1% players have been hiding this since Season 1.

It's not your hardware. It's not your sens. It's one configuration buried in your settings.

I tested it across 200 matches. The difference is not subtle.

Drop a 🎯 and I'll send the exact settings in your DMs.`,
}

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
]

export async function POST(req: NextRequest) {
  const { topic, niche, style } = await req.json()

  const prompt =
    `You are a viral short-form video scriptwriter. Write a punchy script. ` +
    `TOPIC: ${topic}. NICHE: ${niche}. STYLE: ${style}. ` +
    `Structure: HOOK → BUILD → VALUE BOMB → PATTERN INTERRUPT → CTA. ` +
    `Max 120 words. Output only the script.`

  const geminiKey = process.env.GEMINI_API_KEY

  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            signal: AbortSignal.timeout(12000),
          }
        )
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return NextResponse.json({ script: text.trim(), source: model })
      } catch {
        // try next model
      }
    }
  }

  // Pollinations POST fallback
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'openai',
        seed: 42,
      }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })
    if (res.ok) {
      const text = await res.text()
      if (text?.trim()) return NextResponse.json({ script: text.trim(), source: 'pollinations' })
    }
  } catch {}

  // Always return something useful
  const fallback = FALLBACKS[niche] || FALLBACKS['AI & Tech']
  return NextResponse.json({ script: fallback, source: 'template' })
}
