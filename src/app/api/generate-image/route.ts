import { NextRequest, NextResponse } from 'next/server'

// High-fidelity persona portrait prompts
const PERSONA_PROMPTS: Record<string, string> = {
  Aura: 'a 26-year-old Japanese-Brazilian woman with sharp cheekbones, intelligent hazel eyes, sleek low ponytail, wearing a matte black turtleneck with subtle geometric seams. Background: minimalist Tokyo tech lab, soft blue neon ambient glow, blurred server racks',
  Kira: 'a 26-year-old Indo-Australian woman with warm brown eyes, confident expression, wearing a cream structured linen blazer. Background: Sydney waterfront penthouse office, golden hour sun through floor-to-ceiling windows',
  Elara: 'a 26-year-old Indo-French woman with sculpted features, almond eyes, wearing a structured silk blazer in ivory. Background: Parisian high-fashion atelier, soft diffused daylight, cream walls and marble surfaces',
  Maya: 'a 26-year-old Scandinavian-Indian woman with an athletic build, clear skin, wearing sleek performance wear. Background: minimal all-white gym studio, bright clean lighting, focused intense expression',
  Luna: 'a 26-year-old American-Indian woman with striking dark eyes, edgy short hair, wearing a streetwear jacket. Background: cyberpunk gaming setup, RGB LED glow in purple and teal, dark moody atmosphere',
}

export async function POST(req: NextRequest) {
  const { persona_name, seed } = await req.json()

  const personaDesc = PERSONA_PROMPTS[persona_name] || `a 26-year-old AI influencer named ${persona_name}`

  const prompt = [
    'RAW photo, photorealistic portrait,',
    personaDesc + '.',
    'Shot on Sony A7R IV 85mm f/1.4.',
    'Cinematic rim lighting, catchlights in eyes,',
    'subsurface skin scattering, visible pores, ultra-sharp detail,',
    'fashion editorial grade, professional color grading,',
    '8K resolution, social media influencer aesthetic.',
    'Perfect symmetry. No watermarks.',
  ].join(' ')

  const encoded  = encodeURIComponent(prompt)
  const seedParam = seed ? `&seed=${seed}` : ''
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1792&model=flux${seedParam}&nologo=true&enhance=true`

  return NextResponse.json({ url, mode: 'FLUX_ENHANCED' })
}
