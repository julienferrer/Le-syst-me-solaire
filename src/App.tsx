/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { OrbitControls, Stars, PerspectiveCamera, Float, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ZoomIn, ZoomOut, Play, Pause, ChevronRight, ChevronLeft, Globe, Moon as MoonIcon, Menu, X } from 'lucide-react';
import { SOLAR_SYSTEM, PlanetData, MoonData } from './data';
import { cn } from './lib/utils';

// Components
import Sun from './components/Sun';
import Planet from './components/Planet';
import InfoCard from './components/InfoCard';
import ErrorBoundary from './components/ErrorBoundary';

function CameraHandler({ selectedPlanet }: { selectedPlanet: PlanetData | null }) {
  const controlsRef = useRef<any>(null);

  useFrame((state) => {
    if (selectedPlanet && controlsRef.current) {
      // Find the planet group in the scene
      const planetGroup = state.scene.getObjectByName(`planet-${selectedPlanet.name}`);
      if (planetGroup) {
        const worldPos = new Vector3();
        planetGroup.getWorldPosition(worldPos);
        
        // Smoothly interpolate target
        controlsRef.current.target.lerp(worldPos, 0.1);
        controlsRef.current.update();
      }
    } else if (controlsRef.current) {
      // Reset target to Sun
      controlsRef.current.target.lerp(new Vector3(0, 0, 0), 0.05);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      maxDistance={1000}
      minDistance={1}
      makeDefault
    />
  );
}

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [selectedMoon, setSelectedMoon] = useState<MoonData | null>(null);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [viewMode, setViewMode] = useState<'system' | 'planet'>('system');
  const [showInstructions, setShowInstructions] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
    setSelectedMoon(null);
    setViewMode('planet');
  }, []);

  const handleBackToSystem = useCallback(() => {
    setSelectedPlanet(null);
    setSelectedMoon(null);
    setViewMode('system');
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#020205] overflow-hidden font-sans text-white selection:bg-blue-500/30">
      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 60, 120]} fov={45} />
        <CameraHandler selectedPlanet={selectedPlanet} />
        
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={2.5} color="#fff5e6" castShadow />
          
          <Sun />
          
          {SOLAR_SYSTEM.map((planet) => (
              <ErrorBoundary 
                key={planet.name}
                fallback={
                  <Planet 
                    data={{...planet, textureUrl: undefined}} 
                    timeSpeed={isPaused ? 0 : timeSpeed}
                    onClick={() => handlePlanetClick(planet)}
                    isSelected={selectedPlanet?.name === planet.name}
                    onMoonClick={(moon) => setSelectedMoon(moon)}
                    selectedMoon={selectedMoon}
                  />
                }
              >
                <Planet 
                  data={planet}
                  timeSpeed={isPaused ? 0 : timeSpeed}
                  onClick={() => handlePlanetClick(planet)}
                  isSelected={selectedPlanet?.name === planet.name}
                  onMoonClick={(moon) => setSelectedMoon(moon)}
                  selectedMoon={selectedMoon}
                />
              </ErrorBoundary>
            ))}
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            key="instructions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center gap-4 w-[90%] max-w-md"
          >
            <div className="px-6 py-4 sm:px-8 sm:py-6 bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl text-center shadow-2xl">
              <p className="text-base sm:text-lg font-light tracking-[0.3em] uppercase mb-4 text-blue-400">Explorez le Cosmos</p>
              <div className="grid grid-cols-1 gap-3 text-[9px] sm:text-[10px] uppercase tracking-widest text-white/60">
                <div className="flex items-center justify-center gap-3 bg-white/5 py-2 px-4 rounded-full">
                  <Menu className="w-3 h-3 text-blue-400" /> 
                  <span>Drag pour pivoter</span>
                </div>
                <div className="flex items-center justify-center gap-3 bg-white/5 py-2 px-4 rounded-full">
                  <ZoomIn className="w-3 h-3 text-blue-400" /> 
                  <span>Pincez / Scroll pour zoomer</span>
                </div>
                <div className="flex items-center justify-center gap-3 bg-white/5 py-2 px-4 rounded-full">
                  <ChevronRight className="w-3 h-3 text-blue-400" /> 
                  <span>Cliquez sur une planète</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showUI && (
          <>
            {/* Header - Controls */}
            <motion.header
              key="header"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="absolute top-0 left-0 w-full p-3 sm:p-6 flex justify-end items-start pointer-events-none"
            >
              <div className="flex flex-row gap-2 pointer-events-auto items-center bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/5">
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors active:scale-95"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    value={timeSpeed} 
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                    className="w-16 xs:w-24 sm:w-32 accent-blue-500 cursor-pointer h-1"
                  />
                  <span className="text-[10px] sm:text-xs font-mono w-6 sm:w-8 text-center">{timeSpeed.toFixed(1)}x</span>
                </div>
              </div>
            </motion.header>

            {/* Planet List - Responsive Navigation */}
            <motion.aside
              key="sidebar"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute left-0 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 max-h-[50vh] overflow-y-auto p-2 sm:p-0 custom-scrollbar z-40"
            >
              <div className="flex flex-col gap-1">
                {SOLAR_SYSTEM.map((planet) => (
                  <button
                    key={planet.name}
                    onClick={() => handlePlanetClick(planet)}
                    className={cn(
                      "group relative flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2.5 pl-3 sm:pl-5 rounded-r-full transition-all duration-300 min-w-[80px] sm:min-w-0",
                      selectedPlanet?.name === planet.name 
                        ? "bg-blue-500/40 border-l-2 border-blue-500 shadow-lg shadow-blue-500/10" 
                        : "bg-white/5 hover:bg-white/10 border-l-2 border-transparent"
                    )}
                  >
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-transform group-hover:scale-125 shrink-0"
                      style={{ 
                        backgroundColor: planet.color,
                        boxShadow: `0 0 8px ${planet.color}44`
                      }}
                    />
                    <span className={cn(
                      "text-[9px] sm:text-xs uppercase tracking-[0.15em] transition-colors whitespace-nowrap",
                      selectedPlanet?.name === planet.name ? "text-white font-bold" : "text-white/40 group-hover:text-white/90"
                    )}>
                      {planet.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.aside>

            {/* Info Card */}
            <AnimatePresence mode="wait">
              {(selectedPlanet || selectedMoon) && (
                <InfoCard 
                  key={selectedMoon ? `moon-${selectedMoon.name}` : `planet-${selectedPlanet?.name}`}
                  planet={selectedPlanet} 
                  moon={selectedMoon} 
                  onClose={() => {
                    if (selectedMoon) setSelectedMoon(null);
                    else handleBackToSystem();
                  }}
                />
              )}
            </AnimatePresence>

            {/* View Mode Toggle */}
            {viewMode === 'planet' && (
              <motion.button
                key="back-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all text-xs sm:text-sm font-bold"
                onClick={handleBackToSystem}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Retour au Système</span>
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* UI Toggle */}
      <button 
        onClick={() => setShowUI(!showUI)}
        className="absolute bottom-6 right-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors z-50"
      >
        {showUI ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>
  );
}
