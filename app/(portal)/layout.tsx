// app/(portal)/layout.tsx
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  // Check advertiser role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'advertiser'].includes(profile.role)) {
    redirect('/')
  }

  const navLinks = [
    { href: '/portal/dashboard',     label: 'Campaigns' },
    { href: '/portal/campaigns/new', label: 'New Campaign' },
  ]

  if (profile.role === 'admin') {
    navLinks.push({ href: '/admin/dashboard', label: 'Admin ↗' })
  }

  return (
    <div className="min-h-dvh bg-asphalt">
      {/* Portal top bar */}
      <header className="bg-road border-b border-marking px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-wider text-amber">
          Long Haul FM
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-3">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="font-ui text-xs text-ink-muted hover:text-ink uppercase tracking-wider transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="font-ui text-xs text-ink-dim">{profile.display_name}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}