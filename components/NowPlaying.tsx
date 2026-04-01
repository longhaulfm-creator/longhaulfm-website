'use client'
// components/NowPlaying.tsx
import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { fmtDuration, SOURCE_CONFIG, cn } from '@/lib/utils'
import Image from 'next/image'

interface NowPlayingRow {
  track_title:   string | null
  track_artist:  string | null
  artwork_url:   string | null
  duration_secs: number | null
  elapsed_secs:  number
  source:        keyof typeof SOURCE_CONFIG
  started_at:    string
}

interface BroadcastStateRow {
  is_on_air:      boolean
  listener_count: number
  current_source: string
}

const BAR_COUNT = 32

export function NowPlaying() {
  const [track, setTrack]         = useState<NowPlayingRow | null>(null)
  const [state, setState]         = useState<BroadcastStateRow | null>(null)
  const [elapsed, setElapsed]     = useState(0)
  const [loading, setLoading]     = useState(true)
  const supabase = createSupabaseClient()

  // Initial fetch
  useEffect(() => {
    async function init() {
      const [{ data: np }, { data: bs }] = await Promise.all([
        supabase.from('now_playing').select('*').eq('id', 1).single(),
        supabase.from('broadcast_state')
          .select('is_on_air, listener_count, current_source').eq('id', 1).single(),
      ])
      if (np) { setTrack(np as NowPlayingRow); setElapsed(np.elapsed_secs ?? 0) }
      if (bs) setState(bs as BroadcastStateRow)
      setLoading(false)
    }
    init()
  }, [])

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('listener-player')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'now_playing', filter: 'id=eq.1' },
        ({ new: data }) => { setTrack(data as NowPlayingRow); setElapsed(data.elapsed_secs ?? 0) }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'broadcast_state', filter: 'id=eq.1' },
        ({ new: data }) => setState(data as BroadcastStateRow)
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  // Local elapsed ticker
  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(e => track?.duration_secs ? Math.min(e + 1, track.duration_secs) : e)
    }, 1000)
    return () => clearInterval(t)
  }, [track?.started_at, track?.duration_secs])

  const source   = track?.source ?? 'auto'
  const srcConf  = SOURCE_CONFIG[source] ?? SOURCE_CONFIG.auto
  const isLive   = source === 'live' || source === 'talk'
  const progress = track?.duration_secs
    ? Math.min((elapsed / track.duration_secs) * 100, 100)
    : 0

  if (loading) return <NowPlayingSkeleton />

  return (
    <div className="site-container py-6 animate-fade-in">

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-wider text-amber leading-none">
            LONG HAUL FM
          </h1>
          <p className="font-ui text-xs text-ink-dim tracking-widest uppercase mt-1">
            KwaZulu-Natal · On the Road
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {state?.is_on_air && (
            <div className="on-air">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink" />
              ON AIR
            </div>
          )}
          {state && (
            <span className="font-mono text-xs text-signal-green">
              {state.listener_count.toLocaleString()} listening
            </span>
          )}
        </div>
      </div>

      {/* Artwork */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-lane mb-5">
        {track?.artwork_url ? (
          <Image
            src={track.artwork_url}
            alt={track.track_title ?? 'Now playing'}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <span className="text-6xl opacity-20">{isLive ? '🎙' : '♫'}</span>
            {isLive && state?.is_on_air && (
              <span className="font-ui text-sm text-signal-red tracking-widest uppercase animate-pulse-slow">
                ● Live Broadcast
              </span>
            )}
          </div>
        )}

        {/* Source badge overlay */}
        <div className="absolute top-3 left-3">
          <span
            className="font-ui text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border"
            style={{
              color:            srcConf.colour,
              borderColor:      srcConf.colour + '60',
              backgroundColor:  srcConf.colour + '18',
              backdropFilter:   'blur(8px)',
            }}
          >
            {srcConf.icon} {srcConf.label}
          </span>
        </div>
      </div>

      {/* Track info */}
      <div className="mb-4">
        <h2 className="font-ui text-2xl font-bold text-ink leading-tight">
          {track?.track_title ?? (isLive ? 'Live Broadcast' : '—')}
        </h2>
        <p className="font-body text-base text-ink-muted mt-1">
          {track?.track_artist ?? ''}
        </p>
      </div>

      {/* Waveform */}
      <div className="flex items-end gap-0.5 h-10 mb-4">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const h = 18 + Math.sin(i * 0.9) * 10 + Math.sin(i * 1.8) * 5
          return (
            <div
              key={i}
              className="wave-bar flex-1"
              style={{
                height: `${h}px`,
                '--dur':   `${(0.5 + (i % 7) * 0.08).toFixed(2)}s`,
                '--delay': `${(i * 0.02).toFixed(2)}s`,
                animationPlayState: state?.is_on_air ? 'running' : 'paused',
                opacity: state?.is_on_air ? 0.7 : 0.3,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      {/* Progress */}
      {!isLive && track?.duration_secs && track.duration_secs > 0 && (
        <div className="mb-6">
          <div className="w-full h-0.5 bg-marking rounded-full">
            <div
              className="h-full bg-amber rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-ink-dim mt-1.5">
            <span>{fmtDuration(elapsed)}</span>
            <span>{fmtDuration(track.duration_secs)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function NowPlayingSkeleton() {
  return (
    <div className="site-container py-6 animate-pulse">
      <div className="h-10 bg-lane rounded w-48 mb-6" />
      <div className="w-full aspect-square bg-lane rounded-md mb-5" />
      <div className="h-7 bg-lane rounded w-3/4 mb-2" />
      <div className="h-5 bg-lane rounded w-1/2" />
    </div>
  )
}