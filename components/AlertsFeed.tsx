'use client'
// components/AlertsFeed.tsx
import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { ALERT_ICONS, fmtRelative, cn } from '@/lib/utils'

interface Alert {
  id:         string
  route:      string
  detail:     string
  category:   string
  severity:   'info' | 'warning' | 'critical'
  created_at: string
}

const SEV_CLASSES = {
  critical: 'border-signal-red/30 bg-signal-red/5',
  warning:  'border-signal-yellow/30 bg-signal-yellow/5',
  info:     'border-marking',
}

const SEV_TEXT = {
  critical: 'text-signal-red',
  warning:  'text-signal-yellow',
  info:     'text-signal-blue',
}

export function AlertsFeed({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const supabase = createSupabaseClient()

  // Live updates
  useEffect(() => {
    const channel = supabase
      .channel('alerts-feed')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'road_alerts' },
        ({ new: a }) => setAlerts(prev => [a as Alert, ...prev])
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'road_alerts' },
        ({ new: a }) => {
          if (!(a as Alert & { is_active: boolean }).is_active) {
            setAlerts(prev => prev.filter(x => x.id !== a.id))
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-ink-dim">
        <span className="text-4xl opacity-30">✓</span>
        <p className="font-ui text-sm uppercase tracking-wider">No active alerts</p>
        <p className="font-body text-xs text-center max-w-xs">
          Roads are clear. We'll update you the moment anything changes.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={cn('card border', SEV_CLASSES[alert.severity])}
        >
          <div className="p-4 flex gap-3">
            <span className={cn('text-xl flex-shrink-0 mt-0.5', SEV_TEXT[alert.severity])}>
              {ALERT_ICONS[alert.category] ?? '⚠'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-display text-xl tracking-wide text-amber">
                  {alert.route}
                </span>
                <span className={cn(
                  'font-ui text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border',
                  alert.severity === 'critical' && 'border-signal-red/40 text-signal-red bg-signal-red/10',
                  alert.severity === 'warning'  && 'border-signal-yellow/40 text-signal-yellow bg-signal-yellow/10',
                  alert.severity === 'info'     && 'border-signal-blue/40 text-signal-blue bg-signal-blue/10',
                )}>
                  {alert.severity}
                </span>
              </div>
              <p className="font-body text-sm text-ink leading-relaxed">{alert.detail}</p>
              <p className="font-body text-xs text-ink-dim mt-2">{fmtRelative(alert.created_at)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}