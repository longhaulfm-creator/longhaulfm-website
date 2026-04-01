// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title:       'Long Haul FM — KwaZulu-Natal',
  description: 'Internet radio for truckers on the road in KwaZulu-Natal. Road alerts, now playing, and more.',
  keywords:    ['radio', 'truckers', 'KwaZulu-Natal', 'South Africa', 'N3', 'road alerts'],
  openGraph: {
    title:       'Long Haul FM',
    description: 'Radio built for truckers. KwaZulu-Natal.',
    type:        'website',
    locale:      'en_ZA',
  },
  manifest:  '/manifest.json',
  icons: {
    icon:  '/icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor:    '#f5a623',
  width:         'device-width',
  initialScale:  1,
  maximumScale:  1, // prevent zoom on input focus (mobile)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh flex flex-col">
          <main className="flex-1 pb-20">
            {children}
          </main>
          <Nav />
        </div>
      </body>
    </html>
  )
}