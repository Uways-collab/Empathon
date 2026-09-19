import React, { useState } from 'react';
import { Vehicle } from './types';
import { VEHICLES } from './data/inventory';
import { Navbar } from './components/Navbar';
import { HeroCanvas } from './components/HeroCanvas';
import { InventoryGrid } from './components/InventoryGrid';
import { SurveillanceHub } from './components/SurveillanceHub';
import { TelemetryHud } from './components/TelemetryHud';
import { AcquisitionTerminal } from './components/AcquisitionTerminal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { Footer } from './components/Footer';

export default function App() {
  const [modalVehicle, setModalVehicle] = useState<Vehicle | null>(null);
  const [terminalVehicle, setTerminalVehicle] = useState<Vehicle>(VEHICLES[0]);

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAcquisition = (vehicle?: Vehicle) => {
    if (vehicle) {
      setTerminalVehicle(vehicle);
    }
    const el = document.getElementById('acquisition-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F4F4F5] selection:bg-[#FF2A00] selection:text-black flex flex-col">
      {/* Agency Industrial Navbar */}
      <Navbar 
        onNavClick={handleNavClick} 
        onAcquireClick={() => handleOpenAcquisition()} 
      />

      {/* Hero Canvas with 60-Frame Scrubbing */}
      <HeroCanvas 
        onAcquireClick={() => handleOpenAcquisition()} 
        onExploreClick={() => handleNavClick('inventory-section')} 
      />

      {/* Curated Inventory Catalog */}
      <InventoryGrid 
        onSelectVehicle={(v) => setModalVehicle(v)} 
        onAcquireVehicle={(v) => handleOpenAcquisition(v)} 
      />

      {/* 24/7 CCTV Surveillance Reconnaissance Hub */}
      <SurveillanceHub />

      {/* Drift Dynamics & Lateral G-Force Radar Telemetry */}
      <TelemetryHud />

      {/* VIP Acquisition Terminal & Escrow Enclave */}
      <AcquisitionTerminal 
        selectedVehicle={terminalVehicle} 
        onSelectVehicle={(v) => setTerminalVehicle(v)} 
      />

      {/* Tactical Footer */}
      <Footer />

      {/* Vehicle Technical Blueprint Inspection Modal */}
      {modalVehicle && (
        <VehicleDetailModal 
          vehicle={modalVehicle} 
          onClose={() => setModalVehicle(null)} 
          onAcquire={(v) => {
            setModalVehicle(null);
            handleOpenAcquisition(v);
          }} 
        />
      )}
    </div>
  );
}
