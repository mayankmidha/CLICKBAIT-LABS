import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = process.env.REPLICATE_API_TOKEN

  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })

  const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  if (!res.ok) return NextResponse.json({ error: `Replicate ${res.status}` }, { status: res.status })

  const data = await res.json()
  const url = Array.isArray(data.output) ? data.output[0] : data.output

  return NextResponse.json({
    status: data.status,          // starting | processing | succeeded | failed
    url: url || null,
    error: data.error || null,
    progress: data.metrics?.predict_time ? `${Math.round(data.metrics.predict_time)}s` : null,
  })
}
