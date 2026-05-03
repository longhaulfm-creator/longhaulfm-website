// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-marking bg-black px-6 py-10">
      <div className="site-container flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        
        <div className="space-y-2">
          <h2 className="font-display text-xl text-amber uppercase tracking-tighter">
            Longhaul FM
          </h2>
          <p className="text-[10px] text-ink-dim uppercase tracking-[0.2em]">
            Broadcast Infrastructure for the SADC Region
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="block text-[10px] font-bold text-ink-dim uppercase tracking-widest mb-1">
            Logistics Partner
          </span>
          <p className="text-sm text-ink uppercase tracking-tight">
            Powered by the <span className="text-amber font-bold">Isuhamba Group</span>
          </p>
          <p className="text-[9px] text-marking uppercase tracking-widest mt-4">
            © {new Date().getFullYear()} Longhaul FM. All rights reserved.
          </p>
        </div>
        <p className="strong">Technical Pilot Disclaimer: Longhaul FM is currently in a "Closed Pilot" phase. This platform serves as a technical proof-of-concept for the N3 logistics corridor. Music licensing (SAMPRA/SAMRO) is currently being finalized under Application Ref: [Pending]. Audio streams are for technical evaluation purposes only.</p>
      </div>
    </footer>
  )
}