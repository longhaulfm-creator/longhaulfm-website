// app/(admin)/advertisers/page.tsx
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'
import { fmtZAR, fmtRelative } from '@/lib/utils'
import { ApproveButton } from './ApproveButton'

export const metadata: Metadata = { title: 'Advertisers — Admin · Long Haul FM' }

export const revalidate = 0

export default async function AdminAdvertisersPage() {
  const supabase = await createSupabaseServer()

  const { data: advertisers } = await supabase
    .from('advertisers')
    .select(`
      *,
      campaigns:ad_campaigns(
        id, name, status, slot_type, budget_zar, spots_played, spots_booked, created_at
      )
    `)
    .order('created_at', { ascending: false })

  const totalActive  = (advertisers ?? []).flatMap(a => a.campaigns).filter(c => c.status === 'active').length
  const totalPending = (advertisers ?? []).flatMap(a => a.campaigns).filter(c => c.status === 'pending').length

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-amber">Advertisers</h1>
          <p className="font-ui text-xs text-ink-dim uppercase tracking-wider mt-1">
            {(advertisers ?? []).length} registered · {totalActive} active campaigns · {totalPending} pending
          </p>
        </div>
      </div>

      {/* Pending approvals banner */}
      {totalPending > 0 && (
        <div className="bg-signal-yellow/8 border border-signal-yellow/30 rounded p-4">
          <p className="font-ui text-sm font-bold text-signal-yellow">
            ⚠ {totalPending} campaign{totalPending !== 1 ? 's' : ''} awaiting approval
          </p>
          <p className="font-body text-xs text-ink-muted mt-1">
            Review and approve or reject each pending campaign below.
          </p>
        </div>
      )}

      {/* Advertiser list */}
      <div className="flex flex-col gap-4">
        {(advertisers ?? []).map((adv: any) => {
          const pending = adv.campaigns.filter((c: any) => c.status === 'pending')
          const active  = adv.campaigns.filter((c: any) => c.status === 'active')

          return (
            <div key={adv.id} className="card">
              {/* Advertiser header */}
              <div className="card-header">
                <div className="flex items-center gap-3">
                  {adv.is_partner && (
                    <span className="font-ui text-xs font-bold uppercase tracking-wider text-amber border border-amber/40 bg-amber/8 px-2 py-0.5 rounded-sm">
                      Partner
                    </span>
                  )}
                  <div>
                    <span className="font-ui text-sm font-bold text-ink">{adv.company_name}</span>
                    {adv.contact_name && (
                      <span className="font-body text-xs text-ink-dim ml-2">{adv.contact_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-ui text-ink-dim">
                  <span className="text-signal-green">{active.length} active</span>
                  {pending.length > 0 && (
                    <span className="text-signal-yellow">{pending.length} pending</span>
                  )}
                </div>
              </div>

              {/* Campaigns */}
              {adv.campaigns.length > 0 && (
                <div className="divide-y divide-marking">
                  {adv.campaigns.map((c: any) => {
                    const progress = c.spots_booked > 0
                      ? Math.round((c.spots_played / c.spots_booked) * 100) : 0

                    return (
                      <div key={c.id} className="px-4 py-3 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-ui text-sm font-bold text-ink truncate">{c.name}</p>
                            <span className={`font-ui text-xs px-2 py-0.5 rounded-sm border uppercase tracking-wider flex-shrink-0
                              ${c.status === 'active'  ? 'text-signal-green  border-signal-green/30  bg-signal-green/10'  : ''}
                              ${c.status === 'pending' ? 'text-signal-yellow border-signal-yellow/30 bg-signal-yellow/10' : ''}
                              ${c.status === 'paused'  ? 'text-ink-muted border-marking bg-lane' : ''}
                              ${c.status === 'completed' ? 'text-ink-dim border-marking' : ''}
                            `}>
                              {c.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-body text-xs text-ink-dim capitalize">
                              {c.slot_type.replace(/_/g, ' ')} · Budget {fmtZAR(c.budget_zar ?? 0)}
                            </p>
                          </div>
                          {/* Progress bar */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-0.5 bg-marking rounded-full overflow-hidden">
                              <div className="h-full bg-amber" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="font-mono text-xs text-ink-dim flex-shrink-0">
                              {c.spots_played}/{c.spots_booked}
                            </span>
                          </div>
                        </div>

                        {/* Approve / pause actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          {c.status === 'pending' && (
                            <ApproveButton campaignId={c.id} />
                          )}
                          {c.status === 'active' && (
                            <ApproveButton campaignId={c.id} action="pause" />
                          )}
                          {c.status === 'paused' && (
                            <ApproveButton campaignId={c.id} action="activate" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {adv.campaigns.length === 0 && (
                <p className="px-4 py-3 font-body text-sm text-ink-dim">No campaigns yet</p>
              )}

              {/* Advertiser contact */}
              {(adv.contact_email || adv.contact_phone) && (
                <div className="px-4 py-2 border-t border-marking flex gap-4">
                  {adv.contact_email && (
                    <a href={`mailto:${adv.contact_email}`}
                       className="font-body text-xs text-ink-dim hover:text-amber transition-colors">
                      📧 {adv.contact_email}
                    </a>
                  )}
                  {adv.contact_phone && (
                    <a href={`tel:${adv.contact_phone}`}
                       className="font-body text-xs text-ink-dim hover:text-amber transition-colors">
                      📞 {adv.contact_phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
