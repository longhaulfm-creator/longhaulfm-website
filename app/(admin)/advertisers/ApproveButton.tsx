'use client'
// app/(admin)/advertisers/ApproveButton.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  campaignId: string
  action?: 'approve' | 'pause' | 'activate'
}

const ACTION_CONFIG = {
  approve:  { label: 'Approve', next: 'active',  style: 'bg-signal-green text-asphalt hover:bg-signal-green/80' },
  pause:    { label: 'Pause',   next: 'paused',  style: 'border border-marking text-ink-muted hover:border-stripe' },
  activate: { label: 'Resume',  next: 'active',  style: 'border border-signal-green/40 text-signal-green hover:bg-signal-green/10' },
}

export function ApproveButton({ campaignId, action = 'approve' }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const config = ACTION_CONFIG[action]

  const handle = async () => {
    setLoading(true)
    try {
      await fetch(`/api/ads/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: config.next }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={`font-ui text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded
                  transition-all disabled:opacity-40 ${config.style}`}
    >
      {loading ? '…' : config.label}
    </button>
  )
}
