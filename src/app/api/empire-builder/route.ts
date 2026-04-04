import { NextResponse } from 'next/server'

const PERSONAS = [
  { name: 'Aura',  niche: 'AI & Tech', seed: 555555,  dna: 'Japanese-Brazilian tech minimalist, black turtleneck, lab background' },
  { name: 'Kira',  niche: 'Finance',   seed: 7721094, dna: 'Indo-Australian wealth strategist, Sydney coastal office, professional linen' },
  { name: 'Elara', niche: 'Luxury',    seed: 338812,  dna: 'Indo-French fashion visionary, Paris studio, silk and structured style' },
  { name: 'Maya',  niche: 'Fitness',   seed: 992211,  dna: 'Scandinavian-Indian biohacker, minimalist gym, focused and athletic' },
  { name: 'Luna',  niche: 'Gaming',    seed: 445566,  dna: 'American-Indian pro-gamer, neon cyberpunk setup, high-energy' },
]

export async function GET() {
  return NextResponse.json({ status: 'SUCCESS', entities: PERSONAS })
}
