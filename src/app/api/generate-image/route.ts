import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, seed } = await req.json()
  const encoded = encodeURIComponent(prompt)
  const seedParam = seed ? `&seed=${seed}` : ''
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1792&model=flux${seedParam}&nologo=true`
  return NextResponse.json({ url, mode: 'POLLINATIONS_FREE' })
}
