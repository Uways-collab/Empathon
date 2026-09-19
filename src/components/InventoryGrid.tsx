import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { VEHICLES } from '../data/inventory';
import { soundEngine } from '../utils/audio';
import { 
  Search, 
  Filter, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Volume2, 
  ArrowUpRight, 
  Compass, 
  Flame 
} from 'lucide-react';

interface InventoryGridProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAcquireVehicle: (vehicle: Vehicle) => void;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ onSelectVehicle, onAcquireVehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'power-desc'>('price-desc');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'ALL SPECIMENS' },
    { id: 'hypercar', label: 'HYPERCARS' },
    { id: 'gt-track', label: 'GT TRACK WEAPONS' },
    { id: 'jdm-legend', label: 'JDM LEGENDS' },
    { id: 'street-drift', label: 'STREET DRIFT' }
  ];

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch = 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.specs.engine.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'power-desc') return b.specs.powerHp - a.specs.powerHp;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handlePreviewAudio = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick(1200);
    setPlayingAudioId(vehicle.id);
    soundEngine.revEngine(vehicle.specs.redlineRpm - 200);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 1200);
  };

  return (
    <section id="inventory-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-black border-b border-[#18181b] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#18181b] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 mb-2 bg-[#FF2A00]/10 border border-[#FF2A00]/30 text-[#FF2A00] text-[11px] font-tech uppercase tracking-widest">
              <span>ACTIVE SPEC CATALOG // NOCTURNE INVENTORY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              EXCLUSIVE <span className="text-[#FF2A00]">VAULT SPECIMENS</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              Precision-tuned hypercars, homologation specials, and high-angle drift machines inspected to forensic standards.
            </p>
          </div>

          <div className="text-right font-tech text-xs text-[#71717a]">
            <span>VAULT STATUS: </span>
            <span className="text-[#00FF66] font-bold">READY FOR DEPLOYMENT</span>
            <div className="text-white font-bold text-sm mt-0.5">
              {filteredVehicles.length} UNITS AVAILABLE
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick(1000);
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded text-xs font-tech tracking-wider uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF2A00] text-black font-bold shadow-[0_0_12px_rgba(255,42,0,0.3)]'
                    : 'bg-[#121214] text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                placeholder="SEARCH MAKE, MODEL, ENGINE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#121214] border border-[#27272a] focus:border-[#FF2A00] rounded text-xs font-tech text-white placeholder-[#71717a] focus:outline-none transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                soundEngine.playClick(950);
                setSortBy(e.target.value as any);
              }}
              className="px-3 py-1.5 bg-[#121214] border border-[#27272a] rounded text-xs font-tech text-[#a1a1aa] focus:border-[#FF2A00] focus:outline-none"
            >
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="power-desc">POWER: HIGHEST BHP</option>
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => {
                soundEngine.playClick(1100);
                onSelectVehicle(vehicle);
              }}
              className="group relative bg-[#09090b] border border-[#18181b] hover:border-[#FF2A00]/80 rounded overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-black">
                <img
                  src={vehicle.images.main}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-110 brightness-95"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/60" />

                {/* Top status badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 bg-black/80 border border-[#27272a] text-[#FF2A00] font-tech text-[10px] font-bold rounded backdrop-blur-sm">
                    {vehicle.badge}
                  </span>

                  <span className="px-2 py-0.5 bg-[#121214]/80 border border-[#27272a] text-[#a1a1aa] font-tech text-[10px] rounded backdrop-blur-sm">
                    {vehicle.locationStatus}
                  </span>
                </div>

                {/* Sound preview button in corner */}
                <button
                  type="button"
                  onClick={(e) => handlePreviewAudio(vehicle, e)}
                  className={`absolute bottom-3 right-3 z-10 p-2 rounded-full border transition-all ${
                    playingAudioId === vehicle.id
                      ? 'bg-[#FF2A00] text-black border-[#FF2A00] animate-pulse'
                      : 'bg-black/70 hover:bg-[#FF2A00] hover:text-black text-white border-[#27272a]'
                  }`}
                  title="Audition Exhaust Symphony"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-tech text-[#71717a] mb-1">
                    <span>{vehicle.year} // {vehicle.make.toUpperCase()}</span>
                    <span>{vehicle.specs.drivetrain}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-[#FF2A00] transition-colors leading-tight">
                    {vehicle.name}
                  </h3>

                  <p className="mt-1 text-xs font-body text-[#a1a1aa] line-clamp-2">
                    {vehicle.tagline}
                  </p>
                </div>

                {/* Specs Strip */}
                <div className="my-4 grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#121214] border border-[#18181b] rounded font-tech text-center">
                  <div>
                    <div className="text-[10px] text-[#71717a]">OUTPUT</div>
                    <div className="text-xs text-white font-bold">{vehicle.specs.powerHp} HP</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#71717a]">0-60 MPH</div>
                    <div className="text-xs text-[#FF2A00] font-bold">{vehicle.specs.zeroToSixtySec}s</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#71717a]">TOP SPEED</div>
                    <div className="text-xs text-white font-bold">{vehicle.specs.topSpeedMph} MPH</div>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-[#18181b]">
                  <div>
                    <div className="text-[10px] font-tech text-[#71717a]">ACQUISITION VALUE</div>
                    <div className="text-lg font-display font-bold text-white tracking-wide">
                      ${vehicle.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playClick(1150);
                        onAcquireVehicle(vehicle);
                      }}
                      className="px-3 py-1.5 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors"
                    >
                      ACQUIRE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(1050);
                        onSelectVehicle(vehicle);
                      }}
                      className="p-1.5 bg-[#121214] hover:bg-[#18181b] text-white border border-[#27272a] hover:border-[#FF2A00] rounded transition-colors"
                      title="Inspect Blueprint Schematic"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
