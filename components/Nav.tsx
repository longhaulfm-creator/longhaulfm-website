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
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-road border-t-2 border-amber safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {LINKS.map(link => {
          const isActive = path === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn('nav-link', isActive && 'active')}
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