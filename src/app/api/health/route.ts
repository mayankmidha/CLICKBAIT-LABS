import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, string> = {}

  // Pollinations text
  try {
    const res = await fetch('https://text.pollinations.ai/hello?model=openai', {
      signal: AbortSignal.timeout(6000),
    })
    checks.pollinations_text = res.ok ? '✓ OK' : `✗ HTTP ${res.status}`
  } catch (e: any) {
    checks.pollinations_text = `✗ ${e.message}`
  }

  // Pollinations image (URL-based, just confirm domain resolves)
  try {
    const res = await fetch('https://image.pollinations.ai', { signal: AbortSignal.timeout(4000) })
    checks.pollinations_image = res.ok || res.status < 500 ? '✓ OK' : `✗ HTTP ${res.status}`
  } catch (e: any) {
    checks.pollinations_image = `✗ ${e.message}`
  }

  // Env vars (presence only)
  checks.gemini_key = process.env.GEMINI_API_KEY ? '✓ SET' : '✗ MISSING'
  checks.pollinations_key = process.env.POLLINATIONS_API_KEY ? '✓ SET' : '— not required'
  checks.postgres_url = process.env.POSTGRES_URL ? '✓ SET' : '✗ MISSING'

  const allOk = Object.values(checks).every(v => v.startsWith('✓') || v.startsWith('—'))

  return NextResponse.json({
    status: allOk ? 'ALL_OK' : 'DEGRADED',
    services: checks,
    timestamp: new Date().toISOString(),
  })
}
