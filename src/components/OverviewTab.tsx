import React from "react";
import { Sliders, Battery, Activity } from "lucide-react";
import { AnimatedSnowflake, AnimatedRobot, AnimatedLightning } from "./AnimatedIcons";
import { SolarFarm, GridBattery, ConnectedDevice } from "../types";
import ConnectedDevicesSection from "./ConnectedDevicesSection";

function TermSymbol() {
  return <AnimatedLightning className="w-3.5 h-3.5 mr-1 inline-block" />;
}

interface OverviewTabProps {
  selectedFarm: SolarFarm;
  battery: GridBattery;
  dispatchBufferLog: string[];
  gridFrequency: number;
  handleUpdateTelemetry: (key: keyof SolarFarm, value: number) => void;
  triggerCoolingAndWashingSim: (type: "cooling" | "washing") => void;
  devices: ConnectedDevice[];
  onAddDevice: (device: ConnectedDevice) => void;
  onDeleteDevice: (id: string) => void;
  onToggleGridInjection: (id: string) => void;
  onUpdateDevicePower: (id: string, power: number) => void;
}

export default function OverviewTab({
  selectedFarm,
  battery,
  dispatchBufferLog,
  gridFrequency,
  handleUpdateTelemetry,
  triggerCoolingAndWashingSim,
  devices,
  onAddDevice,
  onDeleteDevice,
  onToggleGridInjection,
  onUpdateDevicePower,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Telemetry Sliders and Active States */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Field Macro Alignment Controls</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse-fast"></span>
            <span>LIVE CALIBRATOR</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Slider 1: Zenith Alignment Tilt */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Panel Tilt Tilt</span>
              <span className="text-yellow-500 font-bold">{selectedFarm.panelTiltDegrees}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="90" 
              value={selectedFarm.panelTiltDegrees}
              onChange={(e) => handleUpdateTelemetry("panelTiltDegrees", parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>0° Flat</span>
              <span>Perfect 42.5°</span>
              <span>90° Vertical</span>
            </div>
          </div>

          {/* Slider 2: Node Ambient Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Cell Thermostat</span>
              <span className={`font-bold ${selectedFarm.temperatureC > 50 ? "text-red-400" : "text-zinc-300"}`}>{selectedFarm.temperatureC.toFixed(1)}°C</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="80" 
              step="0.5"
              value={selectedFarm.temperatureC}
              onChange={(e) => handleUpdateTelemetry("temperatureC", parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>10° Winter</span>
              <span>50° Max Nom</span>
              <span>80° Extreme</span>
            </div>
          </div>

          {/* Slider 3: Aerosol & Dust Soiling */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Dust & Soiling</span>
              <span className={`font-bold ${selectedFarm.soilingIndexPercent > 30 ? "text-amber-500" : "text-zinc-300"}`}>{selectedFarm.soilingIndexPercent}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={selectedFarm.soilingIndexPercent}
              onChange={(e) => handleUpdateTelemetry("soilingIndexPercent", parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>0% Pristine</span>
              <span>50% Heavy Mud</span>
              <span>100% Clogged</span>
            </div>
          </div>

        </div>

        {/* Automation triggers row */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 bg-zinc-950/40 p-4 rounded-sm">
          <div className="flex items-center gap-2">
            <TermSymbol />
            <span className="text-[11px] font-mono text-zinc-400">Auxiliary Optimizing Modifiers</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerCoolingAndWashingSim("cooling")}
              className={`px-4 py-2 rounded-sm text-xs font-mono font-bold tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${selectedFarm.coolingActive ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 animate-pulse" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
            >
              {selectedFarm.coolingActive ? (
                <>
                  <AnimatedSnowflake className="w-4 h-4" />
                  <span>Spray Active</span>
                </>
              ) : (
                <span>Deploy Thermal Spray</span>
              )}
            </button>
            <button
              onClick={() => triggerCoolingAndWashingSim("washing")}
              className={`px-4 py-2 rounded-sm text-xs font-mono font-bold tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${selectedFarm.roboticWashingActive ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
            >
              {selectedFarm.roboticWashingActive ? (
                <>
                  <AnimatedRobot className="w-4 h-4" />
                  <span>Crawler Sweeping...</span>
                </>
              ) : (
                <span>Initiate Robotic Sweep</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Telemetry readouts from Design HTML card style */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Alignment Zenith Circle Meter */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-6 flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 self-start">Array Positioning zenith</span>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent border-r-transparent transition-transform" style={{ transform: `rotate(${(selectedFarm.panelTiltDegrees / 90) * 180 - 45}deg)` }}></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-mono font-bold text-white">{selectedFarm.panelTiltDegrees}°</span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Real Zenith</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 mt-4 text-center leading-relaxed font-light">
            Azimuth target: <span className="text-yellow-500 font-mono font-bold">42.5° Optimal</span>
          </div>
        </div>

        {/* Battery SOC Level Control Widget */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Storage BESS Synced</span>
            <Battery className={`w-4 h-4 ${battery.currentSocPercent < 20 ? "text-red-500" : "text-emerald-500"}`} />
          </div>
          <div className="text-3xl font-light mb-2 text-zinc-100 font-mono">
            {battery.currentSocPercent}% <span className="text-xs text-zinc-500 tracking-wider">MWh Charge</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full my-4">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${battery.currentSocPercent}%` }}
            ></div>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 flex justify-between items-center">
            <span>Mode: <strong className="text-yellow-500">{battery.mode}</strong></span>
            <span>{battery.chargeRateMW >= 0 ? `+${battery.chargeRateMW} MW` : `${battery.chargeRateMW} MW`}</span>
          </div>
        </div>

        {/* Smart Calculation Formula Output Widget in Gold */}
        <div className="bg-yellow-500 rounded-sm p-6 flex flex-col justify-between text-zinc-950">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900/60 block mb-2">Calculated Dispatch Output</span>
            <div className="text-4xl font-black font-mono tracking-tight leading-none mb-1">
              {selectedFarm.currentOutputMW} <span className="text-base font-normal">MW</span>
            </div>
            <span className="text-[10px] font-mono font-medium block text-zinc-900/80">
              Cap: {selectedFarm.capacityMW}MW (System efficiency base)
            </span>
          </div>

          <div className="space-y-1.5 mt-4 pt-4 border-t border-zinc-950/15">
            <div className="flex justify-between text-[10px] font-bold">
              <span>Thermal Derate</span>
              <span>-{Math.max(0, Math.round((selectedFarm.temperatureC - 25) * 0.4))}%</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span>Albedo / Clear sky</span>
              <span>{(100 - selectedFarm.soilingIndexPercent)}%</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span>Grid Load balance</span>
              <span className="text-zinc-950/80">60.01 Hz Locked</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold pt-1.5 border-t border-zinc-950/15">
              <span>Client IoT Solar Feed</span>
              <span>+{devices.filter(d => d.type === "solar" && d.status === "ONLINE").reduce((acc, d) => acc + d.currentPowerW, 0)} W</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span>Client BESS Injection</span>
              <span>+{devices.filter(d => (d.type === "battery" || d.type === "ev") && d.status === "ONLINE" && d.gridInjectionActive).reduce((acc, d) => acc + Math.abs(d.currentPowerW), 0)} W</span>
            </div>
          </div>
        </div>

      </div>

      {/* Operational Ledger Log Widget */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Core Telemetry Event Ledger</span>
          <Activity className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
        </div>
        <div className="space-y-3 font-mono text-[11px] text-zinc-400">
          {dispatchBufferLog.map((log, idx) => (
            <div key={idx} className="flex gap-2 items-start leading-relaxed p-1.5 bg-zinc-950/40 border border-zinc-850 rounded-sm">
              <TermSymbol />
              <span>{log}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-zinc-850 mt-4 flex justify-between items-center text-[10px] font-mono text-zinc-500">
          <span>Frequency: {gridFrequency} Hz</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            COHERENCE LOCKED
          </span>
        </div>
      </div>

      {/* Connected hardware client devices registry */}
      <ConnectedDevicesSection 
        devices={devices}
        onAddDevice={onAddDevice}
        onDeleteDevice={onDeleteDevice}
        onToggleGridInjection={onToggleGridInjection}
        onUpdateDevicePower={onUpdateDevicePower}
      />
    </div>
  );
}
