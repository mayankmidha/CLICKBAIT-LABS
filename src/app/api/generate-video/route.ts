import { NextRequest, NextResponse } from 'next/server'

const VIDEO_PROMPTS: Record<string, string> = {
  Aura:  'A high-fidelity cinematic video of a Japanese-Brazilian WOMAN with a sharp jawline and hazel eyes. She is speaking to the camera in a tech lab. Realistic skin, natural feminine movement, 8k.',
  Kira:  'A cinematic video of a beautiful Indo-Australian WOMAN with sun-kissed skin and light brown eyes. She is wearing a linen blazer and speaking professionally in a Sydney office. High-fidelity female features, 8k.',
  Elara: 'A sophisticated video of an Indo-French WOMAN with a chic bob and almond eyes. She turns gracefully toward the camera in a Paris studio. Elegant feminine motion, silk textures, 8k.',
  Maya:  'A focused video of a Scandinavian-Indian WOMAN with an athletic build. She is making eye contact with the camera in a clean white gym. Realistic skin grain, natural breathing, 8k.',
  Luna:  'An energetic video of an American-Indian WOMAN with purple hair streaks. She leans toward the camera with a smirk in a neon gaming room. Expressive female face, high-fidelity, 8k.',
}

export async function POST(req: NextRequest) {
  const { persona_name, script, image_url } = await req.json()

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'REPLICATE_API_TOKEN missing' }, { status: 400 })
  }

  const basePrompt = VIDEO_PROMPTS[persona_name] || `A professional WOMAN ${persona_name} speaking to camera, high fidelity`
  const videoPrompt = `${basePrompt} ${script ? script.substring(0, 100) : ''}`

  // If we have an image_url, we use Image-to-Video for 100% face consistency
  const input: any = {
    prompt: videoPrompt,
    aspect_ratio: "9:16",
    duration: 5,
  }

  if (image_url) {
    input.start_image = image_url
  }

  const res = await fetch('https://api.replicate.com/v1/models/kling-ai/kling-v1-5-pro/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.detail || `Error: ${res.status}` }, { status: res.status })
  }

  const prediction = await res.json()
  return NextResponse.json({ id: prediction.id, status: prediction.status })
}
