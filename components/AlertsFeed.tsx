'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { AlertTriangle, Clock, MapPin, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  created_at: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location_name: string
  is_verified: boolean
}

export function AlertsFeed({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Subscribe to real-time changes in the alerts table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts((prev) => [payload.new as Alert, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setAlerts((prev) => 
              prev.map(a => a.id === payload.new.id ? payload.new as Alert : a)
            )
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  if (alerts.length === 0) {
    return (
      <div className="border border-marking p-12 text-center bg-zinc-950/20">
        <p className="font-mono text-[10px] text-ink-dim uppercase tracking-widest">
          No active incidents reported on N3 Corridor
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={cn(
            "border-l-4 p-5 bg-zinc-900/40 border border-marking transition-all",
            alert.severity === 'critical' ? "border-l-red-600 shadow-[L-0_0_15px_rgba(220,38,38,0.1)]" :
            alert.severity === 'high' ? "border-l-amber" : "border-l-zinc-500"
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className={cn(
                "w-4 h-4",
                alert.severity === 'critical' ? "text-red-500" : "text-amber"
              )} />
              <h3 className="font-display text-xl text-white uppercase italic tracking-tight">
                {alert.title}
              </h3>
            </div>
            {alert.is_verified && (
              <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="font-mono text-[8px] text-emerald-500 uppercase font-bold">Verified</span>
              </div>
            )}
          </div>

          <p className="font-ui text-sm text-ink-muted mb-4 leading-relaxed">
            {alert.description}
          </p>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-marking/30">
            <div className="flex items-center gap-2 text-ink-dim">
              <MapPin className="w-3 h-3 text-amber" />
              <span className="font-mono text-[9px] uppercase tracking-wider">{alert.location_name}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-dim">
              <Clock className="w-3 h-3 text-amber" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}