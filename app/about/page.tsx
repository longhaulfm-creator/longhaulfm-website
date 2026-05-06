import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'About — Longhaul FM',
  description: 'Technical manifest of the Longhaul FM broadcast infrastructure pilot.',
}

export default function AboutPage() {
  return (
    <div className="site-container py-12 px-6 flex flex-col gap-10">
      
      {/* Header Section */}
      <header className="border-b border-marking pb-6">
        <h1 className="font-display text-4xl tracking-tight text-amber uppercase mb-2">Manifest</h1>
        <p className="font-mono text-[10px] text-ink-dim tracking-[0.3em] uppercase">
          Longhaul FM · Infrastructure Pilot · Node: N3-Durban
        </p>
      </header>

      {/* Mission Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="font-display text-amber text-sm uppercase tracking-widest">Our Mission</h2>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <p className="font-body text-sm text-ink leading-relaxed">
            Longhaul FM is an infrastructure project designed for the SADC logistics network. During this pilot phase, we are testing audio distribution stability across the N3 corridor to ensure a seamless "brotherhood of the road."
          </p>
          <p className="font-body text-sm text-ink-dim leading-relaxed">
            Our goal is to integrate real-time road telemetry, carrier updates, and regional content to improve driver safety and connectivity between Durban, the Drakensberg, and Johannesburg hubs.
          </p>
        </div>
      </section>

      {/* Broadcast Schedule / Languages */}
      <section className="border-t border-marking pt-10">
        <h2 className="font-display text-amber text-sm uppercase tracking-widest mb-6">Pilot Broadcast Schedule</h2>
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

      {/* Contact Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-6 border-y border-marking">
        <ContactItem label="General Inquiries" value="hello@longhaulfm.co.za" href="mailto:hello@longhaulfm.co.za" />
        <ContactItem label="Studio WhatsApp" value="+27 (0) XX XXX XXXX" href="tel:+27XXXXXXXXXX" />
        <ContactItem label="Regional Hub" value="KwaZulu-Natal, RSA" />
        <ContactItem label="Digital Stream" value="longhaulfm.co.za" href="/" />
      </section>

      {/* Compliance / Footer Footnote */}
      <footer className="text-center space-y-4 opacity-60">
        <div className="border border-amber/20 bg-amber/5 p-4 mb-4">
          <p className="font-mono text-[9px] text-amber uppercase tracking-widest">
            Notice: Technical Pilot Phase
          </p>
          <p className="font-body text-[10px] text-ink-dim leading-relaxed uppercase mt-1 max-w-2xl mx-auto">
            This broadcast is a technical evaluation of the N3 corridor logistics infrastructure. 
            Music licensing applications are currently in process with SAMRO, SAMPRA, and CAPASSO. 
            The stream is intended for internal testing and signal quality assessment only.
          </p>
        </div>
        <p className="font-mono text-[8px] text-ink-dim uppercase tracking-[0.2em]">
          POPIA Compliant · Broadcast Rights & Infrastructure © {new Date().getFullYear()} Isuhamba Group
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