export type DriveVendor =
  | "Seagate"
  | "Western Digital"
  | "Toshiba"
  | "HGST / Hitachi"
  | "Samsung"
  | "Fujitsu"
  | "Maxtor"
  | "Unknown";

export type CapabilityId =
  | "identify"
  | "smart-read"
  | "read-sectors"
  | "rom-read"
  | "sa-list"
  | "sa-module-read"
  | "terminal"
  | "head-map"
  | "firmware-write";

export type Capability = {
  id: CapabilityId;
  label: string;
  available: boolean;
  reason?: string;
};

export type DeviceInfo = {
  id: string;
  portLabel: string;
  model: string;
  serial: string;
  firmware: string;
  capacityBytes: number;
  logicalSectorSize: number;
  vendor: DriveVendor;
  connected: boolean;
};

export type FamilyProfile = {
  id: string;
  vendor: DriveVendor;
  utility: string;
  name: string;
  capabilities: Capability[];
  verification: "mock" | "unverified" | "hardware-tested";
  sdkVersion?: string;
};

export type BackendMode = "simulation" | "native-sdk";

export type HardwarePort = {
  id: string;
  label: string;
  transport: "SATA" | "PATA" | "USB" | "Unknown";
  available: boolean;
  detail: string;
};

export type BackendStatus = {
  mode: BackendMode;
  connected: boolean;
  sdkVersion?: string;
  message: string;
};

export type OperationResult<T> =
  | { ok: true; data: T; message: string }
  | { ok: false; code: string; message: string };

export interface DriveLabBackend {
  getStatus(): Promise<BackendStatus>;
  listPorts(): Promise<OperationResult<HardwarePort[]>>;
  listDevices(): Promise<OperationResult<DeviceInfo[]>>;
  listFamilyProfiles(): Promise<FamilyProfile[]>;
  identifyDevice(deviceId: string): Promise<OperationResult<DeviceInfo>>;
  readSectors(deviceId: string, startLba: bigint, sectorCount: number): Promise<OperationResult<Uint8Array>>;
}
