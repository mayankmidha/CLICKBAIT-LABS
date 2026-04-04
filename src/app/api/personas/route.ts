import { NextResponse } from 'next/server'

const PERSONAS = [
  { id: 1, name: 'Aura',  niche: 'AI & Tech', prompt: 'Japanese-Brazilian tech minimalist, black turtleneck, lab background',     seed: 555555,  youtube_id: null, insta_id: null },
  { id: 2, name: 'Kira',  niche: 'Finance',   prompt: 'Indo-Australian wealth strategist, Sydney coastal office, professional linen', seed: 7721094, youtube_id: null, insta_id: null },
  { id: 3, name: 'Elara', niche: 'Luxury',    prompt: 'Indo-French fashion visionary, Paris studio, silk and structured style',      seed: 338812,  youtube_id: null, insta_id: null },
  { id: 4, name: 'Maya',  niche: 'Fitness',   prompt: 'Scandinavian-Indian biohacker, minimalist gym, focused and athletic',        seed: 992211,  youtube_id: null, insta_id: null },
  { id: 5, name: 'Luna',  niche: 'Gaming',    prompt: 'American-Indian pro-gamer, neon cyberpunk setup, high-energy',              seed: 445566,  youtube_id: null, insta_id: null },
]

export async function GET() {
  return NextResponse.json(PERSONAS)
}

export async function POST() {
  return NextResponse.json({ status: 'success' })
}
