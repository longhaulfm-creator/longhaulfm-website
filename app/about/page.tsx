// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Long Haul FM',
  description: 'About Long Haul FM, the internet radio station built for truckers in KwaZulu-Natal.',
}

export default function AboutPage() {
  return (
    <div className="site-container py-6">
      <h1 className="font-display text-4xl tracking-wider text-amber mb-1">About Us</h1>
      <p className="font-ui text-xs text-ink-dim tracking-widest uppercase mb-8">
        Long Haul FM · Est. 2025
      </p>

      {/* Mission */}
      <div className="card mb-4">
        <div className="card-header">
          <span className="card-title">Our Mission</span>
        </div>
        <div className="p-4">
          <p className="font-body text-sm text-ink-muted leading-relaxed">
            Long Haul FM is built by truckers, for truckers. We broadcast across KwaZulu-Natal
            in English, Afrikaans, isiZulu and ChiShona — because the N3 belongs to everyone
            on it.
          </p>
          <p className="font-body text-sm text-ink-muted leading-relaxed mt-3">
            We deliver live road alerts, dedications, regulatory news, and music that keeps
            you moving — whether you're heading into Durban, climbing the Drakensberg, or
            parked up in Estcourt.
          </p>
        </div>
      </div>

      {/* Languages */}
      <div className="card mb-4">
        <div className="card-header">
          <span className="card-title">Languages</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {[
            { flag: '🇿🇦', lang: 'English',   time: '07:00 – 10:00 & 13:00 – 22:00' },
            { flag: '🇿🇦', lang: 'Afrikaans', time: '10:00 – 13:00'                 },
            { flag: '🇿🇦', lang: 'isiZulu',   time: '04:00 – 07:00 & 15:00 – 16:00' },
            { flag: '🇿🇼', lang: 'ChiShona',  time: '16:00 – 19:00'                 },
          ].map(({ flag, lang, time }) => (
            <div key={lang} className="bg-lane rounded p-3">
              <p className="text-xl mb-1">{flag}</p>
              <p className="font-ui text-sm font-bold text-ink">{lang}</p>
              <p className="font-body text-xs text-ink-dim mt-0.5">{time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advertise */}
      <div className="card mb-4">
        <div className="card-header">
          <span className="card-title">Advertise With Us</span>
        </div>
        <div className="p-4">
          <p className="font-body text-sm text-ink-muted leading-relaxed mb-4">
            Reach truckers actively driving KZN routes. We offer pre-roll spots,
            mid-roll breaks, road report sponsorships, and live reads in your
            language of choice.
          </p>
          <a
            href="/portal"
            className="btn-primary w-full text-center block"
          >
            Advertiser Portal →
          </a>
        </div>
      </div>

      {/* Contact */}
      <div className="card mb-6">
        <div className="card-header">
          <span className="card-title">Contact</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <ContactItem icon="📧" label="Email"   value="hello@longhaulfm.co.za"  href="mailto:hello@longhaulfm.co.za" />
          <ContactItem icon="📞" label="Studio"  value="+27 (0) XX XXX XXXX"     href="tel:+27XXXXXXXXXX" />
          <ContactItem icon="📍" label="Region"  value="KwaZulu-Natal, South Africa" />
          <ContactItem icon="📻" label="Stream"  value="longhaulfm.co.za"        href="/" />
        </div>
      </div>

      {/* Legal */}
      <p className="font-body text-xs text-ink-dim text-center leading-relaxed">
        Long Haul FM is licensed under SAMRO, SAMPRA and CAPASSO.
        POPIA compliant. All broadcast rights reserved © {new Date().getFullYear()}.
      </p>
    </div>
  )
}

function ContactItem({
  icon, label, value, href,
}: {
  icon: string; label: string; value: string; href?: string
}) {
  const inner = (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xl w-7 flex-shrink-0 text-center">{icon}</span>
      <div>
        <p className="font-ui text-xs text-ink-dim uppercase tracking-wider">{label}</p>
        <p className="font-body text-sm text-ink">{value}</p>
      </div>
    </div>
  )

  return href ? (
    <a href={href} className="hover:text-amber transition-colors">{inner}</a>
  ) : (
    <div>{inner}</div>
  )
}