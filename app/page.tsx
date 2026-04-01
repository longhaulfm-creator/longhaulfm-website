// app/page.tsx
// Public listener homepage — mobile first
// Server component shell, client components for realtime

import { Suspense } from 'react'
import { NowPlaying }    from '@/components/NowPlaying'
import { WebPlayer }     from '@/components/WebPlayer'
import { PartnerStrip }  from '@/components/PartnerStrip'

export default function HomePage() {
  return (
    <>
      {/* Now playing — client, realtime */}
      <NowPlaying />

      {/* Web player controls */}
      <WebPlayer />

      {/* Partner stop info — server rendered, no loading state needed */}
      <Suspense fallback={null}>
        <PartnerStrip />
      </Suspense>

      {/* Language banner */}
      <div className="site-container mb-6">
        <div className="flex items-center justify-center gap-3 py-3 border-y border-marking">
          {[
            { code: 'EN', label: 'English'   },
            { code: 'AF', label: 'Afrikaans' },
            { code: 'ZU', label: 'isiZulu'   },
            { code: 'SN', label: 'ChiShona'  },
          ].map(lang => (
            <div key={lang.code} className="text-center">
              <span className="font-display text-lg text-amber tracking-wider block">{lang.code}</span>
              <span className="font-body text-xs text-ink-dim">{lang.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}