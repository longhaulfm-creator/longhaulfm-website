'use client'
// components/Nav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/',         icon: '▶',  label: 'Listen'  },
  { href: '/alerts',   icon: '△',  label: 'Alerts'  },
  { href: '/download', icon: '↓',  label: 'Get App' },
  { href: '/about',    icon: '◎',  label: 'About'   },
]

export function Nav() {
  const path = usePathname()

  // Hide nav in portal/admin areas
  if (path.startsWith('/portal') || path.startsWith('/admin')) return null

  return (
    <nav className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <div className="flex flex-row gap-2 items-center">
    <Link href="/">
      <svg width="94" height="94" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="180" fill="#1B3A52" stroke="#DAA520" stroke-width="8"/> <line x1="200" y1="120" x2="200" y2="80" stroke="#DAA520" stroke-width="6" stroke-linecap="round"/> <path d="M 160 140 Q 200 115, 240 140" stroke="#DAA520" stroke-width="5" fill="none" stroke-linecap="round"/> <path d="M 140 165 Q 200 120, 260 165" stroke="#DAA520" stroke-width="5" fill="none" stroke-linecap="round"/> <path d="M 120 190 Q 200 125, 280 190" stroke="#DAA520" stroke-width="5" fill="none" stroke-linecap="round"/>  <text x="200" y="245" font-family="Arial Black, sans-serif" font-size="56" fill="#DAA520" text-anchor="middle" font-weight="900">FM</text>  <text x="200" y="310" font-family="Arial Black, sans-serif" font-size="36" fill="#FFFFFF" text-anchor="middle" font-weight="900" letter-spacing="2">LONG HAUL</text> </svg>
      </Link>
      <p className="font-body text-lg uppercase font-300">For the Brotherhood of the Road</p>
      </div>
  </div>
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>

    </button>
        {LINKS.map(link => {
          const isActive = path === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn('nav-link flex flex-col gap-2 hidden', isActive && 'active')}
            >
              <span className="text-xl leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}