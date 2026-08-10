import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ForecastHour } from "../types";

interface ForecastingTabProps {
  forecastData: ForecastHour[];
  cloudCoverSlider: number;
  setCloudCoverSlider: (val: number) => void;
  setForecastData: React.Dispatch<React.SetStateAction<ForecastHour[]>>;
  defaultForecastData: ForecastHour[];
}

export default function ForecastingTab({
  forecastData,
  cloudCoverSlider,
  setCloudCoverSlider,
  setForecastData,
  defaultForecastData,
}: ForecastingTabProps) {
  return (
    <div className="space-y-6">
      {/* Dynamic Recharts Chart for Power Generation Forecast */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Live cloud cover & output modeling</span>
            <h3 className="text-lg font-light text-zinc-200">24-Hour Forecast vs Realized Generation Output</h3>
          </div>
          
          {/* Cloud coverage dynamic visualizer slide key */}
          <div className="flex items-center gap-4 bg-zinc-950 px-3 py-2 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-mono text-zinc-400">Cloud Layer Simulation:</span>
            <input 
              type="range"
              min="0"
              max="100"
              value={cloudCoverSlider}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCloudCoverSlider(val);
                // Modify output curves slightly for live interactivity
                setForecastData(defaultForecastData.map(h => ({
                  ...h,
                  actualMW: Math.round(h.forecastedMW * (1 - (val / 150)) * (1 - (Math.random() * 0.05)))
                })));
              }}
              className="w-24 accent-yellow-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-yellow-500">{cloudCoverSlider}%</span>
          </div>
        </div>

        <div className="h-68 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hourString" stroke="#71717a" fontSize={10} fontFamily="JetBrains Mono" />
              <YAxis stroke="#71717a" fontSize={10} fontFamily="JetBrains Mono" label={{ value: 'MW Output', angle: -90, position: 'insideLeft', style: { fill: '#72727a', fontSize: 10 } }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', fontSize: '11px', color: '#f4f4f5' }} />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              <Area type="monotone" name="Optimized (Forecasted)" dataKey="forecastedMW" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#forecastColor)" />
              <Area type="monotone" name="Real Time Output (Actual)" dataKey="actualMW" stroke="#ffffff" strokeWidth={1} fillOpacity={1} strokeDasharray="4 4" fill="url(#actualColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-[11px] text-zinc-500 font-mono">
          <span>Forecast status: 99.23% Confidence Index</span>
          <span>Sensor Sync: Locked</span>
        </div>
      </div>

      {/* Multi-spectral Atmospheric Prognosis Grid */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Atmospheric Scan Layers</span>
          <h4 className="text-sm font-bold text-zinc-200 uppercase font-mono tracking-wider">Multi-Spectral Solar Irradiance Forecast</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-400 font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="py-2.5">Hour/Interval</th>
                <th className="py-2.5">Atmospheric Vector</th>
                <th className="py-2.5">Est. Irradiance</th>
                <th className="py-2.5">Temp Index</th>
                <th className="py-2.5">Yield Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              <tr className="hover:bg-zinc-900/30">
                <td className="py-3 font-semibold text-yellow-500">2026-05-23 08:00 (Locked)</td>
                <td className="py-3 text-zinc-300">Moderate Aerosols</td>
                <td className="py-3">640 W/m²</td>
                <td className="py-3">22.4°C</td>
                <td className="py-3 text-emerald-400">99.1% Confidence</td>
              </tr>
              <tr className="hover:bg-zinc-900/30">
                <td className="py-3 font-semibold text-yellow-500">2026-05-23 12:00 (Apex)</td>
                <td className="py-3 text-zinc-300">Clear Skies, High Albedo</td>
                <td className="py-3">980 W/m²</td>
                <td className="py-3">30.1°C</td>
                <td className="py-3 text-emerald-400">99.8% Confidence</td>
              </tr>
              <tr className="hover:bg-zinc-900/30">
                <td className="py-3 font-semibold text-yellow-500">2026-05-23 16:00 (Sunset)</td>
                <td className="py-3 text-zinc-300">Scattered High Strata</td>
                <td className="py-3">410 W/m²</td>
                <td className="py-3">27.9°C</td>
                <td className="py-3 text-yellow-500">98.2% Confidence</td>
              </tr>
              <tr className="hover:bg-zinc-900/30">
                <td className="py-3 font-semibold text-yellow-500">2026-05-23 20:00 (Buffer)</td>
                <td className="py-3 text-zinc-300">Overcast Condensate</td>
                <td className="py-3">85 W/m²</td>
                <td className="py-3">19.2°C</td>
                <td className="py-3 text-zinc-500">95.4% Confidence</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-[9px] text-zinc-500 font-mono leading-relaxed">
          * Scanned using LiDAR barometric pressure matrices and multi-spectral satellite streams synced locally.
        </div>
      </div>
    </div>
  );
}
