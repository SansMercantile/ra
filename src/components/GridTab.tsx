import React from "react";
import { Activity } from "lucide-react";
import { AnimatedLightning } from "./AnimatedIcons";
import { SolarFarm, GridBattery } from "../types";

function TermSymbol() {
  return <AnimatedLightning className="w-3.5 h-3.5 mr-1 inline-block" />;
}

interface GridTabProps {
  selectedFarm: SolarFarm;
  battery: GridBattery;
  gridFrequency: number;
  dispatchBufferLog: string[];
}

export default function GridTab({
  selectedFarm,
  battery,
  gridFrequency,
  dispatchBufferLog,
}: GridTabProps) {
  return (
    <div className="space-y-6 flex flex-col">
      {/* Realtime Power Grid Balance Flow Monitor */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm relative overflow-hidden">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Macro Grid Coherence Status</span>
            <h4 className="text-base font-bold text-zinc-200">Interactive Load Balancing & Bus Flow</h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded inline-flex items-center gap-1.5 ${Math.abs(gridFrequency - 60) < 0.05 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BUS STANDARD: {gridFrequency} Hz</span>
          </span>
        </div>

        {/* Dynamic flow schema mapping telemetry */}
        <div className="bg-zinc-950 p-5 rounded border border-zinc-800 space-y-4 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Interconnect Routing Diagram</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center">
            
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-300 relative">
              <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] block text-zinc-500 uppercase font-bold">Generation Node</span>
              <span className="text-yellow-500 font-black block text-sm mt-1">+{selectedFarm.currentOutputMW} MW</span>
              <span className="text-[8px] text-zinc-500 uppercase block mt-1">Atacama Solar yield</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-zinc-500">
              <div className="text-[10px] text-yellow-500/80 font-bold tracking-widest flex items-center justify-center gap-1">
                <AnimatedLightning className="w-3.5 h-3.5" />
                <span>COHERENT FLUX</span>
              </div>
              
              {/* Pulsing flow indicator line */}
              <div className="w-full h-1 bg-zinc-800 rounded relative overflow-hidden my-2.5">
                <div className="absolute top-0 bottom-0 bg-yellow-400 w-1/3 animate-[marquee_2.5s_linear_infinite]" style={{ transform: "skewX(-20deg)" }}></div>
              </div>
              
              <span className="text-[8px] text-zinc-600 tracking-widest block uppercase">LINE IMPEDANCE: 0.04Î©</span>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-300 relative">
              <span className="text-[9px] block text-zinc-500 uppercase font-bold">Substation demand</span>
              <span className="text-zinc-100 font-black block text-sm mt-1">410 MW</span>
              <span className="text-[8px] text-zinc-500 uppercase block mt-1">Substation load baseline</span>
            </div>

          </div>

          {/* Power equation balance metrics */}
          <div className="mt-4 pt-4 border-t border-zinc-900 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 uppercase font-bold">Dynamic Net Line Loss</span>
              <span className="font-bold text-zinc-300 font-mono">
                - {Math.max(0.2, Number((3.82 * (1 - (selectedFarm.panelTiltDegrees / 90) * 0.15)).toFixed(2)))} MW
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 uppercase font-bold">Total Interconnect Bus Net balance</span>
              <span className={`font-mono font-bold ${selectedFarm.currentOutputMW + (-battery.chargeRateMW) - 410 >= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                {(selectedFarm.currentOutputMW + (-battery.chargeRateMW) - 410).toFixed(1)} MW {selectedFarm.currentOutputMW + (-battery.chargeRateMW) - 410 >= 0 ? "Surplus" : "Deficit (BESS Discharging)"}
              </span>
            </div>
          </div>
        </div>

        {/* VAR Transformer Balancing Slider selectors */}
        <div className="mt-6 space-y-4">
          <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">Reactive Transformer Compensation Controls</span>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">VAR Power Factor</span>
                <span className="text-yellow-500 font-bold">0.98 PF (Lead)</span>
              </div>
              <input type="range" min="90" max="100" defaultValue="98" className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-yellow-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Secondary Tap Ratio</span>
                <span className="text-yellow-500 font-bold">1.02 R</span>
              </div>
              <input type="range" min="95" max="105" defaultValue="102" className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Core Telemetry Event Ledger in Grid tab for easy status tracing */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Localized Bus Logs</span>
          <Activity className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
        </div>
        <div className="space-y-3 font-mono text-[11px] text-zinc-400">
          {dispatchBufferLog.map((log, idx) => (
            <div key={idx} className="flex gap-2 items-start leading-relaxed p-1.5 bg-zinc-950/40 border border-zinc-800 rounded-sm">
              <TermSymbol />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
