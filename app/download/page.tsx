// app/downloads/page.tsx
import { ArrowDownTrayIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

export default function DownloadsPage() {
  const downloadLinks = [
    {
      platform: 'Android',
      version: '1.0.0',
      description: 'Optimized for tablets and mobile. Includes Spotify integration and realtime updates.',
      url: 'https://storage.googleapis.com/longhaul-fm-distribution/longhaulfm-final.apk',
      icon: <DevicePhoneMobileIcon className="w-8 h-8 text-amber" />,
      tag: 'Recommended for Drivers',
    },
    {
      platform: 'Windows',
      version: '1.0.0',
      description: 'Desktop companion for home or office. Supports background playback and system notifications.',
      url: 'https://storage.googleapis.com/longhaul-fm-distribution/longhaulfm-app_1.0.0_x64-setup.exe',
      icon: <ComputerDesktopIcon className="w-8 h-8 text-amber" />,
      tag: 'Best for Dispatch',
    }
  ]

  return (
    <section className="px-6 py-12 site-container">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl text-amber uppercase tracking-tighter mb-4">
          Take the Road with You
        </h1>
        <p className="text-ink-dim max-w-md mx-auto">
          Download the official Longhaul FM app for high-fidelity streaming and realtime updates during our Pilot Launch from the route.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {downloadLinks.map((dl) => (
          <div 
            key={dl.platform} 
            className="bg-zinc-900 border border-marking p-6 flex flex-col justify-between hover:border-amber transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                {dl.icon}
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber/10 text-amber px-2 py-1 rounded">
                  {dl.tag}
                </span>
              </div>
              <h2 className="text-2xl font-display text-ink mb-1">{dl.platform}</h2>
              <p className="text-xs text-ink-dim mb-4 tracking-widest uppercase">Version {dl.version}</p>
              <p className="text-sm text-ink-dim leading-relaxed mb-8">
                {dl.description}
              </p>
            </div>

            <a 
              href={dl.url} 
              className="flex items-center justify-center gap-3 bg-amber text-black font-bold py-4 px-6 uppercase tracking-wider hover:bg-white transition-colors"
              download
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download {dl.platform}
            </a>
          </div>
        ))}
      </div>

      {/* Sideloading Instructions */}
      <div className="mt-12 p-6 border-t border-marking">
        <h3 className="text-amber font-display text-lg mb-4 uppercase tracking-wider">Installation Note</h3>
        <p className="text-xs text-ink-dim leading-relaxed">
          For Android: Since this is a direct download, you may need to enable <strong className="text-ink">"Install Unknown Apps"</strong> in your browser or file manager settings. Once downloaded, open the APK to begin installation.
        </p>
      </div>
    </section>
  )
}