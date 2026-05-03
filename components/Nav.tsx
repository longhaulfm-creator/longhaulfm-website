'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/',         icon: '▶',  label: 'Listen'  },
  { href: '/alerts',   icon: '△',  label: 'Alerts'  },
  { href: '/download', icon: '↓',  label: 'Get App' }, // Fixed path to /downloads
  { href: '/about',    icon: '◎',  label: 'About'   },
]

export function Nav() {
  const path = usePathname()

  // Hide nav in portal/admin areas
  if (path.startsWith('/portal') || path.startsWith('/admin')) return null

  return (
    <nav className="border-b border-marking bg-black px-6 py-4">
      <div className="site-container flex items-center justify-between">
        
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <svg width="60" height="60" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" fill="#1B3A52" stroke="#DAA520" strokeWidth="8"/> 
              <line x1="200" y1="120" x2="200" y2="80" stroke="#DAA520" strokeWidth="6" strokeLinecap="round"/> 
              <path d="M 160 140 Q 200 115, 240 140" stroke="#DAA520" strokeWidth="5" fill="none" strokeLinecap="round"/> 
              <path d="M 140 165 Q 200 120, 260 165" stroke="#DAA520" strokeWidth="5" fill="none" strokeLinecap="round"/> 
              <path d="M 120 190 Q 200 125, 280 190" stroke="#DAA520" strokeWidth="5" fill="none" strokeLinecap="round"/> 
              <text x="200" y="245" fontFamily="Arial Black, sans-serif" fontSize="56" fill="#DAA520" textAnchor="middle" fontWeight="900">FM</text> 
              <text x="200" y="310" fontFamily="Arial Black, sans-serif" fontSize="36" fill="#FFFFFF" textAnchor="middle" fontWeight="900" letterSpacing="2">LONG HAUL</text> 
            </svg>
          </Link>
          <div className="hidden sm:block">
            <p className="font-display text-amber text-sm uppercase tracking-tighter italic">
              For the Brotherhood of the Road
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {LINKS.map(link => {
            const isActive = path === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors',
                  isActive ? 'text-amber' : 'text-ink-dim hover:text-white'
                )}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                  {link.label}
                </span>
              </Link>
            )
          })}
          
          {/* Mobile Menu Trigger (Optional visual anchor) */}
          <button className="md:hidden text-ink-dim hover:text-amber">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  )
}