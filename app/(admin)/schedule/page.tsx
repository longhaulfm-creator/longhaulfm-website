// app/(admin)/schedule/page.tsx
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'
import { fmtTime, LANG_LABELS, SOURCE_CONFIG, DAYS_FULL } from '@/lib/utils'

export const metadata: Metadata = { title: 'Schedule — Admin · Long Haul FM' }

const LANG_LABELS: Record<string, string> = {
  en: 'English', zu: 'isiZulu', xh: 'isiXhosa', af: 'Afrikaans', mixed: 'Mixed',
}

const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default async function AdminSchedulePage() {
  const supabase = await createSupabaseServer()
  const today    = new Date().getDay()

  // Fetch all slots with show info, grouped by day
  const { data: allSlots } = await supabase
    .from('schedule')
    .select('*, show:shows(*)')
    .order('day_of_week')
    .order('start_time')

  const byDay: Record<number, any[]> = {}
  for (let d = 0; d < 7; d++) byDay[d] = []
  ;(allSlots ?? []).forEach(slot => { byDay[slot.day_of_week]?.push(slot) })

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-amber">Broadcast Schedule</h1>
          <p className="font-ui text-xs text-ink-dim uppercase tracking-wider mt-1">
            All 7 days · {(allSlots ?? []).length} total slots
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Source legend */}
          {(['live','spotify','talk','auto'] as const).map(s => {
            const c = SOURCE_CONFIG[s]
            return (
              <div key={s} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c.colour }} />
                <span className="font-ui text-xs text-ink-dim uppercase tracking-wider">{c.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Day tabs */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_FULL.map((day, i) => (
          <div
            key={i}
            className={`text-center py-2 rounded font-ui text-xs uppercase tracking-wider
              ${i === today ? 'bg-amber text-asphalt font-bold' : 'bg-lane text-ink-muted'}`}
          >
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Schedule grid — show today prominently, others collapsed */}
      <div className="flex flex-col gap-4">
        {DAYS_FULL.map((dayName, dayIndex) => {
          const slots   = byDay[dayIndex] ?? []
          const isToday = dayIndex === today

          return (
            <details key={dayIndex} open={isToday} className="card group">
              <summary className="card-header cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  {isToday && (
                    <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse-slow flex-shrink-0" />
                  )}
                  <span className={`font-ui text-sm font-bold uppercase tracking-wider ${isToday ? 'text-amber' : 'text-ink-muted'}`}>
                    {dayName}
                  </span>
                  <span className="font-body text-xs text-ink-dim">
                    {slots.length} show{slots.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="font-ui text-xs text-ink-dim group-open:rotate-180 transition-transform">▾</span>
              </summary>

              <div className="divide-y divide-marking">
                {slots.length === 0 && (
                  <p className="p-4 font-body text-sm text-ink-dim">No shows scheduled</p>
                )}
                {slots.map((slot: any) => {
                  const src = SOURCE_CONFIG[slot.source as keyof typeof SOURCE_CONFIG] ?? SOURCE_CONFIG.auto
                  return (
                    <div key={slot.id} className="flex items-center gap-4 px-4 py-3 hover:bg-lane transition-colors">
                      {/* Time */}
                      <div className="w-24 flex-shrink-0">
                        <span className="font-display text-xl text-ink-muted tracking-wide">
                          {fmtTime(slot.start_time)}
                        </span>
                        <span className="font-ui text-xs text-ink-dim block">
                          → {fmtTime(slot.end_time)}
                        </span>
                      </div>

                      {/* Show */}
                      <div className="flex-1 min-w-0">
                        <p className="font-ui text-sm font-bold text-ink truncate">
                          {slot.show?.name ?? 'Unnamed Show'}
                        </p>
                        <p className="font-body text-xs text-ink-dim">
                          {LANG_LABELS[slot.show?.language ?? 'en']}
                          {slot.notes && ` · ${slot.notes}`}
                        </p>
                      </div>

                      {/* Source */}
                      <span
                        className="font-ui text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border flex-shrink-0"
                        style={{ color: src.colour, borderColor: src.colour + '40', background: src.colour + '12' }}
                      >
                        {src.icon} {src.label}
                      </span>

                      {/* Automated badge */}
                      {slot.is_automated && (
                        <span className="font-ui text-xs text-ink-dim border border-marking rounded-sm px-2 py-0.5 flex-shrink-0">
                          Auto
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>

      <p className="font-body text-xs text-ink-dim">
        Schedule changes take effect immediately. The Tauri broadcast dashboard
        reflects this schedule in real time.
      </p>
    </div>
  )
}
