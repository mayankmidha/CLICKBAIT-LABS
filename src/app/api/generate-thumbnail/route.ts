import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { script, persona } = await req.json()

  const prompt =
    `Create a YouTube thumbnail image generation prompt for AI influencer '${persona}'. ` +
    `Script: '${(script || '').substring(0, 200)}'. ` +
    `Output ONLY the image prompt, max 80 words, no explanation.`

  // Try Gemini first
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: AbortSignal.timeout(12000),
        }
      )
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return NextResponse.json({ prompt: text.trim() })
    } catch {}
  }

  // Pollinations fallback (POST)
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: 'openai', seed: 99 }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })
    if (res.ok) {
      const text = await res.text()
      if (text?.trim()) return NextResponse.json({ prompt: text.trim() })
    }
  } catch {}

  return NextResponse.json({
    prompt: `Cinematic portrait of ${persona}, YouTube thumbnail style, bold typography, high contrast, viral energy`,
  })
}
