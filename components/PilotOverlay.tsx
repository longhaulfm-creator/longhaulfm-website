'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Radio, ShieldCheck } from 'lucide-react';

export function PilotOverlay() {
  const [isOpen, setIsOpen] = useState(true);

  // Lock scroll when overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="max-w-md w-full border-2 border-amber bg-zinc-900 p-1 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
        <div className="border border-amber/30 p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-marking pb-4">
            <div className="bg-amber p-2">
              <Lock className="text-black w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-amber uppercase tracking-tighter">
                Pilot Authorization
              </h2>
              <p className="font-mono text-[9px] text-ink-dim uppercase tracking-widest">
                Protocol: Technical_Evaluation_v1.0
              </p>
            </div>
          </div>

          {/* Warning Content */}
          <div className="space-y-4 font-body text-xs text-ink/80 leading-relaxed uppercase">
            <div className="flex gap-3">
              <Radio className="w-4 h-4 text-amber shrink-0" />
              <p>
                This stream is a technical infrastructure pilot for the N3 logistics corridor. 
                Audio quality and uptime are currently under evaluation.
              </p>
            </div>
            
            <div className="flex gap-3">
              <ShieldCheck className="w-4 h-4 text-amber shrink-0" />
              <p>
                By proceeding, you acknowledge that this is a non-commercial broadcast test 
                and that music licensing applications are currently in process.
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-amber hover:bg-white text-black font-display text-lg py-4 uppercase transition-colors tracking-widest"
            >
              Enter Infrastructure
            </button>
            <p className="text-[8px] font-mono text-center text-ink-dim mt-4 uppercase tracking-[0.2em]">
              Authorized by Isuhamba Group
            </p>
          </div>

        </div>
      </div>
      
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
    </div>
  );
}