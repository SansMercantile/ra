import React, { useState } from "react";
import AnimatedDetailedSun from "./AnimatedDetailedSun";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  TrendingUp, 
  Layers, 
  Mail, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  Sparkles,
  HelpCircle
} from "lucide-react";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState<"home" | "advantages" | "features" | "cohort" | "contact">("home");
  const [activeAdvantage, setActiveAdvantage] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    organization: "",
    topic: "Core Infrastructure Suite",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const advantages = [
    {
      title: "Solar field optimization with panel angle and thermal control",
      detail: "Leverage advanced micro-positioning mechanics that continuously shift panels based on the sun's localized azimuth, while using active ambient water cooling to prevent solar cell degradation over prolonged heat index spikes."
    },
    {
      title: "Weather-aware output forecasts with near-99% accuracy",
      detail: "By combining multi-spectral satellite streams, LiDAR cloud density scans, and ground-level barometric pressure arrays, RA models generation output with less than 1.1% mean absolute percentage error."
    },
    {
      title: "Grid balancing, voltage control, and energy storage intelligence",
      detail: "Automates the synchronization of storage dispatch schedules with high-frequency grid frequencies, enabling secondary reserves and peak shaving with absolute sub-frequency precision."
    },
    {
      title: "Predictive maintenance and equipment health monitoring",
      detail: "Continuous thermal anomaly detection identifies hot spot formation across individual photovoltaic nodes, planning field service dispatch schedules before catastrophic failure happens."
    }
  ];

  const coreFeatures = [
    {
      title: "Solar Panel Optimization",
      description: "Real-time tracking, soiling detection, and thermal management to extract maximum power from solar assets.",
      icon: Sun,
      highlight: "Thermal Over-cooling & Azimuth tracking"
    },
    {
      title: "Power Forecasting",
      description: "Advanced weather analysis, cloud modeling, and 24-hour prediction algorithms for reliable generation planning.",
      icon: TrendingUp,
      highlight: "Aerosol & multi-spectral scan prediction"
    },
    {
      title: "Grid Integration",
      description: "Seamless power dispatch, load balancing, and frequency stability across distributed grid networks.",
      icon: Zap,
      highlight: "Ancillary load syncing controls"
    },
    {
      title: "Storage & Resilience",
      description: "Battery scheduling, charge optimization, and dispatch planning to improve renewable reliability and flexibility.",
      icon: Layers,
      highlight: "High-density battery orchestration"
    }
  ];

  const ecosystem = [
    {
      name: "SHANGO",
      tagline: "Forecasting & Renewables",
      desc: "Coordinate solar forecasting and climate-aware renewable planning across macro-geographies.",
      color: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10"
    },
    {
      name: "MONTU",
      tagline: "Nuclear-Solar Hybrids",
      desc: "Blend nuclear baseload and variable solar systems for deeply resilient hybrid power grids.",
      color: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10"
    },
    {
      name: "Brigit",
      tagline: "Energy Governance Sync",
      desc: "Align operational energy dispatch metrics with corporate sustainability frameworks and localized policy.",
      color: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10"
    },
    {
      name: "HAPI",
      tagline: "Equipments & Logistics",
      desc: "Streamline physical equipment logistics, tracking clean-up robotic deployment, and service timing.",
      color: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const savedMessages = JSON.parse(localStorage.getItem("ra_contacts") || "[]");
      savedMessages.push({ ...contactForm, timestamp: new Date().toISOString() });
      localStorage.setItem("ra_contacts", JSON.stringify(savedMessages));
      
      setIsSubmitting(false);
      setSubmitStatus("success");
      setContactForm({
        name: "",
        email: "",
        organization: "",
        topic: "Core Infrastructure Suite",
        message: ""
      });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1200);
  };

  return (
    <div id="landing-container" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500 selection:text-zinc-950 overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Subtle ambient light patterns */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header sticky bar from Design HTML theme with elegant page tabs */}
      <header id="landing-header" className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
            <AnimatedDetailedSun className="w-8 h-8" />
            <div>
              <span className="font-mono text-xl font-bold tracking-widest text-white leading-none block">RA</span>
              <span className="text-[9px] text-yellow-500 font-mono tracking-wider">SOLAR INTELLIGENCE</span>
            </div>
          </div>

          {/* Clean separate pages tabs navigation */}
          <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] uppercase">
            <button 
              onClick={() => setCurrentPage("home")} 
              className={`transition-colors py-1 cursor-pointer hover:text-yellow-500 select-none ${currentPage === "home" ? "text-yellow-500 border-b border-yellow-500" : "text-zinc-400"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setCurrentPage("advantages")} 
              className={`transition-colors py-1 cursor-pointer hover:text-yellow-500 select-none ${currentPage === "advantages" ? "text-yellow-500 border-b border-yellow-500" : "text-zinc-400"}`}
            >
              Key Advantages
            </button>
            <button 
              onClick={() => setCurrentPage("features")} 
              className={`transition-colors py-1 cursor-pointer hover:text-yellow-500 select-none ${currentPage === "features" ? "text-yellow-500 border-b border-yellow-500" : "text-zinc-400"}`}
            >
              Core Features
            </button>
            <button 
              onClick={() => setCurrentPage("cohort")} 
              className={`transition-colors py-1 cursor-pointer hover:text-yellow-500 select-none ${currentPage === "cohort" ? "text-yellow-500 border-b border-yellow-500" : "text-zinc-400"}`}
            >
              Cohort
            </button>
            <button 
              onClick={() => setCurrentPage("contact")} 
              className={`transition-colors py-1 cursor-pointer hover:text-yellow-500 select-none ${currentPage === "contact" ? "text-yellow-500 border-b border-yellow-500" : "text-zinc-400"}`}
            >
              Contact
            </button>
          </nav>

          <div>
            <button 
              id="cta-launch-header"
              onClick={onLaunchApp}
              className="px-6 py-2 bg-yellow-500 text-zinc-950 font-bold text-xs tracking-widest uppercase hover:bg-yellow-400 transition-colors cursor-pointer rounded-sm hover:scale-[1.02]"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Horizontal tactile navigation tag list for responsive mobile devices */}
      <div className="flex md:hidden bg-zinc-950/90 border-b border-zinc-850 px-4 py-2.5 overflow-x-auto gap-3 scrollbar-none items-center sticky top-[69px] z-45 backdrop-blur-md">
        <button 
          onClick={() => setCurrentPage("home")} 
          className={`text-[9px] font-mono tracking-wider uppercase font-bold shrink-0 px-3 py-1.5 rounded-sm transition-colors ${currentPage === "home" ? "bg-yellow-500 text-zinc-950" : "text-zinc-400 bg-zinc-900 border border-zinc-800"}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setCurrentPage("advantages")} 
          className={`text-[9px] font-mono tracking-wider uppercase font-bold shrink-0 px-3 py-1.5 rounded-sm transition-colors ${currentPage === "advantages" ? "bg-yellow-500 text-zinc-950" : "text-zinc-400 bg-zinc-900 border border-zinc-800"}`}
        >
          Key Advantages
        </button>
        <button 
          onClick={() => setCurrentPage("features")} 
          className={`text-[9px] font-mono tracking-wider uppercase font-bold shrink-0 px-3 py-1.5 rounded-sm transition-colors ${currentPage === "features" ? "bg-yellow-500 text-zinc-950" : "text-zinc-400 bg-zinc-900 border border-zinc-800"}`}
        >
          Core Features
        </button>
        <button 
          onClick={() => setCurrentPage("cohort")} 
          className={`text-[9px] font-mono tracking-wider uppercase font-bold shrink-0 px-3 py-1.5 rounded-sm transition-colors ${currentPage === "cohort" ? "bg-yellow-500 text-zinc-950" : "text-zinc-400 bg-zinc-900 border border-zinc-800"}`}
        >
          Cohort
        </button>
        <button 
          onClick={() => setCurrentPage("contact")} 
          className={`text-[9px] font-mono tracking-wider uppercase font-bold shrink-0 px-3 py-1.5 rounded-sm transition-colors ${currentPage === "contact" ? "bg-yellow-500 text-zinc-950" : "text-zinc-400 bg-zinc-900 border border-zinc-800"}`}
        >
          Contact
        </button>
      </div>

      {/* Main Content Area with elegant transition pages animation */}
      <main className="flex-1 flex flex-col justify-start items-center w-full min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full flex-1 flex flex-col"
          >
            {/* Page 1: Overview / Home */}
            {currentPage === "home" && (
              <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-24 text-center flex-1 flex flex-col justify-center items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-sm mb-6">
                  <Sparkles className="w-3 text-yellow-400" />
                  <span className="text-[9px] font-mono font-bold text-yellow-300 uppercase tracking-[0.2em] leading-none">Sans Mercantile Portfolio</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6 text-zinc-100">
                  Solar Intelligence, Forecasting, <br />and <span className="font-black text-yellow-500 italic">Grid Optimization.</span>
                </h1>

                <p className="text-sm sm:text-base text-zinc-405 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                  RA is a mission-critical clean power platform combining weather-aware multi-spectral tracking, active panel thermal tuning, and high-density storage orchestration. It guarantees reliable grid balancing under extreme ambient indices.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                  <button 
                    id="hero-launch"
                    onClick={onLaunchApp}
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 group hover:scale-[1.01]"
                  >
                    <span>Launch Active Console</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => setCurrentPage("contact")}
                    className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-sm transition-all text-center cursor-pointer"
                  >
                    Request Consult
                  </button>
                </div>

                {/* Ambient Real-time Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl w-full mt-16 border-t border-b border-zinc-800 py-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-zinc-100">98.9%</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-550 font-bold mt-1">Forecast Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-yellow-500">14ms</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-550 font-bold mt-1">Grid Dispatch</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-zinc-100">&lt; 1%</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-550 font-bold mt-1">Thermal Derate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-yellow-500">24H</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-550 font-bold mt-1">Cloud Simulation</div>
                  </div>
                </div>
              </div>
            )}

            {/* Page 2: Key Advantages */}
            {currentPage === "advantages" && (
              <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 w-full flex-1 flex flex-col justify-start">
                <div className="mb-12">
                  <span className="text-[10px] font-mono text-yellow-500 tracking-widest uppercase font-bold block mb-2">ENGINEERING PRINCIPLES</span>
                  <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-4">Key Advantages of RA Suite</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    Our platform utilizes highly advanced physical models and mathematical formulas to solve the challenges of atmospheric degradation on solar systems. Click any section below to expand key technical parameters.
                  </p>
                </div>

                <div className="grid gap-4 w-full">
                  {advantages.map((adv, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveAdvantage(activeAdvantage === idx ? null : idx)}
                      className={`p-6 border rounded-sm cursor-pointer transition-all ${activeAdvantage === idx ? 'bg-zinc-900 border-yellow-500/50 shadow-lg shadow-yellow-500/5' : 'bg-zinc-950/60 border-zinc-900 hover:bg-zinc-900/40 hover:border-zinc-800'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 items-start">
                          <span className="font-mono text-xs leading-none bg-yellow-500/10 text-yellow-500 p-2 rounded-sm">
                            0{idx + 1}
                          </span>
                          <h3 className="font-bold text-zinc-200 mt-1 hover:text-white transition-colors text-sm">{adv.title}</h3>
                        </div>
                        <HelpCircle className={`w-4 h-4 text-zinc-500 mt-1 shrink-0 transition-transform ${activeAdvantage === idx ? 'rotate-180 text-yellow-500' : ''}`} />
                      </div>
                      
                      {activeAdvantage === idx && (
                        <div className="mt-4 pl-12 text-xs text-zinc-400 leading-relaxed font-light">
                          {adv.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-12 bg-zinc-900/20 border border-zinc-850 p-6 rounded-sm text-center">
                  <h4 className="text-sm font-mono text-zinc-300 font-bold mb-2">Ready to calibrate active solar fields?</h4>
                  <p className="text-xs text-zinc-400 font-light mb-4 leading-relaxed max-w-lg mx-auto">
                    Evaluate your utility grids using our fully interactive control simulator dashboard with real-time feedback loops.
                  </p>
                  <button
                    onClick={onLaunchApp}
                    className="px-6 py-2 bg-yellow-500 text-zinc-950 font-bold hover:bg-yellow-400 text-xs tracking-widest uppercase transition-colors cursor-pointer rounded-sm"
                  >
                    Open Active Console
                  </button>
                </div>
              </div>
            )}

            {/* Page 3: Core Features */}
            {currentPage === "features" && (
              <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full flex-1 flex flex-col justify-start">
                <div className="max-w-2xl text-left mb-12">
                  <span className="text-[10px] font-mono text-yellow-500 tracking-widest uppercase font-bold block mb-2">SYSTEM CAPABILITIES</span>
                  <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Designed for Modern Grids</h2>
                  <p className="text-zinc-405 text-sm mt-3 font-light leading-relaxed">
                    Highly responsive Distributed Energy Resource Management Systems (DERMS) working natively to model weather degradation and execute precision grid-stabilizing dispatch loops.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {coreFeatures.map((feat, idx) => {
                    const IconComp = feat.icon;
                    return (
                      <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-sm flex flex-col justify-between hover:border-zinc-700 transition-all">
                        <div>
                          <div className="w-12 h-12 rounded-sm bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-light">{feat.description}</p>
                        </div>
                        <div className="border-t border-zinc-800/60 pt-4">
                          <span className="font-mono text-[9px] text-yellow-500 uppercase tracking-widest block font-bold">SPECIFICATION</span>
                          <span className="text-[11px] text-zinc-350 block font-mono mt-0.5">{feat.highlight}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 border-t border-zinc-850 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-zinc-500 block uppercase font-bold">COHERENCE STANDARD</span>
                    <span className="text-xs text-zinc-300">All features synchronized dynamically across telemetry streams.</span>
                  </div>
                  <button
                    onClick={onLaunchApp}
                    className="w-full sm:w-auto bg-zinc-905 hover:bg-zinc-805 border border-zinc-800 text-zinc-200 font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-all"
                  >
                    Interactive Console Preview
                  </button>
                </div>
              </div>
            )}

            {/* Page 4: Cohort (Ecosystem) */}
            {currentPage === "cohort" && (
              <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full flex-1 flex flex-col justify-start">
                <div className="max-w-2xl text-left mb-12">
                  <span className="text-[10px] font-mono text-yellow-500 tracking-widest uppercase font-bold block mb-2">INTEGRATED COHORT</span>
                  <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">The Sans Mercantile Constellation</h2>
                  <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
                    RA operates synchronously alongside climate modeling, nuclear baseload blenders, carbon policy governance, and physical maintenance sister systems. Click any cohort member to engage services.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ecosystem.map((sys, idx) => (
                    <div 
                      key={idx} 
                      onClick={onLaunchApp}
                      className="border border-zinc-850 rounded-sm p-6 bg-zinc-950/60 flex flex-col justify-between hover:border-yellow-500/50 hover:bg-zinc-900/10 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-xl font-bold text-white tracking-wider">{sys.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                        <span className="text-yellow-500 text-[9px] uppercase font-mono tracking-widest font-bold block mb-3">{sys.tagline}</span>
                        <p className="text-zinc-400 text-xs leading-relaxed font-light">{sys.desc}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-550">
                        <span>Status: Operational</span>
                        <span className="text-yellow-500">98% Coherence</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center max-w-xl mx-auto border-t border-zinc-900 pt-8 font-mono text-[10px] text-zinc-500 leading-relaxed">
                  * Constellation sync endpoints configured dynamically. Full integration status validated securely via physical gateway telemetry.
                </div>
              </div>
            )}

            {/* Page 5: Contact Consult */}
            {currentPage === "contact" && (
              <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 w-full flex-1 flex flex-col justify-start">
                <div className="border border-zinc-850 bg-zinc-900/20 rounded-sm p-6 md:p-8">
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-[10px] font-mono text-yellow-500 tracking-widest uppercase font-bold block mb-2">SECURE LOOPBACK</span>
                    <h2 className="text-2.5xl font-light text-zinc-100 tracking-tight">Initiate Solar Operations Consult</h2>
                    <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
                      Provide your regional solar array metrics or utility limits for a professional, albedo-aware assessment with our operational specialists.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">Supervisor Name *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Alexis Carter" 
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">Email Coordinates *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. acarter@utilitysolutions.com" 
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">Utility / Farm fleet</label>
                        <input 
                          type="text" 
                          placeholder="e.g. West Coast Renewable Grid" 
                          value={contactForm.organization}
                          onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">Priority Area</label>
                        <select 
                          value={contactForm.topic}
                          onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-500"
                        >
                          <option>Core Infrastructure Suite</option>
                          <option>Power Forecasting Algorithms</option>
                          <option>Storage Dispatch Orchestration</option>
                          <option>Sans Mercantile Synergies Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1 font-bold">Operational Context</label>
                      <textarea 
                        rows={3}
                        placeholder="Details of tracking tracking, current capacity (MW), storage capability..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-550 font-mono">
                        * Input is secure in loop back log
                      </span>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-805 text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-all cursor-pointer shadow-md flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>Transmitting...</span>
                        ) : (
                          <>
                            <span>Submit Consult Request</span>
                            <Mail className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {submitStatus === "success" && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-sm font-mono mt-4 text-center">
                        Transmission locked. Operational specialists scheduled for contact follow-up.
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer conforming strictly to Design HTML */}
      <footer className="border-t border-zinc-850 bg-zinc-950 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
            <AnimatedDetailedSun className="w-8 h-8" />
            <div>
              <span className="font-mono text-sm font-bold tracking-widest text-zinc-100 leading-none block">RA</span>
              <span className="text-[8px] text-yellow-500 font-mono tracking-wider">SOLAR INTELLIGENCE</span>
            </div>
          </div>

          <span className="text-[10px] text-zinc-550 font-mono text-center">
            © 2026 RA Solar Intelligence • Part of Sans Mercantile Constellation Suite
          </span>

          <div className="flex items-center gap-5 text-[10px] text-zinc-500 font-mono">
            <span>MUTUAL STABILITY COHERENCE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
