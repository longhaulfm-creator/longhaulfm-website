import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'
import { AlertsFeed } from '@/components/AlertsFeed'

export const metadata: Metadata = {
  title: 'Road Alerts — Long Haul FM',
  description: 'Live road alerts, incidents, and weather for truckers in KwaZulu-Natal.',
}

export const revalidate = 30 

export default async function AlertsPage() {
  const supabase = await createSupabaseServer()
  
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('is_active', true)
    .eq('is_verified', true)
    .eq('province', 'KwaZulu-Natal')
    .order('created_at', { ascending: false })

  return (
    <div className="site-container py-6">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-wider text-amber">Road Alerts</h1>
        <p className="font-ui text-xs text-ink-dim tracking-widest uppercase mt-1">
          N3 Corridor · Live Updates
        </p>
      </div>

      <AlertsFeed initialAlerts={(alerts ?? []) as any} />
    </div>
  )
}