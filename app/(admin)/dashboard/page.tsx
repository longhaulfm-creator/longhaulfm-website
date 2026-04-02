// app/(admin)/dashboard/page.tsx
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'
import { fmtZAR, fmtRelative, SOURCE_CONFIG } from '@/lib/utils'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Admin — Long Haul FM' }

export const revalidate = 30

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer()

  const [
    { data: broadcastState },
    { data: nowPlaying     },
    { data: activeCampaigns },
    { data: recentAlerts   },
    { data: pendingCampaigns },
    { count: advertiserCount },
  ] = await Promise.all([
    supabase.from('broadcast_state').select('*').eq('id', 1).single(),
    supabase.from('now_playing').select('*').eq('id', 1).single(),
    supabase.from('ad_campaigns').select('count').eq('status', 'active').single(),
    supabase.from('road_alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
    supabase.from('ad_campaigns').select('*, advertiser:advertisers(company_name)').eq('status', 'pending').order('created_at'),
    supabase.from('advertisers').select('*', { count: 'exact', head: true }),
  ])

  const src = SOURCE_CONFIG[(broadcastState?.current_source as keyof typeof SOURCE_CONFIG) ?? 'auto']

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      <div>
        <h1 className="font-display text-3xl tracking-wider text-amber">Admin Overview</h1>
        <p className="font-ui text-xs text-ink-dim uppercase tracking-wider mt-1">
          Long Haul FM · Station Control
        </p>
      </div>

      {/* Live status row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Broadcast"
          value={broadcastState?.is_on_air ? 'ON AIR' : 'OFF AIR'}
          colour={broadcastState?.is_on_air ? '#39d98a' : '#ff4d4d'}
        />
        <StatCard
          label="Source"
          value={src.label}
          colour={src.colour}
        />
        <StatCard
          label="Listeners"
          value={(broadcastState?.listener_count ?? 0).toLocaleString()}
          colour="#f5a623"
        />
        <StatCard
          label="Advertisers"
          value={String(advertiserCount ?? 0)}
        />
      </div>

      {/* Now playing */}
      {nowPlaying && (
        <div className="card p-4 flex items-center gap-4">
          {nowPlaying.artwork_url && (
            <img
              src={nowPlaying.artwork_url}
              alt=""
              className="w-14 h-14 rounded object-cover flex-shrink-0 bg-lane"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-ui text-xs text-ink-dim uppercase tracking-wider mb-0.5">Now Playing</p>
            <p className="font-ui text-base font-bold text-ink truncate">
              {nowPlaying.track_title ?? 'Live Broadcast'}
            </p>
            <p className="font-body text-sm text-ink-muted truncate">{nowPlaying.track_artist}</p>
          </div>
          <span
            className="font-ui text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border flex-shrink-0"
            style={{ color: src.colour, borderColor: src.colour + '40', background: src.colour + '12' }}
          >
            {src.icon} {src.label}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">

        {/* Pending campaigns */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending Approval</span>
            <span className="font-ui text-xs text-signal-yellow font-bold">
              {(pendingCampaigns ?? []).length} pending
            </span>
          </div>
          <div className="divide-y divide-marking">
            {(pendingCampaigns ?? []).length === 0 && (
              <p className="p-4 font-body text-sm text-ink-dim">No pending campaigns</p>
            )}
            {(pendingCampaigns ?? []).map((c: any) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-ui text-sm font-bold text-ink truncate">{c.name}</p>
                  <p className="font-body text-xs text-ink-dim">
                    {c.advertiser?.company_name} · {fmtZAR(c.budget_zar ?? 0)}
                  </p>
                </div>
                <Link href={`/admin/advertisers`} className="btn-ghost btn-sm flex-shrink-0">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Road Alerts</span>
            <Link href="/admin/schedule" className="font-ui text-xs text-amber hover:underline">
              Schedule →
            </Link>
          </div>
          <div className="divide-y divide-marking">
            {(recentAlerts ?? []).length === 0 && (
              <p className="p-4 font-body text-sm text-ink-dim">No active alerts</p>
            )}
            {(recentAlerts ?? []).map((a: any) => (
              <div key={a.id} className="p-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display text-base text-amber">{a.route}</span>
                  <span className={`font-ui text-xs uppercase tracking-wider
                    ${a.severity === 'critical' ? 'text-signal-red' : a.severity === 'warning' ? 'text-signal-yellow' : 'text-signal-blue'}`}>
                    {a.severity}
                  </span>
                </div>
                <p className="font-body text-xs text-ink-muted truncate">{a.detail}</p>
                <p className="font-body text-xs text-ink-dim mt-0.5">{fmtRelative(a.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/admin/schedule"    className="btn-ghost justify-center">◫ Schedule</Link>
        <Link href="/admin/advertisers" className="btn-ghost justify-center">◎ Advertisers</Link>
        <Link href="/"                  className="btn-ghost justify-center">▶ Live Site</Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, colour }: { label: string; value: string; colour?: string }) {
  return (
    <div className="card p-4">
      <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">{label}</p>
      <p className="font-display text-2xl mt-1 leading-none" style={{ color: colour ?? '#e8eaf0' }}>
        {value}
      </p>
    </div>
  )
}
