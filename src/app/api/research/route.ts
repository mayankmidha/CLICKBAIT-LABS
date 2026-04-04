import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { topic } = await req.json()
  return NextResponse.json({
    content: `Research synthesized for: ${topic}`,
    logs: [`[SYS] Research completed for ${topic}`],
  })
}
