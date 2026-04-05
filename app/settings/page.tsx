'use client'

export default function SettingsPage() {
  const handleReset = () => {
    if (confirm("This will clear all saved keys and logout. Continue?")) {
      localStorage.clear()
      window.location.href = '/'
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '40px' }}>CLICKBAIT LABS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>FACTORY FLOOR</a>
          <a href="/matrix" style={{ color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>TALENT AGENCY</a>
          <a href="/settings" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>SETTINGS</a>
        </nav>
      </div>

      <main style={{ flex: 1, padding: '60px' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '60px' }}>Settings.</h1>
        <div style={{ maxWidth: '600px', backgroundColor: '#111', padding: '40px', borderRadius: '32px', border: '1px solid #222' }}>
          <h3 style={{ marginBottom: '20px' }}>Privacy & Security</h3>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', marginBottom: '40px' }}>
            Your API keys are stored only in your browser's local storage. They are never sent to our database.
          </p>
          <button onClick={handleReset} style={{ padding: '15px 30px', backgroundColor: '#f00', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            Reset Factory Session
          </button>
        </div>
      </main>
    </div>
  )
}
