export default function Footer() {
  return (
    <footer className="mt-20 border-t border-marking bg-black px-6 py-10">
      <div className="site-container flex flex-col md:flex-row justify-between items-start gap-12">
        
        {/* Branding */}
        <div className="space-y-4 max-w-xs">
          <h2 className="font-display text-3xl text-amber uppercase tracking-tighter leading-none italic">
            Longhaul FM
          </h2>
          <p className="text-[10px] text-ink-dim uppercase tracking-[0.2em] leading-relaxed">
            Broadcast Infrastructure for the <br /> SADC Region // N3 Corridor
          </p>
        </div>

        {/* Disclaimer - Center Column */}
        <div className="flex-1 max-w-2xl border-l border-marking/30 pl-8">
          <span className="block text-[10px] font-bold text-amber uppercase tracking-widest mb-3">
            Technical Pilot Disclaimer:
          </span>
          <p className="font-mono text-[9px] text-ink-dim uppercase leading-loose tracking-wider">
            Longhaul FM is currently in a "Closed Pilot" phase. This platform serves as a technical 
            proof-of-concept for the N3 logistics corridor. Music licensing (SAMPRA/SAMRO) is 
            currently being finalized under Application Ref: [Pending]. Audio streams are for 
            technical evaluation purposes only.
          </p>
        </div>

        {/* Partners & Copyright */}
        <div className="text-left md:text-right space-y-4">
          <div>
            <span className="block text-[10px] font-bold text-ink-dim uppercase tracking-widest mb-1">
              Logistics Partner
            </span>
            <p className="text-sm text-white uppercase tracking-tight">
              Powered by the <span className="text-amber font-bold italic">Isuhamba Group</span>
            </p>
          </div>
          <p className="text-[9px] text-marking uppercase tracking-widest">
            © {new Date().getFullYear()} Longhaul FM. System Version 1.0.4-Alpha
          </p>
        </div>
        
      </div>
    </footer>
  )
}