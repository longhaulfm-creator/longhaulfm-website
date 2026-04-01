// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, parseISO } from 'date-fns'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const fmtDuration = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export const fmtRelative = (iso: string) =>
  formatDistanceToNow(parseISO(iso), { addSuffix: true })

export const fmtTime = (t: string) => t.slice(0, 5)

export const fmtZAR = (n: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n)

export const ALERT_ICONS: Record<string, string> = {
  incident: '⚠', roadworks: 'ℹ', weather: '🌧',
  weighbridge: '⚖', fuel: '⛽', closure: '🚫',
}

export const SOURCE_CONFIG = {
  spotify: { label: 'Spotify',   icon: '♫', colour: '#1db954' },
  live:    { label: 'Live',      icon: '●', colour: '#ff4d4d' },
  talk:    { label: 'Talk',      icon: '🎙', colour: '#4da6ff' },
  news:    { label: 'News',      icon: '📰', colour: '#ffd166' },
  promo:   { label: 'Promo',     icon: '📢', colour: '#f5a623' },
  auto:    { label: 'Auto DJ',   icon: '⚙',  colour: '#7a8094' },
} as const

export const GITHUB_RELEASE_BASE =
  'https://github.com/YOUR_ORG/longhaul-fm-tauri/releases/latest/download'

export const APK_URL = `${GITHUB_RELEASE_BASE}/LongHaulFM_android.apk`