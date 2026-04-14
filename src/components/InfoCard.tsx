import React from 'react';
import { motion } from 'motion/react';
import { X, Info, Globe, Moon as MoonIcon, ChevronRight } from 'lucide-react';
import { PlanetData, MoonData } from '../data';
import { cn } from '../lib/utils';

interface InfoCardProps {
  planet: PlanetData | null;
  moon: MoonData | null;
  onClose: () => void;
}

export default function InfoCard({ planet, moon, onClose }: InfoCardProps) {
  const data = moon || planet;
  if (!data) return null;

  const isMoon = !!moon;

  return (
    <motion.div
      initial={{ y: 400, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-4 sm:bottom-24 left-4 sm:left-auto right-4 sm:right-6 top-auto sm:top-24 w-auto sm:w-80 h-[40vh] sm:h-auto bg-black/75 sm:bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl z-50"
    >
      {/* Header Image/Color */}
      <div 
        className="h-14 sm:h-32 w-full relative overflow-hidden shrink-0"
        style={{ backgroundColor: `${data.color}22` }}
      >
        <div 
          className="absolute inset-0 opacity-30 blur-2xl"
          style={{ backgroundColor: data.color }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-6 h-6 sm:w-16 sm:h-16 rounded-full shadow-2xl animate-pulse"
            style={{ 
              backgroundColor: data.color,
              boxShadow: `0 0 25px ${data.color}88`
            }}
          />
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2.5 right-3 p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors border border-white/10 z-50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 mb-1">
          {isMoon ? (
            <MoonIcon className="w-2.5 h-2.5 text-white/40" />
          ) : (
            <Globe className="w-2.5 h-2.5 text-white/40" />
          )}
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold">
            {isMoon ? "Satellite" : "Planète"}
          </span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-3 sm:mb-4 uppercase">
          {data.name}
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <section>
            <h3 className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mb-1.5 flex items-center gap-2">
              <Info className="w-2.5 h-2.5" />
              Description
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-3">
              {data.description}
            </p>
            
            {!isMoon && (data as PlanetData).facts && (
              <ul className="space-y-1">
                {(data as PlanetData).facts.slice(0, 4).map((fact, i) => (
                  <li key={i} className="text-[10px] sm:text-[11px] text-white/50 flex items-start gap-2 leading-tight">
                    <span className="mt-1 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
              <span className="block text-[8px] uppercase tracking-widest text-white/30 mb-0.5">Taille</span>
              <span className="text-base sm:text-lg font-mono">{(data.radius * 2).toFixed(1)}</span>
            </div>
            {!isMoon && (
              <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
                <span className="block text-[8px] uppercase tracking-widest text-white/30 mb-0.5">Lunes</span>
                <span className="text-base sm:text-lg font-mono">{(data as PlanetData).totalMoons}</span>
              </div>
            )}
          </section>

          {!isMoon && (data as PlanetData).moons.length > 0 && (
            <section>
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">
                Lunes Principales
              </h3>
              <div className="space-y-2">
                {(data as PlanetData).moons.map((m) => (
                  <div 
                    key={m.name}
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors cursor-default group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-xs font-medium">{m.name}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-top border-white/10 bg-white/5">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">Data Source: NASA</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-blue-500/50" />
            <div className="w-1 h-1 rounded-full bg-blue-500/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
