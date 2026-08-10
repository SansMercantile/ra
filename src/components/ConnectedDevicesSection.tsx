import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Sun, 
  Battery, 
  Cpu, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Wifi, 
  Activity, 
  Settings,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { ConnectedDevice } from "../types";

// SVG helper for glowing energy flow arrow
function ArrowFlowLoader() {
  return (
    <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
      <span className="animate-pulse">FEEDING GRID</span>
    </div>
  );
}

interface ConnectedDevicesSectionProps {
  devices: ConnectedDevice[];
  onAddDevice: (device: ConnectedDevice) => void;
  onDeleteDevice: (id: string) => void;
  onToggleGridInjection: (id: string) => void;
  onUpdateDevicePower: (id: string, power: number) => void;
}

export default function ConnectedDevicesSection({
  devices,
  onAddDevice,
  onDeleteDevice,
  onToggleGridInjection,
  onUpdateDevicePower,
}: ConnectedDevicesSectionProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [pairingStep, setPairingStep] = useState<"form" | "pairing" | "done">("form");
  const [pairingLogs, setPairingLogs] = useState<string[]>([]);
  const [pairingProgress, setPairingProgress] = useState(0);

  // Form Fields
  const [deviceClass, setDeviceClass] = useState<ConnectedDevice["type"]>("battery");
  const [deviceName, setDeviceName] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceCapacity, setDeviceCapacity] = useState<number>(2000); // Wh or W
  const [deviceSoc, setDeviceSoc] = useState<number>(85); // %
  const [deviceLocation, setDeviceLocation] = useState("");

  // Live dynamic telemetry drift for connected assets
  useEffect(() => {
    const timer = setInterval(() => {
      devices.forEach(device => {
        if (device.status === "ONLINE") {
          let drift = 0;
          if (device.type === "solar") {
            // Solar power drifts based on minor virtual albedo/sun levels
            drift = (Math.random() - 0.5) * 15;
            const livePower = Math.max(10, Math.min(device.capacity, device.currentPowerW + drift));
            onUpdateDevicePower(device.id, Math.round(livePower));
          } else if (device.type === "battery" || device.type === "ev") {
            // If injecting grid, draw power (discharging), otherwise slow trickle charging
            if (device.gridInjectionActive) {
              // discharging relative to capacity
              drift = -8 - Math.random() * 5;
            } else {
              drift = 2 + Math.random() * 4;
            }
            // Update power in Watts
            onUpdateDevicePower(device.id, Math.round(drift * 20));
          }
        }
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [devices, onUpdateDevicePower]);

  // Simulated IoT pair protocol sequence
  const startPairingSequence = () => {
    if (!deviceName) return;
    setPairingStep("pairing");
    setPairingProgress(0);
    setPairingLogs(["Initializing pairing handshake protocol..."]);

    const steps = [
      { prg: 20, log: "Scouting local IP broadcast on subnet. Found device gateway...", delay: 600 },
      { prg: 45, log: "Validating API authentication token against secure manufacturer servers...", delay: 1300 },
      { prg: 70, log: "Coupling Modbus telemetry registries. Downloading hardware descriptors...", delay: 2100 },
      { prg: 90, log: "Initializing encrypted TLS 1.3 socket loop. Subscribing to telemetry MQTT broker...", delay: 2800 },
      { prg: 100, log: "Client pair handshake complete. Stream synchronized successfully!", delay: 3500 },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setPairingProgress(step.prg);
        setPairingLogs(prev => [...prev, step.log]);
        if (step.prg === 100) {
          setTimeout(() => {
            const newDevice: ConnectedDevice = {
              id: `${deviceClass}-${Date.now()}`,
              name: deviceName,
              type: deviceClass,
              brand: deviceBrand || "Custom",
              model: deviceModel || "Standard",
              capacity: Number(deviceCapacity),
              currentPowerW: deviceClass === "solar" ? Math.round(deviceCapacity * 0.7) : -250,
              soc: (deviceClass === "battery" || deviceClass === "ev") ? Number(deviceSoc) : undefined,
              status: "ONLINE",
              location: deviceLocation || "Local Workspace Utility",
              gridInjectionActive: deviceClass === "battery" || deviceClass === "ev",
              connectionDate: new Date().toLocaleDateString(),
            };
            onAddDevice(newDevice);
            setPairingStep("done");
          }, 600);
        }
      }, step.delay);
    });
  };

  const handleOpenPairing = () => {
    setDeviceName("");
    setDeviceBrand("");
    setDeviceModel("");
    setDeviceLocation("");
    setPairingStep("form");
    setPairingLogs([]);
    setPairingProgress(0);
    setShowConnectModal(true);
  };

  // Populate dynamic brand/models recommendations based on selections
  const handleClassChange = (type: ConnectedDevice["type"]) => {
    setDeviceClass(type);
    if (type === "solar") {
      setDeviceBrand("Renogy");
      setDeviceModel("400W Bifacial Panel");
      setDeviceCapacity(800);
    } else if (type === "battery") {
      setDeviceBrand("EcoFlow");
      setDeviceModel("DELTA Pro Ultra");
      setDeviceCapacity(3600);
      setDeviceSoc(85);
    } else if (type === "ev") {
      setDeviceBrand("Ford");
      setDeviceModel("F-150 Lightning (Pro Power)");
      setDeviceCapacity(98000);
      setDeviceSoc(72);
    } else {
      setDeviceBrand("Nest");
      setDeviceModel("Learning Thermostat v4");
      setDeviceCapacity(120);
    }
  };

  // Compute stats
  const totalSolarW = devices.filter(d => d.type === "solar" && d.status === "ONLINE").reduce((acc, d) => acc + d.currentPowerW, 0);
  const totalBatteryCapacityWh = devices.filter(d => (d.type === "battery" || d.type === "ev") && d.status === "ONLINE").reduce((acc, d) => acc + d.capacity, 0);
  const totalBatteryInjectionW = devices.filter(d => (d.type === "battery" || d.type === "ev") && d.status === "ONLINE" && d.gridInjectionActive).reduce((acc, d) => acc + Math.abs(d.currentPowerW), 0);

  return (
    <div className="bg-zinc-900/50 border border-zinc-c800 p-6 rounded-sm space-y-6">
      
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span>Personal IoT Device & Grid Integration</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-1 font-light leading-relaxed">
            Link and synchronize portable power stations, residential rooftop solar strings, or bidirectional vehicle-to-grid (V2G) EV chargers directly into the RA energy balancer state.
          </p>
        </div>
        <div>
          <button 
            onClick={handleOpenPairing}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-zinc-950 font-mono text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-yellow-400 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect IoT Asset</span>
          </button>
        </div>
      </div>

      {/* IoT Quick Totals Band */}
      <div className="grid grid-cols-3 gap-4 bg-zinc-950/40 p-3 rounded border border-zinc-850 text-center font-mono">
        <div>
          <span className="text-[9px] text-zinc-550 block font-bold uppercase">DYNAMIC CLIENT SOLAR FEED</span>
          <span className="text-sm font-bold text-yellow-500">+{totalSolarW} W</span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-550 block font-bold uppercase">TOTAL CONNECTED STORE</span>
          <span className="text-sm font-bold text-emerald-400">{(totalBatteryCapacityWh / 1000).toFixed(1)} kWh</span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-550 block font-bold uppercase">MICRO-GRID BESS INJECTION</span>
          <span className="text-sm font-bold text-white">+{totalBatteryInjectionW} W</span>
        </div>
      </div>

      {/* Active Connected Assets List */}
      <div className="space-y-3">
        {devices.length === 0 ? (
          <div className="text-center py-10 bg-zinc-950/20 border border-dashed border-zinc-800 rounded">
            <Wifi className="w-8 h-8 text-zinc-650 mx-auto mb-2 opacity-50" />
            <h4 className="text-xs font-mono text-zinc-400 font-bold">No Personal Client Assets Online</h4>
            <p className="text-[10px] text-zinc-500 mt-1 max-w-sm mx-auto font-light">
              Your personal solar modules or portable battery generators appear unlinked. Use the **\"Connect IoT Asset\"** wizard above to synchronize your local setup.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-sm flex flex-col justify-between hover:border-zinc-700 transition-all gap-4"
              >
                <div>
                  {/* Title Bar */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-2.5 items-start">
                      <div className={`p-2 rounded ${
                        device.type === "solar" ? "bg-yellow-500/10 text-yellow-500" :
                        device.type === "battery" ? "bg-emerald-500/10 text-emerald-400" :
                        device.type === "ev" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                      }`}>
                        {device.type === "solar" ? <Sun className="w-4 h-4" /> :
                         device.type === "battery" ? <Battery className="w-4 h-4" /> :
                         device.type === "ev" ? <Zap className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100 font-sans">{device.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-500 block">
                          {device.brand} • {device.model} ({device.location})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteDevice(device.id)}
                      className="text-zinc-550 hover:text-red-400 p-1 rounded hover:bg-zinc-900 transition-colors"
                      title="Disconnect asset link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Operational Telemetry row */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-left bg-zinc-900/40 p-2.5 rounded border border-zinc-900">
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Telemetry Rate</span>
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        {device.type === "solar" ? `${device.currentPowerW} Watts` :
                         device.currentPowerW >= 0 ? `+${device.currentPowerW}W (Draw)` : `${Math.abs(device.currentPowerW)}W (Inject)`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Capacity / SOC</span>
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        {device.soc !== undefined ? (
                          <span className="flex items-center gap-1">
                            <span className={device.soc < 30 ? "text-red-400" : "text-emerald-400"}>{device.soc}% SoC</span>
                            <span className="text-[9px] text-zinc-500">({(device.capacity / 1000).toFixed(1)} kWh)</span>
                          </span>
                        ) : (
                          <span>{device.capacity} Watts max</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Injection toggle or details */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-3 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-zinc-400 uppercase font-mono text-[9px]">Linked via TCP Modbus</span>
                  </div>

                  {(device.type === "battery" || device.type === "ev") ? (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[9px] font-bold uppercase">Grid Injection:</span>
                      <button
                        onClick={() => onToggleGridInjection(device.id)}
                        className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          device.gridInjectionActive ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        }`}
                        title={device.gridInjectionActive ? "Discharging battery power back into Grid" : "Battery operating isolated / local stand-by"}
                      >
                        {device.gridInjectionActive ? "Active Injection" : "Isolated Mode"}
                      </button>
                    </div>
                  ) : device.type === "solar" ? (
                    <ArrowFlowLoader />
                  ) : (
                    <span className="text-zinc-500">Stand-by Load Balance</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL Pair Workflow Overlay */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-sm p-6 relative overflow-hidden shadow-2xl">
            
            {/* Elegant glowing line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-zinc-300">
                CLIENT IoT ASSET PAIRING ASSISTANT
              </h3>
              <button 
                onClick={() => setShowConnectModal(false)}
                className="text-zinc-500 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pairingStep === "form" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleClassChange("battery")}
                    className={`p-3 border rounded-sm text-center flex flex-col items-center gap-1.5 transition-all text-xs ${
                      deviceClass === "battery" ? "border-yellow-500 bg-yellow-500/5 text-yellow-500" : "border-zinc-805 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <Battery className="w-4 h-4" />
                    <span className="font-bold">Power Station</span>
                  </button>
                  <button
                    onClick={() => handleClassChange("solar")}
                    className={`p-3 border rounded-sm text-center flex flex-col items-center gap-1.5 transition-all text-xs ${
                      deviceClass === "solar" ? "border-yellow-500 bg-yellow-500/5 text-yellow-500" : "border-zinc-805 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="font-bold">Solar Array</span>
                  </button>
                  <button
                    onClick={() => handleClassChange("ev")}
                    className={`p-3 border rounded-sm text-center flex flex-col items-center gap-1.5 transition-all text-xs ${
                      deviceClass === "ev" ? "border-yellow-500 bg-yellow-500/5 text-yellow-500" : "border-zinc-805 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">EV / V2G Grid</span>
                  </button>
                </div>

                <div className="border border-zinc-800 p-4 bg-zinc-950/20 rounded-sm space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-450 mb-1 font-bold">Asset Custom Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Balcony Solar 800W, Anker Solix Core" 
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        className="w-full bg-zinc-955 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-455 mb-1 font-bold">Location Segment</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Roof South, Garage Rack" 
                        value={deviceLocation}
                        onChange={(e) => setDeviceLocation(e.target.value)}
                        className="w-full bg-zinc-955 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-455 mb-1 font-bold">Brand Manufacturer</label>
                      <input 
                        type="text" 
                        placeholder="e.g. EcoFlow, Renogy, Tesla" 
                        value={deviceBrand}
                        onChange={(e) => setDeviceBrand(e.target.value)}
                        className="w-full bg-zinc-955 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-455 mb-1 font-bold">Model Identifier</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Delta Pro, Cybertruck Dual" 
                        value={deviceModel}
                        onChange={(e) => setDeviceModel(e.target.value)}
                        className="w-full bg-zinc-955 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-455 mb-1 font-bold">
                        {deviceClass === "solar" ? "Peak Output (Watts)" : "Battery Capacity (Watt-hours)"}
                      </label>
                      <input 
                        type="number" 
                        value={deviceCapacity}
                        onChange={(e) => setDeviceCapacity(Number(e.target.value))}
                        className="w-full bg-zinc-955 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-500 font-mono"
                      />
                    </div>

                    {(deviceClass === "battery" || deviceClass === "ev") && (
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-zinc-455 mb-1 font-bold">Current Battery Charge (SoC %)</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={deviceSoc}
                          onChange={(e) => setDeviceSoc(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 mt-3"
                        />
                        <span className="text-[10px] font-mono text-zinc-400 text-right block mt-1">{deviceSoc}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button 
                    onClick={() => setShowConnectModal(false)}
                    className="px-4 py-2 border border-zinc-800 text-zinc-400 rounded-sm text-[10px] font-mono uppercase tracking-wider hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!deviceName}
                    onClick={startPairingSequence}
                    className="px-6 py-2 bg-yellow-400 text-zinc-950 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-650 cursor-pointer rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold"
                  >
                    Trigger Telemetry Sync
                  </button>
                </div>
              </div>
            )}

            {pairingStep === "pairing" && (
              <div className="space-y-6 py-4">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-dashed border-yellow-500/30 rounded-full animate-spin"></div>
                    <RefreshCw className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200">
                      Syncing Modbus Gateway Telemetry
                    </h4>
                    <span className="text-[11px] font-mono text-yellow-500">{pairingProgress}% synced</span>
                  </div>
                </div>

                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-300" 
                    style={{ width: `${pairingProgress}%` }}
                  ></div>
                </div>

                <div className="bg-zinc-950 p-3 rounded border border-zinc-850 h-32 overflow-y-auto space-y-1.5 font-mono text-[9px] text-zinc-400 leading-relaxed">
                  {pairingLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <span className="text-yellow-555 select-none">»</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pairingStep === "done" && (
              <div className="space-y-6 pt-2 pb-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 mb-2">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Integration Sync Live
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-sm mx-auto font-light leading-relaxed">
                    Personal hardware cluster **\"{deviceName}\"** connected and authorized via secure TCP-IP gateway profile registry. Real-time telemetry is feeding directly to our main system database index.
                  </p>
                </div>

                <button 
                  onClick={() => setShowConnectModal(false)}
                  className="px-6 py-2 bg-zinc-800 text-zinc-200 rounded-sm text-[10px] font-mono uppercase tracking-wider hover:bg-zinc-700 hover:text-white"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
