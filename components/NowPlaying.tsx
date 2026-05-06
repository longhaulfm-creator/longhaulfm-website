'use client'

import { useEffect, useState, useMemo } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { fmtDuration, SOURCE_CONFIG, PILOT_CONFIG } from '@/lib/utils'
import Image from 'next/image'
import { Radio, Users } from 'lucide-react'

export function NowPlaying() {
  const [track, setTrack] = useState<any>(null)
  const [state, setState] = useState<any>({ is_playing: false, listener_count: 0 })
  const [elapsed, setElapsed] = useState(0)
  const [mounted, setMounted] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => { setMounted(true) }, [])

  const barSeeds = useMemo(() => 
    Array.from({ length: 32 }).map(() => ({
      duration: `${0.4 + Math.random() * 0.6}s`,
      delay: `${Math.random() * 0.5}s`
    })), [])

  // Spotify Metadata Sync
  useEffect(() => {
    const syncSpotify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('spotify-sync')
        if (data) {
          setTrack(data)
          setElapsed(data.elapsed_secs)
          setState((prev: any) => ({ ...prev, is_playing: data.is_playing }))
        }
      } catch (e) { console.warn("Spotify Sync failed") }
    }
    syncSpotify()
    const interval = setInterval(syncSpotify, 5000)
    return () => clearInterval(interval)
  }, [supabase])

  // AzuraCast Listener Sync (Active Nodes)
  useEffect(() => {
   // Inside your useEffect for listeners
const fetchListeners = async () => {
  try {
    const res = await fetch(`https://radio.longhaul-fm.co.za/api/nowplaying/1`)
    const data = await res.json()
    // AzuraCast structure: data.listeners.total
    setState((prev: any) => ({ ...prev, listener_count: data?.listeners?.total ?? 0 }))
  } catch (e) { 
    console.warn("AzuraCast sync failed") 
  }
}
    fetchListeners()
    const interval = setInterval(fetchListeners, 15000) 
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!state.is_playing || !track?.duration_secs) return
    const t = setInterval(() => {
      setElapsed(e => (e < track.duration_secs) ? e + 1 : e)
    }, 1000)
    return () => clearInterval(t)
  }, [state.is_playing, track?.duration_secs])

  const progress = track?.duration_secs ? Math.min((elapsed / track.duration_secs) * 100, 100) : 0

  return (
    <div className="bg-black text-white p-6 border border-zinc-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-4">
          <div className={`${state.is_playing ? 'bg-red-600 animate-pulse' : 'bg-zinc-800'} px-2 py-0.5 text-[10px] font-bold uppercase`}>
            {state.is_playing ? '● Signal Active' : '○ Standby'}
          </div>
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            {state?.mic_allowed ? 'Mic_Open' : 'Mic_Muted'}
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500 uppercase">
          <Users className="w-3 h-3" />
          {state.listener_count} Active_Nodes
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-40 h-40 shrink-0 border border-zinc-700 bg-zinc-900 group">
          {track?.artwork_url ? (
            <Image src={track.artwork_url} alt="Artwork" fill unoptimized className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20"><Radio size={48} /></div>
          )}
        </div>

        <div className="flex-1 w-full space-y-6">
          <div>
            <h2 className="text-4xl font-black text-amber-500 uppercase tracking-tighter leading-none truncate">
              {track?.track_title || 'Awaiting Signal'}
            </h2>
            <p className="font-mono text-sm text-zinc-400 uppercase tracking-[0.2em] mt-1">
              {track?.track_artist || 'Longhaul FM Network'}
            </p>
          </div>

          <div className="flex items-end gap-[2px] h-10 w-full overflow-hidden">
            {barSeeds.map((seed, i) => (
              <div 
                key={i} 
                className={`bg-amber-500/60 w-full min-w-[3px] max-w-[6px] ${state.is_playing && mounted ? 'animate-bar' : ''}`}
                style={{ 
                  animationDuration: mounted ? seed.duration : '0.8s',
                  animationDelay: mounted ? seed.delay : '0s',
                  height: state.is_playing && mounted ? undefined : '4px',
                  opacity: 0.3 + (i / 32) * 0.7 
                }} 
              />
            ))}
          </div>

          <div className="space-y-2">
            <div className="w-full h-[2px] bg-zinc-800">
              <div className="h-full bg-amber-500 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-zinc-500">
              <span>{fmtDuration(elapsed)}</span>
              <span>{fmtDuration(track?.duration_secs ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}