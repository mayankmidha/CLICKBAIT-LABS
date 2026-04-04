import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { script, persona } = await req.json()

  const prompt =
    `Create a YouTube thumbnail image generation prompt for AI influencer '${persona}'. ` +
    `Script: '${(script || '').substring(0, 200)}'. ` +
    `Output ONLY the image prompt, max 80 words, no explanation.`

  try {
    const encoded = encodeURIComponent(prompt)
    const res = await fetch(
      `https://text.pollinations.ai/${encoded}?model=openai&seed=99`,
      { signal: AbortSignal.timeout(20000) }
    )
    if (res.ok) {
      const text = await res.text()
      if (text?.trim()) return NextResponse.json({ prompt: text.trim() })
    }
  } catch {}

  return NextResponse.json({
    prompt: `Cinematic portrait of ${persona}, YouTube thumbnail style, bold typography, high contrast, viral energy`,
  })
}
