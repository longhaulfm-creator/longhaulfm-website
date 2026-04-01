'use client'
// components/WebPlayer.tsx
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? 'https://radio.longhaulfm.co.za/listen/longhaul_fm/radio.mp3'

type PlayerState = 'idle' | 'loading' | 'playing' | 'error'

export function WebPlayer() {
  const audioRef                      = useRef<HTMLAudioElement | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState>('idle')
  const [volume, setVolume]           = useState(0.85)
  const [muted, setMuted]             = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.volume  = volume

    audio.addEventListener('waiting',  () => setPlayerState('loading'))
    audio.addEventListener('playing',  () => setPlayerState('playing'))
    audio.addEventListener('error',    () => setPlayerState('error'))
    audio.addEventListener('stalled',  () => setPlayerState('loading'))

    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playerState === 'playing' || playerState === 'loading') {
      audio.pause()
      audio.src = ''
      setPlayerState('idle')
    } else {
      // Always reload stream — radio streams aren't seekable
      audio.src = STREAM_URL
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
    <div className="site-container pb-4">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Web Player</span>
          {playerState === 'error' && (
            <span className="font-ui text-xs text-signal-red">Stream unavailable</span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Main play button */}
          <button
            onClick={toggle}
            className={cn(
              'w-full py-4 rounded font-ui text-base font-bold tracking-widest uppercase',
              'flex items-center justify-center gap-3 transition-all duration-200',
              isActive
                ? 'bg-signal-red/10 border border-signal-red/40 text-signal-red active:scale-98'
                : 'bg-amber text-asphalt hover:bg-amber-hot active:scale-98'
            )}
            aria-label={isActive ? 'Stop stream' : 'Play Long Haul FM'}
          >
            {playerState === 'loading' ? (
              <>
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Connecting…
              </>
            ) : isActive ? (
              <>■ Stop</>
            ) : (
              <>▶ Listen Live</>
            )}
          </button>

          {/* Volume control */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleMute}
              className="text-ink-muted hover:text-ink transition-colors w-6 text-center flex-shrink-0"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={e => handleVolume(Number(e.target.value))}
              className="flex-1 h-1 accent-amber cursor-pointer"
              aria-label="Volume"
            />
            <span className="font-mono text-xs text-ink-dim w-8 text-right flex-shrink-0">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Stream quality note */}
          <p className="font-body text-xs text-ink-dim text-center">
            128kbps · Mobile data friendly · Afrikaans · English · isiZulu · ChiShona
          </p>
        </div>
      </div>
    </div>
  )
}