import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';
import { Activity, Compass, Gauge, Zap, Flame, RotateCcw } from 'lucide-react';

export const TelemetryHud: React.FC = () => {
  const [slipAngle, setSlipAngle] = useState<number>(34.2);
  const [lateralG, setLateralG] = useState<number>(1.38);
  const [speedMph, setSpeedMph] = useState<number>(84);
  const [throttlePct, setThrottlePct] = useState<number>(76);
  const [boostBar, setBoostBar] = useState<number>(1.85);

  // Dynamic drift fluctuation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSlipAngle(prev => {
        const delta = (Math.random() - 0.48) * 1.5;
        return parseFloat(Math.min(58, Math.max(12, prev + delta)).toFixed(1));
      });
      setLateralG(prev => {
        const delta = (Math.random() - 0.48) * 0.08;
        return parseFloat(Math.min(1.85, Math.max(0.6, prev + delta)).toFixed(2));
      });
      setSpeedMph(prev => {
        const delta = (Math.random() - 0.48) * 2;
        return Math.round(Math.min(115, Math.max(65, prev + delta)));
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateTransition = () => {
    soundEngine.playClick(1300);
    soundEngine.revEngine(8600);
    setSlipAngle(52.4);
    setLateralG(1.72);
    setThrottlePct(95);
    setBoostBar(2.2);

    setTimeout(() => {
      setSlipAngle(32.1);
      setLateralG(1.25);
      setThrottlePct(72);
      setBoostBar(1.8);
    }, 1400);
  };

  return (
    <section id="telemetry-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-black border-b border-[#18181b] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#18181b] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 mb-2 bg-[#FF2A00]/10 border border-[#FF2A00]/30 text-[#FF2A00] text-[11px] font-tech uppercase tracking-widest">
              <Activity className="w-3 h-3 text-[#FF2A00]" />
              <span>LIVE SENSOR BUS // CAN-FD 5.0 MBPS TELEMETRY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              DRIFT DYNAMICS <span className="text-[#FF2A00]">&amp; G-FORCE RADAR</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              Real-time inertial measurement unit (IMU) telemetry recording yaw rate, tire thermal degradation, and lateral slip velocity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulateTransition}
            className="px-4 py-2 bg-[#121214] hover:bg-[#FF2A00] hover:text-black text-[#FF2A00] border border-[#FF2A00] font-tech text-xs font-bold uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(255,42,0,0.15)] flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TRIGGER WEIGHT TRANSITION (FEINT DRIFT)</span>
          </button>
        </div>

        {/* Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-tech">
          
          {/* Tile 1: Lateral G-Force Radar */}
          <div className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>LATERAL G-RADAR</span>
              <span className="text-[#FF2A00] font-bold">2.0G SCALE</span>
            </div>

            {/* Radar Circle */}
            <div className="relative w-44 h-44 mx-auto my-3 border border-[#27272a] rounded-full flex items-center justify-center">
              {/* Concentric rings */}
              <div className="w-32 h-32 border border-[#18181b] rounded-full" />
              <div className="w-20 h-20 border border-[#18181b] rounded-full" />
              <div className="w-8 h-8 border border-[#18181b] rounded-full" />
              
              {/* Axes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-[#18181b]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-px bg-[#18181b]" />
              </div>

              {/* Dynamic G-force point */}
              <div 
                className="absolute w-3 h-3 rounded-full bg-[#FF2A00] shadow-[0_0_10px_#FF2A00] transition-all duration-150"
                style={{
                  transform: `translate(${lateralG * 35}px, -15px)`
                }}
              />
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">LATERAL LOAD:</span>
              <span className="text-white font-bold">{lateralG} G</span>
            </div>
          </div>

          {/* Tile 2: Drift Slip Angle Gauge */}
          <div className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>SLIP ANGLE (YAW)</span>
              <span className="text-[#00FF66] font-bold">STABLE LOCK</span>
            </div>

            <div className="my-auto text-center py-4">
              <div className="font-display font-bold text-5xl sm:text-6xl text-white tracking-tight">
                {slipAngle}°
              </div>
              <div className="text-xs text-[#FF2A00] uppercase mt-1 font-bold">
                HIGH-ANGLE OVERSTEER
              </div>
              <div className="w-full h-2 bg-[#121214] rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-gradient-to-r from-[#00FF66] via-yellow-400 to-[#FF2A00]" 
                  style={{ width: `${(slipAngle / 65) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">STEERING COUNTER:</span>
              <span className="text-white font-bold">FULL OPPOSITE LOCK</span>
            </div>
          </div>

          {/* Tile 3: 4-Wheel Tire Thermal Matrix */}
          <div className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>TIRE CARTRIDGE MATRIX</span>
              <span className="text-white font-bold">4 CHANNELS</span>
            </div>

            {/* Car Chassis Wheel Layout */}
            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-2.5 bg-[#121214] border border-[#27272a] rounded">
                <div className="text-[10px] text-[#71717a]">FRONT LEFT (FL)</div>
                <div className="text-sm font-bold text-white">82°C / 29.5 PSI</div>
                <div className="text-[10px] text-[#00FF66]">OPTIMAL GRIP</div>
              </div>
              <div className="p-2.5 bg-[#121214] border border-[#27272a] rounded">
                <div className="text-[10px] text-[#71717a]">FRONT RIGHT (FR)</div>
                <div className="text-sm font-bold text-white">86°C / 30.1 PSI</div>
                <div className="text-[10px] text-[#00FF66]">OPTIMAL GRIP</div>
              </div>
              <div className="p-2.5 bg-[#121214] border border-[#FF2A00]/40 rounded">
                <div className="text-[10px] text-[#FF2A00]">REAR LEFT (RL)</div>
                <div className="text-sm font-bold text-[#FF2A00]">104°C / 27.8 PSI</div>
                <div className="text-[10px] text-[#FF2A00]">HEAT WARNING (SMOKE)</div>
              </div>
              <div className="p-2.5 bg-[#121214] border border-[#FF2A00]/40 rounded">
                <div className="text-[10px] text-[#FF2A00]">REAR RIGHT (RR)</div>
                <div className="text-sm font-bold text-[#FF2A00]">108°C / 28.2 PSI</div>
                <div className="text-[10px] text-[#FF2A00]">HEAT WARNING (SMOKE)</div>
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">COMPOUND:</span>
              <span className="text-white font-bold">COMPETITION SLICK</span>
            </div>
          </div>

          {/* Tile 4: Powertrain & Velocity */}
          <div className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>CAN VELOCITY BUS</span>
              <span className="text-[#00FF66] font-bold">ACTIVE</span>
            </div>

            <div className="space-y-3 my-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#71717a]">DRIFT SPEED:</span>
                  <span className="text-white font-bold">{speedMph} MPH</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <div className="h-full bg-white" style={{ width: `${(speedMph / 140) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#71717a]">THROTTLE POSITION:</span>
                  <span className="text-[#FF2A00] font-bold">{throttlePct}% WOT</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF2A00]" style={{ width: `${throttlePct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#71717a]">BOOST PRESSURE:</span>
                  <span className="text-[#00FF66] font-bold">{boostBar} BAR</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF66]" style={{ width: `${(boostBar / 2.5) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">GEAR SELECTION:</span>
              <span className="text-white font-bold">3RD GEAR (7,800 RPM)</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
