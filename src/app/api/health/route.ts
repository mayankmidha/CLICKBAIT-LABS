import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, string> = {}

  // Gemini — test with a real request
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'say ok' }] }] }),
          signal: AbortSignal.timeout(8000),
        }
      )
      const data = await res.json()
      if (data.candidates?.[0]?.content) {
        checks.gemini = '✓ Working'
      } else if (data.error) {
        checks.gemini = `✗ ${data.error.message}`
      } else {
        checks.gemini = `✗ HTTP ${res.status}`
      }
    } catch (e: any) {
      checks.gemini = `✗ ${e.message}`
    }
  } else {
    checks.gemini = '✗ Key missing'
  }

  // Pollinations text — POST (avoids 301 redirect)
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'say hi' }], model: 'openai' }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })
    checks.pollinations_text = res.ok ? '✓ OK' : `✗ HTTP ${res.status}`
  } catch (e: any) {
    checks.pollinations_text = `✗ ${e.message}`
  }

  // Pollinations image
  try {
    const res = await fetch('https://image.pollinations.ai', {
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    })
    checks.pollinations_image = res.status < 500 ? '✓ OK' : `✗ HTTP ${res.status}`
  } catch (e: any) {
    checks.pollinations_image = `✗ ${e.message}`
  }

  // Env vars
  checks.postgres_url = process.env.POSTGRES_URL ? '✓ SET' : '✗ MISSING'
  checks.pollinations_key = process.env.POLLINATIONS_API_KEY ? '✓ SET' : '— optional'

  const allOk = Object.values(checks).every(v => v.startsWith('✓') || v.startsWith('—'))

  return NextResponse.json({
    status: allOk ? 'ALL_OK' : 'DEGRADED',
    services: checks,
    timestamp: new Date().toISOString(),
  })
}
