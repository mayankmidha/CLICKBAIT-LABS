'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'FACTORY FLOOR', href: '/' },
  { name: 'TALENT AGENCY', href: '/matrix' },
  { name: 'ASSET LIBRARY', href: '/library' },
  { name: 'SETTINGS', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div style={{ width: '250px', height: '100vh', backgroundColor: '#000', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ marginBottom: '40px', fontWeight: 'bold', fontSize: '18px', letterSpacing: '-1px' }}>
        CLICKBAIT LABS
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              style={{ 
                padding: '12px 20px', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontSize: '12px', 
                fontWeight: 'bold',
                backgroundColor: isActive ? '#111' : 'transparent',
                color: isActive ? '#fff' : '#666'
              }}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
