// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'

const NAV = [
  { href: '/admin/dashboard',   icon: '⬡', label: 'Overview'    },
  { href: '/admin/schedule',    icon: '◫', label: 'Schedule'    },
  { href: '/admin/advertisers', icon: '◎', label: 'Advertisers' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-dvh bg-asphalt flex">

      {/* Sidebar */}
      <aside className="w-48 bg-road border-r border-marking flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-marking">
          <Link href="/">
            <p className="font-display text-xl tracking-wider text-amber">Long Haul FM</p>
          </Link>
          <p className="font-ui text-xs text-ink-dim tracking-widest uppercase mt-0.5">
            Admin
          </p>
        </div>

        <nav className="flex flex-col gap-1 p-2 flex-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded
                         font-ui text-sm text-ink-muted hover:text-ink hover:bg-lane
                         transition-colors uppercase tracking-wider"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-marking">
          <p className="font-body text-xs text-ink-dim">{profile?.display_name}</p>
          <Link
            href="/portal/dashboard"
            className="font-ui text-xs text-ink-dim hover:text-amber transition-colors uppercase tracking-wider"
          >
            ← Portal
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
