import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Zap, 
  Layers, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Sliders, 
  Gauge, 
  Terminal, 
  ArrowRight, 
  HelpCircle, 
  Activity, 
  Cpu, 
  X, 
  ChevronRight, 
  MessageSquare, 
  Send,
  Loader2,
  Battery,
  ShieldAlert,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import Markdown from "react-markdown";
import LandingPage from "./components/LandingPage";
import { SolarFarm, GridBattery, ForecastHour, DialogueMessage, ConnectedDevice } from "./types";
import AnimatedDetailedSun, { useDetailedSunFavicon } from "./components/AnimatedDetailedSun";
import { AnimatedSnowflake, AnimatedRobot, AnimatedWarning, AnimatedLightning, TextWithAnimatedIcons } from "./components/AnimatedIcons";
import OverviewTab from "./components/OverviewTab";
import ForecastingTab from "./components/ForecastingTab";
import GridTab from "./components/GridTab";
import StorageTab from "./components/StorageTab";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

export default function App() {
  useDetailedSunFavicon();
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<"overview" | "forecasting" | "grid" | "storage">("overview");

  // Telemetry state of Active Solar Farms (loaded from the real solar backend
  // — Open-Meteo irradiance + PV model — with a static fallback if offline).
  const [farmsLive, setFarmsLive] = useState<boolean>(false);
  const [solarFarms, setSolarFarms] = useState<SolarFarm[]>([
    {
      id: "atacama-01",
      name: "Atacama Field Array",
      location: "San Pedro, Chile • 23.8°S 69.1°W",
      capacityMW: 450,
      currentOutputMW: 0,
      temperatureC: 25,
      panelTiltDegrees: 42,
      soilingIndexPercent: 12,
      coolingActive: false,
      roboticWashingActive: false,
      status: "OPTIMAL"
    },
    {
      id: "mojave-02",
      name: "Mojave Basin Core",
      location: "California, USA • 35.0°N 117.2°W",
      capacityMW: 320,
      currentOutputMW: 0,
      temperatureC: 25,
      panelTiltDegrees: 31,
      soilingIndexPercent: 22,
      coolingActive: false,
      roboticWashingActive: false,
      status: "OPTIMAL"
    },
    {
      id: "karoo-03",
      name: "Karoo Distributed Array",
      location: "Western Cape, RSA • 32.2°S 21.8°E",
      capacityMW: 250,
      currentOutputMW: 0,
      temperatureC: 25,
      panelTiltDegrees: 45,
      soilingIndexPercent: 3,
      coolingActive: false,
      roboticWashingActive: false,
      status: "OPTIMAL"
    }
  ]);

  // Load live farm telemetry from the solar backend.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/farms`);
        if (!res.ok) throw new Error(`farms_${res.status}`);
        const data = await res.json();
        if (!alive || !Array.isArray(data.farms) || data.farms.length === 0) return;
        setSolarFarms(prev => prev.map(f => {
          const live = data.farms.find((x: any) => x.id === f.id);
          return live ? {
            ...f,
            currentOutputMW: live.currentOutputMW,
            temperatureC: live.temperatureC,
            status: live.status,
          } : f;
        }));
        setFarmsLive(true);
      } catch (e) {
        console.warn("Live farm telemetry unavailable, using local model:", e);
        if (alive) setFarmsLive(false);
      }
    };
    load();
    const t = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => { alive = false; clearInterval(t); };
  }, []);

  const [selectedFarmId, setSelectedFarmId] = useState<string>("atacama-01");
  const selectedFarm = solarFarms.find(f => f.id === selectedFarmId) || solarFarms[0];

  // Grid battery state
  const [battery, setBattery] = useState<GridBattery>({
    id: "la-pampa-bess",
    name: "Atacama Storage Sync BESS",
    capacityMWh: 150,
    currentSocPercent: 84.2,
    chargeRateMW: 45, // positive charging, negative discharging
    temperatureC: 28.4,
    status: "ACTIVE",
    mode: "AUTO"
  });

  // Custom connected IoT client devices (personal panels, stations)
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([
    {
      id: "device-delta-01",
      name: "Residential Backup Power Core",
      type: "battery",
      brand: "EcoFlow",
      model: "DELTA Pro 3",
      capacity: 4000,
      currentPowerW: -520, // Negative means injecting power to grid
      soc: 84,
      status: "ONLINE",
      location: "Balcony Cabinet",
      gridInjectionActive: true,
      connectionDate: "2026-05-20"
    },
    {
      id: "device-renogy-02",
      name: "Bifacial Balcony PV Blanket",
      type: "solar",
      brand: "Renogy",
      model: "400W Bifacial Foldable",
      capacity: 800,
      currentPowerW: 320,
      status: "ONLINE",
      location: "South Facing Railing",
      connectionDate: "2026-05-21"
    },
    {
      id: "device-lightning-03",
      name: "Emergency V2G Ford Link",
      type: "ev",
      brand: "Ford",
      model: "F-150 Lightning Extended",
      capacity: 131000,
      currentPowerW: -1200, // Active microgrid discharge
      soc: 76,
      status: "ONLINE",
      location: "Garage Charging Bay",
      gridInjectionActive: true,
      connectionDate: "2026-05-22"
    }
  ]);

  // Real 24H forecast loaded from the solar backend (Open-Meteo irradiance
  // forecast + PV model), with a static fallback shape if offline.
  const defaultForecastData: ForecastHour[] = [
    { hourString: "06:00", hourNum: 6, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 18 },
    { hourString: "08:00", hourNum: 8, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 22 },
    { hourString: "10:00", hourNum: 10, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 26 },
    { hourString: "12:00", hourNum: 12, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 30 },
    { hourString: "14:00", hourNum: 14, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 32 },
    { hourString: "16:00", hourNum: 16, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 28 },
    { hourString: "18:00", hourNum: 18, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 22 },
    { hourString: "20:00", hourNum: 20, forecastedMW: 0, actualMW: 0, cloudCoverPercent: 0, temperatureC: 19 }
  ];

  const [forecastData, setForecastData] = useState<ForecastHour[]>(defaultForecastData);
  const [cloudCoverSlider, setCloudCoverSlider] = useState<number>(10);

  // Load the real 24h forecast for the selected farm.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/farms/${selectedFarmId}/forecast`);
        if (!res.ok) throw new Error(`forecast_${res.status}`);
        const data = await res.json();
        if (!alive || !Array.isArray(data.forecast)) return;
        // Map to the ForecastHour shape (every 3rd hour to match the layout).
        const pts = data.forecast
          .filter((p: any) => p.hourNum % 2 === 0)
          .slice(0, 8)
          .map((p: any) => ({
            hourString: `${String(p.hourNum).padStart(2, "0")}:00`,
            hourNum: p.hourNum,
            forecastedMW: Math.round(p.outputMW),
            actualMW: Math.round(p.outputMW), // same model = same baseline; "actual" refines with live
            cloudCoverPercent: Math.round(p.cloudCoverPct),
            temperatureC: Math.round(p.temperatureC),
          }));
        if (pts.length > 0) setForecastData(pts);
      } catch (e) {
        console.warn("Live forecast unavailable:", e);
      }
    })();
    return () => { alive = false; };
  }, [selectedFarmId]);

  // Gemini Advisories Operational Report State
  const [isGeneratingAdvisor, setIsGeneratingAdvisor] = useState<boolean>(false);
  const [advisorError, setAdvisorError] = useState<string | null>(null);
  const [advisorReport, setAdvisorReport] = useState<string>(
    `### RA Core AI Telemetry Advisor Report
No current dynamic reports generated in the buffer. Click **\"Request AI Advisory Dispatch\"** below to dispatch real-time parameters from the selected solar field into our server-side operational engine.

Key Insights pending live cloud cover modeling feedback.`
  );

  // Gemini Dialogue Console Log Chat State
  const [chatMessages, setChatMessages] = useState<DialogueMessage[]>([
    {
      id: "init-message",
      role: "assistant",
      content: "RA core intelligence dialogue initialized. How may I assist with your grid dispatch schedules, multi-spectral cloud mapping, or panel optimization adjustments today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Simulated grid metrics ticker — explicitly a SIMULATOR (grid frequency is
  // not a real feed; solar farm telemetry IS real via the backend).
  const [gridFrequency, setGridFrequency] = useState<number>(60.01);
  const [totalLoadActive, setTotalLoadActive] = useState<number>(384);
  const [dispatchBufferLog, setDispatchBufferLog] = useState<string[]>([
    "UTC 19:50:00 - Grid sync locked frequency standard secondary control.",
    "UTC 19:51:30 - Atacama Array micro-alignment tracker matching 42Â° zenith.",
    "UTC 19:52:12 - Storage synchronization automated control system armed."
  ]);

  // Ecosystem integrations visualization trigger
  const [activeEcosystemFocus, setActiveEcosystemFocus] = useState<string | null>(null);

  // Automatic state recalculated based on alignment, temperature, soiling & active modifiers
  useEffect(() => {
    setSolarFarms(prev => prev.map(farm => {
      if (farm.id === selectedFarmId) {
        // Alignment score relative to perfect 42.5Â° zenith angle
        const alignmentScore = 100 - Math.min(100, Math.abs(farm.panelTiltDegrees - 42.5) * 2);
        // Efficiencies reduced by soot and cell thermal index (standard solar temperature coefficient -0.4%/C above nominal 25C)
        const temperatureLoss = Math.max(0, (farm.temperatureC - 25) * 0.004);
        const soilingFactor = Math.max(0, (100 - farm.soilingIndexPercent) / 100);
        
        const calculatedOutput = Math.round(
          farm.capacityMW * (alignmentScore / 100) * (1 - temperatureLoss) * soilingFactor
        );

        // Auto determine status
        let newStatus: SolarFarm["status"] = "OPTIMAL";
        if (farm.soilingIndexPercent > 40 || farm.temperatureC > 58) {
          newStatus = "WARNING";
        }
        if (farm.temperatureC > 65) {
          newStatus = "CRITICAL";
        }

        return {
          ...farm,
          currentOutputMW: Math.max(0, Math.min(farm.capacityMW, calculatedOutput)),
          status: newStatus
        };
      }
      return farm;
    }));
  }, [selectedFarmId, selectedFarm.panelTiltDegrees, selectedFarm.temperatureC, selectedFarm.soilingIndexPercent]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Periodic grid fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setGridFrequency(freq => {
        const delta = (Math.random() - 0.5) * 0.008;
        return Number((freq + delta).toFixed(3));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Dispatch live telemetry to server-side Bedrock Core Advising Agent
  const handleRequestAdvisorReport = async () => {
    setIsGeneratingAdvisor(true);
    setAdvisorError(null);
    try {
      const response = await fetch(`${API_BASE}/api/ai/advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelAngle: selectedFarm.panelTiltDegrees,
          temperature: selectedFarm.temperatureC,
          soilingIndex: selectedFarm.soilingIndexPercent,
          weatherState: cloudCoverSlider > 50 ? "Heavy overcast with density layer" : cloudCoverSlider > 20 ? "Intermittent high-altitude clouds" : "Clear direct sky, maximum albedo index",
          batteryCharge: battery.currentSocPercent,
          gridLoad: selectedFarm.currentOutputMW
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setAdvisorReport(resData.report);
        setDispatchBufferLog(prev => [
          `UTC ${new Date().toLocaleTimeString()} - AI Dispatch advice compiled and parsed into system memory.`,
          ...prev.slice(0, 5)
        ]);
      } else {
        throw new Error(resData.error || "Failed to parse advisor report");
      }
    } catch (err: any) {
      console.error(err);
      setAdvisorError(err.message || "Unable to speak with the Gemini Operational backend. Verify your secrets config.");
    } finally {
      setIsGeneratingAdvisor(false);
    }
  };

  // Dialogue messaging logic
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: DialogueMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Map all chat history to conform to conversational arrays
      const mappedMessages = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: mappedMessages })
      });

      const resData = await response.json();
      if (resData.success) {
        setChatMessages(prev => [...prev, {
          id: `reply-${Date.now()}`,
          role: "assistant",
          content: resData.reply,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        throw new Error(resData.error || "Failed to grab dialogue reply");
      }
    } catch (error: any) {
      console.error(error);
      setChatMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `âš ï¸ Dialogue Core Interruption: ${error.message || "Failed to dispatch context to server-side Gemini API. Verify process variables."}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Slider adjustments directly updating state
  const handleUpdateTelemetry = (field: keyof SolarFarm, value: any) => {
    setSolarFarms(prev => prev.map(farm => {
      if (farm.id === selectedFarmId) {
        return { ...farm, [field]: value };
      }
      return farm;
    }));
  };

  const triggerCoolingAndWashingSim = (type: "cooling" | "washing") => {
    setSolarFarms(prev => prev.map(farm => {
      if (farm.id === selectedFarmId) {
        if (type === "cooling") {
          const wasActive = farm.coolingActive;
          return {
            ...farm,
            coolingActive: !wasActive,
            temperatureC: !wasActive ? Math.max(25, farm.temperatureC - 15) : farm.temperatureC + 15
          };
        } else {
          const wasActive = farm.roboticWashingActive;
          return {
            ...farm,
            roboticWashingActive: !wasActive,
            soilingIndexPercent: !wasActive ? 0 : farm.soilingIndexPercent
          };
        }
      }
      return farm;
    }));

    setDispatchBufferLog(prev => [
      `UTC ${new Date().toLocaleTimeString()} - ${type === "cooling" ? "Thermal Spray matrix automated cooling deployed" : "Autonomous crawler robotic soiling cleaner initiated"}.`,
      ...prev.slice(0, 5)
    ]);
  };

  const handleAddDevice = (device: ConnectedDevice) => {
    setConnectedDevices(prev => [...prev, device]);
    setDispatchBufferLog(prev => [
      `UTC ${new Date().toLocaleTimeString()} - IoT Peer Auth Success: Connected custom ${device.brand} ${device.model} (${(device.type === 'solar' ? device.capacity + 'W' : (device.capacity / 1000).toFixed(1) + 'kWh')}).`,
      ...prev.slice(0, 5)
    ]);
  };

  const handleDeleteDevice = (id: string) => {
    const target = connectedDevices.find(d => d.id === id);
    if (target) {
      setConnectedDevices(prev => prev.filter(d => d.id !== id));
      setDispatchBufferLog(prev => [
        `UTC ${new Date().toLocaleTimeString()} - IoT Link Severed: Disconnected device "${target.name}".`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  const handleToggleGridInjection = (id: string) => {
    setConnectedDevices(prev => prev.map(device => {
      if (device.id === id) {
        const nextState = !device.gridInjectionActive;
        // Adjust power dynamically
        const newPower = nextState ? -150 * (device.capacity / 2000) : 0;
        setDispatchBufferLog(prevLogs => [
          `UTC ${new Date().toLocaleTimeString()} - Grid sync update: "${device.name}" shift to ${nextState ? "injection dispatch state" : "local isolated state"}.`,
          ...prevLogs.slice(0, 5)
        ]);
        return {
          ...device,
          gridInjectionActive: nextState,
          currentPowerW: Math.round(newPower)
        };
      }
      return device;
    }));
  };

  const handleUpdateDevicePower = (id: string, power: number) => {
    setConnectedDevices(prev => prev.map(device => {
      if (device.id === id) {
        return { ...device, currentPowerW: power };
      }
      return device;
    }));
  };

  const handleUpdateBatteryMode = (mode: GridBattery["mode"]) => {
    let chargeRate = 0;
    let status: GridBattery["status"] = "IDLE";
    
    if (mode === "MANUAL_CHARGE") {
      chargeRate = 60;
      status = "CHARGING";
    } else if (mode === "MANUAL_DISCHARGE") {
      chargeRate = -80;
      status = "ACTIVE";
    } else if (mode === "AUTO") {
      chargeRate = 45;
      status = "ACTIVE";
    } else {
      chargeRate = 0;
      status = "IDLE";
    }

    setBattery(prev => ({
      ...prev,
      mode,
      chargeRateMW: chargeRate,
      status
    }));

    setDispatchBufferLog(prev => [
      `UTC ${new Date().toLocaleTimeString()} - Battery storage sync shifted to ${mode} mode. Rating updated to ${chargeRate} MW.`,
      ...prev.slice(0, 5)
    ]);
  };

  const handleLaunchApp = () => {
    setCurrentView("app");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ecosystemPlatforms = [
    {
      id: "shango",
      name: "SHANGO",
      tagline: "Forecasting & Renewables",
      description: "Automates multi-jurisdiction weather streams, optimizing macro-grid forecasting for maximum solar albedo yield across entire regions."
    },
    {
      id: "montu",
      name: "MONTU",
      tagline: "Baseload Blending Core",
      description: "Controls immediate thermal baseload coupling by blending nuclear power output directly with fluctuating variable solar arrays to assure grid voltage standard thresholds."
    },
    {
      id: "brigit",
      name: "Brigit",
      tagline: "Energy Governance Sync",
      description: "Ensures carbon accounting ledger indices, operational safety thresholds, and ESG metric reporting comply seamlessly with regional grids and governance directives."
    },
    {
      id: "hapi",
      name: "HAPI",
      tagline: "Logistics & Maintenance Team",
      description: "Generates preventative field workforce tickets, sends GPS dispatch coordinates for manual cell replacement, and coordinates cleaning bots scheduling."
    }
  ];

  if (currentView === "landing") {
    return <LandingPage onLaunchApp={handleLaunchApp} />;
  }

  // Live App Dashboard Console styled strictly as "Geometric Balance"
  return (
    <div id="app-container" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500 selection:text-zinc-950 overflow-x-hidden flex flex-col">
      
      {/* Top Navigation Bar from Design HTML */}
      <nav id="app-nav" className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("landing")}>
            <AnimatedDetailedSun className="w-8 h-8" />
            <span className="text-2xl font-black tracking-tighter">RA</span>
          </div>
          <div className="hidden md:flex gap-6 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
            <button 
              onClick={() => { setActiveTab("overview"); }}
              className={`pb-1 cursor-pointer transition-colors ${activeTab === "overview" ? "text-yellow-500 border-b-2 border-yellow-500 font-black" : "hover:text-white"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => { setActiveTab("forecasting"); }}
              className={`pb-1 cursor-pointer transition-colors ${activeTab === "forecasting" ? "text-yellow-500 border-b-2 border-yellow-500 font-black" : "hover:text-white"}`}
            >
              Forecasting
            </button>
            <button 
              onClick={() => { setActiveTab("grid"); }}
              className={`pb-1 cursor-pointer transition-colors ${activeTab === "grid" ? "text-yellow-500 border-b-2 border-yellow-500 font-black" : "hover:text-white"}`}
            >
              Grid Control
            </button>
            <button 
              onClick={() => { setActiveTab("storage"); }}
              className={`pb-1 cursor-pointer transition-colors ${activeTab === "storage" ? "text-yellow-500 border-b-2 border-yellow-500 font-black" : "hover:text-white"}`}
            >
              Storage
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm text-[10px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GRID LINK: LATENCY 14ms</span>
          </div>
          <button 
            onClick={() => setCurrentView("landing")}
            className="px-4 py-1.5 border border-zinc-700 hover:border-zinc-500 rounded-sm text-xs font-mono font-medium tracking-wider transition-all"
          >
            Landing Site
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Banner: Integrated Ecosystem from Design HTML */}
        <aside id="app-sidebar" className="w-16 border-r border-zinc-800 flex flex-col items-center py-6 gap-8 bg-zinc-900/10">
          <div className="writing-mode-vertical rotate-180 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 shrink-0 select-none pb-4 border-b border-zinc-900">
          </div>
          <div className="flex flex-col gap-4">
            {ecosystemPlatforms.map(platform => (
              <div 
                key={platform.id}
                onMouseEnter={() => setActiveEcosystemFocus(platform.id)}
                onMouseLeave={() => setActiveEcosystemFocus(null)}
                onClick={() => setActiveEcosystemFocus(prev => prev === platform.id ? null : platform.id)}
                className={`w-9 h-9 rounded-sm border ${activeEcosystemFocus === platform.id ? "border-yellow-500 text-yellow-500 bg-yellow-500/5 scale-105" : "border-zinc-800 text-zinc-500 bg-zinc-950"} flex items-center justify-center text-[10px] font-mono font-bold hover:border-yellow-500 cursor-pointer transition-all relative group`}
                title={`${platform.name} - ${platform.tagline}`}
              >
                {platform.name.substring(0,2)}
                {/* Tooltip */}
                <span className="absolute left-12 w-48 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] p-2 rounded-sm shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-40 font-sans leading-relaxed">
                  <strong className="text-yellow-500 font-mono block mb-1">{platform.name} â€¢ {platform.tagline}</strong>
                  {platform.description}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <main id="app-workspace" className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* Active Banner Indicator */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold block mb-1">Operational Workspace</span>
              <h2 className="text-xl font-light text-zinc-100 flex items-center gap-3">
                <span>{selectedFarm.name}</span>
                <span className="text-xs bg-zinc-800 text-yellow-500 font-mono font-medium px-2 py-0.5 border border-zinc-700">
                  {selectedFarm.location}
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {solarFarms.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFarmId(f.id)}
                  className={`px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-sm transition-all focus:outline-none ${selectedFarmId === f.id ? "bg-yellow-500 text-zinc-900" : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"}`}
                >
                  {f.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Responsive Panels for control */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Pane: Interactive Telemetry controls & meters (7 columns on wide screens) */}
            <div className="xl:col-span-7 space-y-6">
              {activeTab === "overview" && (
                <OverviewTab 
                  selectedFarm={selectedFarm}
                  battery={battery}
                  dispatchBufferLog={dispatchBufferLog}
                  gridFrequency={gridFrequency}
                  handleUpdateTelemetry={handleUpdateTelemetry}
                  triggerCoolingAndWashingSim={triggerCoolingAndWashingSim}
                  devices={connectedDevices}
                  onAddDevice={handleAddDevice}
                  onDeleteDevice={handleDeleteDevice}
                  onToggleGridInjection={handleToggleGridInjection}
                  onUpdateDevicePower={handleUpdateDevicePower}
                />
              )}
              {activeTab === "forecasting" && (
                <ForecastingTab 
                  forecastData={forecastData}
                  cloudCoverSlider={cloudCoverSlider}
                  setCloudCoverSlider={setCloudCoverSlider}
                  setForecastData={setForecastData}
                  defaultForecastData={defaultForecastData}
                />
              )}
              {activeTab === "grid" && (
                <GridTab 
                  selectedFarm={selectedFarm}
                  battery={battery}
                  gridFrequency={gridFrequency}
                  dispatchBufferLog={dispatchBufferLog}
                />
              )}
              {activeTab === "storage" && (
                <StorageTab 
                  battery={battery}
                  handleUpdateBatteryMode={handleUpdateBatteryMode}
                />
              )}
            </div>

            {/* Right Pane: Core Intelligence Workspace (5 columns on wide screens) */}
            <div className="xl:col-span-5 space-y-6">
              
              {/* Gemini Operational Solar Advisor */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-yellow-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">RA Core Operational AI Advisor</span>
                  </div>
                  <span className="text-[9px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 border border-yellow-500/20 rounded">
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-6 leading-relaxed font-light">
                  Query our server-side meteorological core. This calculates the optimal cell alignment degrees, thermal spray duration, and secondary reserve battery dispatch rates.
                </p>

                {/* Response area */}
                <div className="bg-zinc-950 p-5 rounded-sm border border-zinc-800 text-xs font-mono mb-6 max-h-96 overflow-y-auto leading-relaxed text-zinc-300">
                  {isGeneratingAdvisor ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                      <span className="text-[11px] font-mono text-yellow-500 blinking-cursor">DISPATCHING TELEMETRY STREAM TO COMPILER...</span>
                    </div>
                  ) : advisorError ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-bold">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>INTELLIGENCE ERROR</span>
                      </div>
                      <p className="font-sans leading-relaxed text-[11px]">{advisorError}</p>
                      <span className="text-[9px] font-sans opacity-75 mt-2">.</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-xs max-w-none text-[11px] font-mono">
                      <Markdown
                        components={{
                          text(props) {
                            const childText = typeof props.children === "string" ? props.children : String(props.children ?? "");
                            return <TextWithAnimatedIcons text={childText} />;
                          }
                        }}
                      >{advisorReport}</Markdown>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isGeneratingAdvisor}
                  onClick={handleRequestAdvisorReport}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGeneratingAdvisor ? (
                    <span>Compiling Live Report...</span>
                  ) : (
                    <>
                      <span>Request AI Advisory Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Operations Dialogue Core (Interactive Q&A console) */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-6 flex flex-col justify-between h-104">
                
                <div>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-yellow-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Operations Dialogue Core</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">DIALOGUE LINK ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-light mb-4">
                    Expert conversational channel regarding photovoltaic cell dynamics, albedo clouds, thermal spray cooling cycles, or constellation alignments.
                  </p>
                </div>

                {/* Dialog thread area */}
                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-sm p-4 overflow-y-auto space-y-3 mb-4 text-[11px] font-mono max-h-56 scroll-smooth">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`p-2 rounded-sm ${msg.role === "assistant" ? "bg-zinc-900 w-11/12 border-l-2 border-yellow-500" : "bg-zinc-900/80 w-11/12 ml-auto text-right border-r-2 border-zinc-600 text-yellow-300"}`}
                    >
                      <div className="text-[9px] text-zinc-500 flex justify-between items-center mb-1">
                        <span className="font-bold">{msg.role === "assistant" ? "RA CORE AI" : "OPERATOR"}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line text-left flex items-start gap-1.5">
                        {msg.id.startsWith("err-") && <AnimatedWarning className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                        <TextWithAnimatedIcons text={msg.content.startsWith("Dialogue Core Interruption") || msg.content.startsWith("âš ï¸ Dialogue Core Interruption") ? msg.content.replace("âš ï¸", "") : msg.content} />
                      </p>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-2 text-yellow-500 p-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transcribing response vector...</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Dialogue input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text"
                    required
                    placeholder="Ask RA Advisor about cloud physics, angle tuning..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={chatLoading}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                  <button 
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 border border-zinc-700 text-yellow-500 font-mono text-xs px-3 rounded-sm flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Footer Info conforming to "Geometric Balance" */}
      <footer id="app-footer" className="mt-auto border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center bg-zinc-950 px-8 py-6 gap-4 shrink-0">
        <div className="flex flex-wrap gap-8 text-center md:text-left">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Location sync</span>
            <span className="text-xs font-mono">Atacama Desert System Base â€¢ 23.8Â°S 69.1Â°W</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Solar Telemetry</span>
            <span className={`text-xs flex items-center gap-2 font-mono justify-center md:justify-start ${farmsLive ? "text-emerald-400" : "text-amber-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${farmsLive ? "bg-emerald-400" : "bg-amber-400"}`}></span>
              {farmsLive ? "LIVE (OPEN-METEO)" : "OFFLINE MODEL"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Solar farm sync</span>
            <span className="text-xs font-mono text-zinc-300">
              {solarFarms.length} Farms Online â€¢ {solarFarms.reduce((acc, f) => acc + f.currentOutputMW, 0)} MW actively dispatching
            </span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 tracking-tighter">
          Â© 2026 RA SOLAR INTELLIGENCE â€¢ MISSION CRITICAL CONSTELLATION SUITE
        </div>
      </footer>
    </div>
  );
}

// Simple helper components to avoid type repetition
function TermSymbol() {
  return <AnimatedLightning className="w-3.5 h-3.5 mr-1 inline-block" />;
}
