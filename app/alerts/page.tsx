// app/alerts/page.tsx
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'
import { AlertsFeed } from '@/components/AlertsFeed'

export const metadata: Metadata = {
  title: 'Road Alerts — Long Haul FM',
  description: 'Live road alerts, incidents, and weather for truckers in KwaZulu-Natal.',
}

export const revalidate = 60 // ISR — revalidate every 60 seconds

export default async function AlertsPage() {
  const supabase = await createSupabaseServer()
  const { data: alerts } = await supabase.rpc('get_active_alerts', {
    p_province: 'KwaZulu-Natal',
  })

  return (
    <div className="site-container py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-wider text-amber">Road Alerts</h1>
        <p className="font-ui text-xs text-ink-dim tracking-widest uppercase mt-1">
          KwaZulu-Natal · Live updates
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { sev: 'critical', label: 'Critical', colour: 'text-signal-red'    },
          { sev: 'warning',  label: 'Warning',  colour: 'text-signal-yellow' },
          { sev: 'info',     label: 'Info',     colour: 'text-signal-blue'   },
        ].map(({ sev, label, colour }) => (
          <div key={sev} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full bg-current ${colour}`} />
            <span className="font-ui text-xs text-ink-muted uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Live feed — client component for realtime updates */}
      <AlertsFeed initialAlerts={(alerts ?? []) as any} />

      <p className="font-body text-xs text-ink-dim text-center mt-8">
        Alerts are updated in real time by Long Haul FM presenters.
        Call us on-air to report an incident.
      </p>
    </div>
  )
}