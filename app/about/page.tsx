// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Longhaul FM',
  description: 'About Longhaul FM, the broadcast infrastructure built for the brotherhood of the road.',
}

export default function AboutPage() {
  return (
    <div className="site-container py-12 px-6 flex flex-col gap-10">
      
      {/* Header Section */}
      <header className="border-b border-marking pb-6">
        <h1 className="font-display text-4xl tracking-tight text-amber uppercase mb-2">Manifest</h1>
        <p className="font-mono text-[10px] text-ink-dim tracking-[0.3em] uppercase">
          Longhaul FM · Registered Broadcast · Est. 2025
        </p>
      </header>

      {/* Mission Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="font-display text-amber text-sm uppercase tracking-widest">Our Mission</h2>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <p className="font-body text-sm text-ink leading-relaxed">
            Longhaul FM is built by truckers, for truckers. We broadcast across the SADC network—specifically the N3 corridor—because the road belongs to everyone on it.
          </p>
          <p className="font-body text-sm text-ink-dim leading-relaxed">
            We deliver live road alerts, carrier news, and the music that keeps the wheels turning—whether you're heading into Durban, climbing the Drakensberg, or parked up in Estcourt.
          </p>
        </div>
      </section>

      {/* Broadcast Schedule / Languages */}
      <section className="border-t border-marking pt-10">
        <h2 className="font-display text-amber text-sm uppercase tracking-widest mb-6">Broadcast Schedule</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { flag: '🇿🇦', lang: 'English',   time: '07:00 – 10:00 & 13:00 – 22:00' },
            { flag: '🇿🇦', lang: 'Afrikaans', time: '10:00 – 13:00'                 },
            { flag: '🇿🇦', lang: 'isiZulu',   time: '04:00 – 07:00 & 15:00 – 16:00' },
            { flag: '🇿🇼', lang: 'ChiShona',  time: '16:00 – 19:00'                 },
          ].map(({ flag, lang, time }) => (
            <div key={lang} className="bg-zinc-900 border border-marking p-4 hover:border-amber transition-colors">
              <span className="text-2xl block mb-3">{flag}</span>
              <p className="font-display text-lg text-ink uppercase leading-none">{lang}</p>
              <p className="font-mono text-[9px] text-amber mt-2 tracking-tighter uppercase">{time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commercial Section */}
      <section className="bg-amber text-black p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md">
          <h2 className="font-display text-2xl uppercase tracking-tighter mb-2">Advertise With Us</h2>
          <p className="text-xs font-bold uppercase leading-tight">
            Reach drivers actively on the KZN routes with precision-targeted live reads and road report sponsorships.
          </p>
        </div>
        <a
          href="/portal"
          className="bg-black text-white px-8 py-4 font-display uppercase tracking-widest text-sm hover:bg-zinc-800 transition-colors"
        >
          Partner Portal →
        </a>
      </section>

      {/* Contact Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-6 border-y border-marking">
        <ContactItem label="General Inquiries" value="hello@longhaulfm.co.za" href="mailto:hello@longhaulfm.co.za" />
        <ContactItem label="Studio WhatsApp" value="+27 (0) XX XXX XXXX" href="tel:+27XXXXXXXXXX" />
        <ContactItem label="Regional Hub" value="KwaZulu-Natal, RSA" />
        <ContactItem label="Digital Stream" value="longhaulfm.co.za" href="/" />
      </section>

      {/* Compliance / Footer Footnote */}
      <footer className="text-center space-y-2 opacity-50">
        <p className="font-mono text-[9px] text-ink-dim uppercase tracking-widest">
          Licensed under SAMRO, SAMPRA and CAPASSO · POPIA Compliant
        </p>
        <p className="font-mono text-[9px] text-ink-dim uppercase tracking-widest">
          Broadcast Rights © {new Date().getFullYear()} · Infrastructure by Isuhamba Group
        </p>
      </footer>
    </div>
  )
}

function ContactItem({
  label, value, href,
}: {
  label: string; value: string; href?: string
}) {
  const content = (
    <div className="group">
      <p className="font-mono text-[9px] text-amber uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display text-sm text-ink uppercase group-hover:text-amber transition-colors">{value}</p>
    </div>
  )

  return href ? <a href={href}>{content}</a> : <div>{content}</div>
}