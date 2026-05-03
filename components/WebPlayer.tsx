'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Updated Stream URL
const STREAM_URL = 'https://radio.longhaul-fm.co.za/radio/8000/radio.mp3'

type PlayerState = 'idle' | 'loading' | 'playing' | 'error'

export function WebPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState>('idle')
  const [volume, setVolume] = useState(0.85)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.volume = volume
    audio.crossOrigin = 'anonymous' // Required for some stream headers

    audio.addEventListener('waiting', () => setPlayerState('loading'))
    audio.addEventListener('playing', () => setPlayerState('playing'))
    audio.addEventListener('error', () => setPlayerState('error'))
    audio.addEventListener('stalled', () => setPlayerState('loading'))
    audio.addEventListener('loadstart', () => setPlayerState('loading'))

    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playerState === 'playing' || playerState === 'loading') {
      audio.pause()
      // Clearing the src stops the network request immediately
      audio.src = ''
      audio.load() 
      setPlayerState('idle')
    } else {
      // Append timestamp to URL to bypass any aggressive browser caching
      audio.src = `${STREAM_URL}?cache_bust=${Date.now()}`
      setPlayerState('loading')
      audio.play().catch(() => setPlayerState('error'))
    }
  }

  const handleVolume = (v: number) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
    if (v > 0) setMuted(false)
  }

  const handleMute = () => {
    const next = !muted
    setMuted(next)
    if (audioRef.current) audioRef.current.muted = next
  }

  const isActive = playerState === 'playing' || playerState === 'loading'

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border border-marking bg-black p-6 space-y-6 shadow-[0_0_50px_rgba(218,165,32,0.1)]">
        
        {/* Status Header */}
        <div className="flex items-center justify-between border-b border-marking pb-4">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-dim leading-none mb-1">
              Live Stream
            </span>
            <span className="font-mono text-[10px] text-amber uppercase">
              radio.longhaul-fm.co.za
            </span>
          </div>
          
          {playerState === 'error' && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest">Signal Fault</span>
            </div>
          )}
          {isActive && (
            <div className="flex items-center gap-3">
               <div className="flex gap-1 items-end h-3">
                <div className="w-1 bg-amber animate-[bounce_1s_infinite] h-full" />
                <div className="w-1 bg-amber animate-[bounce_1.2s_infinite] h-2/3" />
                <div className="w-1 bg-amber animate-[bounce_0.8s_infinite] h-1/2" />
              </div>
              <span className="font-mono text-[10px] text-amber uppercase tracking-widest">Receiving</span>
            </div>
          )}
        </div>

        {/* Play Control */}
        <button
          onClick={toggle}
          className={cn(
            'relative w-full py-8 font-display text-2xl uppercase tracking-[0.2em] transition-all duration-300',
            isActive
              ? 'bg-zinc-900 text-white border border-white/10'
              : 'bg-amber text-black hover:bg-white active:translate-y-0.5'
          )}
        >
          <div className="flex items-center justify-center gap-4">
            {playerState === 'loading' ? (
              <span className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
            ) : isActive ? (
              <div className="w-5 h-5 bg-current" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
            <span>{isActive ? 'Disconnect' : 'Connect to Station'}</span>
          </div>
        </button>

        {/* Volume & Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={handleMute} className="text-ink-dim hover:text-amber transition-colors">
              {muted || volume === 0 ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
              )}
            </button>
            <input
              type="range" min={0} max={1} step={0.01}
              value={muted ? 0 : volume}
              onChange={e => handleVolume(Number(e.target.value))}
              className="flex-1 h-1 accent-amber bg-zinc-800 appearance-none cursor-pointer"
            />
            <span className="font-mono text-[10px] text-ink-dim w-8 text-right uppercase">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-marking pt-4">
             <div className="flex flex-col">
                <span className="font-mono text-[8px] text-ink-dim uppercase tracking-widest">Quality</span>
                <span className="font-display text-xs text-ink uppercase">128kbps MP3</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="font-mono text-[8px] text-ink-dim uppercase tracking-widest">Usage</span>
                <span className="font-display text-xs text-ink uppercase">~1MB / Min</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}