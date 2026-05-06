import { Suspense } from 'react'
import { NowPlaying } from '@/components/NowPlaying'
import { WebPlayer } from '@/components/WebPlayer'
import { PartnerStrip } from '@/components/PartnerStrip'
import { PilotOverlay } from '@/components/PilotOverlay' // Ensure this exists

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Legal & Technical Gate */}
      <PilotOverlay />

      {/* Top Banner - Fixed & Slim */}
      <div className="bg-amber text-black py-1 px-4 text-center sticky top-0 z-50">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          N3 Corridor Pilot Phase // Technical Stream Test: v1.0.4-Beta
        </p>
      </div>

      {/* 1. Compressed Video Hero - Focus on Brand, not empty space */}
      <div className="relative h-[35vh] md:h-[40vh] w-full overflow-hidden border-b border-marking">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
        >
          <source src="https://storage.googleapis.com/longhaul-fm-distribution/hero-loop.mp4" type="video/mp4" />
        </video>
        
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        {/* Content Overlay - Tightened Spacing */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 site-container">
          <div className="mb-4">
            <h1 className="font-display text-5xl md:text-7xl text-amber uppercase tracking-tighter leading-[0.8] mb-2">
              Live From <br/> The N3
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-white/40 tracking-[0.4em] uppercase">
                Node: DURBAN_KZN_BROADCAST
              </span>
              <div className="h-[1px] flex-1 bg-marking/50" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Functional Dashboard - No Negative Margins for better flow */}
      <section className="relative z-10 px-4 md:px-6 site-container py-8 flex flex-col gap-6">
        
        {/* Row 1: Now Playing & Controls */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black border border-marking p-1 shadow-2xl">
             <Suspense fallback={<div className="h-32 animate-pulse bg-marking/10" />}>
                <NowPlaying />
             </Suspense>
          </div>
          
          <div className="bg-black border border-marking flex flex-col justify-center">
            <WebPlayer />
          </div>
        </div>

        {/* Row 2: Partners & Languages */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Partners */}
          <div className="bg-zinc-900/30 border border-marking p-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-[9px] font-bold text-amber uppercase tracking-[0.3em]">Route Partners</h3>
              <div className="h-[1px] flex-1 bg-marking" />
            </div>
            <Suspense fallback={<div className="h-12 animate-pulse bg-marking/10" />}>
              <PartnerStrip />
            </Suspense>
          </div>

          {/* Languages - Compact Grid */}
          <div className="grid grid-cols-4 gap-2 bg-zinc-900/10 border border-marking p-2">
            {[
              { code: 'EN', label: 'English' },
              { code: 'AF', label: 'Afrikaans' },
              { code: 'ZU', label: 'isiZulu' },
              { code: 'SN', label: 'ChiShona' }
            ].map((lang) => (
              <div key={lang.code} className="flex flex-col items-center justify-center border border-marking/20 py-3 hover:border-amber transition-colors">
                <span className="font-display text-xl text-amber tracking-tighter">{lang.code}</span>
                <span className="font-mono text-[7px] text-ink-dim uppercase mt-1">{lang.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Footer Footnote */}
        <div className="flex justify-between items-center opacity-30 px-2 pt-4 border-t border-marking/50">
           <span className="font-mono text-[8px] uppercase tracking-widest">Protocol: AzuraCast/MP3_64K</span>
           <span className="font-mono text-[8px] uppercase tracking-widest">Coord: 29.8587S | 31.0218E</span>
        </div>

      </section>
    </main>
  )
}