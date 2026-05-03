import { Suspense } from 'react'
import { NowPlaying } from '@/components/NowPlaying'
import { WebPlayer } from '@/components/WebPlayer'
import { PartnerStrip } from '@/components/PartnerStrip'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black pb-20">
      <div className="bg-amber text-black py-1 px-4 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
    N3 Corridor Pilot Phase // Technical Stream Test: v1.0.4-Beta
        </p>
      </div>
      {/* 1. The Video Hero Layer - Immersive Industrial Backdrop */}
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden border-b border-marking">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale"
        >
          <source src="https://storage.googleapis.com/longhaul-fm-distribution/hero-loop.mp4" type="video/mp4" />
        </video>
        
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 site-container pb-16">
          <div className="space-y-2">
            <h1 className="font-display text-6xl md:text-8xl text-amber uppercase tracking-tighter leading-[0.85]">
              Live From <br/> The N3
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">
                Broadcast Node: DURBAN_KZN
              </span>
              <div className="h-[1px] flex-1 bg-marking" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Interaction Layer - Functional Dashboard */}
      <section className="relative z-10 -mt-12 px-6 site-container flex flex-col gap-8">
        
        {/* Now Playing - Floating Industrial Card */}
        <div className="bg-black border border-marking p-1 shadow-[0_20px_50px_rgba(0,0,0,1)]">
          <NowPlaying />
        </div>

        {/* Updated Web Player */}
        <WebPlayer />

        {/* Route Partners - Simplified Strip */}
        <div className="bg-zinc-900/30 border border-marking p-6">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[9px] font-bold text-amber uppercase tracking-[0.3em] whitespace-nowrap">Route Partners</h3>
            <div className="h-[1px] w-full bg-marking" />
          </div>
          <Suspense fallback={<div className="h-12 animate-pulse bg-marking/10" />}>
            <PartnerStrip />
          </Suspense>
        </div>

        {/* Language Grid - Regional Coverage Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-marking">
          {[
            { code: 'EN', label: 'English' },
            { code: 'AF', label: 'Afrikaans' },
            { code: 'ZU', label: 'isiZulu' },
            { code: 'SN', label: 'ChiShona' }
          ].map((lang) => (
            <div key={lang.code} className="flex flex-col items-center justify-center border border-marking/30 py-4 group hover:border-amber transition-colors">
              <span className="font-display text-3xl text-amber tracking-tighter group-hover:scale-110 transition-transform">{lang.code}</span>
              <span className="font-mono text-[8px] text-ink-dim uppercase tracking-widest mt-1">{lang.label}</span>
            </div>
          ))}
        </div>

        {/* Technical Footer Footnote */}
        <div className="flex justify-between items-center opacity-30 px-2">
           <span className="font-mono text-[8px] uppercase tracking-widest">Protocol: AzuraCast/MP3</span>
           <span className="font-mono text-[8px] uppercase tracking-widest">Lat: -29.8587 | Lon: 31.0218</span>
        </div>

      </section>
    </main>
  )
}