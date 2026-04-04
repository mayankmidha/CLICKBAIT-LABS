import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { topic, niche, style } = await req.json()

  const prompt =
    `You are a legendary viral video scriptwriter. Write a punchy short-form video script. ` +
    `TOPIC: ${topic}. NICHE: ${niche}. STYLE: ${style}. ` +
    `Structure: HOOK (1 line that stops the scroll), BUILD (2-3 lines of tension), ` +
    `VALUE (the key insight), PATTERN INTERRUPT (unexpected twist), CTA (call to action). ` +
    `Max 150 words. Output only the script, no labels.`

  // 1. Gemini first — key is available, fast, reliable
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: AbortSignal.timeout(15000),
        }
      )
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return NextResponse.json({ script: text })
      // Gemini returned an error — log it but fall through
      const geminiErr = data.error?.message || `HTTP ${res.status}`
      console.error('Gemini error:', geminiErr)
    } catch (e: any) {
      console.error('Gemini fetch failed:', e.message)
    }
  }

  // 2. Pollinations text API — free fallback (POST to avoid redirect issues)
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
      signal: AbortSignal.timeout(20000),
    })
    if (res.ok) {
      const text = await res.text()
      if (text?.trim()) return NextResponse.json({ script: text.trim() })
    }
  } catch (e: any) {
    console.error('Pollinations failed:', e.message)
  }

  return NextResponse.json({ script: null, error: 'All AI providers unavailable. Check Gemini quota at console.cloud.google.com' })
}
