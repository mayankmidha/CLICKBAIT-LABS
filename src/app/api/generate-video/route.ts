import { NextRequest, NextResponse } from 'next/server'

const VIDEO_PROMPTS: Record<string, string> = {
  Aura:  'A confident Japanese-Brazilian tech influencer in a black turtleneck looks directly into camera in a sleek blue-lit Tokyo tech lab, subtle nod, natural breathing, cinematic',
  Kira:  'An Indo-Australian finance influencer in a linen blazer speaks confidently to camera in a Sydney penthouse office, golden hour light, professional and engaging',
  Elara: 'An Indo-French luxury influencer in structured silk turns gracefully toward camera in a Parisian atelier, soft editorial lighting, poised and elegant',
  Maya:  'A Scandinavian-Indian fitness influencer in athletic wear makes eye contact with camera in a clean white gym, focused energy, motivational expression',
  Luna:  'An American-Indian gaming influencer in streetwear leans toward camera with a smirk in a RGB-lit cyberpunk gaming room, high energy, confident and playful',
}

export async function POST(req: NextRequest) {
  const { persona_name, script } = await req.json()

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'REPLICATE_API_TOKEN not set. Add it in Vercel → Settings → Environment Variables.' }, { status: 400 })
  }

  const basePrompt = VIDEO_PROMPTS[persona_name] || `AI influencer ${persona_name} speaking to camera, cinematic, professional`
  const scriptHint = script ? ` ${script.substring(0, 80)}` : ''
  const videoPrompt = basePrompt + scriptHint

  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'minimax/video-01',
      input: {
        prompt: videoPrompt,
        prompt_optimizer: true,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.detail || `Replicate error: ${res.status}` }, { status: res.status })
  }

  const prediction = await res.json()
  return NextResponse.json({ id: prediction.id, status: prediction.status })
}
