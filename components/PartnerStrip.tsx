// components/PartnerStrip.tsx
// Server component — fetches partner location data
import { createSupabaseServer } from '@/lib/supabase/server'
import { fmtZAR, fmtRelative } from '@/lib/utils'

export async function PartnerStrip() {
  const supabase = await createSupabaseServer()
  const { data: locations } = await supabase
    .from('partner_locations')
    .select('*')
    .order('name')

  if (!locations || locations.length === 0) return null

  const loc = locations[0] // First partner location (truck wash)

  return (
    <div className="site-container mb-2">
      <div className="bg-amber/8 border border-amber/20 rounded-md p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="font-ui text-xs font-bold tracking-widest uppercase text-amber">
              Partner Stop
            </p>
            <h3 className="font-ui text-lg font-bold text-ink mt-0.5">{loc.name}</h3>
            {loc.route && (
              <p className="font-body text-xs text-ink-dim">{loc.route}</p>
            )}
          </div>
          <div className="flex gap-2 text-xl flex-shrink-0">
            {(loc.services ?? []).map((s: string) => (
              <span key={s} title={s}>
                {{ truck_wash: '🚿', convenience: '🏪', parking: '🅿', fuel: '⛽', restaurant: '🍽', workshop: '🔧' }[s] ?? '●'}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {loc.bays_available !== null && (
            <div className="bg-road rounded p-2.5">
              <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">Bays Open</p>
              <p className="font-display text-2xl text-signal-green">{loc.bays_available}</p>
            </div>
          )}
          {loc.fuel_price_zar !== null && (
            <div className="bg-road rounded p-2.5">
              <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">Diesel</p>
              <p className="font-display text-2xl text-amber">{fmtZAR(loc.fuel_price_zar)}/L</p>
            </div>
          )}
        </div>

        {loc.todays_special && (
          <div className="mt-3 bg-road rounded p-3 border border-marking">
            <p className="font-ui text-xs text-amber uppercase tracking-wider mb-1">Today's Special</p>
            <p className="font-body text-sm text-ink">{loc.todays_special}</p>
          </div>
        )}

        <p className="font-body text-xs text-ink-dim mt-2 text-right">
          Updated {fmtRelative(loc.updated_at)}
        </p>
      </div>
    </div>
  )
}