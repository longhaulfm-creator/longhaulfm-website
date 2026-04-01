// app/(portal)/dashboard/page.tsx
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'
import { fmtZAR } from '@/lib/utils'
import Link from 'next/link'

export const metadata: Metadata = { title: 'My Campaigns — Long Haul FM' }

const STATUS_STYLES: Record<string, string> = {
  active:    'text-signal-green border-signal-green/30 bg-signal-green/10',
  pending:   'text-signal-yellow border-signal-yellow/30 bg-signal-yellow/10',
  paused:    'text-ink-muted  border-marking bg-lane',
  completed: 'text-ink-dim   border-marking bg-lane',
  cancelled: 'text-signal-red border-signal-red/30 bg-signal-red/10',
}

const SLOT_ICONS: Record<string, string> = {
  pre_roll: '▶', mid_roll: '⏸', sponsor_read: '🎙', road_report_sponsor: '🛣',
}

export default async function PortalDashboard() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: advertiser } = await supabase
    .from('advertisers')
    .select('id, company_name')
    .eq('profile_id', user!.id)
    .single()

  const { data: campaigns } = advertiser
    ? await supabase
        .from('ad_campaigns')
        .select('*, ad_plays(count)')
        .eq('advertiser_id', advertiser.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const active = (campaigns ?? []).filter(c => c.status === 'active').length
  const totalSpend = (campaigns ?? []).reduce((a, c) => a + (c.spend_zar ?? 0), 0)

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-3xl tracking-wider text-amber">
          {advertiser?.company_name ?? 'My Campaigns'}
        </h1>
        <p className="font-ui text-xs text-ink-dim uppercase tracking-wider mt-1">
          Advertiser Portal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4">
          <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">Active</p>
          <p className="font-display text-3xl text-signal-green mt-1">{active}</p>
        </div>
        <div className="card p-4">
          <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">Campaigns</p>
          <p className="font-display text-3xl text-amber mt-1">{campaigns?.length ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">Total Spend</p>
          <p className="font-display text-2xl text-ink mt-1">{fmtZAR(totalSpend)}</p>
        </div>
      </div>

      {/* New campaign CTA */}
      <Link href="/portal/campaigns/new" className="btn-primary w-full block text-center mb-6">
        + New Campaign
      </Link>

      {/* Campaigns list */}
      <div className="flex flex-col gap-3">
        {(campaigns ?? []).length === 0 && (
          <div className="card p-8 text-center">
            <p className="font-ui text-sm text-ink-dim uppercase tracking-wider">No campaigns yet</p>
            <p className="font-body text-xs text-ink-dim mt-2">
              Create your first campaign to start reaching KZN truckers.
            </p>
          </div>
        )}

        {(campaigns ?? []).map((c: any) => {
          const progress = c.spots_booked > 0
            ? Math.round((c.spots_played / c.spots_booked) * 100)
            : 0

          return (
            <div key={c.id} className="card p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base">{SLOT_ICONS[c.slot_type] ?? '◎'}</span>
                    <span className="font-ui text-base font-bold text-ink truncate">{c.name}</span>
                  </div>
                  <p className="font-body text-xs text-ink-dim capitalize">
                    {c.slot_type.replace('_', ' ')} · {c.languages?.join(', ')}
                  </p>
                </div>
                <span className={`font-ui text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border flex-shrink-0 ${STATUS_STYLES[c.status] ?? ''}`}>
                  {c.status}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between font-mono text-xs text-ink-dim mb-1">
                  <span>{c.spots_played} played</span>
                  <span>{c.spots_booked} booked</span>
                </div>
                <div className="w-full h-1 bg-marking rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between font-body text-xs text-ink-dim">
                <span>{c.start_date} → {c.end_date ?? 'ongoing'}</span>
                <span>Spend: {fmtZAR(c.spend_zar ?? 0)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}