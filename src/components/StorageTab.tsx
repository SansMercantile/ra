import React from "react";
import { Battery } from "lucide-react";
import { GridBattery } from "../types";

interface StorageTabProps {
  battery: GridBattery;
  handleUpdateBatteryMode: (mode: "AUTO" | "MANUAL_CHARGE" | "MANUAL_DISCHARGE" | "RESERVED") => void;
}

export default function StorageTab({
  battery,
  handleUpdateBatteryMode,
}: StorageTabProps) {
  return (
    <div className="space-y-6">
      {/* Detailed Large BESS (Battery Energy Storage System) Control Deck */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Energy Orchestration Center</span>
            <h4 className="text-base font-bold text-zinc-200">BESS Capacity & Charge Matrix</h4>
          </div>
          <Battery className={`w-5 h-5 ${battery.currentSocPercent < 20 ? "text-red-500" : "text-emerald-500"}`} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          
          <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-850 rounded text-center">
            <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold mb-3">SOC Charge Gauge</span>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-zinc-850 rounded-full"></div>
              {/* Colored circular progress ring representing current percentage */}
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-b-transparent border-r-transparent transition-transform" style={{ transform: `rotate(${(battery.currentSocPercent / 100) * 360 - 45}deg)` }}></div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-mono font-bold text-white">{battery.currentSocPercent}%</span>
                <span className="text-[8px] font-mono text-zinc-500 uppercase">Synced</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">BESS Cell Parameters</span>
              <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-xs">
                <div className="bg-zinc-950/40 p-2.5 border border-zinc-850 rounded">
                  <span className="text-zinc-500 text-[10px] block uppercase">BESS Temp</span>
                  <span className="text-zinc-200 font-bold mt-1 block">{battery.temperatureC.toFixed(1)}°C</span>
                </div>
                <div className="bg-zinc-950/40 p-2.5 border border-zinc-850 rounded">
                  <span className="text-zinc-500 text-[10px] block uppercase">Charge Delta</span>
                  <span className="text-yellow-500 font-bold mt-1 block">{battery.chargeRateMW >= 0 ? `+${battery.chargeRateMW} MW Charging` : `${battery.chargeRateMW} MW Dispatch`}</span>
                </div>
                <div className="bg-zinc-950/40 p-2.5 border border-zinc-850 rounded">
                  <span className="text-zinc-500 text-[10px] block uppercase">SOH Cell Health</span>
                  <span className="text-emerald-400 font-bold mt-1 block">98.9% Health SOH</span>
                </div>
                <div className="bg-zinc-950/40 p-2.5 border border-zinc-850 rounded">
                  <span className="text-zinc-500 text-[10px] block uppercase">Total Capacitance Limit</span>
                  <span className="text-zinc-200 font-bold mt-1 block">{battery.capacityMWh} MWh Limit</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Manual Battery Override Section */}
      <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-805 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Battery Sync Controls Override</span>
            <span className="text-xs px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono">{battery.currentSocPercent > 30 ? "System Charged" : "Depleted Warning"}</span>
          </div>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-light">
            Manage battery orchestration rules. Force direct peak charge scheduling or immediate ancillary power line injection into local loops.
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1">Set Mode Override</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleUpdateBatteryMode("AUTO")}
              className={`py-2 px-3 text-xs font-mono font-medium rounded-sm border transition-all cursor-pointer ${battery.mode === "AUTO" ? "bg-yellow-500 text-zinc-950 border-yellow-400 font-bold" : "bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-zinc-300"}`}
            >
              Auto (AI Orchestrated)
            </button>
            <button
              onClick={() => handleUpdateBatteryMode("MANUAL_CHARGE")}
              className={`py-2 px-3 text-xs font-mono font-medium rounded-sm border transition-all cursor-pointer ${battery.mode === "MANUAL_CHARGE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500 font-bold" : "bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-zinc-300"}`}
            >
              Manual Grid Charge
            </button>
            <button
              onClick={() => handleUpdateBatteryMode("MANUAL_DISCHARGE")}
              className={`py-2 px-3 text-xs font-mono font-medium rounded-sm border transition-all cursor-pointer ${battery.mode === "MANUAL_DISCHARGE" ? "bg-amber-500/10 text-amber-500 border-amber-500 font-bold" : "bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-zinc-300"}`}
            >
              Full Peak Dispatch
            </button>
            <button
              onClick={() => handleUpdateBatteryMode("RESERVED")}
              className={`py-2 px-3 text-xs font-mono font-medium rounded-sm border transition-all cursor-pointer ${battery.mode === "RESERVED" ? "bg-zinc-800 text-zinc-300 border-zinc-700 font-medium" : "bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-zinc-300"}`}
            >
              Reserved Baseload Mode
            </button>
          </div>
        </div>
      </div>

      {/* Thermodynamic status details */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Thermodynamic Status Matrix</span>
          <h4 className="text-sm font-bold text-zinc-200 uppercase font-mono">BESS Cell Thermal Array Logs</h4>
        </div>
        <div className="space-y-2 font-mono text-[11px] text-zinc-400">
          <div className="flex justify-between p-2 bg-zinc-950/40 border border-zinc-850 rounded">
            <span>Atacama BESS Pack 01</span>
            <span className="text-emerald-400 font-bold">34.8°C • Optimal (Sync Lock)</span>
          </div>
          <div className="flex justify-between p-2 bg-zinc-950/40 border border-zinc-850 rounded">
            <span>Atacama BESS Pack 02</span>
            <span className="text-emerald-400 font-bold">35.1°C • Optimal (Sync Lock)</span>
          </div>
          <div className="flex justify-between p-2 bg-zinc-950/40 border border-zinc-850 rounded">
            <span>Atacama BESS Pack 03</span>
            <span className="text-yellow-500 font-bold">41.2°C • Cool cycles online</span>
          </div>
          <div className="flex justify-between p-2 bg-zinc-950/40 border border-zinc-850 rounded">
            <span>Atacama BESS Pack 04</span>
            <span className="text-emerald-400 font-bold">33.9°C • Optimal (Sync Lock)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
