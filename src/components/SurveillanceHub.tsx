import React, { useState, useEffect } from 'react';
import { SurveillanceCam } from '../types';
import { SURVEILLANCE_CAMS } from '../data/inventory';
import { soundEngine } from '../utils/audio';
import { Camera, Radio, ZoomIn, ZoomOut, Maximize2, ShieldAlert, Wifi, Activity } from 'lucide-react';

export const SurveillanceHub: React.FC = () => {
  const [selectedCam, setSelectedCam] = useState<SurveillanceCam>(SURVEILLANCE_CAMS[0]);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [isNightVision, setIsNightVision] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [liveTimestamp, setLiveTimestamp] = useState<string>('');
  const [viewMode, setViewMode] = useState<'single' | 'quad'>('single');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const millis = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setLiveTimestamp(`${dateStr} ${hours}:${mins}:${secs}.${millis}Z`);
    };
    const timer = setInterval(updateTime, 50);
    return () => clearInterval(timer);
  }, []);

  const handleSelectCamera = (cam: SurveillanceCam) => {
    soundEngine.playGlitch();
    setIsGlitching(true);
    setSelectedCam(cam);
    setTimeout(() => {
      setIsGlitching(false);
    }, 280);
  };

  return (
    <section id="surveillance-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-black border-b border-[#18181b] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#18181b] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 mb-2 bg-[#FF2A00]/10 border border-[#FF2A00]/30 text-[#FF2A00] text-[11px] font-tech uppercase tracking-widest">
              <Radio className="w-3 h-3 text-[#FF2A00] animate-pulse" />
              <span>DIGITAL SURVEILLANCE // ATELIER FEED MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              CCTV RECONNAISSANCE <span className="text-[#FF2A00]">HUB</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              24/7 uncompressed encrypted surveillance over the subterranean vault, staging bays, and private drift testing circuit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1000);
                setViewMode(viewMode === 'single' ? 'quad' : 'single');
              }}
              className="px-3 py-1.5 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-[#FF2A00] text-xs font-tech text-[#a1a1aa] hover:text-white rounded transition-colors"
            >
              MODE: {viewMode === 'single' ? 'QUAD MATRIX' : 'PRIMARY FOCUS'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1200);
                setIsNightVision(!isNightVision);
              }}
              className={`px-3 py-1.5 border rounded text-xs font-tech font-bold transition-colors ${
                isNightVision 
                  ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/40' 
                  : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
              }`}
            >
              IR NIGHT-VISION: {isNightVision ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Main Feed Display */}
        {viewMode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Primary Monitor (3 cols on large) */}
            <div className="lg:col-span-3 relative bg-[#09090b] border border-[#27272a] rounded overflow-hidden shadow-2xl">
              
              {/* Top Surveillance HUD */}
              <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-black/80 backdrop-blur-sm border-b border-[#27272a] flex items-center justify-between font-tech text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[#FF2A00] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A00] animate-rec" />
                    <span>REC</span>
                  </div>
                  <span className="text-white font-bold tracking-wider">{selectedCam.code}</span>
                  <span className="text-[#71717a] hidden sm:inline">| {selectedCam.location}</span>
                </div>

                <div className="flex items-center gap-4 text-[#a1a1aa]">
                  <span className="hidden md:inline text-[11px]">{selectedCam.focalLength}</span>
                  <span className="text-[#00FF66] font-bold">{selectedCam.fps} FPS</span>
                  <span>{liveTimestamp}</span>
                </div>
              </div>

              {/* Feed Image Container with Glitch & Scanline Effects */}
              <div className="relative w-full aspect-video sm:min-h-[460px] overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={selectedCam.image}
                  alt={selectedCam.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isNightVision 
                      ? 'filter grayscale contrast-150 brightness-90' 
                      : 'filter contrast-125 brightness-95'
                  } ${isGlitching ? 'opacity-40 translate-x-2 skew-x-2' : 'opacity-100'}`}
                  style={{ transform: `scale(${zoomLevel})` }}
                />

                {/* Scanlines and CRT Grime */}
                <div className="absolute inset-0 scanlines opacity-80 pointer-events-none" />
                <div className="absolute inset-0 noise-overlay opacity-50 pointer-events-none" />

                {/* Night vision green tint layer if enabled */}
                {isNightVision && (
                  <div className="absolute inset-0 bg-emerald-950/25 mix-blend-color pointer-events-none" />
                )}

                {/* Tactical HUD Crosshair Overlays */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-32 h-32 border border-[#FF2A00]/40 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#FF2A00]" />
                    <div className="absolute top-0 bottom-0 w-px bg-[#FF2A00]/30" />
                    <div className="absolute left-0 right-0 h-px bg-[#FF2A00]/30" />
                  </div>
                </div>

                {/* Optical Corner Brackets */}
                <div className="absolute top-12 left-6 w-8 h-8 border-t-2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute top-12 right-6 w-8 h-8 border-t-2 border-r-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-12 left-6 w-8 h-8 border-b-2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-12 right-6 w-8 h-8 border-b-2 border-r-2 border-white/60 pointer-events-none" />

                {/* Live Bitrate & Telemetry Tag */}
                <div className="absolute bottom-4 left-4 z-20 font-tech text-xs bg-black/80 px-3 py-1.5 border border-[#27272a] rounded text-[#a1a1aa] flex items-center gap-3">
                  <span className="text-[#00FF66] font-bold">ENC: {selectedCam.bitrate}</span>
                  <span>BANDWIDTH: 1.2 GB/s</span>
                  <span className="text-white">STATUS: {selectedCam.status}</span>
                </div>

                {/* Zoom Controls Overlay */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-black/80 p-1 border border-[#27272a] rounded">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1050);
                      setZoomLevel(prev => Math.max(1, prev - 0.25));
                    }}
                    className="p-1 hover:bg-[#18181b] text-[#a1a1aa] hover:text-white rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-tech text-xs text-white">{zoomLevel.toFixed(1)}x</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1150);
                      setZoomLevel(prev => Math.min(2.5, prev + 0.25));
                    }}
                    className="p-1 hover:bg-[#18181b] text-[#a1a1aa] hover:text-white rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Camera Channel Selector Sidebar */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-tech text-[#71717a] uppercase tracking-wider px-1">
                CONNECTED CAM NODES (4 ACTIVE)
              </div>

              {SURVEILLANCE_CAMS.map((cam) => {
                const isCurrent = cam.id === selectedCam.id;
                return (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => handleSelectCamera(cam)}
                    className={`text-left p-3.5 rounded border transition-all relative overflow-hidden group ${
                      isCurrent 
                        ? 'bg-[#18181b] border-[#FF2A00] shadow-[0_0_15px_rgba(255,42,0,0.15)]' 
                        : 'bg-[#09090b] border-[#18181b] hover:border-[#27272a] hover:bg-[#121214]'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#FF2A00]" />
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-tech text-xs font-bold ${isCurrent ? 'text-[#FF2A00]' : 'text-white'}`}>
                        {cam.code}
                      </span>
                      <span className="text-[10px] font-tech text-[#71717a]">
                        {cam.fps} FPS
                      </span>
                    </div>

                    <div className="font-display text-sm text-white font-semibold uppercase tracking-wide">
                      {cam.name}
                    </div>

                    <div className="text-xs font-tech text-[#a1a1aa] mt-1 truncate">
                      {cam.location}
                    </div>

                    <div className="mt-2 text-[11px] text-[#71717a] font-body line-clamp-2">
                      {cam.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Quad Matrix View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SURVEILLANCE_CAMS.map((cam) => (
              <div
                key={cam.id}
                onClick={() => {
                  handleSelectCamera(cam);
                  setViewMode('single');
                }}
                className="relative aspect-video bg-[#09090b] border border-[#27272a] hover:border-[#FF2A00] rounded overflow-hidden cursor-pointer group"
              >
                <img
                  src={cam.image}
                  alt={cam.name}
                  className={`w-full h-full object-cover filter contrast-125 ${isNightVision ? 'grayscale' : ''}`}
                />
                <div className="absolute inset-0 scanlines opacity-70 pointer-events-none" />
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between font-tech text-[10px] bg-black/80 px-2 py-1 border border-[#27272a] rounded">
                  <span className="text-[#FF2A00] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A00] animate-pulse" />
                    {cam.code}
                  </span>
                  <span className="text-white">{cam.name}</span>
                </div>
                <div className="absolute bottom-2 left-2 font-tech text-[10px] text-[#00FF66] bg-black/80 px-1.5 py-0.5 rounded">
                  {cam.bitrate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
