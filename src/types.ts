export interface SolarFarm {
  id: string;
  name: string;
  location: string;
  capacityMW: number;
  currentOutputMW: number;
  temperatureC: number;
  panelTiltDegrees: number;
  soilingIndexPercent: number;
  coolingActive: boolean;
  roboticWashingActive: boolean;
  status: "OPTIMAL" | "WARNING" | "CRITICAL" | "MAINTENANCE";
}

export interface GridBattery {
  id: string;
  name: string;
  capacityMWh: number;
  currentSocPercent: number; // State of Charge
  chargeRateMW: number; // negative is discharging
  temperatureC: number;
  status: "ACTIVE" | "IDLE" | "CHARGING" | "DISCHARGED";
  mode: "AUTO" | "MANUAL_DISCHARGE" | "MANUAL_CHARGE" | "RESERVED";
}

export interface ForecastHour {
  hourString: string;
  hourNum: number;
  forecastedMW: number;
  actualMW: number;
  cloudCoverPercent: number;
  temperatureC: number;
}

export interface EcosystemPlatform {
  id: string;
  name: string;
  tagline: string;
  description: string;
  synergyMetric: number;
  linkText: string;
}

export interface DialogueMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  organization: string;
  topic: string;
  message: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: "solar" | "battery" | "load" | "ev";
  brand: string;
  model: string;
  capacity: number; // Wh for batteries, W for solar/loads
  currentPowerW: number; // Current real-time power in Watts
  soc?: number; // state of charge (for batteries / ev)
  status: "ONLINE" | "STANDBY" | "OFFLINE" | "SYNCING";
  location: string;
  gridInjectionActive?: boolean; // discharges battery back to macro grid
  connectionDate: string;
}
